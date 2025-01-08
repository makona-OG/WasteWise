from flask import Blueprint, jsonify, request
from models import db, Bin

bins_bp = Blueprint('bins', __name__)

@bins_bp.route('/', methods=['GET'])
def get_all_bins():
    bins = Bin.query.all()
    return jsonify([{
        'id': bin.id,
        'location': bin.location,
        'status': bin.status,
        'last_updated': bin.last_updated.isoformat()
    } for bin in bins])

@bins_bp.route('/<int:bin_id>', methods=['PUT'])
def update_bin_status(bin_id):
    bin = Bin.query.get_or_404(bin_id)
    data = request.get_json()
    
    if 'status' in data:
        bin.status = data['status']
        db.session.commit()
        
    return jsonify({
        'id': bin.id,
        'location': bin.location,
        'status': bin.status,
        'last_updated': bin.last_updated.isoformat()
    })