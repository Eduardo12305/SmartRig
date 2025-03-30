from ninja import Schema
from pydantic import EmailStr

class registrarSchema(Schema):
    name: str
    password: str
    confPassword: str
    email: EmailStr
