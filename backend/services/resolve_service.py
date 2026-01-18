import os
import json
import ast
from fastapi import HTTPException, status
from database import endpoint_collection as collection
from utils.utils import format_path
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.getenv("BASE_URL")

async def resolve_mock_response(endpoint_id: str, rest_of_path: str, request_meta: dict):
    doc = await collection.find_one({"endpoint_id": endpoint_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Mock not found")

    mock_type = doc["type"]
    config = doc["config"]
    request_path = format_path(rest_of_path)

    if mock_type == "static":
        target = format_path(config.get("path", "/"))
        if target == request_path or target == "/":
            return config.get("value")
            
    elif mock_type == "mapping":
        for route in config.get("routes", []):
            if format_path(route["path"]) == request_path:
                return route["value"]

    elif mock_type == "functional":
        full_url = f"{BASE_URL}/{endpoint_id}{request_path}"
        data = config.get("data", {})
        
        result = execute_functional_code(
            config.get("code", ""),
            data,
            full_url,
            request_meta
        )
        
        await collection.update_one(
            {"endpoint_id": endpoint_id},
            {"$set": {"config.data": data}}
        )
        
        return result

    elif mock_type == "post_mock":
        expected_method = config.get("method", "POST")
        if request_meta.get("method") != expected_method:
            raise HTTPException(status_code=405, detail=f"Method Not Allowed: This mock is for {expected_method} requests only")

        full_url = f"{BASE_URL}/{endpoint_id}{request_path}"
        data = config.get("data", {})
        
        result = execute_functional_code(
            config.get("code", ""),
            data,
            full_url,
            request_meta
        )
        
        await collection.update_one(
            {"endpoint_id": endpoint_id},
            {"$set": {"config.data": data}}
        )
        
        return result

    raise HTTPException(status_code=404, detail="Route matching failed")


def execute_functional_code(code: str, data: dict, url: str, request_meta: dict):

    local_vars = {}
    try:
        body = request_meta.get("body")
        if isinstance(body, str) and (body.strip().startswith("{") or body.strip().startswith("[")):
            try:
                body = json.loads(body)
            except json.JSONDecodeError:
                try:
                    body = ast.literal_eval(body)
                except:
                    pass # Keep as string if all fails

        execution_env = {"true": True, "false": False, "null": None}
        
        exec(code, execution_env)
        
        handler = execution_env.get("handler")
        if not handler:
            raise ValueError("No function named 'handler' found in code.")
        result = handler(
            url, 
            request_meta.get("headers"), 
            body, 
            data)
        return result

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Functional Error: {str(e)}")