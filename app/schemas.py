from pydantic import BaseModel
from typing import Optional

class SignUpRequest(BaseModel):
    name: str
    email: str
    shop: str
    shopdetails: Optional[str] = None
    phoneno: str
    password: str
    image: Optional[str] = None
    isMerchant: bool

class SignInRequest(BaseModel):
    pin: str
    phone: str

class CompareFaceRequest(BaseModel):
    from_: str
    image: str