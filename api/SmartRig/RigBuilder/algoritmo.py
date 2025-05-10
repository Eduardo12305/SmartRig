# Genetic Algorithm for PC Part Selection

import re
import random
import pandas as pd
from deap import base, creator, tools
from pathlib import Path

PROJECT_DIR = Path(__file__).parent

# Load PC parts datasets
cpu_parts = pd.read_csv(PROJECT_DIR / "cpu_clean.csv")
gpu_parts = pd.read_csv(PROJECT_DIR / "gpu2_clean.csv")
ram_parts = pd.read_csv(PROJECT_DIR / "ram_clean.csv")
mobo_parts = pd.read_csv(PROJECT_DIR / "mobo_clean.csv")
psu_parts = pd.read_csv(PROJECT_DIR / "psu_clean.csv")
storage_parts = pd.read_csv(PROJECT_DIR / "storage_clean.csv")

def parse_modules(mod_str):
    try:
        count, size = map(int, str(mod_str).split(","))
        return count, count * size
    except:
        return 0, 0  # fallback in case of bad format
    
ram_parts[["module_count", "total_gb"]] = ram_parts["modules"].apply(
    lambda x: pd.Series(parse_modules(x))
)

# Genetic Algorithm Parameters
POPULATION_SIZE = 100
GENERATIONS = 50
BUDGET = 500



# Define Fitness Function (Maximize Performance, Minimize Cost)
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

# Register Individual (PC Build) and Population
def random_build():
    mobo = mobo_parts.sample(n=1)
    cpu = cpu_parts[cpu_parts["socket"] == mobo.iloc[0]["socket"]].sample(n=1)
    gpu = gpu_parts.sample(n=1)
    psu = psu_parts.sample(n=1)
    ram = ram_parts[ram_parts["module_count"] <= int(mobo.iloc[0]["memory_slots"])].sample(n=1)
        
    storage = storage_parts.sample(n=1)
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

    cpu = individual[0].iloc[0].to_dict()
    gpu = individual[1].iloc[0].to_dict()
    psu = individual[2].iloc[0].to_dict()
    mobo = individual[3].iloc[0].to_dict()
    ram = individual[4].iloc[0].to_dict()
    storage = individual[5].iloc[0].to_dict()

    cpu_perf = ((float(cpu["speed"]) + float(cpu["turbo"])) / 2) * float(cpu["cores"])
    gpu_perf = ((float(gpu["core_clock"]) + float(gpu["boost_clock"])) / 2) * float(gpu["memory"])

    perf = (cpu_perf + gpu_perf) / 3

    if ram["total_gb"] <= 8:
        perf *= 0.5

    price = float(cpu["price"] + gpu["price"] + psu["price"] + mobo["price"] + ram["price"] + storage["price"])

    if cpu["socket"] != mobo["socket"]:
        return -1000,

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

    if part_index == 3:  # Motherboard
        new_mobo = mobo_parts.sample(n=1)
        new_cpu = cpu_parts[cpu_parts["socket"] == new_mobo.iloc[0]["socket"]].sample(n=1)
        new_ram = ram_parts[
            ram_parts["module_count"] <= new_mobo.iloc[0]["memory_slots"]
        ].sample(n=1)
        individual[3] = new_mobo
        individual[0] = new_cpu
        individual[4] = new_ram

    elif part_index == 0:  # CPU
        socket = individual[3].iloc[0]["socket"]
        compatible_cpus = cpu_parts[cpu_parts["socket"] == socket]
        if not compatible_cpus.empty:
            individual[0] = compatible_cpus.sample(n=1)

    elif part_index == 1:  # GPU
        individual[1] = gpu_parts.sample(n=1)

    elif part_index == 2:  # PSU
        individual[2] = psu_parts.sample(n=1)

    elif part_index == 4:  # RAM
        slots = individual[3].iloc[0]["memory_slots"]
        compatible_rams = ram_parts[
            ram_parts["module_count"] <= slots
        ]
        if not compatible_rams.empty:
            individual[4] = compatible_rams.sample(n=1)

    elif part_index == 5:  # Storage
        individual[5] = storage_parts.sample(n=1)

    return individual,

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
        print(f"Generation {generation} - Max Fitness: {max(fits)} | Avg: {sum(fits)/len(fits):.2f}")

    best_build = tools.selBest(population, 1)[0]
    return best_build


if __name__ == "__main__":
    
    try:
        BUDGET = float(input("Insira seu orçamento: "))
    except ValueError:
        print("Input invalido.")
        BUDGET = 1500.0

    best_build = run_ga(BUDGET)
    price = 0
print("\n🎯 Melhor Build Encontrada!:\n")
print("======================================")
print("🔧 BUILD")
print("======================================")

cpu = best_build[0].iloc[0]
gpu = best_build[1].iloc[0]
psu = best_build[2].iloc[0]
mobo = best_build[3].iloc[0]
ram = best_build[4].iloc[0]
storage = best_build[5].iloc[0]

print(f"🧠 Processador   : {cpu['name']} ({cpu['cores']} núcleos, Velocidade: {cpu['speed']}GHz base / {cpu['turbo']}GHz turbo, Soquete: {cpu['socket']})")
print(f"🎮 Placa de Vídeo: {gpu['name']} (Chipset: {gpu['chipset']}, {gpu['memory']}GB VRAM, {gpu['core_clock']}MHz base / {gpu.get('boost_clock', 'N/A')}MHz boost)")
print(f"🔌 Fonte         : {psu['name']} (Voltagem: {psu["wattage"]}W, Certificação: {psu["efficiency"]}, Modular: {psu["modular"]})")
print(f"🧩 Placa-Mãe     : {mobo['name']} (Socket {mobo['socket']}, {mobo['memory_slots']} RAM slots)")
ramsize = ram["modules"].split(",")
ramspeed = ram["speed"].split(",")
print(f"💾 RAM           : {ram['name']} (Total: {ram['total_gb']}GB, Quantidade: {ramsize[0]}x{ramsize[1]}GB, Tecnologia: DDR{ramspeed[0]}, Velocidade: {ramspeed[1]}MHz)")
print(f"📀 Armazenamento : Capacidade: {storage['name']} ({storage['capacity']}GB, Tipo: {f"HDD {storage["type"]}RPM" if not storage["type"] == "SSD" else "SSD"})")

print("======================================")
for part in best_build:
    price += float(part.iloc[0]["price"])
print(f"💰 Preço Estimado      : ${price:.2f}")
print(f"⚡ Fitness              : {best_build.fitness.values[0]:.2f}")
print("======================================")
