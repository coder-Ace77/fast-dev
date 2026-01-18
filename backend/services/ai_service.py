from fastapi import HTTPException
from models import AiGenRequest
from database import user_collection
import os
from datetime import datetime
from openai import AsyncOpenAI
import json

client = AsyncOpenAI(api_key=os.getenv("OPEN_AI_KEY"))
MAX_CHATS = int(os.getenv("MAX_CHATS_PER_WEEK", "20"))
AI_MODEL = os.getenv("AI_MODEL", "gpt-3.5-turbo")

async def generate_mock_config_service(payload: AiGenRequest, user: dict):
    # Rate Limiting Logic
    now = datetime.utcnow()
    last_reset = user.get("last_reset_time", now)
    
    # If more than 7 days have passed, reset counter
    if (now - last_reset).days >= 7:
        await user_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"max_chats_count": 0, "last_reset_time": now}}
        )
        current_count = 0
    else:
        current_count = user.get("max_chats_count", 0)
    
    if current_count >= MAX_CHATS:
        raise HTTPException(status_code=429, detail="Weekly AI generation limit reached.")

    # Generate Content
    system_prompt = """
    You are an expert Python backend developer. 
    Your task is to generate a Mock Configuration based on the user's description.
    
    You must return a JSON object with the following structure:
    {
        "type": "functional" | "static",
        "code": "python code string (only for functional)",
        "value": { ... } (json payload for static),
        "data": { ... } (initial persistent data state, required for functional if state is needed)
    }

    Rules for 'functional':
    1. The `code` field must contain a Python function named `handler`.
    2. The function signature must be `def handler(url, headers, body, data):`.
    3. `data` is a persistent dictionary. You can read/write to it.
    4. If the user mentions a "counter" or "initial state", define the initial values in the `data` field of the JSON response.
    5. The `handler` must return a dictionary or a direct value.
    6. Do NOT use `os`, `sys`, or file operations.
    7. Standard libraries (json, random, time, datetime) are allowed.
    8. **IMPORTANT**: Use Python syntax for booleans (`True`, `False`, `None`) in your code, NOT JSON (`true`, `false`, `null`).

    Rules for 'static':
    1. The `value` field must contain the JSON response payload.
    2. Do not provide `code`.

    Return ONLY the raw JSON object. Do not wrap it in markdown code blocks.
    """

    user_prompt = f"""
    Description: {payload.description}
    Input Format: {payload.input_format or "Any"}
    Output Format: {payload.output_format or "JSON"}
    URL Hint: {payload.url or "N/A"}
    
    Generate the configuration. root your answer in a valid assumption of what the user wants.
    """

    try:
        response = await client.chat.completions.create(
            model=AI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        content = response.choices[0].message.content.strip()
        
        # Cleanup potential markdown
        if content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()

        print("GEN::RAW_CONTENT", content)

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            # Fallback if AI fails to return valid JSON - try to wrap it as static or functional heuristically
            # This is a basic fallback
            print("GEN::JSON_FAIL", content)
            return {"content": content, "type": "functional"} # Assume functional legacy

        # Transform to frontend expected format
        result = {
            "type": parsed.get("type", "functional"),
            "data": parsed.get("data", {}),
            "content": parsed.get("code") if parsed.get("type") == "functional" else json.dumps(parsed.get("value"))
        }

        # Handle case where static value might be dict, ensure content is stringified for static
        if result["type"] == "static" and not isinstance(result["content"], str):
             result["content"] = json.dumps(result["content"])

        await user_collection.update_one(
            {"_id": user["_id"]},
            {"$inc": {"max_chats_count": 1}}
        )
        
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Generation Failed: {str(e)}")
