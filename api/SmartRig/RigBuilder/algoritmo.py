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
psu_parts = pd.read_csv(PROJECT_DIR / "power-supply.csv")
storage_parts = pd.read_csv(PROJECT_DIR / "internal-hard-drive.csv")

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
BUDGET = 1500


# Genetic Algorithm Parameters
POPULATION_SIZE = 100
GENERATIONS = 50
BUDGET = 1500

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
   mobo = individual[3].iloc[0].to_dict()

   cpu_perf = ((cpu["speed"] + cpu["turbo"]) / 2) * cpu["cores"]
   gpu_perf = ((gpu["core_clock"] + gpu["boost_clock"]) / 2) * gpu["memory"]

   perf = (cpu_perf + gpu_perf) / 2


   if cpu["socket"] != mobo["socket"]:
       return 0,

   return perf,

def crossover(ind1, ind2):
    # Choose a random crossover point between 0 and 5 (since there are 6 components)
    crossover_point = random.randint(1, 5)
    
    # Swap the components after the crossover point
    for i in range(crossover_point, len(ind1)):
        ind1[i], ind2[i] = ind2[i], ind1[i]
        
    return ind1, ind2

""" def custom_mutation(individual):
    part_index = random.randint(0, len(individual) - 1)
    part_category = list(pc_parts.keys())[part_index]
    individual[part_index] = random.choice(pc_parts[part_category].values.tolist())
    return individual, """

# Register Genetic Operators
toolbox.register("evaluate", fitness_function)
toolbox.register("mate", crossover)
toolbox.register("select", tools.selTournament, tournsize=3)

# Run Genetic Algorithm
def run_ga():
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

        """ for mutant in offspring:
            if random.random() < 0.2:
                toolbox.mutate(mutant)
                del mutant.fitness.values """

        invalid_individuals = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = map(toolbox.evaluate, invalid_individuals)
        for ind, fit in zip(invalid_individuals, fitnesses):
            ind.fitness.values = fit


        population[:] = offspring

    best_build = tools.selBest(population, 1)[0]
    return best_build


if __name__ == "__main__":
    best_build = run_ga()
    print("\n🎯 Best PC Build Found:")
    print("CPU: ", best_build[0].iloc[0]["name"])  # CPU is the first component
    print("GPU: ", best_build[1].iloc[0]["name"], best_build[1].iloc[0]["chipset"])  # GPU is the second component
    print("PSU: ", best_build[2].iloc[0]["name"])  # PSU is the third component
    print("Motherboard: ", best_build[3].iloc[0]["name"])  # Motherboard is the fourth component
    print("RAM: ", best_build[4].iloc[0]["name"], best_build[4].iloc[0]["modules"], "GB")  # RAM is the fifth component
    print("Storage: ", best_build[5].iloc[0]["name"], best_build[5].iloc[0]["capacity"])  # Storage is the sixth component
    print("Total Performance: ", best_build.fitness.values[0])
