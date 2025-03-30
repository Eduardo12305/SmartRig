from datetime import datetime
from hashlib import sha256
import json
from django.http import HttpResponse, HttpResponseBadRequest
from django.shortcuts import render
from dotenv import load_dotenv
import os
import jwt
from db.models import Users

def registrar(data):
    user = Users(nome=data.nome, senha=None, email=None, data_criacao=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    # Verificar se o email já está em uso
    if not Users.objects.filter(email=data.email).exists():
        user.email = data.email
    else:
        return HttpResponseBadRequest(json.dumps({
            "message": "Email já em uso",
            "status": 400
        }))
    
    # Verificar se as senhas coincidem
    if data.senha == data.senha_conf:
        user.senha = sha256(data.senha.encode()).hexdigest()
    else:
        return HttpResponseBadRequest(json.dumps({
            "message": "As senhas não coincidem",
            "status": 400
        }))
    
    # Salvar o usuário no banco de dados
    user.save()

    return HttpResponse(json.dumps({
        "message": "Usuário criado com sucesso",
        "status": 201,
    }))

def login(request):
    # Tentar fazer o parse do JSON
    try:
        req = json.loads(request.body)
        email = req.get('email')
        password = req.get('password')
    except json.JSONDecodeError:
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

    if sha256(password.encode()).hexdigest() != stored_password:
        return HttpResponseBadRequest(json.dumps({
            "message": "E-mail ou Senha incorretos",
            "status": 400
        }))
    
    # Criar o token JWT
    load_dotenv()  # Carregar variáveis de ambiente
    secret_key = os.getenv('SECRET_KEY')  # Obter chave secreta do .env

    payload = {
        "email": user.email,  # Usar email do usuário
        "name": user.nome,    # Usar nome do usuário
    }
    token = jwt.encode(payload, secret_key, algorithm="HS256")

    # Retornar a resposta com o token
    return HttpResponse(json.dumps({
        "message": "Login bem-sucedido",
        "status": 200,
        "token": token
    }), content_type="application/json")
    # usando o token, para fins de testes
    SECRET_KEY = "sdfs54610"
    payload = {
        "email": data.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return JsonResponse({
        "message": "Usuário criado com sucesso",
        "status": 201,
        "token": token,
    })

