from django.db import models

class Users(models.Model):
    nome = models.CharField(max_length=100)
    senha = models.CharField(max_length=64)
    email = models.EmailField()
    data_criacao = models.DateTimeField()

class Tipo(models.IntegerChoices):
    PSU = 0, "Fonte"
    MOBO = 1, "Placa-mãe"
    CPU = 2, "Processador"
    RAM = 3, "Memória RAM"
    GPU = 4, "Placa De Vídeo"
    UNK = 5, "Desconhecido"

class Produtos(models.Model):
    categoria = models.IntegerField(choices=Tipo, default=  5)
    nome = models.CharField()
    marca = models.CharField()
    modelo = models.CharField()
    especificacoes = models.JSONField()
    imagem = models.CharField()
    data_adicionado = models.DateField()

class Builds(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    psu = models.ForeignKey(Produtos, related_name = "build_psu", limit_choices_to={"categoria": Tipo.PSU}, on_delete= models.CASCADE)
    mobo = models.ForeignKey(Produtos, related_name = "build_mobo", limit_choices_to={"categoria": Tipo.MOBO}, on_delete= models.CASCADE)
    cpu = models.ForeignKey(Produtos, related_name = "build_cpu", limit_choices_to={"categoria": Tipo.CPU}, on_delete= models.CASCADE)
    ram = models.ForeignKey(Produtos, related_name = "build_ram", limit_choices_to={"categoria": Tipo.RAM}, on_delete= models.CASCADE)
    gpu = models.ForeignKey(Produtos, related_name = "build_gpu", limit_choices_to={"categoria": Tipo.GPU}, null=True, on_delete= models.SET_NULL)


class Lojas(models.Model):
    nome = models.CharField()
    url = models.URLField()


class Precos(models.Model):
    produto = models.ForeignKey(Produtos, on_delete=models.CASCADE)
    loja = models.ForeignKey(Lojas, on_delete=models.CASCADE)
    url_produto = models.URLField()
    preco = models.FloatField()
    data_coleta = models.DateField()

class Favoritos(models.Model):
    users = models.ForeignKey(Users, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produtos, on_delete=models.CASCADE)
