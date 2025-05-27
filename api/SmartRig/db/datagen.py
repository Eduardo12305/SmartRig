from decimal import Decimal
import random
from datetime import timedelta

from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from faker import Faker
from ninja.errors import HttpError
from django.contrib.auth.hashers import make_password

from db.models import (
    Cpu,
    Gpu,
    Igpu,
    Mobo,
    PartRegistry,
    Prices,
    Psu,
    Ram,
    Storage,
    Stores,
    Users,
)

fake = Faker()


def genUsers():
    Users.objects.create(
        **{"name": fake.name(), "password": make_password("123"), "email": fake.email()}
    )


def genStores():
    Stores.objects.create(**{"name": fake.company(), "url": fake.url()})


def genCpus():
    brand = random.choice(["Intel", "AMD"])

    # Define socket options based on brand
    socket_options = {"Intel": ["LGA1151", "LGA1200", "LGA1700"], "AMD": ["AM4", "AM5"]}

    socket = random.choice(socket_options[brand])

    if brand == "Intel":
        series = random.choice(["Core i3", "Core i5", "Core i7", "Core i9"])
        gen = random.randint(8, 14)  # Example: 8th to 14th gen
        model = random.randint(1, 9)
        suffix = random.choice(["", "K", "KF", "F", "T"])
        cpu_name = f"{brand} {series}-{gen}{model}00{suffix} {gen}th Gen"
    else:
        series = random.choice(["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"])
        model = random.randint(10, 99)
        suffix = random.choice(["", "X", "XT", "G", "GE"])
        cpu_name = f"{brand} {series} {model}00{suffix}"

    # 50% chance to have an iGPU
    igpu = None
    if suffix in ["G", "GE"] or not suffix in ["F", "KF"]:
        igpu_queryset = Igpu.objects.filter(brand=brand)
        if igpu_queryset.exists():
            igpu = random.choice(list(igpu_queryset))

    cpu = Cpu(
        **{
            "name": cpu_name,
            "image": "https://prd.place/200",
            "date_added": fake.date_this_decade(),
            "brand": brand,
            "igpu": igpu,
            "socket": socket,
            "tdp": random.randint(35, 125),
            "cores": random.choice([2, 4, 6, 8, 12, 16]),
            "speed": random.randint(2000, 3600),  # realistic base clocks
            "turbo": random.randint(3600, 5200),  # realistic turbo clocks
        }
    )
    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(cpu),
        object_id=cpu.uid,
        part_type="cpu",
    )
    cpu.save()
    registry.save()


def genIgpus():
    amd_igpus = [
        {"name": "Radeon Vega 3", "memory": 2, "speed": 1000, "turbo": 1200},
        {"name": "Radeon Vega 6", "memory": 2, "speed": 1100, "turbo": 1400},
        {"name": "Radeon Vega 8", "memory": 2, "speed": 1200, "turbo": 1500},
        {"name": "Radeon 680M", "memory": 2, "speed": 2200, "turbo": 2400},
    ]

    intel_igpus = [
        {"name": "Intel UHD 610", "memory": 1, "speed": 300, "turbo": 950},
        {"name": "Intel UHD 630", "memory": 1, "speed": 350, "turbo": 1150},
        {"name": "Intel Iris Xe", "memory": 2, "speed": 400, "turbo": 1300},
        {"name": "Intel Xe Graphics G7", "memory": 2, "speed": 450, "turbo": 1350},
    ]

    if random.random() < 0.5:
        brand = "AMD"
        spec = random.choice(amd_igpus)
    else:
        brand = "Intel"
        spec = random.choice(intel_igpus)

    igpu = Igpu(
        name=spec["name"],
        brand=brand,
        memory=spec["memory"],
        speed=spec["speed"],
        turbo=spec["turbo"],
    )

    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(igpu),
        object_id=igpu.uid,
        part_type="igpu",
    )

    igpu.save()
    registry.save()


def get_random_gpu_chipset():
    nvidia_chipsets = {
        "GTX 1050": (75, 2, 1350, 1450),
        "GTX 1050 Ti": (75, 4, 1290, 1390),
        "GTX 1060": (120, 6, 1506, 1708),
        "GTX 1070": (150, 8, 1506, 1683),
        "GTX 1080": (180, 8, 1607, 1733),
        "GTX 1660 Ti": (120, 6, 1500, 1770),
        "RTX 3060": (170, 12, 1320, 1777),
        "RTX 3070": (220, 8, 1500, 1730),
        "RTX 3080": (320, 10, 1440, 1710),
        "RTX 4090": (450, 24, 2230, 2520),
        # Add more as needed
    }

    amd_chipsets = {
        "RX 570": (150, 4, 1168, 1244),
        "RX 580": (185, 8, 1257, 1340),
        "RX 6600 XT": (160, 8, 1968, 2589),
        "RX 6800": (250, 16, 1700, 2105),
        "RX 7900 XTX": (355, 24, 1900, 2500),
        # Add more as needed
    }

    if random.random() < 0.5:
        brand = "NVIDIA"
        chipset, (tdp, memory, speed, turbo) = random.choice(
            list(nvidia_chipsets.items())
        )
    else:
        brand = "AMD"
        chipset, (tdp, memory, speed, turbo) = random.choice(list(amd_chipsets.items()))

    return brand, chipset, tdp, memory, speed, turbo


def genGpus():
    brand, chipset, tdp, memory, speed, turbo = get_random_gpu_chipset()

    gpu = Gpu(
        name=f"{brand} {chipset}",
        image="https://prd.place/200",
        brand=brand,
        chipset=chipset,
        tdp=tdp,
        memory=memory,
        speed=speed,
        turbo=turbo,
    )

    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(gpu),
        object_id=gpu.uid,
        part_type="gpu",
    )

    gpu.save()
    registry.save()


def genPsus():
    efficiency_tiers = [
        "80+ Bronze",
        "80+ Silver",
        "80+ Gold",
        "80+ Platinum",
        "80+ Titanium",
    ]
    efficiency = random.choices(efficiency_tiers, weights=[30, 10, 35, 20, 5])[0]
    wattage = random.choices(
        [450, 550, 650, 750, 850, 1000, 1200], weights=[10, 20, 30, 25, 10, 4, 1]
    )[0]

    brand = random.choice(
            ["Corsair", "EVGA", "Seasonic", "Cooler Master", "Thermaltake", "Be Quiet!"]
        )

    # Match modularity more realistically based on wattage
    if wattage >= 750:
        modular = random.choices(["Full", "Semi"], weights=[70, 30])[0]
    elif wattage >= 550:
        modular = random.choices(["None", "Semi", "Full"], weights=[20, 50, 30])[0]
    else:
        modular = random.choices(["None", "Semi"], weights=[80, 20])[0]

    psu = Psu(
        name=f"{brand} {fake.word().capitalize()} {wattage}W {efficiency}",
        image="https://prd.place/200",
        brand=brand,
        type=random.choices(["ATX", "SFX"], weights=[85, 15])[0],  # SFX is rarer
        wattage=wattage,
        efficiency=efficiency,
        modular=modular,
    )

    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(psu),
        object_id=psu.uid,
        part_type="psu",
    )

    psu.save()
    registry.save()


def genRam():
    memory_type = random.choices(["DDR4", "DDR5"], weights=[0.6, 0.4])[0]

    # Define valid speed ranges by memory type
    speed_range = {
        "DDR4": (2133, 3600),
        "DDR5": (4800, 7200),
    }

    memory_modules = random.choice([1, 2])
    # More than 2 modules is rare for a single RAM product (those are kits)

    memory_size_per_module = random.choice([8, 16, 32])
    brand = random.choice(["Corsair", "G.Skill", "Kingston", "Crucial", "Patriot"])

    ram = Ram(
        name=f"{brand} {fake.word().capitalize()} {memory_modules}x{memory_size_per_module}GB {memory_type}",
        image="https://prd.place/200",
        brand=brand,
        memory_type=memory_type,
        memory_size=memory_size_per_module,
        memory_modules=memory_modules,
        memory_speed=random.randint(*speed_range[memory_type]),
    )

    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(ram),
        object_id=ram.uid,
        part_type="ram",
    )

    ram.save()
    registry.save()


def genMobo():
    socket_chipsets = {
        "AM4": ["B450", "X570"],
        "AM5": ["B650", "X670", "X670E"],
        "LGA1151": ["B360", "Z370"],
        "LGA1200": ["B460", "Z490", "H470", "H410"],
        "LGA1700": ["B660", "Z690", "Z790"],
    }
    brand = random.choice(["ASUS", "Gigabyte", "MSI", "ASRock", "Biostar"])
    socket = random.choice(list(socket_chipsets.keys()))
    chipset = random.choice(socket_chipsets[socket])

    memory_type = "DDR4" if socket in ["AM4", "LGA1151"] else "DDR5"

    form_factor = random.choices(
        ["ATX", "Micro ATX", "Mini ITX"], weights=[0.5, 0.3, 0.2]
    )[0]

    memory_slots = 4 if form_factor in ["ATX", "Micro ATX"] else 2
    memory_max_options = {2: [32, 64], 4: [64, 128], 8: [128, 256]}
    memory_max = random.choice(memory_max_options.get(memory_slots, [64]))

    mobo = Mobo(
        name=f"{brand} {chipset} {fake.word().capitalize()} {socket}",
        image="https://prd.place/200",
        brand=brand,
        socket=socket,
        form_factor=form_factor,
        memory_max=memory_max,
        memory_type=memory_type,
        memory_slots=memory_slots,
        chipset=chipset,
        m2_nvme=random.choices([0, 1, 2], weights=[0.2, 0.6, 0.2])[0],
        m2_sata=random.choices([0, 1], weights=[0.7, 0.3])[0],
    )

    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(mobo),
        object_id=mobo.uid,
        part_type="mobo",
    )

    mobo.save()
    registry.save()


def genStorage():

    type = random.choice(["HDD", "SSD", "M.2"])

    if type == "HDD":
        form_factor = random.choice(["3.5", "2.5"])
        interface = "SATA"
        capacity = random.choice([1024, 2048, 3072, 4096, 8192])  # 1TB to 8TB

    elif type == "SSD":
        form_factor = "2.5"
        interface = "SATA"
        capacity = random.choice([256, 512, 1024, 2048])  # 256GB to 2TB

    else:  # M.2
        form_factor = "M.2"
        interface = random.choice(["SATA", "NVMe"])
        capacity = random.choice([256, 512, 1024, 2048, 4096])  # Up to 4TB for NVMe

    storage = Storage(
        **{
            "name": f"{fake.company()} {fake.word()}",
            "image": "https://prd.place/200",
            "brand": fake.company(),
            "type": type,
            "capacity": capacity,
            "form_factor": form_factor,
            "interface": interface,
        }
    )

    registry = PartRegistry(
        content_type=ContentType.objects.get_for_model(storage),
        object_id=storage.uid,
        part_type="storage",
    )

    storage.save()
    registry.save()


def estimate_base_price(part):
    """Estimate price based on part power with Brazilian market in mind."""
    model = part.__class__.__name__

    if model == "Cpu":
        base_ghz = part.speed / 1000
        turbo_ghz = part.turbo / 1000
        return (
            part.cores * 100 + base_ghz * 210 + turbo_ghz * 200
        )  # adjusted for BR prices

    elif model == "Gpu":
        core_ghz = part.speed / 1000
        return (
            part.memory * 100 + core_ghz * 250 + part.tdp * 3
        )  # adjusted for BR prices

    elif model == "Ram":
        return (part.memory_size / 8) * 200 + (
            part.memory_speed / 1000
        ) * 80  # adjusted

    elif model == "Storage":
        if part.type == "HDD":
            return part.capacity * 0.4  # ~R$400 for 1TB HDD
        else:
            return part.capacity * 0.8  # ~R$800 for 1TB SSD

    elif model == "Psu":
        return 250 + part.wattage * 1.2  # 600W ~R$970

    elif model == "Mobo":
        return 600 + part.memory_max * 0.6 + part.memory_slots * 80

    else:
        return 200  # default fallback


def genPrice(part):
    """Generate and save a realistic Prices entry for a given part."""
    store = random.choice(list(Stores.objects.all()))
    content_type = ContentType.objects.get_for_model(part)

    # Base estimated price for the part
    base_price = estimate_base_price(part)

    # Introduce store pricing bias (simulate expensive/cheap stores)
    store_price_bias = random.uniform(-0.1, 0.1)  # ±10%
    price_variation = random.uniform(-0.05, 0.15)  # ±5% to +15%
    final_price = base_price * (1 + store_price_bias + price_variation)
    final_price = round(max(final_price, 10), 2)  # Ensure minimum price

    # Determine if the product is on sale
    is_on_sale = random.choices([True, False], weights=[0.3, 0.7])[0]

    old_price = None
    sale_percent = None
    sale_end = None

    if is_on_sale:
        sale_increase = random.uniform(0.10, 0.40)  # 10–40% discount
        old_price = round(final_price * (1 + sale_increase), 2)
        sale_percent = int(((old_price - final_price) / old_price) * 100)
        sale_end = timezone.now() + timedelta(days=random.randint(1, 10))

    # Generate a realistic product URL
    name_slug = str(part.name).replace(" ", "-").lower()
    url = f"https://{store.name.lower().replace(' ', '')}.com/produtos/{name_slug}?ref={random.randint(1000,9999)}"

    Prices.objects.create(
        store=store,
        url_product=url,
        sale=is_on_sale,
        price=Decimal(final_price),
        old_price=Decimal(old_price) if old_price else None,
        sale_percent=sale_percent,
        sale_end=sale_end,
        content_type=content_type,
        object_id=part.uid,
    )

def genAllPrices():
    registry = list(PartRegistry.objects.filter(~Q(part_type="igpu")))

    for x in range(len(registry)):
        part = registry[x].part
        try:
            genPrice(part)
        except Exception as e:
            print(f"Error creating price for {part}: {e}")
    
    return JsonResponse({
        "message": "Preços criados com sucesso"
    }, status=201)


def genAll(data):
    qty = data.qty
    try:
        for _ in range(qty[0]):
            genUsers()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[1]):
            genStores()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[2]):
            genIgpus()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[3]):
            genCpus()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[4]):
            genGpus()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[5]):
            genPsus()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[6]):
            genMobo()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[7]):
            genRam()
    except Exception as e:
        raise HttpError(400, str(e))

    try:
        for _ in range(qty[8]):
            genStorage()
    except Exception as e:
        raise HttpError(400, str(e))

    return JsonResponse({"message": "Produtos Gerados com sucesso!"}, status=201)
