from ninja import Schema
from pydantic import EmailStr

class registrarSchema(Schema):
    name: str
    password: str
    confPassword: str
    email: EmailStr

class updatePassword(Schema):
    password: str
    confPassword: str

class update(Schema):
    name: str = None
    password: str
    newPassword: updatePassword = None
    email: EmailStr = None
    token: str


class loginSchema(Schema):
    email: EmailStr
    password: str