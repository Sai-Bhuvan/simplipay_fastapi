from pydantic import BaseModel
from typing import Optional

class SignUpRequest(BaseModel):
    name: str
    email: str
    shopName: str
    shopDetails: Optional[str] = None
    phoneNo: str
    password: str
    image: Optional[str] = None
    isMerchant: bool

class SignInRequest(BaseModel):
    pin: str
    phone: str

class CompareFaceRequest(BaseModel):
    phone: str
    image: str

class SearchUserRequest(BaseModel):
    phoneNo: str
