from datetime import date
from typing import Any, List, Optional
from uuid import UUID

from ninja import Schema
from pydantic import EmailStr, Field


class registrarSchema(Schema):
    name: str
    password: str
    confPassword: str
    email: EmailStr


class updatePassword(Schema):
    password: str
    confPassword: str


class addProd(Schema):
    type: str
    token: str
    products: List[Any]


class genProd(Schema):
    qty: List[int]


class build(Schema):
    cpu: str
    gpu: str
    mobo: str
    psu: str
    ram: str
    storage: str


class weightsSchema(Schema):
    cpu: Optional[float] = None
    gpu: Optional[float] = None
    ram: Optional[float] = None


class genBuild(Schema):
    cpu: Optional[str] = None
    gpu: Optional[str] = None
    mobo: Optional[str] = None
    psu: Optional[str] = None
    budget: float
    storage: int
    storageType: str
    weights: Optional[weightsSchema] = None

    @staticmethod
    def resolve_storage_type(obj):
        if not obj.storageType in ["HDD", "SSD", "M.2"]:
            return 400, {"message": "Tipo de armazenamento inválido."}


class GenericFilterSchema(Schema):
    uid: Optional[UUID] = None
    name: Optional[str] = None
    image: Optional[str] = None
    date_added: Optional[date] = None
    brand: Optional[str] = None

    igpu_id: Optional[UUID] = None
    socket: Optional[str] = None
    tdp: Optional[int] = None
    cores: Optional[int] = None
    speed: Optional[int] = None
    turbo: Optional[int] = None

    chipset: Optional[str] = None
    memory: Optional[int] = None

    type: Optional[str] = None
    wattage: Optional[int] = None
    efficiency: Optional[str] = None
    modular: Optional[str] = None

    form_factor: Optional[str] = None
    memory_max: Optional[int] = None
    memory_type: Optional[str] = None
    memory_slots: Optional[int] = None
    m2_nvme: Optional[int] = None
    m2_sata: Optional[int] = None

    memory_size: Optional[int] = None
    memory_modules: Optional[int] = None
    memory_speed: Optional[int] = None

    capacity: Optional[int] = None
    interface: Optional[str] = None


class priceFilter(Schema):
    store: Optional[str] = None
    sale: Optional[bool] = None
    price_range: Optional[List[float]] = Field(default=None, max_items=2, min_items=2)


class update(Schema):
    name: Optional[str] = None
    password: str
    newPassword: Optional[updatePassword] = None
    email: Optional[EmailStr] = None


class loginSchema(Schema):
    email: EmailStr
    password: str
