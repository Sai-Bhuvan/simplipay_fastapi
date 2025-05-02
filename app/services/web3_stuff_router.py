from fastapi import APIRouter, Request
from .web3_stuff import get_balance, make_transaction, get_previous_transactions, transaction_status

router = APIRouter()

@router.post("/get-balance")
async def balance(req: Request, payload: dict):
    balance = await get_balance(req.app.mongodb_db, payload["from"])
    return {"message": "Got Balance", "balance": balance, "statusCode": 200}

@router.post("/transaction")
async def transaction(req: Request, payload: dict):
    result = await make_transaction(
        req.app.mongodb_db,
        payload["from"],
        payload["to"],
        payload["amount"],
        payload["note"],
        payload["pass"]
    )
    return {"message": "Transaction Success!", **result, "statusCode": 200}

@router.post("/previous-transactions")
async def previous_transactions(req: Request, payload: dict):
    results = await get_previous_transactions(req.app.mongodb_db, payload["phone"])
    return {"transactions": results, "statusCode": 200}

@router.post("/transaction-status")
async def tx_status(payload: dict):
    result = await transaction_status(payload["transactionHash"])
    return {"statusCode": 200, **result}
