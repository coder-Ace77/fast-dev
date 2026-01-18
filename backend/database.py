import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGOURI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.fastdev_db
endpoint_collection = database.get_collection("endpoints")
user_collection = database.get_collection("users")