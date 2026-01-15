# FastDev

FastDev is a high-performance utility that allows developers to mock backend APIs in a matter of seconds. By providing three distinct mocking strategies, the platform offers the flexibility needed to kickstart development without waiting for a functional backend. Additionally, FastDev features an integrated testing suite to validate API behavior on the fly.

### Usage & Mocking Strategies

FastDev is designed to eliminate backend dependencies by allowing you to deploy programmable endpoints with persistent state in under 30 seconds.

#### 1. Static Mocks
The simplest way to mock an API. You define a path and a JSON payload, and every request to that path returns the same data.

* **Default Path:** If no path is provided, the mock resolves at the root (`/`).
* **Content-Type:** Automatically set to `application/json`.
* **Pro Tip:** Use static mocks to simulate `404` or `500` errors by pasting the specific error schema your frontend expects to handle.

#### 2. Route Mapping
Define an array of sub-routes within a single deployment to mimic a full REST resource.

* **Matching Logic:** Uses suffix-based routing. The engine evaluates the end of the URL against your defined paths.
* **Capacity:** The free tier supports up to 50 individual mappings per endpoint ID.

#### 3. Functional Mocks (Dynamic Logic)
Functional mocks execute your request within a restricted Python environment. This enables dynamic logic, header-based authentication, and persistent state management.

**The Handler Function:**
```python
def handler(url, headers, body, data):
    # Your custom logic here
    return {"message": "success"}, 200
```

### Architecture

FastDev is built on a modern, decoupled architecture designed for low-latency request handling and secure code execution.

The dashboard is built with Next.js, providing a reactive interface where users can configure their mocks.
We chose FastAPI for the core engine due to its asynchronous capabilities. 
For Functional Mocks, the backend spins up a restricted execution environment. 

It injects the incoming request parameters and the current state (from MongoDB) into the user's custom script. Once the script returns, the engine captures the result and commits any changes made to the data object back to the database.

#### Data Layer (MongoDB)

MongoDB serves as our primary data store. It is used to store:

- Route mapping definitions.
- Persistent State: The dynamic JSON objects used by functional mocks to simulate a real database.
