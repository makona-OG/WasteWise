from flask import Blueprint, jsonify, request
from models import db, Report
from services.infobip import send_whatsapp_notification

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('/', methods=['GET'])
def get_all_reports():
    reports = Report.query.all()
    return jsonify([{
        'id': report.id,
        'bin_id': report.bin_id,
        'issue': report.issue,
        'status': report.status,
        'created_at': report.created_at.isoformat(),
        'updated_at': report.updated_at.isoformat()
    } for report in reports])

@reports_bp.route('/', methods=['POST'])
def create_report():
    data = request.get_json()
    new_report = Report(
        bin_id=data['bin_id'],
        issue=data['issue']
    )
    db.session.add(new_report)
    db.session.commit()
    
    # Send notification to fixed number
    send_whatsapp_notification(f"New report for Bin #{data['bin_id']}: {data['issue']}")
    
    return jsonify({
        'id': new_report.id,
        'bin_id': new_report.bin_id,
        'issue': new_report.issue,
        'status': new_report.status,
        'created_at': new_report.created_at.isoformat(),
        'updated_at': new_report.updated_at.isoformat()
    }), 201

@reports_bp.route('/<int:report_id>', methods=['PUT'])
def update_report(report_id):
    report = Report.query.get_or_404(report_id)
    data = request.get_json()
    
    if 'status' in data:
        report.status = data['status']
        db.session.commit()
        
        # Send notification about status update
        send_whatsapp_notification(f"Report #{report_id} status updated to: {data['status']}")
    
    return jsonify({
        'id': report.id,
        'bin_id': report.bin_id,
        'issue': report.issue,
        'status': report.status,
        'created_at': report.created_at.isoformat(),
        'updated_at': report.updated_at.isoformat()
    })