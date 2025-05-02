import os
import bcrypt
from web3 import Web3
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

RPC_URL = os.getenv("RPC_URL", "https://polygon-rpc.com")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "0x4c605275f88f328955CB9e05aFB28FC823098E7D")
OWNER_PRIVATE_KEY = os.getenv("OWNER_PRIVATE_KEY", "aed712d2542985fd737b25baa8fdb84af57cae3d3674ce52814ffd06cfa771f8")
OWNER_ADDRESS = os.getenv("OWNER_ADDRESS", "0x9EdF62131a0580D35D4e665FcD1B07f8eA44A472")

# Load contract ABI
import json
with open("smart-contract/main_contract_abi.json") as f:
    CONTRACT_ABI = json.load(f)

# Initialize web3 and contract
web3 = Web3(Web3.HTTPProvider(RPC_URL, request_kwargs={'timeout': 5}))
main_contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)

async def register_user_on_chain(merchant_id: str):
    try:
        gas_price = web3.eth.gas_price
        nonce = web3.eth.get_transaction_count(OWNER_ADDRESS)
        
        tx_data = main_contract.functions.registerUser(merchant_id).build_transaction({
            'from': OWNER_ADDRESS,
            'to': CONTRACT_ADDRESS,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': gas_price,
            'value': 1000000  # value in wei
        })

        signed_tx = web3.eth.account.sign_transaction(tx_data, OWNER_PRIVATE_KEY)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        
        return {
            "transactionHash": receipt.transactionHash.hex(),
            "status": "SUCCESS" if receipt.status == 1 else "FAILURE"
        }

    except Exception as e:
        return {
            "status": "ERROR",
            "error": str(e)
        }


async def get_balance(db, phone):
    users = db["merchants"]
    from_user = await users.find_one({"phoneNo": phone})
    if not from_user:
        raise Exception("User not found")

    user_id = str(from_user["_id"])
    balance = main_contract.functions.getBalance(user_id).call({
        'from': OWNER_ADDRESS
    })
    return balance

async def get_previous_transactions(db, phone):
    transactions = db["transactions"]
    results = await transactions.find({
        "$or": [{"to": phone}, {"from": phone}]
    }).to_list(length=100)  # Limit to 100 for now
    return results

async def make_transaction(db, from_phone, to_phone, amount, note, password):
    users = db["merchants"]
    from_user = await users.find_one({"phoneNo": from_phone})
    to_user = await users.find_one({"phoneNo": to_phone})

    if not from_user or not to_user:
        raise Exception("User(s) not found")

    if not bcrypt.checkpw(password.encode('utf-8'), from_user["password"].encode('utf-8')):
        raise Exception("Wrong PIN!")

    from_id = str(from_user["_id"])
    to_id = str(to_user["_id"])

    gas_price = web3.eth.gas_price
    nonce = web3.eth.get_transaction_count(OWNER_ADDRESS)
    tx_data = main_contract.functions.transact(from_id, to_id, int(amount)).build_transaction({
        'from': OWNER_ADDRESS,
        'gas': 300000,
        'gasPrice': gas_price,
        'nonce': nonce
    })

    signed_tx = web3.eth.account.sign_transaction(tx_data, OWNER_PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    status = "SUCCESS" if receipt.status == 1 else "FAILURE"

    transactions = db["transactions"]
    await transactions.insert_one({
        "from": from_phone,
        "to": to_phone,
        "time": int(web3.eth.get_block(receipt.blockNumber).timestamp),
        "amount": amount,
        "note": note,
        "transactionHash": receipt.transactionHash.hex(),
        "status": status
    })

    return {
        "transactionHash": receipt.transactionHash.hex(),
        "status": status
    }

async def transaction_status(tx_hash):
    try:
        receipt = web3.eth.get_transaction_receipt(tx_hash)
        return {
            "status": "SUCCESS" if receipt.status == 1 else "FAILURE",
            "blockNumber": receipt.blockNumber,
            "gasUsed": receipt.gasUsed
        }
    except Exception:
        return {
            "status": "PENDING",
            "message": "Transaction not yet mined"
        }
