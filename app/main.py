from fastapi import FastAPI, HTTPException, Depends ,Request,UploadFile,Form,File
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
import os
import numpy as np
from models import MerchantModel, TransactionModel
from schemas import SignUpRequest, SignInRequest, CompareFaceRequest
import face_recognition
from io import BytesIO
from PIL import Image
import base64
from services.web3_stuff_router import router as web3_stuff_router

# Initialize FastAPI app
app = FastAPI()
app.include_router(web3_stuff_router)

# MongoDB client initialization
@app.on_event("startup")
async def startup_db():
    app.mongodb_client = AsyncIOMotorClient("mongodb+srv://saibhuvan2003:b7NJvDf1YwAGXBw1@simplipay.24vuah4.mongodb.net/")
    app.mongodb_db = app.mongodb_client["simplipay_db"]
    app.merchant_model = MerchantModel(app.mongodb_db)
    app.transaction_model = TransactionModel(app.mongodb_db)

@app.on_event("shutdown")
async def shutdown_db():
    app.mongodb_client.close()

# Sign-up endpoint
@app.post("/sign-up")
async def sign_up(request: SignUpRequest):
    try:
        bcrypt_salt = bcrypt.gensalt(10)
        hashed_password = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt_salt)

        new_merchant = {
            "name": request.name,
            "email": request.email,
            "shopName": request.shop,
            "shopDetails": request.shopdetails,
            "phoneNo": request.phoneno,
            "password": hashed_password.decode('utf-8'),
            "image": request.image,
            "isMerchant": request.isMerchant
        }

        merchant_id = await app.merchant_model.create_merchant(new_merchant)

        # Save the transaction (for simplicity, we'll assume a transaction exists)
        transaction_data = {
            "from": "boss",
            "to": merchant_id,
            "time": 1234567890,  # Example timestamp
            "amount": 1000000,
            "note": "nice deposit",
            "transactionHash": "dummy_hash_for_now",
            "status": "SUCCESS"
        }
        await app.transaction_model.create_transaction(transaction_data)

        return {"phoneNo": request.phoneno, "isMerchant": request.isMerchant, "statusCode": 201}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/sign-in")
async def sign_in(request: SignInRequest, req: Request):
    try:
        db = req.app.mongodb_db
        merchant_model = MerchantModel(db)
        
        user = await merchant_model.find_by_phone(request.phone)
        if not user:
            raise HTTPException(status_code=404, detail="Merchant not found")

        pass_ok = bcrypt.checkpw(request.pin.encode('utf-8'), user["password"].encode('utf-8'))

        if pass_ok:
            return {
                "message": "pass-ok",
                "statusCode": 200,
                "phoneNo": user["phoneNo"],
                "isMerchant": user.get("isMerchant", False)
            }
        else:
            return {
                "message": "pass-wrong",
                "statusCode": 201
            }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
def base64_to_image(base64_str: str) -> np.ndarray:
    image_data = base64.b64decode(base64_str)
    image = Image.open(BytesIO(image_data))
    return np.array(image)


def image_file_to_np(file: UploadFile) -> np.ndarray:
    image_data = file.file.read()
    image = Image.open(BytesIO(image_data))
    return np.array(image)

@app.post("/compareFace/")
async def compare_face_file(
    from_: str = Form(...),
    image: UploadFile = File(...),
    req: Request = None
):
    try:
        db = req.app.mongodb_db
        users = db["merchants"]
        user = await users.find_one({"phoneNo": from_})
        if not user or "image" not in user:
            raise HTTPException(status_code=404, detail="User or image not found")

        # Convert uploaded image to numpy
        img1_np = image_file_to_np(image)

        # Convert stored base64 image to numpy
        img2_np = base64_to_image(user["image"])

        face1_enc = face_recognition.face_encodings(img1_np)
        face2_enc = face_recognition.face_encodings(img2_np)

        if not face1_enc or not face2_enc:
            raise HTTPException(status_code=400, detail="Face not detected in one or both images")

        distance = np.linalg.norm(face1_enc[0] - face2_enc[0])
        status_code = 200 if distance < 0.6 else 201
        message = "Face Matched" if distance < 0.6 else "Face Do not match"

        return {"message": message, "distance": distance, "statusCode": status_code}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
