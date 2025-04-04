from SmartRig.schema import registrarSchema, loginSchema, update
from ninja import NinjaAPI
from ninja_jwt.routers.blacklist import blacklist_router
from ninja_jwt.routers.obtain import obtain_pair_router, sliding_router
from ninja_jwt.routers.verify import verify_router
from db import views

api = NinjaAPI()
api.add_router('/token', tags=['Auth'], router=obtain_pair_router)

@api.post("/users/register")
def post_registrar(request, data: registrarSchema):
    return views.registrar(data)

@api.post("/users/login")
def post_login(request, data: loginSchema):
    return views.login(data)

@api.post("/users/update")
def updateUser(request, data: update):
    return views.updateUser(data)

@api.post("/users/delete")
def deleteUser(request, data: update):
    return views.deleteUser(data)
