from django.db import models

class Users(models.Model):
    name = models.CharField(max_length=100)
    password = models.TextField()
    email = models.EmailField()
    creation_date = models.DateTimeField()

class Tipo(models.IntegerChoices):
    PSU = 0, "Fonte"
    MOBO = 1, "Placa-mãe"
    CPU = 2, "Processador"
    RAM = 3, "Memória RAM"
    GPU = 4, "Placa De Vídeo"
    UNK = 5, "Desconhecido"

class Produtos(models.Model):
    category = models.IntegerField(choices=Tipo, default=  5)
    name = models.CharField()
    specifications = models.JSONField()
    image = models.CharField()
    date_added = models.DateField()

class Builds(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    psu = models.ForeignKey(Produtos, related_name = "build_psu", limit_choices_to={"categoria": Tipo.PSU}, on_delete= models.CASCADE)
    mobo = models.ForeignKey(Produtos, related_name = "build_mobo", limit_choices_to={"categoria": Tipo.MOBO}, on_delete= models.CASCADE)
    cpu = models.ForeignKey(Produtos, related_name = "build_cpu", limit_choices_to={"categoria": Tipo.CPU}, on_delete= models.CASCADE)
    ram = models.ForeignKey(Produtos, related_name = "build_ram", limit_choices_to={"categoria": Tipo.RAM}, on_delete= models.CASCADE)
    gpu = models.ForeignKey(Produtos, related_name = "build_gpu", limit_choices_to={"categoria": Tipo.GPU}, null=True, on_delete= models.SET_NULL)


class Lojas(models.Model):
    name = models.CharField()
    url = models.URLField()


class Precos(models.Model):
    product = models.ForeignKey(Produtos, on_delete=models.CASCADE)
    loja = models.ForeignKey(Lojas, on_delete=models.CASCADE)
    url_product = models.URLField()
    price = models.FloatField()
    colected_date = models.DateField()

class Favoritos(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produtos, on_delete=models.CASCADE)
