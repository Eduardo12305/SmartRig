from django.db import models

class User(models.Model):
    nome = models.CharField(max_length=100)
    senha = models.CharField(max_length=64)
    email = models.CharField(max_length=320)

class Produto(models.Model):
    nome = models.CharField(max_length=100)

class Hist_Preco(models.Model):
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    loja = models.CharField(max_length=32)
    preco = models.FloatField()
    data = models.DateField()

class Favoritos(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
