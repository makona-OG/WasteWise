import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def send_whatsapp_notification(message: str):
    INFOBIP_API_KEY = os.getenv('INFOBIP_API_KEY')
    INFOBIP_BASE_URL = os.getenv('INFOBIP_BASE_URL')
    WHATSAPP_NUMBER = "0712961615"  # Fixed number as requested
    
    if not INFOBIP_API_KEY or not INFOBIP_BASE_URL:
        print("InfoBip credentials not configured")
        return
    
    url = f"{INFOBIP_BASE_URL}/whatsapp/1/message/text"
    
    headers = {
        "Authorization": f"App {INFOBIP_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    payload = {
        "messages": [{
            "from": os.getenv('WHATSAPP_BUSINESS_NUMBER', '447860099299'),
            "to": WHATSAPP_NUMBER,
            "content": {
                "text": message
            }
        }]
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending WhatsApp notification: {e}")
        return None