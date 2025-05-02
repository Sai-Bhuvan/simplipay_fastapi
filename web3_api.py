import os
from fastapi import FastAPI, HTTPException, Depends ,Request
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from services.web3_stuff_router import router as web3_stuff_router

from dotenv import load_dotenv

load_dotenv()  # Load .env variables

app = FastAPI()


# Mongo connection
@app.on_event("startup")
async def startup_db_client():
    # app.state.db_client = AsyncIOMotorClient(os.getenv("mongodb://localhost:27017/?retryWrites=true&w=majority"))
    # app.state.db = app.state.db_client["your-db-name"]
    app.mongodb_client = AsyncIOMotorClient("mongodb+srv://saibhuvan2003:b7NJvDf1YwAGXBw1@simplipay.24vuah4.mongodb.net/")
    app.mongodb_db = app.mongodb_client["simplipay_db"]

@app.on_event("shutdown")
async def shutdown_db_client():
    app.state.db_client.close()

app.include_router(web3_stuff_router)