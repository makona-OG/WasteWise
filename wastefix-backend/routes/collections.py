from flask import Blueprint, request, jsonify
from models import db, Bin, Collection
from datetime import datetime

collections_bp = Blueprint('collections', __name__)

@collections_bp.route('/', methods=['GET'])
def get_all_collections():
    collections = Collection.query.all()
    return jsonify([{
        'id': c.id,
        'bin_id': c.bin_id,
        'collector_id': c.collector_id,
        'timestamp': c.timestamp.isoformat(),
        'previous_status': c.previous_status,
        'new_status': c.new_status,
        'bin': {
            'id': c.bin.id,
            'location': c.bin.location
        },
        'collector': {
            'id': c.collector.id,
            'username': c.collector.username
        }
    } for c in collections])

@collections_bp.route('/<int:bin_id>', methods=['PUT'])
def update_collection_status(bin_id):
    bin = Bin.query.get_or_404(bin_id)
    data = request.get_json()
    
    if 'status' not in data or 'previous_status' not in data:
        return jsonify({'error': 'Status and previous status are required'}), 400
        
    # Record collection if status is being reduced
    status_levels = {'Empty': 0, 'Half-full': 1, 'Overflowing': 2}
    if status_levels[data['status']] < status_levels[data['previous_status']]:
        collection = Collection(
            bin_id=bin.id,
            collector_id=1,  # Default collector for simulation
            previous_status=data['previous_status'],
            new_status=data['status']
        )
        db.session.add(collection)
    
    bin.status = data['status']
    bin.last_updated = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'id': bin.id,
        'location': bin.location,
        'status': bin.status,
        'last_updated': bin.last_updated.isoformat()
    })

@collections_bp.route('/', methods=['POST'])
def add_collection_bin():
    data = request.get_json()
    
    if not all(k in data for k in ['location', 'latitude', 'longitude', 'owner_id']):
        return jsonify({'error': 'Missing required fields'}), 400
        
    new_bin = Bin(
        location=data['location'],
        status=data.get('status', 'Empty'),
        latitude=data['latitude'],
        longitude=data['longitude'],
        owner_id=data['owner_id']
    )
    
    db.session.add(new_bin)
    db.session.commit()
    
    return jsonify({
        'id': new_bin.id,
        'location': new_bin.location,
        'status': new_bin.status,
        'last_updated': new_bin.last_updated.isoformat(),
        'latitude': new_bin.latitude,
        'longitude': new_bin.longitude,
        'owner_id': new_bin.owner_id
    }), 201