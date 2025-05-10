from django.db import models

class Users(models.Model):
    name = models.CharField(max_length=100)
    password = models.TextField()
    email = models.EmailField()
    creation_date = models.DateTimeField()

class Type(models.IntegerChoices):
        PSU = 0, "Fonte"
        MOBO = 1, "Placa-mãe"
        CPU = 2, "Processador"
        RAM = 3, "Memória RAM"
        GPU = 4, "Placa De Vídeo"
        UNK = 5, "Desconhecido"

class Products(models.Model):

    type = models.IntegerField(choices=Type, default=  5)
    name = models.CharField()
    specifications = models.JSONField()
    image = models.CharField()
    date_added = models.DateField()

class Builds(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    psu = models.ForeignKey(Products, related_name = "build_psu", limit_choices_to={"categoria": Type.PSU}, on_delete= models.CASCADE)
    mobo = models.ForeignKey(Products, related_name = "build_mobo", limit_choices_to={"categoria": Type.MOBO}, on_delete= models.CASCADE)
    cpu = models.ForeignKey(Products, related_name = "build_cpu", limit_choices_to={"categoria": Type.CPU}, on_delete= models.CASCADE)
    ram = models.ForeignKey(Products, related_name = "build_ram", limit_choices_to={"categoria": Type.RAM}, on_delete= models.CASCADE)
    gpu = models.ForeignKey(Products, related_name = "build_gpu", limit_choices_to={"categoria": Type.GPU}, null=True, on_delete= models.SET_NULL)


class Stores(models.Model):
    name = models.CharField()
    url = models.URLField()


class Prices(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    store = models.ForeignKey(Stores, on_delete=models.CASCADE)
    url_product = models.URLField()
    price = models.FloatField()
    colected_date = models.DateField()

class Favorites(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
