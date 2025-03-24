from datetime import datetime
from hashlib import sha256
import json
from django.http import HttpRequest as request
from django.http import HttpResponse, HttpResponseBadRequest 
from django.shortcuts import render
from dotenv import load_dotenv
import os
from db.models import Users


from db.models import Users


def registrar(data):
    user = Users(nome=data.nome, senha=None, email=None, data_criacao=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    if not Users.objects.filter(email = data.email).exists():
        user.email = data.email
    else:
        return HttpResponseBadRequest(json.dumps({ 
            "message" : "Email já em uso",
            "status" : 400
        }))
    
    if data.senha == data.senha_conf:
        user.senha = sha256(data.senha.encode()).hexdigest()
    else:
        return HttpResponseBadRequest(json.dumps({ 
            "message" : "As senhas não conhecidem",
            "status" : 400
        }))
    user.save()

    return HttpResponse(json.dumps({
        "message" : "Usuário criado com sucesso",
         "status" : 201
    }))
