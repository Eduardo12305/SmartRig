import uuid

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email deve ser informado")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # hashes the password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser precisa ter is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser precisa ter is_superuser=True.")
        return self.create_user(email, password, **extra_fields)


class Users(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=100)
    password = models.TextField()
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    email = models.EmailField(max_length=255, unique=True)
    creation_date = models.DateField(auto_now_add=True)

    USERNAME_FIELD = "email"  # Use email to login
    REQUIRED_FIELDS = ["name"]  # Required when creating user via createsuperuser

    objects = UserManager()

    @property
    def id(self):
        return self.uid

    def __str__(self):
        return self.email


class Stores(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    url = models.URLField(max_length=500)


class Prices(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(Stores, on_delete=models.CASCADE)
    url_product = models.URLField(max_length=500)
    sale = models.BooleanField()
    price = models.FloatField()
    old_price = models.FloatField(null=True, blank=True, default=None)
    sale_percent = models.IntegerField(null=True, blank=True, default=None)
    sale_end = models.DateTimeField(null=True, default=None, blank=True)
    colected_date = models.DateTimeField(auto_now_add=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    product = GenericForeignKey("content_type", "object_id")

    def clean(self):
        if self.sale:
            if self.old_price is None or self.sale_percent is None:
                raise ValidationError(
                    "Se sale for true, old_price e sale_percent não podem ser vazios!"
                )
        else:
            if self.old_price is not None or self.sale_percent is not None:
                raise ValidationError(
                    "Se sale for false, old_price e sale_percent não devem estar vazios"
                )


class PartRegistry(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    part = GenericForeignKey("content_type", "object_id")
    part_type = models.CharField(max_length=50)


class Igpu(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    memory = models.IntegerField()
    speed = models.IntegerField()
    turbo = models.IntegerField()


class Cpu(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500, blank=True)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    igpu = models.ForeignKey(Igpu, null=True, on_delete=models.CASCADE)
    socket = models.CharField(max_length=50)
    tdp = models.IntegerField()
    cores = models.IntegerField()
    speed = models.IntegerField()
    turbo = models.IntegerField()


class Gpu(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500, blank=True)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    chipset = models.CharField(max_length=100)
    tdp = models.IntegerField()
    memory = models.IntegerField()
    speed = models.IntegerField()
    turbo = models.IntegerField()


class Psu(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500, blank=True)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    type = models.CharField(max_length=100)
    wattage = models.IntegerField()
    efficiency = models.CharField(max_length=50)
    modular = models.CharField(max_length=50, null=True)


class Mobo(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500, blank=True)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    socket = models.CharField(max_length=50)
    form_factor = models.CharField(max_length=50)
    memory_max = models.IntegerField()
    memory_type = models.CharField(max_length=50)
    memory_slots = models.IntegerField()
    chipset = models.CharField(max_length=100)
    m2_nvme = models.IntegerField()
    m2_sata = models.IntegerField()


class Ram(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500, blank=True)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    memory_type = models.CharField(max_length=50)
    memory_size = models.IntegerField()
    memory_modules = models.IntegerField()
    memory_speed = models.IntegerField()


class Storage(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=500, blank=True)
    date_added = models.DateField(auto_now_add=True)
    brand = models.CharField(max_length=50)
    type = models.CharField(max_length=10)
    capacity = models.IntegerField()
    form_factor = models.CharField(max_length=30)
    interface = models.CharField(max_length=30)


class Builds(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    created = models.DateField(auto_now_add=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    build = models.JSONField()


class Favorites(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    favorite = GenericForeignKey("content_type", "object_id")
    added_at = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "content_type", "object_id"], name="unique_favorite"
            )
        ]
