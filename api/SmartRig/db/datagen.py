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
    
    # More realistic socket distributions
    socket_options = {
        "Intel": ["LGA1151", "LGA1200", "LGA1700"], 
        "AMD": ["AM4", "AM5", "sTRX4"]  # Added sTRX4 for high-end
    }
    
    if brand == "Intel":
        # More realistic Intel generation
        series_weights = [
            ("Core i3", 0.25),
            ("Core i5", 0.35), 
            ("Core i7", 0.25),
            ("Core i9", 0.15)
        ]
        series = random.choices(
            [s[0] for s in series_weights], 
            weights=[s[1] for s in series_weights]
        )[0]
        
        # Generation and socket correlation
        gen_socket_map = {
            8: "LGA1151", 9: "LGA1151", 
            10: "LGA1200", 11: "LGA1200",
            12: "LGA1700", 13: "LGA1700", 14: "LGA1700"
        }
        gen = random.choice(list(gen_socket_map.keys()))
        socket = gen_socket_map[gen]
        
        # Realistic model numbers based on series and generation
        if series == "Core i3":
            model_ranges = {8: [100, 350], 9: [100, 350], 10: [100, 320], 
                          11: [100, 320], 12: [100, 300], 13: [100, 300], 14: [100, 300]}
            cores = random.choice([4, 6]) if gen >= 12 else 4
            base_speed = random.randint(3000, 3700)
            turbo_speed = base_speed + random.randint(400, 800)
            tdp = random.choice([35, 65])
        elif series == "Core i5":
            model_ranges = {8: [400, 680], 9: [400, 680], 10: [400, 640], 
                          11: [400, 650], 12: [400, 600], 13: [400, 600], 14: [400, 600]}
            cores = random.choice([6, 8]) if gen >= 12 else 6
            base_speed = random.randint(2400, 3200)
            turbo_speed = base_speed + random.randint(800, 1400)
            tdp = random.choice([65, 95, 125])
        elif series == "Core i7":
            model_ranges = {8: [700, 870], 9: [700, 870], 10: [700, 870], 
                          11: [700, 870], 12: [700, 790], 13: [700, 790], 14: [700, 790]}
            cores = random.choice([8, 12]) if gen >= 12 else 8
            base_speed = random.randint(2000, 2900)
            turbo_speed = base_speed + random.randint(1200, 2000)
            tdp = random.choice([65, 95, 125])
        else:  # Core i9
            model_ranges = {8: [900, 980], 9: [900, 980], 10: [900, 980], 
                          11: [900, 980], 12: [900, 980], 13: [900, 980], 14: [900, 980]}
            cores = random.choice([8, 12, 16]) if gen >= 12 else random.choice([8, 10])
            base_speed = random.randint(2000, 2700)
            turbo_speed = base_speed + random.randint(1500, 2500)
            tdp = random.choice([95, 125, 165])
        
        model_min, model_max = model_ranges[gen]
        model = random.randint(model_min, model_max)
        
        # Realistic suffix distribution
        suffix_weights = [("", 0.4), ("K", 0.25), ("KF", 0.15), ("F", 0.15), ("T", 0.05)]
        suffix = random.choices(
            [s[0] for s in suffix_weights], 
            weights=[s[1] for s in suffix_weights]
        )[0]
        
        # Adjust TDP for suffixes
        if suffix == "T":
            tdp = random.choice([35, 45])
        elif suffix in ["K", "KF"]:
            tdp = max(tdp, 95)  # K series typically higher TDP
        
        cpu_name = f"{brand} {series}-{gen}{model:03d}{suffix}"
        
    else:  # AMD
        # More realistic AMD series distribution
        series_weights = [
            ("Ryzen 3", 0.20),
            ("Ryzen 5", 0.40),
            ("Ryzen 7", 0.25),
            ("Ryzen 9", 0.10),
            ("Threadripper", 0.05)
        ]
        series = random.choices(
            [s[0] for s in series_weights], 
            weights=[s[1] for s in series_weights]
        )[0]
        
        if series == "Threadripper":
            socket = "sTRX4"
            gen = random.choice([3, 5])  # 3000 or 5000 series
            model = random.choice([24, 32, 64])
            suffix = random.choice(["WX", "X"])
            cores = {"24": 24, "32": 32, "64": 64}[str(model)]
            cpu_name = f"{brand} {series} {gen}9{model}{suffix}"
            base_speed = random.randint(2700, 3200)
            turbo_speed = base_speed + random.randint(1100, 1600)
            tdp = random.choice([280, 350])
        else:
            socket = random.choice(["AM4", "AM5"])
            
            # Generation based on socket
            if socket == "AM4":
                gen = random.choice([1, 2, 3, 5])  # 1000, 2000, 3000, 5000 series
            else:  # AM5
                gen = random.choice([7, 8, 9])  # 7000, 8000, 9000 series
            
            # Realistic model numbers and specs based on series
            if series == "Ryzen 3":
                if gen <= 5:
                    model_options = [100, 200, 300] if gen <= 3 else [100, 300, 500, 600]
                else:
                    model_options = [100, 200, 300]
                cores = random.choice([4, 6])
                base_speed = random.randint(3200, 3800)
                turbo_speed = base_speed + random.randint(400, 800)
                tdp = random.choice([45, 65])
            elif series == "Ryzen 5":
                if gen <= 5:
                    model_options = [500, 600, 700, 800] if gen <= 3 else [500, 600, 700, 800]
                else:
                    model_options = [500, 600, 700, 800]
                cores = random.choice([6, 8])
                base_speed = random.randint(3000, 3700)
                turbo_speed = base_speed + random.randint(600, 1200)
                tdp = random.choice([65, 95, 105])
            elif series == "Ryzen 7":
                if gen <= 5:
                    model_options = [700, 800, 900] if gen <= 3 else [700, 800, 900]
                else:
                    model_options = [700, 800, 900]
                cores = random.choice([8, 12])
                base_speed = random.randint(2800, 3400)
                turbo_speed = base_speed + random.randint(800, 1600)
                tdp = random.choice([65, 95, 105])
            else:  # Ryzen 9
                model_options = [900, 950]
                cores = random.choice([12, 16])
                base_speed = random.randint(2700, 3200)
                turbo_speed = base_speed + random.randint(1000, 1800)
                tdp = random.choice([105, 170])
            
            model = random.choice(model_options)
            
            # Realistic suffix distribution for AMD
            suffix_weights = [("", 0.3), ("X", 0.35), ("XT", 0.15), ("G", 0.15), ("GE", 0.05)]
            suffix = random.choices(
                [s[0] for s in suffix_weights], 
                weights=[s[1] for s in suffix_weights]
            )[0]
            
            # Adjust specs for suffixes
            if suffix == "G":
                tdp = min(tdp, 65)  # G series typically lower TDP
            elif suffix == "GE":
                tdp = 35
            elif suffix in ["X", "XT"]:
                base_speed += random.randint(100, 300)
                turbo_speed += random.randint(100, 400)
            
            cpu_name = f"{brand} {series} {gen}{model:01d}00{suffix}"
    
    # iGPU logic - more realistic
    igpu = None
    has_igpu_chance = 0.7 if suffix in ["G", "GE"] else 0.3 if brand == "Intel" and suffix not in ["F", "KF"] else 0.1
    
    if random.random() < has_igpu_chance:
        igpu_queryset = Igpu.objects.filter(brand=brand)
        if igpu_queryset.exists():
            igpu = random.choice(list(igpu_queryset))
    
    cpu = Cpu(
        **{
            "name": cpu_name,
            "image": "https://prd.place/200?id=38",
            "date_added": fake.date_this_decade(),
            "brand": brand,
            "igpu": igpu,
            "socket": socket,
            "tdp": tdp,
            "cores": cores,
            "speed": base_speed,
            "turbo": turbo_speed,
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
    manufacturer = random.choice(["ASUS", "MSI", "Gigabyte", "EVGA", "Sapphire", "Zotac"])

    gpu = Gpu(
        name=f"{manufacturer} {brand} {chipset} {memory}GB",
        image="https://prd.place/200?id=2",
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
        image="https://prd.place/200?id=43",
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
        image="https://prd.place/200?id=3",
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
    "sTRX4": ["TRX40", "WRX80"],
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
        image="https://prd.place/200?id=5",
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
            "name": f"{fake.company()} {capacity}GB {type} {interface} {form_factor}",
            "image": "https://prd.place/200?id=1",
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
    model = part.__class__.__name__
    
    if model == "Cpu":
        base_ghz = part.speed / 1000
        turbo_ghz = part.turbo / 1000
        
        # CPUs entry-level (4 cores): R$400-800
        # CPUs mid-range (6-8 cores): R$800-1500
        # CPUs high-end (12+ cores): R$1500-3000+
        core_multiplier = 60 if part.cores <= 4 else (80 if part.cores <= 8 else 120)
        
        return (
            part.cores * core_multiplier + 
            base_ghz * 150 + 
            turbo_ghz * 100
        )
    
    elif model == "Gpu":
        core_ghz = part.speed / 1000
        
        # Entry-level: R$500-1000
        # Mid-range: R$1000-2500
        # High-end: R$2500-5000+
        memory_multiplier = 60 if part.memory <= 4 else (80 if part.memory <= 8 else 120)
        
        return (
            part.memory * memory_multiplier + 
            core_ghz * 180 + 
            part.tdp * 2
        )
    
    elif model == "Ram":
        # 8GB DDR4: ~R$180-300
        # 16GB DDR4: ~R$300-500
        # 32GB DDR4: ~R$600-1000
        base_price_per_gb = 25 if part.memory_size <= 16 else 20
        speed_bonus = max(0, (part.memory_speed - 2400) / 1000) * 30
        
        return (part.memory_size * base_price_per_gb) + speed_bonus
    
    elif model == "Storage":
        if part.type == "HDD":
            # HDD: ~R$250-350 para 1TB
            return part.capacity * 0.25
        else:
            # SSD: ~R$400-600 para 1TB
            return part.capacity * 0.45
    
    elif model == "Psu":
        # PSU: 500W ~R$300-400, 650W ~R$400-600, 850W ~R$600-900
        base_psu = 200
        wattage_multiplier = 0.6 if part.wattage <= 600 else 0.8
        
        return base_psu + (part.wattage * wattage_multiplier)
    
    elif model == "Mobo":
        # Motherboards: Entry R$400-600, Mid R$600-1200, High R$1200+
        base_mobo = 400
        memory_bonus = (part.memory_max / 1000) * 50  # Por GB máximo suportado
        slot_bonus = part.memory_slots * 25
        
        return base_mobo + memory_bonus + slot_bonus
    
    else:
        return 150  # default fallback reduzido


def genPrice(part):
    store = random.choice(list(Stores.objects.all()))
    content_type = ContentType.objects.get_for_model(part)
    
    # Base estimated price for the part
    base_price = estimate_base_price(part)
    
    store_price_bias = random.uniform(-0.15, 0.25)  # -15% a +25%
    price_variation = random.uniform(-0.08, 0.12)   # -8% a +12%
    
    final_price = base_price * (1 + store_price_bias + price_variation)
    final_price = round(max(final_price, 50), 2)  
    
    # Determine if the product is on sale
    is_on_sale = random.choices([True, False], weights=[0.25, 0.75])[0]
    
    old_price = None
    sale_percent = None
    sale_end = None
    
    if is_on_sale:
        sale_increase = random.uniform(0.08, 0.30)  # 8–30% discount
        old_price = round(final_price * (1 + sale_increase), 2)
        sale_percent = int(((old_price - final_price) / old_price) * 100)
        sale_end = timezone.now() + timedelta(days=random.randint(3, 15))
    
    # Generate a realistic product URL
    name_slug = str(part.name).replace(" ", "-").lower()
    url = f"https://{store.name.lower().replace(' ', '')}.com.br/produtos/{name_slug}?ref={random.randint(1000,9999)}"
    
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
