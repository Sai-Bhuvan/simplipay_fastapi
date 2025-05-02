# app/models.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class MerchantIn(BaseModel):
    name: str
    email: EmailStr
    shopName: str
    shopDetails: Optional[str]
    phoneNo: str
    password: str
    image: Optional[str]
    isMerchant: Optional[bool] = True

class MerchantOut(BaseModel):
    phoneNo: str
    isMerchant: bool
    statusCode: int
