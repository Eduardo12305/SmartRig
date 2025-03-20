from SmartRig.schema import registrarSchema
from ninja import NinjaAPI
from ninja_jwt.routers.blacklist import blacklist_router
from ninja_jwt.routers.obtain import obtain_pair_router, sliding_router
from ninja_jwt.routers.verify import verify_router
from db import views

api = NinjaAPI()
api.add_router('/token', tags=['Auth'], router=obtain_pair_router)

@api.post("/registrar")
def post_registrar(request, data: registrarSchema):
    return views.registrar(data)