from datetime import timedelta
from django.utils import timezone
import random
from django.http import JsonResponse
from faker import Faker
from ninja.errors import HttpError
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from db.models import Cpu, Gpu, Igpu, Mobo, PartRegistry, Prices, Psu, Ram, Storage, Stores, Users

fake = Faker()

def genUsers():
    Users.objects.create(
        **{
            "name": fake.name(),
            "password": fake.password(),
            "email": fake.email()
        }
    )

def genStores():
    Stores.objects.create(
        **{
            "name": fake.company(),
            "url": fake.url()
        }
    )

def genCpus():
    brand = random.choice(["Intel", "AMD"])
    igpu = random.choice(list(Igpu.objects.filter(brand=brand)))
    igpu = random.choice([None, igpu])

    cpu = Cpu(
        **{
            "name": f"{brand} {fake.word()}",
            "image": fake.image_url(),
            "date_added": fake.date(),
            "brand": brand,
            "igpu": igpu,
            "socket": random.choice(["AM4", "AM5", "LGA1151", "LGA1700"]),
            "tdp": random.randint(35, 125),
            "cores": random.randint(2, 16),
            "speed": random.randint(2000, 4000),
            "turbo": random.randint(3000, 5000)
        }
    )
    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(cpu),
                    object_id = cpu.uid,
                    part_type = "cpu"
                )
    cpu.save()
    registry.save()

def genIgpus():
    brand = random.choice(["Intel", "AMD"])
    if brand == "AMD":
        speed = random.randint(300, 2200)
        turbo = 2400
    else:
        speed = random.randint(300, 1500)
        turbo = 1650

    igpu = Igpu(
        **{
            "name": f"{fake.word()}",
            "brand": brand,
            "memory": random.randint(1, 2),
            "speed": speed,
            "turbo": turbo
        }
    )

    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(igpu),
                    object_id = igpu.uid,
                    part_type = "igpu"
                )
    
    igpu.save()
    registry.save()

def get_random_gpu_chipset():
    nvidia_chipsets = [
        "GTX 1050", "GTX 1050 Ti", "GTX 1060", "GTX 1070", "GTX 1070 Ti",
        "GTX 1080", "GTX 1080 Ti", "GTX 1650", "GTX 1660", "GTX 1660 Super",
        "GTX 1660 Ti", "RTX 2060", "RTX 2060 Super", "RTX 2070", "RTX 2070 Super",
        "RTX 2080", "RTX 2080 Super", "RTX 2080 Ti", "RTX 3050", "RTX 3060",
        "RTX 3060 Ti", "RTX 3070", "RTX 3070 Ti", "RTX 3080", "RTX 3080 Ti",
        "RTX 3090", "RTX 3090 Ti", "RTX 4060", "RTX 4060 Ti", "RTX 4070",
        "RTX 4070 Ti", "RTX 4080", "RTX 4090"
    ]

    amd_chipsets = [
        "RX 550", "RX 560", "RX 570", "RX 580", "RX 590", "RX 6400", "RX 6500 XT",
        "RX 6600", "RX 6600 XT", "RX 6650 XT", "RX 6700", "RX 6700 XT", "RX 6750 XT",
        "RX 6800", "RX 6800 XT", "RX 6900 XT", "RX 7600", "RX 7700 XT",
        "RX 7800 XT", "RX 7900 GRE", "RX 7900 XT", "RX 7900 XTX"
    ]

    all_chipsets = nvidia_chipsets + amd_chipsets
    return random.choice(all_chipsets)

def genGpus():
    chipset = get_random_gpu_chipset()

    gpu = Gpu(
        **{
            "name": f"{fake.company()} {chipset}",
            "image": fake.image_url(),
            "brand": random.choice(["NVIDIA", "AMD"]),
            "chipset": chipset,
            "tdp": random.randint(75, 350),
            "memory": random.randint(4, 24),
            "speed": random.randint(1000, 2000),
            "turbo": random.randint(1500, 2500)
        }
    )

    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(gpu),
                    object_id = gpu.uid,
                    part_type = "gpu"
                )
    
    gpu.save()
    registry.save()

def genPsus():
    psu = Psu(
        **{
            "name": f"{fake.company()} {fake.word()}",
            "image": fake.image_url(),
            "brand": fake.company(),
            "type": random.choice(["ATX", "SFX"]),
            "wattage": random.randint(400, 1000),
            "efficiency": random.choice(["80+ Bronze", "80+ Gold", "80+ Platinum", "80+ Titanium"]),
            "modular": random.choice([None, "Semi", "Full"])
        }
    )

    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(psu),
                    object_id = psu.uid,
                    part_type = "psu"
                )

    psu.save()
    registry.save()

def genRam():
    ram = Ram(
        **{
            "name": f"{fake.company()} {fake.word()}",
            "image": fake.image_url(),
            "brand": fake.company(),
            "memory_type": random.choice(["DDR4", "DDR5"]),
            "memory_size": random.choice([8, 16, 32, 64, 128]),
            "memory_modules": random.choice([1, 2, 4]),
            "memory_speed": random.randint(2400, 6000)
        }
    )

    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(ram),
                    object_id = ram.uid,
                    part_type = "ram"
                )

    ram.save()
    registry.save()


def genMobo():
    mobo = Mobo(
        **{
            "name": f"{fake.company()} {fake.word()}",
            "image": fake.image_url(),
            "brand": random.choice(["ASUS", "Gigabyte", "MSI", "ASRock", "Biostar"]),
            "socket": random.choice(["AM4", "AM5", "LGA1151", "LGA1700"]),
            "form_factor": random.choice(["ATX", "Micro ATX", "Mini ITX"]),
            "memory_max": random.choice([64, 128, 256, 512]),
            "memory_type": random.choice(["DDR4", "DDR5"]),
            "memory_slots": random.choice([2, 4, 8]),
            "chipset": random.choice(["B450", "B550", "Z590", "Z690", "X570"]),
            "m2_nvme": random.randint(0,2),
            "m2_sata": random.randint(0,2)
        }
    )

    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(mobo),
                    object_id = mobo.uid,
                    part_type = "mobo"
                )
    
    mobo.save()
    registry.save()

def genStorage():

    type = random.choice(["HDD","SSD", "M.2"])
    if type == "HDD":
        form_factor = random.choice(["2.5", "3.5"])
        interface = "SATA"

    elif type == "SSD":
        form_factor = "2.5"
        interface = random.choice(["SATA", "PCIe"])
    
    else:
        form_factor = "M.2"
        interface = random.choice(["SATA", "NVMe"])

    storage = Storage(
        **{
            "name": f"{fake.company()} {fake.word()}",
            "image": fake.image_url(),
            "brand": fake.company(),
            "type": type,
            "capacity": random.choice([256, 512, 1024, 2048]),
            "form_factor": form_factor,
            "interface": interface
        }
    )

    registry = PartRegistry(
                    content_type = ContentType.objects.get_for_model(storage),
                    object_id = storage.uid,
                    part_type = "storage"
                )
    
    storage.save()
    registry.save()

def estimate_base_price(part):
    """Estimate price based on part power."""
    model = part.__class__.__name__

    if model == "Cpu":
        # Example: 6 cores, 3600 MHz base, 4500 MHz turbo
        # Convert MHz to GHz by dividing by 1000
        base_ghz = part.speed / 1000
        turbo_ghz = part.turbo / 1000
        return 200 + part.cores * 80 + base_ghz * 300 + turbo_ghz * 150

    elif model == "Gpu":
        # VRAM (e.g., 8GB), speed (MHz), TDP (watts)
        core_ghz = part.speed / 1000
        return 500 + part.memory * 120 + core_ghz * 200 + part.tdp * 2

    elif model == "Ram":
        # Memory size in GB, speed in MHz
        return (part.memory_size / 8) * 130 + (part.memory_speed / 1000) * 50

    elif model == "Storage":
        # HDD or SSD
        if part.type == "HDD":
            return part.capacity * 0.25  # ~R$250 for 1TB HDD
        else:
            return part.capacity * 0.55  # ~R$550 for 1TB SSD

    elif model == "Psu":
        # wattage in W
        return 150 + part.wattage * 1.0  # 600W ~R$750

    elif model == "Mobo":
        # memory_max in GB, slots as a proxy for expandability
        return 400 + part.memory_max * 0.4 + part.memory_slots * 50

    else:
        return 150


def genPrice(part):
    """Create and save a Prices instance for a part."""
    store = random.choice(list(Stores.objects.all()))
    content_type = ContentType.objects.get_for_model(part)
    base_price = estimate_base_price(part)
    
    sale = random.choice([True, False])
    price = round(base_price + random.uniform(-20, 80), 2)
    old_price = None
    sale_percent = None

    if sale:
        old_price = round(price + random.uniform(10, 50), 2)
        sale_percent = int(((old_price - price) / old_price) * 100)
        days = random.randint(1,7)
        sale_end = timezone.now() + timedelta(days=days)

    Prices.objects.create(
        store=store,
        url_product=fake.url(),
        sale=sale,
        price=price,
        old_price=old_price,
        sale_percent=sale_percent,
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

def genAll(data):
    qty = data.qty
    try:
        for _ in range(qty[0]):
            genUsers()
    except Exception as e:
        raise HttpError(400,str(e))
    
    try:    
        for _ in range(qty[1]):
            genStores()
    except Exception as e:
        raise HttpError(400,str(e))
    
    try:
        for _ in range(qty[2]):
            genIgpus()
    except Exception as e:
        raise HttpError(400,str(e))
    
    try: 
        for _ in range(qty[3]):
            genCpus()
    except Exception as e:
        raise HttpError(400,str(e))
        
    try:
        for _ in range(qty[4]):
            genGpus()
    except Exception as e:
        raise HttpError(400,str(e))    
        
    try:    
        for _ in range(qty[5]):
            genPsus()
    except Exception as e:
        raise HttpError(400,str(e))
    
    try:
        for _ in range(qty[6]):
            genMobo()
    except Exception as e:
        raise HttpError(400,str(e))    

    try:
        for _ in range(qty[7]):
            genRam()
    except Exception as e:
        raise HttpError(400,str(e))    

    try:
        for _ in range(qty[8]):
            genStorage()
    except Exception as e:
        raise HttpError(400,str(e))

    return JsonResponse({
        "message": "Produtos Gerados com sucesso!"
    }, status=201)

    