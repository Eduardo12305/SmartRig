import random
from functools import partial

from deap import base, creator, tools
from django.db.models import ExpressionWrapper, F, FloatField, IntegerField, Max
from django.forms import model_to_dict
from django.utils import timezone

from db.models import Cpu, Gpu, Mobo, Prices, Psu, Ram, Storage

# Constants
POPULATION_SIZE = 150
GENERATIONS = 50
try:
    MAXCPU = (
        Cpu.objects.annotate(
            perf=ExpressionWrapper(
                ((F("speed") + F("turbo")) / 2) * F("cores"), output_field=FloatField()
            )
        ).aggregate(Max("perf"))["perf__max"]
        or 0
    )

    # GPU max
    MAXGPU = (
        Gpu.objects.annotate(
            perf=ExpressionWrapper(
                ((F("speed") + F("turbo")) / 2) * F("memory"), output_field=FloatField()
            )
        ).aggregate(Max("perf"))["perf__max"]
        or 0
    )

    MAXRAM = Ram.objects.annotate(
        perf=ExpressionWrapper(
            F("memory_speed") * F("memory_size"), output_field=FloatField()
        )
    ).aggregate(Max("perf"))["perf__max"]

    # Global part caches (reduces DB hits)
    ALL_CPUS = list(Cpu.objects.all())
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
                    ((F("speed") + F("turbo")) / 2) * F("cores"), output_field=FloatField()
                )
            ).aggregate(Max("perf"))["perf__max"]
            or 0
        )

        # GPU max
        MAXGPU = (
            Gpu.objects.annotate(
                perf=ExpressionWrapper(
                    ((F("speed") + F("turbo")) / 2) * F("memory"), output_field=FloatField()
                )
            ).aggregate(Max("perf"))["perf__max"]
            or 0
        )

        MAXRAM = Ram.objects.annotate(
            perf=ExpressionWrapper(
                F("memory_speed") * F("memory_size"), output_field=FloatField()
            )
        ).aggregate(Max("perf"))["perf__max"]

        # Global part caches (reduces DB hits)
        ALL_CPUS = list(Cpu.objects.all())
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
    valid_prices = Prices.objects.filter(
        object_id=part.uid
    ).filter(
        # either not on sale
        sale=False
    ).union(
        Prices.objects.filter(
            object_id=part.uid,
            sale=True,
            sale_end__gt=now
        )
    ).order_by("price")
    
    price_obj = valid_prices.first()
    value = price_obj.price if price_obj else 0
    _price_cache[part.uid] = value
    return value


def getPriceObj(part):
    
    now = timezone.now()
    
    # Get prices that are either not on sale or on sale but sale_end is in the future
    valid_prices = Prices.objects.filter(
        object_id=part.uid
    ).filter(
        # either not on sale
        sale=False
    ).union(
        Prices.objects.filter(
            object_id=part.uid,
            sale=True,
            sale_end__gt=now
        )
    ).order_by("price")
    
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
        if storage.type == "M.2":
            return mobo.m2_sata > 0
        return True
    return False


def random_build(data):
    mobo = (
        next(x for x in ALL_MOBOS if x.pk == data.mobo)
        if data.mobo
        else random.choice(ALL_MOBOS)
    )

    if data.cpu:
        cpu = next(x for x in ALL_CPUS if x.pk == data.cpu)
    else:
        cpus = [cpu for cpu in ALL_CPUS if cpu.socket == mobo.socket]
        cpu = random.choice(cpus) if cpus else random.choice(ALL_CPUS)

    if data.gpu:
        gpu = next(x for x in ALL_GPUS if x.pk == data.gpus)
    else:
        gpu = cpu.igpu if cpu.igpu else random.choice(ALL_GPUS)

    if data.psu:
        psu = next(x for x in ALL_PSUS if x.pk == data.psu)
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
        if x.capacity > data.storage and mobo_supports_storage(mobo, x)
    ]
    storage = random.choice(storages)

    return creator.Individual([cpu, gpu, psu, mobo, ram, storage])


# DEAP Setup
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)
toolbox = base.Toolbox()


def fitness_function(ind, weights,budget):
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
    gpu_perf = (((gpu.speed + gpu.turbo) / 2) * gpu.memory) / MAXGPU
    ram_perf = (ram.memory_size * (ram.memory_speed / 1000)) / MAXRAM

    total_perf = (
        cpu_perf * weights["cpu"]
        + gpu_perf * weights["gpu"]
        + ram_perf * weights["ram"]
    )

    # Calculate total price
    total_price = sum(
        getBestPrice(p) if p.__class__.__name__ != "Igpu" else 0 for p in ind
    )

    # Power requirement check
    if gpu.__class__.__name__ == "Igpu":
        required_watt = estimateWatts(cpu.tdp, 0)
    else:
        required_watt = estimateWatts(cpu.tdp, gpu.tdp)  # 100W overhead approx
    if psu.wattage < required_watt:
        return (-1000,)  # power inadequate penalty

    # Penalize if price exceeds budget, but allow partial credit (soft penalty)
    if total_price > budget:
        penalty = 1000 * (total_price - budget)  # penalty grows fast
    else:
        penalty = 0

    # Fitness: combine price and inverted performance to minimize
    fitness_score = total_perf * 1000 - penalty

    # Make sure fitness is never negative zero or less, so min 1 or so
    return (fitness_score,)


def crossover(ind1, ind2):
    point = random.randint(1, 5)
    ind1[point:], ind2[point:] = ind2[point:], ind1[point:]
    return ind1, ind2


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
            if x.capacity > data.storage and mobo_supports_storage(ind[3], x)
        ]
        ind[5] = random.choice(storages)
    return ind


toolbox.register("mate", crossover)
toolbox.register("select", tools.selTournament, tournsize=3)


def run_ga(data):
    toolbox.register("individual", partial(random_build, data=data))
    toolbox.register("mutate", partial(mutate, data=data))
    toolbox.register("evaluate", partial(fitness_function, weights=data.weights, budget=data.budget))
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    population = toolbox.population(n=POPULATION_SIZE)
    for ind in population:
        ind.fitness.values = toolbox.evaluate(ind)

    for _ in range(GENERATIONS):
        offspring = toolbox.select(population, len(population))
        offspring = list(map(toolbox.clone, offspring))

        for c1, c2 in zip(offspring[::2], offspring[1::2]):
            if random.random() < 0.8:
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
        if item and hasattr(item, "uid"):
            prices.append(getPriceObj(item))  # Adiciona preço ao objeto

    if best.fitness.values[0] < 0:
        return {"message": "Orçamento muito baixo :("}
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
