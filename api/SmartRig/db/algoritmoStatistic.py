import random
from functools import partial
import time
import numpy as np
import matplotlib.pyplot as plt
from deap import base, creator, tools
from django.db.models import ExpressionWrapper, F, FloatField, IntegerField, Max, Q
from django.forms import model_to_dict
from django.utils import timezone
from ninja.errors import HttpError
from db.models import Cpu, Gpu, Mobo, Prices, Psu, Ram, Storage

# Constants
POPULATION_SIZE = 150
GENERATIONS = 50


def get_chipset_multiplier(chipset):
    """
    Multiplica performance baseado no chipset da GPU
    Valores aproximados baseados em arquiteturas reais
    """
    chipset_lower = chipset.lower()

    # NVIDIA
    if "rtx 40" in chipset_lower or "ada" in chipset_lower:
        return 1.3  # Arquitetura mais eficiente
    elif "rtx 30" in chipset_lower or "ampere" in chipset_lower:
        return 1.2
    elif "rtx 20" in chipset_lower or "turing" in chipset_lower:
        return 1.1
    elif "gtx 16" in chipset_lower:
        return 1.0
    elif "gtx 10" in chipset_lower or "pascal" in chipset_lower:
        return 0.9

    # AMD
    elif "rx 7000" in chipset_lower or "rdna3" in chipset_lower:
        return 1.25
    elif "rx 6000" in chipset_lower or "rdna2" in chipset_lower:
        return 1.15
    elif "rx 5000" in chipset_lower or "rdna" in chipset_lower:
        return 1.05
    elif "rx 500" in chipset_lower or "polaris" in chipset_lower:
        return 0.85

    # Intel (Arc)
    elif "arc" in chipset_lower:
        return 1.0

    # Default para chipsets desconhecidos
    return 1.0


def get_igpu_multiplier(chipset):
    """
    Multiplier específico para iGPUs
    """
    chipset_lower = chipset.lower()

    if "iris xe" in chipset_lower or "arc" in chipset_lower:
        return 0.3
    elif "iris" in chipset_lower:
        return 0.2
    elif "uhd" in chipset_lower or "hd" in chipset_lower:
        return 0.1
    elif "vega" in chipset_lower:
        return 0.25
    elif "radeon" in chipset_lower:
        return 0.15

    return 0.1  # Default muito baixo para iGPUs genéricas


def calculate_gpu_performance(gpu):
    """
    Calcula performance da GPU baseada nos campos disponíveis
    """
    if gpu.__class__.__name__ == "Igpu":
        # iGPU tem performance muito menor
        base_performance = gpu.speed * get_igpu_multiplier(gpu.name)
        return base_performance
    else:
        # Frequência média (MHz)
        avg_frequency = (gpu.speed + gpu.turbo) / 2

        # Performance bruta: frequência × memória (com expoente menor para não super-valorizar memória)
        raw_performance = avg_frequency * (gpu.memory**0.7)

        # Fator de correção por chipset
        chipset_multiplier = get_chipset_multiplier(gpu.chipset)

        # Performance ajustada
        adjusted_performance = raw_performance * chipset_multiplier

        return adjusted_performance


try:
    MAXCPU = (
        Cpu.objects.annotate(
            perf=ExpressionWrapper(
                ((F("speed") + F("turbo")) / 2) * F("cores"), output_field=FloatField()
            )
        ).aggregate(Max("perf"))["perf__max"]
        or 0
    )

    all_gpus = Gpu.objects.all()  # ou como você obtém todas as GPUs
    max_gpu_performance = max(calculate_gpu_performance(gpu) for gpu in all_gpus)
    MAXGPU = max_gpu_performance

    MAXRAM = Ram.objects.annotate(
        perf=ExpressionWrapper(
            F("memory_speed") * F("memory_size"), output_field=FloatField()
        )
    ).aggregate(Max("perf"))["perf__max"]

    # Global part caches (reduces DB hits)
    ALL_CPUS = list(Cpu.objects.all())
    ALL_GPUS = list(Gpu.objects.all())
    ALL_GPUS = list(Gpu.objects.all())
    ALL_PSUS = list(Psu.objects.all())
    ALL_MOBOS = list(Mobo.objects.all())
    ALL_RAMS = list(
        Ram.objects.annotate(
            total_memory=ExpressionWrapper(
                F("memory_size") * F("memory_modules"), output_field=IntegerField()
            )
        )
    )
    ALL_STORAGES = list(Storage.objects.all())
except:
    print("Não foi possivel carregar os dados para o algoritmo.")
# Price cache
_price_cache = {}


def updateProductCache():
    try:
        MAXCPU = (
            Cpu.objects.annotate(
                perf=ExpressionWrapper(
                    ((F("speed") + F("turbo")) / 2) * F("cores"),
                    output_field=FloatField(),
                )
            ).aggregate(Max("perf"))["perf__max"]
            or 0
        )

        all_gpus = Gpu.objects.all()  # ou como você obtém todas as GPUs
        max_gpu_performance = max(calculate_gpu_performance(gpu) for gpu in all_gpus)
        MAXGPU = max_gpu_performance

        MAXRAM = Ram.objects.annotate(
            perf=ExpressionWrapper(
                F("memory_speed") * F("memory_size"), output_field=FloatField()
            )
        ).aggregate(Max("perf"))["perf__max"]

        # Global part caches (reduces DB hits)
        ALL_CPUS = list(Cpu.objects.all())
        ALL_GPUS = list(Gpu.objects.all())
        ALL_GPUS = list(Gpu.objects.all())
        ALL_PSUS = list(Psu.objects.all())
        ALL_MOBOS = list(Mobo.objects.all())
        ALL_RAMS = list(
            Ram.objects.annotate(
                total_memory=ExpressionWrapper(
                    F("memory_size") * F("memory_modules"), output_field=IntegerField()
                )
            )
        )
        ALL_STORAGES = list(Storage.objects.all())
    except:
        print("Não foi possivel carregar os dados para o algoritmo.")


def getBestPrice(part):
    if part.uid in _price_cache:
        return _price_cache[part.uid]

    now = timezone.now()

    # Get prices that are either not on sale or on sale but sale_end is in the future
    valid_prices = (
        Prices.objects.filter(object_id=part.uid)
        .filter((Q(sale=False)) | (Q(sale=True) & Q(sale_end__gt=now)))
        .order_by("price")
    )

    price_obj = valid_prices.first()
    value = price_obj.price if price_obj else 0
    _price_cache[part.uid] = value
    return value


def getPriceObj(part):

    now = timezone.now()

    # Get prices that are either not on sale or on sale but sale_end is in the future
    valid_prices = (
        Prices.objects.filter(object_id=part.uid)
        .filter(
            # either not on sale
            sale=False
        )
        .union(Prices.objects.filter(object_id=part.uid, sale=True, sale_end__gt=now))
        .order_by("price")
    )

    price_obj = valid_prices.first()
    value = model_to_dict(price_obj) if price_obj else 0
    if value != 0:
        value["uid"] = price_obj.uid
    return value


def indran(n):
    return random.randint(0, n - 1) if n > 0 else 0


def estimateWatts(cpu_tdp, gpu_tdp, overhead=150, headroom_factor=1.3):
    base = cpu_tdp + gpu_tdp + overhead
    return int(base * headroom_factor)


def mobo_supports_storage(mobo, storage):
    if storage.interface == "NVMe" and mobo.m2_nvme > 0:
        return True
    if storage.interface == "SATA":
        return True
    if storage.type == "M.2":
        return mobo.m2_sata > 0
    return False


def random_build(data):
    mobo = (
        next(x for x in ALL_MOBOS if str(x.uid) == data.mobo)
        if data.mobo
        else random.choice(ALL_MOBOS)
    )

    if data.cpu:
        cpu = next(x for x in ALL_CPUS if str(x.uid) == data.cpu)
    else:
        cpus = [cpu for cpu in ALL_CPUS if cpu.socket == mobo.socket]
        cpu = random.choice(cpus) if cpus else random.choice(ALL_CPUS)

    if data.gpu:
        gpu = next(x for x in ALL_GPUS if str(x.uid) == data.gpu)
    else:
        gpu = cpu.igpu if cpu.igpu else random.choice(ALL_GPUS)

    if data.psu:
        psu = next(x for x in ALL_PSUS if str(x.uid) == data.psu)
    else:
        reqWatts = estimateWatts(cpu.tdp, 0 if cpu.igpu == gpu else gpu.tdp)
        psus = [psu for psu in ALL_PSUS if psu.wattage >= reqWatts]
        psu = random.choice(psus) if psus else random.choice(ALL_PSUS)

    rams = [
        ram
        for ram in ALL_RAMS
        if ram.memory_type == mobo.memory_type
        and ram.memory_modules <= mobo.memory_slots
        and ram.total_memory <= mobo.memory_max
    ]
    ram = random.choice(rams) if rams else random.choice(ALL_RAMS)

    storages = [
        x
        for x in ALL_STORAGES
        if x.type == data.storageType
        and x.capacity > data.storage
        and mobo_supports_storage(mobo, x)
    ]
    storage = random.choice(storages)

    return creator.Individual([cpu, gpu, psu, mobo, ram, storage])


# DEAP Setup
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)
toolbox = base.Toolbox()


def fitness_function(ind, weights, budget):
    if not weights:
        weights = {"cpu": 0.45, "gpu": 0.45, "ram": 0.1}

    cpu, gpu, psu, mobo, ram, storage = ind

    # Compatibility checks
    if cpu.socket != mobo.socket:
        return (-1000,)
    if gpu.__class__.__name__ == "Igpu" and cpu.igpu != gpu:
        return (-1000,)
    if ram.memory_type != mobo.memory_type:
        return (-1000,)

    # Performance calculation
    cpu_perf = (((cpu.speed + cpu.turbo) / 2) * cpu.cores) / MAXCPU

    # GPU performance calculation melhorada
    gpu_raw_perf = calculate_gpu_performance(gpu)
    gpu_perf = gpu_raw_perf / MAXGPU

    ram_perf = (ram.memory_size * (ram.memory_speed / 1000)) / MAXRAM

    total_perf = (
        cpu_perf * weights.cpu + gpu_perf * weights.gpu + ram_perf * weights.ram
    )

    # Calculate total price
    total_price = sum(
        getBestPrice(p) if p.__class__.__name__ != "Igpu" else 0 for p in ind
    )

    # Power requirement check
    if gpu.__class__.__name__ == "Igpu":
        required_watt = estimateWatts(cpu.tdp, 0)
    else:
        required_watt = estimateWatts(cpu.tdp, gpu.tdp)
    if psu.wattage < required_watt:
        return (-1000,)  # power inadequate penalty

    # Penalize if price exceeds budget, but allow partial credit (soft penalty)
    if total_price > budget:
        # Penalty graduado - cresce mais devagar no início
        overspend_ratio = (total_price - budget) / budget
        penalty = 1000 * (overspend_ratio**1.5)  # Crescimento mais suave
    else:
        penalty = 0

    # Fitness: combine price and inverted performance to minimize
    fitness_score = total_perf * 1000 - penalty

    return (max(fitness_score, -1000),)


def crossover(ind1, ind2):
    # Clone individuals to avoid modifying originals
    child1, child2 = ind1[:], ind2[:]

    # Swap CPU if sockets match respective motherboards
    if child1[0].socket == child2[3].socket and child2[0].socket == child1[3].socket:
        child1[0], child2[0] = child2[0], child1[0]

    # Swap Motherboard if compatible with CPUs
    if child1[3].socket == child1[0].socket and child2[3].socket == child2[0].socket:
        child1[3], child2[3] = child2[3], child1[3]

    # Swap GPU — usually safe
    child1[1], child2[1] = child2[1], child1[1]

    # Swap PSU (assumes no dependency; optional check: power budget)
    child1[2], child2[2] = child2[2], child1[2]

    # Swap RAM if compatible with respective motherboards
    def ram_compatible(ram, mobo):
        return (
            ram.memory_modules <= mobo.memory_slots
            and ram.memory_type == mobo.memory_type
            and ram.total_memory <= mobo.memory_max
        )

    if ram_compatible(child1[4], child2[3]) and ram_compatible(child2[4], child1[3]):
        child1[4], child2[4] = child2[4], child1[4]

    # Swap storage if both are supported by the opposite's motherboard
    if mobo_supports_storage(child1[3], child2[5]) and mobo_supports_storage(
        child2[3], child1[5]
    ):
        child1[5], child2[5] = child2[5], child1[5]

    return child1, child2


def mutate(ind, data):
    idx = random.randint(0, 5)
    mobo = ind[3]
    if idx == 3 and not data.mobo:
        compatible_mobos = [
            mobo for mobo in ALL_MOBOS if ind[3].socket == ind[0].socket
        ]
        if len(compatible_mobos) == 0:
            compatible_cpus = [c for c in ALL_CPUS if c.socket == mobo.socket]
            if compatible_cpus:
                ind[0] = random.choice(compatible_cpus)
        else:
            new_mobo = random.choice(compatible_mobos)
            ind[3] = new_mobo
            compatible_rams = [
                r
                for r in ALL_RAMS
                if r.memory_modules <= new_mobo.memory_slots
                and r.memory_type == new_mobo.memory_type
                and r.total_memory <= new_mobo.memory_max
            ]
            if compatible_rams:
                ind[4] = random.choice(compatible_rams)
    elif idx == 0 and not data.cpu:
        compatible_cpus = [c for c in ALL_CPUS if c.socket == mobo.socket]
        if compatible_cpus:
            ind[0] = random.choice(compatible_cpus)
    elif idx == 1 and not data.gpu:
        ind[1] = random.choice(ALL_GPUS)
    elif idx == 2 and data.gpu:
        ind[2] = random.choice(ALL_PSUS)
    elif idx == 4:
        compatible_rams = [
            r
            for r in ALL_RAMS
            if r.memory_modules <= mobo.memory_slots
            and r.memory_type == mobo.memory_type
            and r.total_memory <= mobo.memory_max
        ]
        if compatible_rams:
            ind[4] = random.choice(compatible_rams)
    elif idx == 5:
        storages = [
            x
            for x in ALL_STORAGES
            if x.type == data.storageType
            and x.capacity > data.storage
            and mobo_supports_storage(ind[3], x)
        ]
        ind[5] = random.choice(storages)
    return ind


toolbox.register("mate", crossover)
toolbox.register("select", tools.selTournament, tournsize=3)

stats = tools.Statistics(lambda ind: ind.fitness.values[0])
stats.register("avg", np.mean)
stats.register("std", np.std)
stats.register("min", np.min)
stats.register("max", np.max)

logbook = tools.Logbook()
logbook.header = ["gen", "nevals", "time"] + stats.fields


def plot_logbook(logbook):
    gen = logbook.select("gen")
    avg = logbook.select("avg")
    std = logbook.select("std")
    min_ = logbook.select("min")
    max_ = logbook.select("max")

    plt.figure(figsize=(12, 6))
    plt.plot(gen, avg, label="Fitness Média", color="blue")
    plt.fill_between(
        gen,
        [a - s for a, s in zip(avg, std)],
        [a + s for a, s in zip(avg, std)],
        alpha=0.2,
        label="Desvio Padrão",
        color="blue",
    )
    plt.plot(gen, min_, label="Min Fitness", linestyle="--", color="red")
    plt.plot(gen, max_, label="Max Fitness", linestyle="--", color="green")

    plt.xlabel("Gerações")
    plt.ylabel("Fitness")
    plt.title("Evolução da Fitness ao longo das Gerações")
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.tight_layout()
    plt.savefig("ga_fitness_evolution.png")
    plt.clf()


def run_ga(data):
    total_start_time = time.time()

    # Register functions
    toolbox.register("individual", partial(random_build, data=data))
    toolbox.register("mutate", partial(mutate, data=data))
    toolbox.register(
        "evaluate", partial(fitness_function, weights=data.weights, budget=data.budget)
    )
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    # Statistics and logbook
    stats = tools.Statistics(lambda ind: ind.fitness.values[0])
    stats.register("avg", np.mean)
    stats.register("std", np.std)
    stats.register("min", np.min)
    stats.register("max", np.max)

    logbook = tools.Logbook()
    logbook.header = ["gen", "nevals", "time"] + stats.fields

    # Initial population
    population = toolbox.population(n=POPULATION_SIZE)
    for ind in population:
        ind.fitness.values = toolbox.evaluate(ind)

    # Record initial stats
    gen_start_time = time.time()
    record = stats.compile(population)
    gen_duration = time.time() - gen_start_time
    logbook.record(gen=0, nevals=len(population), time=gen_duration, **record)
    print(logbook.stream)

    # Evolution loop
    for gen in range(1, GENERATIONS + 1):
        gen_start_time = time.time()

        # Selection and cloning
        offspring = toolbox.select(population, len(population))
        offspring = list(map(toolbox.clone, offspring))

        # Crossover
        for c1, c2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < 0.8:
                toolbox.mate(c1, c2)
                del c1.fitness.values, c2.fitness.values

        # Mutation
        for mutant in offspring:
            if random.random() < 0.2:
                toolbox.mutate(mutant)
                del mutant.fitness.values

        # Evaluation
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        for ind in invalid_ind:
            ind.fitness.values = toolbox.evaluate(ind)

        # Replacement
        population[:] = offspring

        # Record stats
        record = stats.compile(population)
        gen_duration = time.time() - gen_start_time
        logbook.record(gen=gen, nevals=len(invalid_ind), time=gen_duration, **record)

    # Get best individual
    best = tools.selBest(population, 1)[0]
    print(logbook.stream)
    plot_logbook(logbook)  # Plot the logbook after evolution

    # Total time
    total_duration = time.time() - total_start_time
    print(f"\nTotal evolution time: {total_duration:.2f} seconds")

    prices = []
    for item in best:
        if item and hasattr(item, "uid"):
            prices.append(getPriceObj(item))  # Adiciona preço ao objeto

    if best.fitness.values[0] < 0:
        raise HttpError(400, "Orçamento muito baixo :(")
    # Convert to dict and attach prices
    cpu_dict = model_to_dict(best[0])
    cpu_dict["uid"] = best[0].uid
    cpu_dict["price"] = prices[0]

    gpu_dict = model_to_dict(best[1])
    gpu_dict["uid"] = best[1].uid
    gpu_dict["price"] = prices[1]

    psu_dict = model_to_dict(best[2])
    psu_dict["uid"] = best[2].uid
    psu_dict["price"] = prices[2]

    mobo_dict = model_to_dict(best[3])
    mobo_dict["uid"] = best[3].uid
    mobo_dict["price"] = prices[3]

    ram_dict = model_to_dict(best[4])
    ram_dict["uid"] = best[4].uid
    ram_dict["price"] = prices[4]

    storage_dict = model_to_dict(best[5])
    storage_dict["uid"] = best[5].uid
    storage_dict["price"] = prices[5]

    total_price = 0
    for price in prices:
        if isinstance(price, dict):
            total_price += price.get("price", 0)
        else:
            total_price += price

    # Final return
    return {
        "cpu": cpu_dict,
        "gpu": gpu_dict,
        "psu": psu_dict,
        "mobo": mobo_dict,
        "ram": ram_dict,
        "storage": storage_dict,
        "total_price": total_price,
        "fitness": best.fitness.values[0],
    }
