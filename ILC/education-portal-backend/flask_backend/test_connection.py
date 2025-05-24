from pymongo import MongoClient

# Replace with your connection string
client = MongoClient("mongodb+srv://udaysharma9171:YCBxPNYykbcrhMua@clusterdb.o3rt2.mongodb.net/student_data")
db = client["student_data"]

# Test connection
print("Databases available:", client.list_database_names())
