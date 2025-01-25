import os
from dotenv import load_dotenv
import http.client
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def send_whatsapp_notification(message: str):
    """Send WhatsApp notification using Infobip API"""
    try:
        INFOBIP_API_KEY = os.getenv('INFOBIP_API_KEY')
        INFOBIP_BASE_URL = os.getenv('INFOBIP_BASE_URL')
        WHATSAPP_NUMBER = os.getenv('WHATSAPP_BUSINESS_NUMBER')
        
        logger.info("=== INFOBIP CONFIGURATION CHECK ===")
        if not INFOBIP_API_KEY:
            logger.error("INFOBIP_API_KEY is missing")
            return {"error": "Infobip API key not configured"}
        if not INFOBIP_BASE_URL:
            logger.error("INFOBIP_BASE_URL is missing")
            return {"error": "Infobip base URL not configured"}
        if not WHATSAPP_NUMBER:
            logger.error("WHATSAPP_BUSINESS_NUMBER is missing")
            return {"error": "WhatsApp business number not configured"}
            
        logger.info(f"Base URL configured: {bool(INFOBIP_BASE_URL)}")
        logger.info(f"API Key configured: {bool(INFOBIP_API_KEY)}")
        logger.info(f"WhatsApp number configured: {bool(WHATSAPP_NUMBER)}")
        
        # Format WhatsApp numbers - ensure they start with country code
        from_number = WHATSAPP_NUMBER if WHATSAPP_NUMBER.startswith("+") else f"+{WHATSAPP_NUMBER}"
        to_number = "+254712961615"  # Target WhatsApp number with country code
        
        # Remove 'https://' from the base URL if present
        base_url = INFOBIP_BASE_URL.replace('https://', '')
        
        # Create connection
        conn = http.client.HTTPSConnection(base_url)
        
        # Prepare headers
        headers = {
            "Authorization": f"App {INFOBIP_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        # Prepare payload with template
        payload = {
            "messages": [{
                "from": from_number,
                "to": to_number,
                "content": {
                    "templateName": "wastefix_alert",
                    "templateData": {
                        "body": {
                            "placeholders": [message]
                        }
                    },
                    "language": "en"
                }
            }]
        }
        
        logger.info("=== REQUEST DETAILS ===")
        logger.info(f"Target URL: {base_url}/whatsapp/1/message/template")
        logger.info("Headers configured (excluding API key)")
        logger.info(f"From number: {from_number}")
        logger.info(f"To number: {to_number}")
        logger.info(f"Payload: {json.dumps(payload, indent=2)}")
        
        # Make the request
        conn.request("POST", "/whatsapp/1/message/template", 
                    body=json.dumps(payload),
                    headers=headers)
        
        # Get the response
        response = conn.getresponse()
        response_data = response.read().decode()
        
        logger.info("=== RESPONSE DETAILS ===")
        logger.info(f"Status Code: {response.status}")
        logger.info(f"Response Data: {response_data}")
        
        if response.status not in [200, 201]:
            logger.error(f"Error Response: {response_data}")
            return {"error": f"Request failed with status {response.status}", "details": response_data}
            
        logger.info("Message sent successfully!")
        return json.loads(response_data)
        
    except Exception as e:
        logger.error(f"Unexpected error sending notification: {str(e)}")
        return {"error": "Unexpected error", "details": str(e)}
    finally:
        if 'conn' in locals():
            conn.close()