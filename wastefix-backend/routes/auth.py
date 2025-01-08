from flask import Blueprint, request, jsonify
from models import db, User
import jwt
from datetime import datetime, timedelta
import os

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key')

def create_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        is_admin=data['email'] == 'admin@wastefix.com',
        is_collector=data.get('is_collector', False)
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    token = create_token(user.id)
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_admin': user.is_admin,
            'is_collector': user.is_collector
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if 'password' not in data:
        return jsonify({'error': 'Password is required'}), 400
    
    if 'username' not in data and 'email' not in data:
        return jsonify({'error': 'Username or email is required'}), 400
    
    user = None
    if 'email' in data:
        user = User.query.filter_by(email=data['email']).first()
    else:
        user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        token = create_token(user.id)
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'is_collector': user.is_collector
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        if not user:
            raise Exception('User not found')
            
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin,
                'is_collector': user.is_collector
            }
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 401

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_admin': user.is_admin,
        'is_collector': user.is_collector,
        'created_at': user.created_at.isoformat(),
        'bins': [{
            'id': bin.id,
            'location': bin.location
        } for bin in user.bins],
        'collections': [{
            'id': collection.id,
            'timestamp': collection.timestamp.isoformat()
        } for collection in user.collections]
    } for user in users])