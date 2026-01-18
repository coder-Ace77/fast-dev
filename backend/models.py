from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Union, List, Dict, Any, Optional
from datetime import datetime

class StaticConfig(BaseModel):
    path: str = "/"
    value: Dict[str, Any]

class RouteMapping(BaseModel):
    path: str
    value: Any

class MappingConfig(BaseModel):
    routes: List[RouteMapping]
class FunctionalConfig(BaseModel):
    path: str = "/"
    code: str
    data: Dict[str, Any] = {}

class PostMockConfig(BaseModel):
    path: str = "/"
    method: Literal["POST", "PUT", "DELETE"] = "POST"
    code: str
    data: Dict[str, Any] = {}

class CreateUrlRequest(BaseModel):
    type: Literal["static", "mapping", "functional", "post_mock"]
    config: Union[StaticConfig, MappingConfig, FunctionalConfig, PostMockConfig]
    name: str = Field(..., min_length=1, max_length=50)
    description: str = ""
    is_public: bool = True
    owner_email: Optional[str] = None
    custom_id: Optional[str] = None

# User Models
class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    max_chats_count: int = 0
    last_reset_time: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class AiGenRequest(BaseModel):
    description: str
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    url: Optional[str] = None