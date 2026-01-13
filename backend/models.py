from pydantic import BaseModel , Field
from typing import Literal, Union, List, Dict, Any , Optional

class StaticConfig(BaseModel):
    path: str = "/"
    value: Dict[str, Any]

class RouteMapping(BaseModel):
    path: str
    value: Any

class MappingConfig(BaseModel):
    routes: List[RouteMapping]

# Add this for Functional Mocks
class FunctionalConfig(BaseModel):
    path: str = "/"
    code: str
    data: Dict[str, Any] = {}

class CreateUrlRequest(BaseModel):
    type: Literal["static", "mapping", "functional"]
    config: Union[StaticConfig, MappingConfig, FunctionalConfig]
    # New Fields
    name: str = Field(..., min_length=1, max_length=50)
    description: str = ""
    is_public: bool = True
    owner_email: Optional[str] = None # Set by backend from auth token