from datetime import datetime
from hashlib import sha256
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render
from dotenv import load_dotenv
import os
import jwt
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from db.models import Users

def registrar(data):
    
        # Verificar se o email já está em uso
    if Users.objects.filter(email=data.email).exists():
       return HttpResponseBadRequest(json.dumps({
           "message": "Usuario ja cadastrado",
           "status": 400
       }))
    
    # Verificar se as senhas coincidem
    if data.password != data.confPassword:
        return HttpResponseBadRequest(json.dumps({
            "message": "Senhas não conferem",
            "status": 400,
        }))
    
    password_hash = make_password(data.password) 

    # Salvar o usuário no banco de dados
    user = Users(
        name = data.name,
        password = password_hash,
        email = data.email,
        creation_date = timezone.now()
    )

    try:
        user.save()
    except:
        return HttpResponseBadRequest(json.dumps({
            "message": "Erro ao salvar o usuário",
            "status": 500
        }))

    return JsonResponse({
        "message": "Usuario cadastrado com sucesso",
        "status": 201,
        "data" : {
            "id": user.id,
            "nome": user.name,
            "email": user.email,
            "data_criacao": user.data_criacao,
        }
    })

def login(data):
    # Tentar acessar os dados
    try:
        email = data.email  # Acesso direto ao atributo "email"
        password = data.password  # Acesso direto ao atributo "password"
    except AttributeError:
        return HttpResponseBadRequest(json.dumps({
            "message": "Email e Senha são obrigatórios",
            "status": 400
        }))

    if not email or not password:
        return HttpResponseBadRequest(json.dumps({
            "message": "Email e Senha são obrigatórios",
            "status": 400
        }))
    
    # Buscar o usuário no banco de dados
    user = Users.objects.filter(email=email).first()

    if not user:
        return HttpResponseBadRequest(json.dumps({
            "message": "Verifique E-mail e Senha",
            "status": 404
        }))
    
    # Comparar a senha fornecida com a senha armazenada
    stored_password = user.password  # Certifique-se de usar o campo correto

    if not check_password(password,stored_password):
        return JsonResponse({
            "message": "E-mail ou Senha incorretos",
            "status": 400
        }, status=400)
    # Criar o token JWT
    load_dotenv()  # Carregar variáveis de ambiente
    secret_key = os.getenv('SECRET_KEY')  # Obter chave secreta do .env

    payload = {
        "email": user.email,  # Usar email do usuário
        "name": user.name,    # Usar nome do usuário
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Retornar a resposta com o token
    return JsonResponse({
        "message": "Login bem-sucedido",
        "status": 200,
        "token": token
    }, content_type="application/json")

def updateUser(data):

    load_dotenv()
    secret_key = os.getenv("SECRET_KEY")
    try:
        token = jwt.decode(data.token, secret_key, algorithms="HS256", do_time_check = True)
    except:
        return HttpResponseBadRequest(json.dumps({
            "message": "token invalido"
        }))
    
    newToken = "Email e/ou nome não foram atualizados"
    user = Users.objects.filter(email=token["email"]).first()

    if not check_password(data.password, user.password):
        return HttpResponseBadRequest(json.dumps({
            "message": "Senha Invalida!",
            "status": 400
        }))
    
    if data.name != None:
        user.nome = data.name
        payload = {
        "email": user.email,  
        "name": user.name,   
        }
        newToken = jwt.encode(payload, secret_key, algorithm="HS256")
        

    if data.newPassword != None:
        if data.newPassword.password == data.newPassword.confPassword:
            user.password = make_password(data.newPassword.password)
        else:
            return HttpResponseBadRequest(json.dumps({
                "message": "As senhas não coincidem",
                "status": 400
            }))
        
    if data.email != None:
        user.email = data.email
        payload = {
        "email": user.email,  
        "name": user.name,   
        }
        newToken = jwt.encode(payload, secret_key, algorithm="HS256")
    
    try:
        user.save()
    except:
        return HttpResponseBadRequest(json.dumps({
            "message": "Erro ao salvar o usuário",
            "status": 500
        }))

    return JsonResponse({
        "message" : "Usuário atualizado com sucesso!",
        "token": newToken,
        "status": 200
    })

def deleteUser(data):
     
    load_dotenv()
    secret_key = os.getenv("SECRET_KEY")
    try:
        token = jwt.decode(data.token, secret_key, algorithms="HS256", do_time_check = True)
    except:
        return HttpResponseBadRequest(json.dumps({
            "message": "token invalido"
        }))
    
    user = Users.objects.filter(email=token["email"]).first()

    if not check_password(data.password, user.password):
        return HttpResponseBadRequest(json.dumps({
            "message": "Senha Invalida!",
            "status": 400
        }))
    
    try:
        user.delete()
    except:
        return HttpResponseBadRequest(json.dumps({
            "message": "Erro ao deletar o usuário",
            "status": 500
        }))
    
    return JsonResponse({
        "message": "Usuário deletado com sucesso",
        "status": 200
    })