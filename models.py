from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class MerchantModel:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = self.db["merchants"]

    async def create_merchant(self, merchant_data: dict):
        result = await self.collection.insert_one(merchant_data)
        return str(result.inserted_id)

    async def get_merchant_by_phone(self, phone: str):
        return await self.collection.find_one({"phoneNo": phone})

class TransactionModel:
    def __init__(self, db: AsyncIOMotorClient):
        self.db = db
        self.collection = self.db["transactions"]

    async def create_transaction(self, transaction_data: dict):
        await self.collection.insert_one(transaction_data)
