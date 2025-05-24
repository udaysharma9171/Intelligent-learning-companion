import jwt
import datetime
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from functools import wraps
from sklearn.ensemble import RandomForestClassifier
import numpy as np

MONGO_URI = "mongodb+srv://udaysharma9171:YCBxPNYykbcrhMua@clusterdb.o3rt2.mongodb.net/student_data"
client = MongoClient(MONGO_URI)
db = client['student_data']

# ✅ REAL TRAINING DATA FETCHED FROM DATABASE
students_collection = db['students']
X = []
y = []

for student in students_collection.find():
    scores = [
        student.get("quiz_score_1", 0),
        student.get("quiz_score_2", 0),
        student.get("quiz_score_3", 0),
        student.get("assignment_score_1", 0),
        student.get("assignment_score_2", 0),
    ]
    X.append(scores)
    avg = sum(scores) / len(scores)

    if avg >= 0.8:
        y.append("High Achievers")
    elif avg >= 0.6:
        y.append("Average")
    else:
        y.append("At Risk")

X = np.array(X)
y = np.array(y)

model = RandomForestClassifier()
model.fit(X, y)

#TOKEN verification decorator
def token_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None

            # Get token from request header
            if 'Authorization' in request.headers:
                token = request.headers['Authorization'].split(" ")[1]  # Bearer <token>

            if not token:
                return jsonify({"message": "Token is missing!"}), 401

            try:
                data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                if data['role'] != role:
                    return jsonify({"message": "Permission denied!"}), 403
            except jwt.ExpiredSignatureError:
                return jsonify({"message": "Token has expired!"}), 401
            except jwt.InvalidTokenError:
                return jsonify({"message": "Invalid token!"}), 401

            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Initialize flask app
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://192.168.0.102:3000"], supports_credentials=True)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', request.headers.get('Origin'))
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response
# MongoDB URI
MONGO_URI = "mongodb+srv://udaysharma9171:YCBxPNYykbcrhMua@clusterdb.o3rt2.mongodb.net/"
client = MongoClient(MONGO_URI)

# Access your database and collection
db = client['student_data']
students_collection = db['students']
teachers_collection = db['teachers']

#JWT SECRET KEY
SECRET_KEY = 'MAJOR_PROJECT'

def generate_token(user_id, role):
    payload = {
        'user_id': str(user_id),
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiry: 1 hour
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token

# API for delete resource
@app.route('/resources/<title>', methods=['DELETE'])
@token_required("teacher")

def delete_resource(title):

    try:

        result = db.resources.delete_one({"title": title})

        if result.deleted_count > 0:

            return jsonify({"message": "Resource deleted successfully"}), 200

        else:

            return jsonify({"message": "Resource not found"}), 404

    except Exception as e:

        return jsonify({"error": str(e)}), 500
# ✅✅ NEW API: Performance Distribution (Pie Chart for Teacher Dashboard)
@app.route('/api/teacher/performance-distribution', methods=['GET'])
def get_performance_distribution():
    print("working piechart-1")
    try:
        students = list(students_collection.find({}))

        distribution = {
            "High Achievers": 0,
            "Average": 0,
            "At Risk": 0
        }

        for student in students:
            scores = [
                student.get('quiz_score_1', 0),
                student.get('quiz_score_2', 0),
                student.get('quiz_score_3', 0),
                student.get('assignment_score_1', 0),
                student.get('assignment_score_2', 0)
            ]
            average_score = sum(scores) / len(scores)

            if average_score >= 80:
                distribution["High Achievers"] += 1
            elif average_score >= 60:
                distribution["Average"] += 1
            else:
                distribution["At Risk"] += 1

        return jsonify(distribution), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅✅ NEW API: Teacher Upload Resource
@app.route('/api/resources', methods=['POST'])
@token_required("teacher")
def add_resource():
    try:
        data = request.json
        title = data.get('title')
        category = data.get('category')
        link = data.get('link')

        if not all([title, category, link]):
            return jsonify({"message": "Missing required fields"}), 400

        # Insert into MongoDB
        db.resources.insert_one({
            "title": title,
            "category": category,
            "link": link
        })

        return jsonify({"message": "Resource added successfully"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/resources', methods=['GET', 'POST'])
def manage_resources():
    if request.method == 'GET':
        try:
            resources = list(db.resources.find({}, {"_id": 0}))
            return jsonify({"resources": resources, "message": "Resources fetched successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e), "message": "Failed to fetch resources"}), 500

    if request.method == 'POST':
        try:
            data = request.json
            title = data.get('title')
            category = data.get('category')
            url = data.get('url')
            type = data.get('type')

            if not all([title, category, url, type]):
                return jsonify({"message": "Missing required fields"}), 400

            db.resources.insert_one({
                "title": title,
                "category": category,
                "url": url,
                "type": type
            })

            return jsonify({"message": "Resource added successfully"}), 201

        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/resources/<category>', methods=['GET'])
def get_resources_by_category(category):
    try:
        resources = list(db.resources.find({"category": category}, {"_id": 0}))
        if resources:
            return jsonify({"resources": resources, "message": "Resources fetched successfully"}), 200
        else:
            return jsonify({"resources": [], "message": "No resources found for this category"}), 404
    except Exception as e:
        return jsonify({"error": str(e), "message": "Failed to fetch resources"}), 500

@app.route('/api/students', methods=['GET', 'POST'])
def handle_students():
    if request.method == 'GET':
        students = list(students_collection.find({}, {"_id": 0}))
        return jsonify({"students": students})
    elif request.method == 'POST':
        new_student = request.json.get('name')
        if new_student:
            students_collection.insert_one({"name": new_student})
            return jsonify({"message": "Student added successfully"}), 201
        else:
            return jsonify({"message": "No student name provided"}), 400

@app.route('/api/students/<int:student_id>', methods=['GET'])
def get_student_data(student_id):
    try:
        student = students_collection.find_one({"student_id": student_id}, {"_id": 0})
        if student:
            return jsonify({"student": student, "message": "Student data fetched successfully"}), 200
        else:
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    student_id = request.args.get('studentId')
    if student_id:
        student = students_collection.find_one({"student_id": int(student_id)}, {"_id": 0})
        if student:
            return jsonify({"student": student}), 200
        else:
            return jsonify({"message": "Student not found"}), 404
    else:
        students = list(students_collection.find({}, {"_id": 0}))
        return jsonify({"students": students}), 200

# API for stu login
@app.route('/api/student/login', methods=['POST'])
def student_login():
    data = request.json
    name = data.get('name')
    student_id = data.get('studentId')

    student = students_collection.find_one({"name": name, "student_id": int(student_id)})

    if student:
        token=generate_token(student_id,"student")
        return jsonify({"message": "Login successful", "token" : token, "role": "student"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# API for teacher login
@app.route('/api/teacher/login', methods=['POST'])
def teacher_login():
    data = request.json
    name = data.get('name')
    password = data.get('password')

    teacher = teachers_collection.find_one({"name": name, "password": password})

    if teacher:
        token = generate_token(teacher["_id"],"teacher")
        return jsonify({"message": "Login successful", "token" : token, "role": "teacher"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
    
# ✅✅ API: Predict Student Performance
@app.route('/api/predict-performance', methods=['POST'])
def predict_performance():
    try:
        data = request.get_json()
        
        quiz_score_1 = float(data.get('quiz_score_1', 0))
        quiz_score_2 = float(data.get('quiz_score_2', 0))
        quiz_score_3 = float(data.get('quiz_score_3', 0))
        assignment_score_1 = float(data.get('assignment_score_1', 0))
        assignment_score_2 = float(data.get('assignment_score_2', 0)) 
        input_data = [[
            quiz_score_1,
            quiz_score_2,
            quiz_score_3,
            assignment_score_1,
            assignment_score_2
        ]]

        prediction = model.predict(input_data)[0]
        return jsonify({"predicted_performance": prediction}),200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not Found'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal Server Error'}), 500


if __name__ == '__main__':
    app.run(debug=True)