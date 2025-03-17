# Genetic Algorithm for PC Part Selection

import random
import pandas as pd
from deap import base, creator, tools
from pathlib import Path

PROJECT_DIR = Path(__file__).parent

# Load PC parts datasets
cpu_parts = pd.read_csv(PROJECT_DIR / "cpu.csv")
gpu_parts = pd.read_csv(PROJECT_DIR / "video-card.csv")
ram_parts = pd.read_csv(PROJECT_DIR / "memory.csv")
motherboard_parts = pd.read_csv(PROJECT_DIR / "motherboard.csv")
psu_parts = pd.read_csv(PROJECT_DIR / "power-supply.csv")
storage_parts = pd.read_csv(PROJECT_DIR / "internal-hard-drive.csv")

# Genetic Algorithm Parameters
POPULATION_SIZE = 100
GENERATIONS = 50
BUDGET = 1500

pc_parts = {
    "CPU": cpu_parts,
    "GPU": gpu_parts,
    "RAM": ram_parts,
    "Motherboard": motherboard_parts,
    "PSU": psu_parts,
    "Storage": storage_parts
}


# Genetic Algorithm Parameters
POPULATION_SIZE = 100
GENERATIONS = 50
BUDGET = 1500

# Define Fitness Function (Maximize Performance, Minimize Cost)
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)

# Register Individual (PC Build) and Population
def random_build():
    return [
        random.choice(pc_parts["CPU"].values.tolist()),
        random.choice(pc_parts["GPU"].values.tolist()),
        random.choice(pc_parts["RAM"].values.tolist()),
        random.choice(pc_parts["Motherboard"].values.tolist()),
        random.choice(pc_parts["PSU"].values.tolist()),
        random.choice(pc_parts["Storage"].values.tolist())
    ]


toolbox = base.Toolbox()
toolbox.register("individual", tools.initIterate, creator.Individual, random_build)
toolbox.register("population", tools.initRepeat, list, toolbox.individual)

# Fitness Function
def fitness_function(individual):
    cost = sum(part[1] for part in individual)

    # Performance calculation
    cpu_performance = float(individual[0][2]) * float(individual[0][3]) + float(individual[0][4])
    gpu_performance = float(individual[1][3]) + float(individual[1][4])


    performance = cpu_performance + gpu_performance

    # Compatibility checks
    cpu_socket = individual[0][7]
    motherboard_socket = individual[3][3]

    total_power = individual[0][4] + individual[1][4]
    psu_wattage = individual[4][4]

    compatible = (
        psu_wattage >= total_power
    )

    budget_penalty = max(0, (cost - BUDGET) / BUDGET)

    if not compatible:
        return 0,

    return performance * (1 - budget_penalty),

def custom_mutation(individual):
    part_index = random.randint(0, len(individual) - 1)
    part_category = list(pc_parts.keys())[part_index]
    individual[part_index] = random.choice(pc_parts[part_category].values.tolist())
    return individual,

# Register Genetic Operators
toolbox.register("evaluate", fitness_function)
toolbox.register("mate", tools.cxTwoPoint)
toolbox.register("mutate", custom_mutation)
toolbox.register("select", tools.selTournament, tournsize=3)

# Run Genetic Algorithm
def run_ga():
    population = toolbox.population(n=POPULATION_SIZE)
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

        # Recalculate Fitness
        invalid_individuals = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = map(toolbox.evaluate, invalid_individuals)
        for ind, fit in zip(invalid_individuals, fitnesses):
            ind.fitness.values = fit

        population[:] = offspring

    best_build = tools.selBest(population, 1)[0]
    return best_build

if __name__ == "__main__":
    best_pc_build = run_ga()
    print("\n🎯 Best PC Build Found:")
    for part in best_pc_build:
        print(f"{part[0]}: {part[1]} | Price: ${part[1]}")
