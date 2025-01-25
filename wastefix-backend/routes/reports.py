from flask import Blueprint, jsonify, request
from models import db, Report, Bin
from services.infobip import send_whatsapp_notification
import logging

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
    try:
        data = request.get_json()
        print(f"Received report data: {data}")
        
        if not data or 'bin_id' not in data or 'issue' not in data:
            print("Invalid report data received")
            return jsonify({'error': 'Invalid report data'}), 400
        
        # Verify bin exists
        bin = Bin.query.get(data['bin_id'])
        if not bin:
            print(f"Bin not found with ID: {data['bin_id']}")
            return jsonify({'error': 'Bin not found'}), 404

        new_report = Report(
            bin_id=data['bin_id'],
            issue=data['issue']
        )
        db.session.add(new_report)
        db.session.commit()
        
        # Send notification with plain text formatting
        notification_message = (
            "New Report Alert!\n"
            f"Report ID: #{new_report.id}\n"
            f"Bin Location: {bin.location}\n"
            f"Current Status: {bin.status}\n"
            f"Issue Reported: {data['issue']}\n"
            f"Time: {new_report.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
        )
        
        print("Attempting to send WhatsApp notification...")
        notification_result = send_whatsapp_notification(notification_message)
        print(f"WhatsApp notification result: {notification_result}")
        
        return jsonify({
            'id': new_report.id,
            'bin_id': new_report.bin_id,
            'issue': new_report.issue,
            'status': new_report.status,
            'created_at': new_report.created_at.isoformat(),
            'updated_at': new_report.updated_at.isoformat()
        }), 201
        
    except Exception as e:
        print(f"Error creating report: {str(e)}")
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/<int:report_id>', methods=['PUT'])
def update_report(report_id):
    try:
        report = Report.query.get_or_404(report_id)
        data = request.get_json()
        
        if 'status' in data:
            old_status = report.status
            report.status = data['status']
            db.session.commit()
            
            # Send notification about status update with plain text
            bin = Bin.query.get(report.bin_id)
            notification_message = (
                "Report Status Update\n"
                f"Report #{report_id} for {bin.location}\n"
                f"Status changed: {old_status} -> {data['status']}\n"
                f"Original Issue: {report.issue}\n"
                f"Time: {report.updated_at.strftime('%Y-%m-%d %H:%M:%S')}"
            )
            
            print("Attempting to send status update notification...")
            notification_result = send_whatsapp_notification(notification_message)
            print(f"Status update notification result: {notification_result}")
        
        return jsonify({
            'id': report.id,
            'bin_id': report.bin_id,
            'issue': report.issue,
            'status': report.status,
            'created_at': report.created_at.isoformat(),
            'updated_at': report.updated_at.isoformat()
        })
        
    except Exception as e:
        print(f"Error updating report: {str(e)}")
        return jsonify({'error': str(e)}), 500