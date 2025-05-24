from pymongo import MongoClient
import json

# Connect to MongoDB Atlas
client = MongoClient("mongodb+srv://udaysharma9171:YCBxPNYykbcrhMua@clusterdb.o3rt2.mongodb.net/")
db = client["student_data"]  

# Load JSON file
with open("resources.json", "r") as file:
    resources = json.load(file)

# Insert resources into the 'resources' collection
db.resources.insert_many(resources)
print("Resources added to MongoDB successfully!")