from ninja import NinjaAPI, Query
from ninja.errors import HttpError
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.routers.obtain import obtain_pair_router

from db import product, views
from db.algoritmo import run_ga
from db.datagen import genAll, genAllPrices
from SmartRig import schema

api = NinjaAPI()
api.add_router("/token", tags=["Auth"], router=obtain_pair_router)
auth = JWTAuth()

# User


@api.post("/users/register")
def post_registrar(request, data: schema.registrarSchema):
    return views.registrar(data)


@api.post("/users/login")
def post_login(request, data: schema.loginSchema):
    """
    {"email": str, "password": str}
    """
    return views.login(data)


@api.put("/users/update", auth=auth)
def updateUser(request, data: schema.update):
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Faça login")
    return views.updateUser(data, user)


@api.post("/users/delete", auth=auth)
def deleteUser(request, data: schema.updatePassword):
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Faça login")
    return views.deleteUser(data, user)


@api.post("/users/favorite/{object_id}", auth=auth)
def favorite(request, object_id: str):
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Faça login")
    return views.addFavoritos(object_id, user)


@api.delete("/users/favorite/{object_id}", auth=auth)
def favorite(request, object_id: str):
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Faça login")
    return views.deleteFavoritos(object_id, user)


# Produtos


@api.post("/products/add", auth=auth)
def addProd(request, data: schema.addProd):
    user = request.user
    if not user.is_staff:
        raise HttpError(403, "Acesso Negado")
    return product.add(data)


@api.post("/products/gen")
def genProd(request, data: schema.genProd):
    """
    {"qty: [Users,Stores,Igpus,Cpus,Gpus,Psus,Mobos,Ram,Storage]}
    """
    return genAll(data)


@api.post("/products/genPrices")
def genProd(request):
    return genAllPrices()


@api.get("/products/{product_id}")
def getProd(request, product_id: str):
    """
exemplo retorno:
    {
    "message": "Produto encontrado",
    "data": {
        "name": "AMD stand",
        "image": "https://dummyimage.com/92x639",
        "brand": "AMD",
        "igpu": "b1b90e1c-329f-4ecf-b0c1-d4abfd31d3b2",
        "socket": "LGA1151",
        "tdp": 86,
        "cores": 14,
        "speed": 3814,
        "turbo": 4467,
        "prices": [
            {
                "uid": "8e5d0e4f-4e2b-48f9-8188-55316d67db41",
                "store_id": "cfccb196-3804-4b5d-9f57-3a25b6087532",
                "url_product": "https://www.rhodes.com/",
                "sale": true,
                "price": 15095.96,
                "old_price": 15145.71,
                "sale_percent": 0,
                "sale_end": null,
                "colected_date": "2025-05-15T18:31:07.368Z",
                "content_type_id": 6,
                "object_id": "96c41940-8872-4500-9cde-c42e8db142ed"
            }
        ]
    }
}
"""
    return product.get(product_id)


@api.get("/prices/{product_id}")
def getProd(request, product_id: str):
    return product.getProductPrices(product_id)

@api.delete("/products/{product_id}", auth=auth)
def delProd(request, product_id: str):
    user = request.user
    if not user.is_staff:
        raise HttpError(403, "Acesso Negado")
    return product.delete(product_id)


@api.get("/products/{type}/")
def getProdFilter(
    request,
    type: str,
    filters: schema.GenericFilterSchema = Query(...),
    filter_prices: schema.priceFilter = Query(...),
):
    """
📘 Filtros disponíveis por tipo de hardware:

    Você pode adicionar filtros à rota usando parâmetros na URL, no formato `?campo=valor`.

    exemplo de retorno:
        "message": "produtos retornados com sucesso",
        "data": [
         {
            "name": "Intel apply",
            "image": "https://picsum.photos/106/961",
            "brand": "Intel",
            "igpu": null,
            "socket": "LGA1700",
            "tdp": 35,
            "cores": 5,
            "speed": 2561,
            "turbo": 3506,
            "prices": [
                {
                    "store": "Murphy-Reynolds",
                    "url": "http://www.walker.com/",
                    "price": 11034.36,
                    "old_price": 11066.58,
                    "sale": true,
                    "sale_percent": 0,
                    "sale_end": null,
                    "collected": "2025-05-15T18:31:07.118Z"
                }
            ]
        },
        {
            "name": "AMD level",
            "image": "https://picsum.photos/998/204",
            "brand": "AMD",
            "igpu": null,
            "socket": "AM4",
            "tdp": 60,
            "cores": 3,
            "speed": 3864,
            "turbo": 4531,
            "prices": [
                {
                    "store": "Rodriguez Group",
                    "url": "http://www.brown-lewis.com/",
                    "price": 14985.67,
                    "old_price": 15033.38,
                    "sale": true,
                    "sale_percent": 0,
                    "sale_end": null,
                    "collected": "2025-05-15T18:31:07.212Z"
                }
            ]
        },
        ]

    📌 Formato:
    /products/{type}/?campo1=valor1&campo2=valor2

   Preço
   - store: nome da loja
   - sale: true ou false
   - price_range:  /products/{type}/?price_range=valor1&price_range=valor2

🔧 CPU (/products/cpu/)
    - brand: "Intel", "AMD"
    - cores: 4, 6, 8, ...
    - socket: "AM4", "LGA1200", ...
    - tdp: 65, 95, 125, ...
    - speed: em MHz (ex: 3200)
    - turbo: em MHz (ex: 4500)

🎮 GPU (/products/gpu/)
    - brand: "NVIDIA", "AMD"
    - chipset: "RTX 3060", "RX 6700", ...
    - memory: em GB (ex: 8, 12)
    - tdp, speed, turbo: inteiros (MHz ou Watts)

🔌 PSU (/products/psu)
    - brand: "Corsair", "EVGA", ...
    - type: "ATX", "SFX"
    - wattage: 500, 650, 750, ...
    - efficiency: "80+ Bronze", "Gold", ...
    - modular: "Full", "Semi", "False"

🧠 RAM (/products/ram)
    - brand: "Corsair", "Kingston", ...
    - memory_type: "DDR4", "DDR5"
    - memory_size: 8, 16, 32 ...
    - memory_modules: 1, 2, 4 ...
    - memory_speed: em MHz (ex: 3200)

💾 Storage (/products/storage)
    - brand: "Samsung", "WD", ...
    - type: "SSD", "HDD", "M.2"
    - capacity: em GB (ex: 500, 1000, 2000)
    - form_factor: "2.5", "M.2", "3.5"
    - interface: "SATA", "NVMe", "PCIe"

🧩 Mobo (/products/mobo)
    - brand: "ASUS", "Gigabyte", ...
    - socket: "AM4", "LGA1700", ...
    - form_factor: "ATX", "Micro-ATX", ...
    - memory_type: "DDR4", "DDR5"
    - memory_max: 32, 64, 128, 256, 512
    - memory_slots: 2, 4, 8
    - chipset: "B550", "Z690", ...
    - m2_nvme / m2_sata: 0, 1, 2, ...

❗ Todos os filtros são opcionais e passados como query string. Exemplo:
    /query/db/cpu?brand=Intel&cores=6
"""

    return product.getFiltered(request, type, filters, filter_prices)




@api.get("/products/")
def getProdFilter(request):
    """
Retorno igual ao com filtro
"""
    return product.getAll()




# Loja


@api.get("/stores/{uid}")
def getStore(request, uid: str):
    return product.getStore(uid)


@api.get("/stores/")
def getAllStores(request):
    return product.getStore(None)

# Builds

@api.post("/builds/gen", auth=auth)
def genBuild(request, data: schema.genBuild):
    """
    {"cpu": str, "gpu": str, "mobo": str, "psu": str, "budget": float, "storage": int}
    """
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Só usuários registrados podem gerar builds!")
    return run_ga(data)


@api.post("/builds/save", auth=auth)
def favorite(request, data: schema.build):
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Faça login")
    return views.saveBuild(data, user)

@api.delete("/builds/delete/{object_id}", auth=auth)
def favorite(request, object_id: str):
    user = request.user
    if user.is_anonymous or not user:
        raise HttpError(401, "Faça login")
    return views.saveBuild(object_id, user)

