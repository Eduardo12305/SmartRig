from SmartRig import schema
from ninja import File, NinjaAPI, Query, UploadedFile
from ninja_jwt.routers.blacklist import blacklist_router
from ninja_jwt.routers.obtain import obtain_pair_router, sliding_router
from ninja_jwt.routers.verify import verify_router
from db import views
from db import product

api = NinjaAPI()
api.add_router('/token', tags=['Auth'], router=obtain_pair_router)

@api.post("/users/register")
def post_registrar(request, data: schema.registrarSchema):
    return views.registrar(data)

@api.post("/users/login")
def post_login(request, data: schema.loginSchema):
    return views.login(data)

@api.post("/users/update")
def updateUser(request, data: schema.update):
    return views.updateUser(data)

@api.post("/users/delete")
def deleteUser(request, data: schema.update):
    return views.deleteUser(data)

@api.get("/products/get/{product_id}")
def getProd(request, product_id: str):
    return product.get(product_id)

#   PSU = Fonte
#   MOBO = Placa-mãe
#   CPU = Processador
#   RAM = Memória RAM
#   GPU = Placa De Vídeo
#   STORAGE = HDD ou SSD 
@api.get("/products")
def getProdFilter(request, query: Query[schema.getProd]):
    return product.getFiltered(query)