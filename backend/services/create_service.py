import os
from database import endpoint_collection as collection
from utils.utils import format_path, generate_unique_id
from dotenv import load_dotenv
from fastapi import HTTPException, status

load_dotenv()

BASE_URL = os.getenv("BASE_URL")

async def check_availability(endpoint_id: str):
    """Checks if an endpoint ID is already in use."""
    endpoint_id = endpoint_id.strip("/")
    exists = await collection.find_one({"endpoint_id": endpoint_id})
    return {"available": not bool(exists)}

async def list_endpoints(user_email: str = None):
    """
    Lists endpoints. 
    If user_email is provided, shows Public + User's Own endpoints.
    If no user_email, shows only Public endpoints.
    """
    query = {"is_public": True}
    
    if user_email:
        query = {
            "$or": [
                {"is_public": True},
                {"owner_email": user_email}
            ]
        }
        
    return await collection.find(query, {"_id": 0}).to_list(length=1000)

async def create_new_mock(payload, user_email: str):
    endpoint_id = payload.custom_id if payload.custom_id else generate_unique_id()
    endpoint_id = endpoint_id.strip("/")
    
    # Check if ID exists if custom_id provided OR just to be safe (collision check)
    existing = await collection.find_one({"endpoint_id": endpoint_id})
    
    # If custom ID is requested and taken by someone else (or even same user, we might want to overwrite or fail using specific logic)
    # User Request: "Verify if its available and not being used"
    # User Request: "There should be an option to create new by name and must have check button"
    # Strategy: If it exists and user is owner, allow update? Or fail?
    # Simpler first pass: functionality to check availability is separate. 
    # Here, if it exists, we fail if it's a NEW creation request logic, but let's assume if they passed the check they want it.
    # However, to be robust:
    if existing:
        if existing.get("owner_email") != user_email:
             raise HTTPException(status_code=409, detail=f"Endpoint ID '{endpoint_id}' is already taken by another user.")
        # If it is the same user, we overwrite/update.
        # But `insert_one` will fail on _id if we used endpoint_id as _id (we aren't, accessing by endpoint_id field).
        # We should probably use update_one with upsert, or delete previous.
        await collection.delete_one({"endpoint_id": endpoint_id})

    if hasattr(payload.config, "model_dump"):
        config_dict = payload.config.model_dump()
    else:
        config_dict = payload.config.dict()
    
    new_endpoint = {
        "endpoint_id": endpoint_id,
        "type": payload.type,
        "config": config_dict,
        "name": payload.name,
        "description": payload.description,
        "is_public": payload.is_public,
        "owner_email": user_email
    }
    
    await collection.insert_one(new_endpoint)
    path_suffix = config_dict.get('path', '/')
    return {
        "endpoint_id": endpoint_id,
        "base_url": f"{BASE_URL}/{endpoint_id}{format_path(path_suffix)}",
        "usage": f"{BASE_URL}/{endpoint_id}{format_path(path_suffix)}"
    }
