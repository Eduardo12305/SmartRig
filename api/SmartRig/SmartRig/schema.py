from ninja import Schema
from pydantic import EmailStr

class registrarSchema(Schema):
    nome: str
    senha: str
    senha_conf: str
    email: EmailStr
