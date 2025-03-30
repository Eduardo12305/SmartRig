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
        nome = data.name,
        senha = password_hash,
        email = data.email,
        data_criacao = timezone.now()
    )

    user.save()

    return JsonResponse({
        "message": "Usuario cadastrado com sucesso",
        "status": 201,
        "data" : {
            "id": user.id,
            "nome": user.nome,
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
    stored_password = user.senha  # Certifique-se de usar o campo correto

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
        "name": user.nome,    # Usar nome do usuário
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Retornar a resposta com o token
    return JsonResponse({
        "message": "Login bem-sucedido",
        "status": 200,
        "token": token
    }, content_type="application/json")

