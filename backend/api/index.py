from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from models import CreateUrlRequest
from services import services
from dotenv import load_dotenv

load_dotenv()

# Change: Add root_path="/api" to handle Vercel's default function routing
app = FastAPI(title="Mock API Engine", root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Specific Static Routes go FIRST
@app.get("/endpoints")
async def get_endpoints():
    return await services.list_endpoints()

@app.post("/url", status_code=status.HTTP_201_CREATED)
async def create_mock(payload: CreateUrlRequest):
    result = await services.create_new_mock(payload)
    return {"message": "Mock created successfully", **result}

# 2. Dynamic "Catch-All" route MUST be last
@app.api_route("/{endpoint_id}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def serve_mock(endpoint_id: str, rest_of_path: str, request: Request):
    # Your logic remains the same...
    headers = dict(request.headers)
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except:
            body = (await request.body()).decode() if await request.body() else None

    request_data = {"headers": headers, "body": body}
    return await services.resolve_mock_response(endpoint_id, rest_of_path, request_data)

# 3. Add a fallback for the root of the API
@app.get("/")
async def root():
    return {"message": "FastDev API Engine is online", "docs": "/docs"}