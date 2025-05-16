from datetime import datetime
from hashlib import sha256
import json
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render
from ninja.errors import HttpError
from dotenv import load_dotenv
import os
import jwt
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from db.models import Users

def registrar(data):
    # Verificar se o email já está em uso
    if Users.objects.filter(email=data.email).exists():
        raise HttpError(400, "Usuário já cadastrado")
    
    # Verificar se as senhas coincidem
    if data.password != data.confPassword:
        raise HttpError(400, "Senhas não conferem")
    
    password_hash = make_password(data.password) 

    # Criar e salvar o usuário
    user = Users(
        name=data.name,
        password=password_hash,
        email=data.email
    )

    try:
        user.save()
    except Exception as e:
        raise HttpError(500, f"Erro ao salvar usuário: {str(e)}")

    return JsonResponse({
        "message": "Usuário cadastrado com sucesso",
        "data": {
            "id": str(user.uid),  # Corrigido de user.id para user.uid
            "nome": user.name,
            "email": user.email,
            "data_criacao": user.creation_date,
        }
    }, status=201)

def login(data):
    # Tentar acessar os dados
    try:
        email = data.email  # Acesso direto ao atributo "email"
        password = data.password  # Acesso direto ao atributo "password"
    except AttributeError:
        raise HttpError(400, "Input Inválido")

    if not email or not password:
        raise HttpError(400, "Email e senha são obrigatorios")
    
    # Buscar o usuário no banco de dados
    user = Users.objects.filter(email=email).first()

    if not user:
        raise HttpError(400, "E-mail ou Senha incorretos")
    
    # Comparar a senha fornecida com a senha armazenada
    stored_password = user.password  # Certifique-se de usar o campo correto

    if not check_password(password,stored_password):
        raise HttpError(400, "E-mail ou Senha incorretos")
    
    # Criar o token JWT
    load_dotenv()  # Carregar variáveis de ambiente
    secret_key = os.getenv('SECRET_KEY')  # Obter chave secreta do .env

    payload = {
        "email": user.email,  # Usar email do usuário
        "name": user.name,    # Usar nome do usuário
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Retornar a resposta com o token
    return {
        "message": "Login bem-sucedido",
        "token": token
    }

def updateUser(data):

    load_dotenv()
    secret_key = os.getenv("SECRET_KEY")
    try:
        token = jwt.decode(data.token, secret_key, algorithms="HS256", do_time_check = True)
    except:
        raise HttpError(400, "Token Inválido")
    
    newToken = "Email e/ou nome não foram atualizados"
    user = Users.objects.filter(email=token["email"]).first()

    if not check_password(data.password, user.password):
        raise HttpError(400, "Senha Inválida")
    
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
            raise HttpError(400, "As senhas não coincidem")
        
    if data.email != None:
        if Users.objects.filter(email=data.email).exists():
            raise HttpError(400, "E-mail em uso")
        else:
            user.email = data.email
            payload = {
            "email": user.email,  
            "name": user.name,   
            }
        newToken = jwt.encode(payload, secret_key, algorithm="HS256")
    
    try:
        user.save()
    except:
        raise HttpError(500, "Erro ao salvar o usuário")

    return {
        "message" : "Usuário atualizado com sucesso!",
        "token": newToken,
    }

def deleteUser(data):
     
    load_dotenv()
    secret_key = os.getenv("SECRET_KEY")
    try:
        token = jwt.decode(data.token, secret_key, algorithms="HS256", do_time_check = True)
    except:
        raise HttpError(400, "Token Inválido")
    
    user = Users.objects.filter(email=token["email"]).first()

    if not check_password(data.password, user.password):
        raise HttpError(400, "Senha Inválida")
    
    try:
        user.delete()
    except:
        return HttpError(500, "Erro ao tentar deletar o usuário")
    
    return {
        "message": "Usuário deletado com sucesso"
    }