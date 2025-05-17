# Optimized Genetic Algorithm for PC Part Selection

from django.utils import timezone
import random
from django.forms import model_to_dict
from deap import base, creator, tools
from django.db.models import F, ExpressionWrapper, IntegerField
from db.models import Cpu, Gpu, Prices, Ram, Psu, Mobo, Storage

# Constants
POPULATION_SIZE = 100
GENERATIONS = 50
BUDGET = 500

# Global part caches (reduces DB hits)
ALL_CPUS = list(Cpu.objects.all())
ALL_GPUS = list(Gpu.objects.all())
ALL_PSUS = list(Psu.objects.all())
ALL_MOBOS = list(Mobo.objects.all())
ALL_RAMS = list(Ram.objects.annotate(
    total_memory=ExpressionWrapper(F('memory_size') * F('memory_modules'), output_field=IntegerField())
))
ALL_STORAGES = list(Storage.objects.all())

# Price cache
_price_cache = {}

def getBestPrice(part):
    if part.uid in _price_cache:
        return _price_cache[part.uid]
    price = Prices.objects.filter(object_id=part.uid).order_by("price").first()
    value = price.price if price else 0
    _price_cache[part.uid] = value
    return value

def indran(n):
    return random.randint(0, n - 1) if n > 0 else 0

def estimateWatts(cpu_tdp, gpu_tdp, overhead=150, headroom_factor=1.3):
    base = cpu_tdp + gpu_tdp + overhead
    return int(base * headroom_factor)

def random_build():
    mobo = random.choice(ALL_MOBOS)
    cpus = [cpu for cpu in ALL_CPUS if cpu.socket == mobo.socket]
    cpu = random.choice(cpus) if cpus else random.choice(ALL_CPUS)
    gpu = cpu.igpu if cpu.igpu else random.choice(ALL_GPUS)
    reqWatts = estimateWatts(cpu.tdp, 0 if cpu.igpu == gpu else gpu.tdp)
    psus = [psu for psu in ALL_PSUS if psu.wattage >= reqWatts]
    psu = random.choice(psus) if psus else random.choice(ALL_PSUS)
    rams = [ram for ram in ALL_RAMS if ram.memory_type == mobo.memory_type and ram.memory_modules <= mobo.memory_slots and ram.total_memory <= mobo.memory_max]
    ram = random.choice(rams) if rams else random.choice(ALL_RAMS)
    storage = random.choice(ALL_STORAGES)
    return creator.Individual([cpu, gpu, psu, mobo, ram, storage])

# DEAP Setup
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)
toolbox = base.Toolbox()
toolbox.register("individual", random_build)
toolbox.register("population", tools.initRepeat, list, toolbox.individual)

def fitness_function(ind):
    cpu, gpu, psu, mobo, ram, storage = ind

    # Compatibility checks
    if cpu.socket != mobo.socket:
        return -1000,
    if gpu.__class__.__name__ == "Igpu" and cpu.igpu != gpu:
        return -1000,

    # Performance calculation
    cpu_perf = ((cpu.speed + cpu.turbo) / 2) * cpu.cores
    gpu_perf = ((gpu.speed + gpu.turbo) / 2) * gpu.memory
    ram_perf = ram.memory_size * (ram.memory_speed / 1000)  # scale speed to GHz
    storage_perf = storage.capacity * (1.0 if storage.type == "SSD" else 0.5)  # SSD better than HDD

    total_perf = cpu_perf * 0.4 + gpu_perf * 0.4 + ram_perf * 0.15 + storage_perf * 0.05

    # Calculate total price
    total_price = sum(getBestPrice(p) if p.__class__.__name__ != "Igpu" else 0 for p in ind)

    # Power requirement check
    if gpu.__class__.__name__ == "Igpu":
        required_watt = estimateWatts(cpu.tdp, 0)
    else:
        required_watt = estimateWatts(cpu.tdp,gpu.tdp) # 100W overhead approx
    if psu.wattage < required_watt:
        return -1000,  # power inadequate penalty

    # Penalize if price exceeds budget, but allow partial credit (soft penalty)
    if total_price > BUDGET * 1.1:
        return -total_price,

    # Make sure fitness is never negative zero or less, so min 1 or so
    return total_perf,

def crossover(ind1, ind2):
    point = random.randint(1, 5)
    ind1[point:], ind2[point:] = ind2[point:], ind1[point:]
    return ind1, ind2

def mutate(ind):
    idx = random.randint(0, 5)
    mobo = ind[3]
    if idx == 3:
        new_mobo = random.choice(ALL_MOBOS)
        ind[3] = new_mobo
        compatible_cpus = [c for c in ALL_CPUS if c.socket == new_mobo.socket]
        if compatible_cpus: ind[0] = random.choice(compatible_cpus)
        compatible_rams = [r for r in ALL_RAMS if r.memory_modules <= new_mobo.memory_slots and r.memory_type == new_mobo.memory_type and r.total_memory <= new_mobo.memory_max]
        if compatible_rams: ind[4] = random.choice(compatible_rams)
    elif idx == 0:
        compatible_cpus = [c for c in ALL_CPUS if c.socket == mobo.socket]
        if compatible_cpus: ind[0] = random.choice(compatible_cpus)
    elif idx == 1:
        ind[1] = random.choice(ALL_GPUS)
    elif idx == 2:
        ind[2] = random.choice(ALL_PSUS)
    elif idx == 4:
        compatible_rams = [r for r in ALL_RAMS if r.memory_modules <= mobo.memory_slots and r.memory_type == mobo.memory_type and r.total_memory <= mobo.memory_max]
        if compatible_rams: ind[4] = random.choice(compatible_rams)
    elif idx == 5:
        ind[5] = random.choice(ALL_STORAGES)
    return ind

toolbox.register("mutate", mutate)
toolbox.register("evaluate", fitness_function)
toolbox.register("mate", crossover)
toolbox.register("select", tools.selTournament, tournsize=3)

def run_ga(budget):
    global BUDGET
    BUDGET = budget
    population = toolbox.population(n=POPULATION_SIZE)
    for ind in population:
        ind.fitness.values = toolbox.evaluate(ind)

    for _ in range(GENERATIONS):
        offspring = toolbox.select(population, len(population))
        offspring = list(map(toolbox.clone, offspring))

        for c1, c2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < 0.5:
                toolbox.mate(c1, c2)
                del c1.fitness.values, c2.fitness.values

        for mutant in offspring:
            if random.random() < 0.2:
                toolbox.mutate(mutant)
                del mutant.fitness.values

        for ind in offspring:
            if not ind.fitness.valid:
                ind.fitness.values = toolbox.evaluate(ind)

        population[:] = offspring

    best = tools.selBest(population, 1)[0]

    prices = []
    for item in best:
        if item and hasattr(item, 'uid'):
            prices.append(getBestPrice(item))  # Adiciona preço ao objeto

    if best.fitness.values[0] < 0:
        return {
            "message": "Orçamento muito baixo :("
        }
    # Convert to dict and attach prices
    cpu_dict = model_to_dict(best[0])
    cpu_dict["price"] = prices[0]

    gpu_dict = model_to_dict(best[1])
    gpu_dict["price"] = prices[1]

    psu_dict = model_to_dict(best[2])
    psu_dict["price"] = prices[2]

    mobo_dict = model_to_dict(best[3])
    mobo_dict["price"] = prices[3]

    ram_dict = model_to_dict(best[4])
    ram_dict["price"] = prices[4]

    storage_dict = model_to_dict(best[5])
    storage_dict["price"] = prices[5]

    # Final return
    return {
        "cpu": cpu_dict,
        "gpu": gpu_dict,
        "psu": psu_dict,
        "mobo": mobo_dict,
        "ram": ram_dict,
        "storage": storage_dict,
        "total_price": sum(prices),
        "fitness": best.fitness.values[0]
    }