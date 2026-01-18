import sys
import os
from fastapi.testclient import TestClient

# Add current directory to sys.path so we can import api.index
sys.path.append(os.getcwd())

try:
    from api.index import app
except Exception as e:
    print(f"Error importing app: {e}")
    sys.exit(1)

client = TestClient(app)

def test_routes():
    print("Testing /auth/login route (expecting 405 Method Not Allowed or 422 Validation Error if found, not 404 Mock not found)")
    # We send a GET to /auth/login. It is POST only.
    # If route exists: 405 Method Not Allowed.
    # If route does NOT exist: Fallthrough to catch-all -> 404 Mock Not found.
    
    response = client.get("/auth/login")
    print(f"GET /auth/login: Status={response.status_code}, Body={response.json()}")

    print("\nTesting /auth/login POST (expecting 422 or 200, not 404)")
    response = client.post("/auth/login", json={"email": "test@example.com", "password": "pass"})
    print(f"POST /auth/login: Status={response.status_code}, Body={response.json()}")
    
    # Also test with /api prefix if root_path logic is involved
    print("\nTesting /api/auth/login (simulating request with /api prefix)")
    response = client.post("/api/auth/login", json={"email": "test@example.com", "password": "pass"})
    print(f"POST /api/auth/login: Status={response.status_code}, Body={response.json()}")

if __name__ == "__main__":
    test_routes()
