# Genetic Algorithm for PC Part Selection

from django.utils import timezone
import re
import random
from django.forms import model_to_dict
import pandas as pd
from deap import base, creator, tools
from pathlib import Path
from django.db.models import F, ExpressionWrapper, IntegerField
from db.models import Cpu, Gpu, Prices, Ram, Psu, Mobo, Storage
import warnings
warnings.filterwarnings("ignore", category=RuntimeWarning, module='django.db.models.fields')



POPULATION_SIZE = 100
GENERATIONS = 50
BUDGET = 500



# Define Fitness Function (Maximize Performance, Minimize Cost)
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

# Register Individual (PC Build) and Population
countCpu = Cpu.objects.count()
countGpu = Gpu.objects.count()
countRam = Ram.objects.count()
countPsu = Psu.objects.count()
countMobo = Mobo.objects.count()
countStorage = Storage.objects.count()

def getBestPrice(part):
    price = Prices.objects.filter(object_id=part.uid, sale_end__lte=timezone.now()).order_by("price").first()
    if price:
        return price.price
    else:
        return 0

def indran(n):
    return random.randint(0, n - 1) if n > 0 else 0  # avoids IndexError

def estimateWatts(cpu_tdp, gpu_tdp, overhead=150, headroom_factor=1.3):
    base = cpu_tdp + gpu_tdp + overhead
    recommended = int(base * headroom_factor)
    return recommended

def random_build():
    # Pick random motherboard
    mobos = Mobo.objects.all()
    mobo = mobos[indran(mobos.count())]

    # Pick random CPU compatible with motherboard
    cpus = Cpu.objects.filter(socket=mobo.socket)
    cpu = cpus[indran(cpus.count())]

    # Pick random GPU
    gpus = Gpu.objects.all()
    if cpu.igpu:
        gpu = random.choice([gpus[indran(gpus.count())], cpu.igpu])
    else:
        gpu = gpus[indran(gpus.count())]

    # Estimate power and pick PSU with enough wattage
    if cpu.igpu == gpu:
        reqWatts = estimateWatts(cpu.tdp, 0)
    else:
        reqWatts = estimateWatts(cpu.tdp, gpu.tdp)
    psus = Psu.objects.filter(wattage__gte=reqWatts)
    psu = psus[indran(psus.count())]

    # Pick random RAM compatible with motherboard
    rams = Ram.objects.annotate(
    total_memory=ExpressionWrapper(
        F('memory_size') * F('memory_modules'),
        output_field=IntegerField()
    )).filter(
        memory_type=mobo.memory_type,
        memory_modules__lte=mobo.memory_slots,
        total_memory__lte=mobo.memory_max
    )
    ram = rams[indran(rams.count())]
    
    storages = Storage.objects.all()
    storage = storages[indran(storages.count())]
    return creator.Individual([
        cpu,
        gpu,
        psu,
        mobo,
        ram,
        storage 
    ])


toolbox = base.Toolbox()
toolbox.register("individual", random_build)
toolbox.register("population", tools.initRepeat, list, toolbox.individual)

# Fitness Function
def fitness_function(individual):

    cpu = individual[0]
    gpu = individual[1]
    psu = individual[2]
    mobo = individual[3]
    ram = individual[4]
    storage = individual[5]

    cpu_perf = ((cpu.speed + cpu.turbo)/2) * cpu.cores
    gpu_perf = ((gpu.speed + gpu.turbo)/2) * gpu.memory

    perf = (cpu_perf + gpu_perf) / 2

    prices = []
    for item in individual:
        if item.__class__.__name__ == "igpu":
            prices.append(0)
        else:
            prices.append(getBestPrice(item))
    price = sum(prices)

    if cpu.socket != mobo.socket:
        return -1000,

    if gpu.__class__.__name__ == "igpu":
        if cpu.igpu != gpu:
            return -1000

    if price > BUDGET * 1.1:
        return -price,

    return perf, 

def crossover(ind1, ind2):
    # Choose a random crossover point between 0 and 5 (since there are 6 components)
    crossover_point = random.randint(1, 5)
    
    # Swap the components after the crossover point
    for i in range(crossover_point, len(ind1)):
        ind1[i], ind2[i] = ind2[i], ind1[i]
        
    return ind1, ind2

def mutate(individual):
    part_index = random.randint(0, 5)  # 0=CPU, 1=GPU, 2=PSU, 3=Mobo, 4=RAM, 5=Storage

    mobo = individual[3]

    if part_index == 3:  # Motherboard
        count_mobo = Mobo.objects.count()
        index = indran(count_mobo)
        new_mobo = Mobo.objects.all()[index]

        # Compatible CPU
        compatible_cpus = Cpu.objects.filter(socket=new_mobo.socket)
        new_cpu = compatible_cpus[indran(compatible_cpus.count())] if compatible_cpus.exists() else None

        # Compatible RAM
        compatible_rams = Ram.objects.filter(memory_modules__lte=new_mobo.memory_slots)
        new_ram = compatible_rams[indran(compatible_rams.count())] if compatible_rams.exists() else None

        individual[3] = new_mobo
        if new_cpu: individual[0] = new_cpu
        if new_ram: individual[4] = new_ram

    elif part_index == 0:  # CPU
        compatible_cpus = Cpu.objects.filter(socket=mobo.socket)
        if compatible_cpus.exists():
            individual[0] = compatible_cpus[indran(compatible_cpus.count())]

    elif part_index == 1:  # GPU
        count_gpu = Gpu.objects.count()
        individual[1] = Gpu.objects.all()[indran(count_gpu)]

    elif part_index == 2:  # PSU
        count_psu = Psu.objects.count()
        individual[2] = Psu.objects.all()[indran(count_psu)]

    elif part_index == 4:  # RAM
        compatible_rams = Ram.objects.filter(memory_modules__lte=mobo.memory_slots)
        if compatible_rams.exists():
            individual[4] = compatible_rams[indran(compatible_rams.count())]

    elif part_index == 5:  # Storage
        count_storage = Storage.objects.count()
        individual[5] = Storage.objects.all()[indran(count_storage)]

    return individual

# Register Genetic Operators
toolbox.register("mutate", mutate)
toolbox.register("evaluate", fitness_function)
toolbox.register("mate", crossover)
toolbox.register("select", tools.selTournament, tournsize=3)

# Run Genetic Algorithm
def run_ga(budget):

    BUDGET = budget
    
    population = toolbox.population(n=POPULATION_SIZE)

    # Recalculate Fitness
    invalid_individuals = [ind for ind in population if not ind.fitness.valid]
    fitnesses = map(toolbox.evaluate, invalid_individuals)
    for ind, fit in zip(invalid_individuals, fitnesses):
        ind.fitness.values = fit

    for generation in range(GENERATIONS):
        offspring = toolbox.select(population, len(population))
        offspring = list(map(toolbox.clone, offspring))

        # Crossover and Mutation
        for child1, child2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < 0.5:
                toolbox.mate(child1, child2)
                del child1.fitness.values, child2.fitness.values

        for mutant in offspring:
            if random.random() < 0.2:
                toolbox.mutate(mutant)
                del mutant.fitness.values

        invalid_individuals = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = map(toolbox.evaluate, invalid_individuals)
        for ind, fit in zip(invalid_individuals, fitnesses):
            ind.fitness.values = fit


        population[:] = offspring
        fits = [ind.fitness.values[0] for ind in population]

    best_build = tools.selBest(population, 1)[0]

    prices = []
    for item in best_build:
        if item.__class__.__name__ == "igpu":
            prices.append(0)
        else:
            prices.append(getBestPrice(item))
    price = sum(prices)

    return {
    "cpu": model_to_dict(best_build[0]),
    "gpu": model_to_dict(best_build[1]),
    "psu": model_to_dict(best_build[2]),
    "mobo": model_to_dict(best_build[3]),
    "ram": model_to_dict(best_build[4]),
    "storage": model_to_dict(best_build[5]),
    "total_price": price
}
