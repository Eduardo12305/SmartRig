from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.contenttypes.models import ContentType
from django.forms import model_to_dict
from django.http import JsonResponse
from ninja.errors import HttpError
from ninja_jwt.tokens import RefreshToken

from db.product import get as getProduct
from db.models import Builds, Cpu, Gpu, Ram, Mobo, Psu, Storage, Favorites, PartRegistry, Users


def registrar(data):
    # Verificar se o email já está em uso
    if Users.objects.filter(email=data.email).exists():
        raise HttpError(400, "Usuário já cadastrado")

    # Verificar se as senhas coincidem
    if data.password != data.confPassword:
        raise HttpError(400, "Senhas não conferem")

    password_hash = make_password(data.password)


    # Salvar o usuário no banco de dados
    user = Users(name=data.name, password=password_hash, email=data.email)
    try:
        user.save()
    except Exception as e:
        raise HttpError(500, f"Erro ao salvar usuário: {str(e)}")
    return JsonResponse(
        {
            "message": "Usuario cadastrado com sucesso",
            "data": {
                "id": user.id,
                "nome": user.name,
                "email": user.email,
                "data_criacao": user.creation_date,
            },
        },
        status=201,
    )
def login(data):
    # Tentar acessar os dados
    user = authenticate(email=data.email, password=data.password)

    if not user:
        raise HttpError(400, "Email ou senha inválidos")

    token = RefreshToken.for_user(user)

    return {
        "access": str(token.access_token),
        "refresh": str(token),
        "message": "Login com sucesso",
    }


def updateUser(data, user):

    if data.newPassword == None and data.name == None and data.email == None:
        raise HttpError(400, "Nenhum valor para atualizar")

    if not check_password(data.password, user.password):
        raise HttpError(400, "Senha Inválida")

    if data.name != None:
        user.name = data.name

    if data.newPassword != None:
        if data.newPassword.password == data.newPassword.confPassword:
            user.password = make_password(data.newPassword.password)
        else:
            raise HttpError(400, "As senhas não coincidem")

    if data.email != None:
        if Users.objects.filter(email=data.email).exists():
            raise HttpError(400, "E-mail em uso")
        else:
            user.email = data.email

    user.save()
    token = RefreshToken.for_user(user)

    return {
        "message": "Usuário atualizado com sucesso!",
        "token": str(token.access_token),
        "refresh": str(token),
    }


def deleteUser(data, user):

    if data.password != data.confPassword:
        raise HttpError(400, "Senhas não conhecidem")
    elif not check_password(data.password, user.password):
        raise HttpError(400, "Senha está errada")

    try:
        user.delete()
    except:
        return HttpError(500, "Erro ao tentar deletar o usuário")

    return {"message": "Usuário deletado com sucesso"}


def addFavoritos(uid, user):
    try:
        part = PartRegistry.objects.get(object_id=uid).part
        content_type = ContentType.objects.get_for_model(part.__class__)
    except:
        raise HttpError(404, "Produto não encontrado")
    favArgs = {"user": user, "content_type": content_type, "object_id": uid}

    try:
        Favorites.objects.create(**favArgs)
    except Exception as e:
        raise HttpError(500, f"Erro ao adicionar aos favoritos: {str(e)}")
    return {"message": "Adicionado aos favoritos com successo"}

def getFavoritos(user):
    try:
        favorites = Favorites.objects.filter(user=user)
    except:
        raise HttpError(404, "Nenhum favorito encontrado")

    if not favorites:
        return {"message": "Nenhum favorito encontrado"}

    data = []
    for favorite in favorites:
        data.append(getProduct(favorite.object_id))

    return {
        "message": "Favoritos encontrados",
        "data": data
    }

def deleteFavoritos(uid, user):
    try:
        favorite = Favorites.objects.get(object_id=uid, user=user)
    except:
        raise HttpError(404, "Produto não encontrado")

    favorite.delete()
    return {"message": "Favorito removido com successo"}


def saveBuild(data, user):
    try:
        Builds.objects.create(
            user=user,
            cpu= Cpu.objects.get(pk=data.cpu) if data.cpu else None,
            gpu= Gpu.objects.get(pk=data.gpu) if data.gpu else None,
            psu= Psu.objects.get(pk=data.psu) if data.psu else None,
            mobo= Mobo.objects.get(pk=data.mobo) if data.mobo else None,
            ram= Ram.objects.get(pk=data.ram) if data.ram else None,
            storage= Storage.objects.get(pk=data.storage) if data.storage else None,
            name=data.name)
        return {
            "message": "Build salva com sucesso",
        }
    except ValueError as e:
        raise HttpError(400, f"Valor invalido, {e}")
    except Exception as e:
        raise HttpError(500, f"Erro ao tentar salvar a build: {e}")

def deleteBuild(uid, user):
    if uid:
        try:
            build = Builds.objects.get(pk=uid, user=user)
        except:
            raise HttpError(404, "Build não encontrada")
        build.delete()    
        return {
            "message": "Build deletada com succeso"
        }
    else:
        raise HttpError(400, "Informe o id da build")
    
def getAllBuilds(user):

    try:
        builds = Builds.objects.filter(user=user).values("uid", "name", "created")
    except:
        raise HttpError(404, "Nenhum favorito encontrado")

    data = []
    for build in builds:
        data.append(build)
    return {
        "message": "Builds encontradas",
        "data": data
    }

def getBuild(uid, user):
    try:
        build = Builds.objects.get(pk=uid)
    except:
        raise HttpError(404, "Nenhuma build encontrado")
    
    if build.user != user:
        raise HttpError(403, "Você não tem permissão para acessar esta build")
    
    build_dict = model_to_dict(build)
    build_dict["uid"] = str(build.uid)

    build_dict["cpu"] = getProduct(build.cpu.uid)["data"] if build.cpu else None
   
    build_dict["gpu"] = getProduct(build.gpu.uid)["data"] if build.gpu else getProduct(build.cpu.igpu.uid)["data"] if build.cpu.igpu else None
 
    build_dict["mobo"] = getProduct(build.mobo.uid)["data"] if build.mobo else None
   
    build_dict["psu"] = getProduct(build.psu.uid)["data"] if build.psu else None
 
    build_dict["ram"] = getProduct(build.ram.uid)["data"] if build.ram else None

    build_dict["storage"] = getProduct(build.storage.uid)["data"] if build.storage else None

    return {
        "message": "Build encontrada",
        "data": build_dict
    }
