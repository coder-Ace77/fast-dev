from fastapi import FastAPI, Request, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from models import CreateUrlRequest, UserCreate, UserLogin, Token, AiGenRequest
from services.create_service import create_new_mock, list_endpoints, check_availability
from services.resolve_service import resolve_mock_response
from services.auth_service import register_user, login_user, get_current_user, get_current_user_optional, oauth2_scheme
from services.ai_service import generate_mock_config_service
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Mock API Engine")

api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Auth Routes ---
@app.post("/auth/register", response_model=Token, tags=["Auth"])
async def register(user: UserCreate):
    return await register_user(user)

@app.post("/auth/login", response_model=Token, tags=["Auth"])
async def login(user: UserLogin):
    return await login_user(user)

@app.get("/auth/me", tags=["Auth"])
async def read_users_me(current_user: dict = Depends(get_current_user)):
    current_user["_id"] = str(current_user["_id"])
    return current_user

# --- AI Routes ---
@app.post("/ai/generate", tags=["AI"])
async def generate_mock_config(payload: AiGenRequest, user: dict = Depends(get_current_user)):
    return await generate_mock_config_service(payload, user)

# --- Existing Routes ---
@app.get("/endpoints")
async def get_endpoints(user = Depends(get_current_user_optional)):
    email = user["email"] if user else None
    return await list_endpoints(email)

@app.get("/check-availability")
async def check_availability_route(id: str):
    return await check_availability(id)

@app.post("/url", status_code=status.HTTP_201_CREATED)
async def create_mock(payload: CreateUrlRequest, user = Depends(get_current_user)):
    result = await create_new_mock(payload, user["email"])
    return {"message": "Mock created successfully", **result}

@app.api_route("/{endpoint_id}/{rest_of_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def serve_mock(endpoint_id: str, rest_of_path: str, request: Request):
    headers = dict(request.headers)
    body = None
    if request.method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except:
            body = (await request.body()).decode() if await request.body() else None

    request_data = {"headers": headers, "body": body, "method": request.method}
    return await resolve_mock_response(endpoint_id, rest_of_path, request_data)

@app.get("/")
async def root():
    return {"message": "FastDev API Engine is online", "docs": "/docs"}