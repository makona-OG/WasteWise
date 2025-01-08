from flask import Flask
from flask_cors import CORS
from routes.bins import bins_bp
from routes.reports import reports_bp
from routes.auth import auth_bp
from routes.collections import collections_bp
from models import db, User, Bin
from datetime import datetime
import random
import os

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///wastefix.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Initialize extensions
db.init_app(app)

def init_demo_data():
    with app.app_context():
        # Check if admin user exists
        if not User.query.filter_by(email='admin@wastefix.com').first():
            admin = User(
                username='admin',
                email='admin@wastefix.com',
                is_admin=True
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()

        # Check if bins already exist
        if Bin.query.first() is None:
            # Base coordinates for Nairobi (approximate center)
            base_lat = -1.2921
            base_lng = 36.8219
            
            # List of possible locations
            locations = [
                "Westlands Mall", "Kilimani Plaza", "Yaya Centre", "Garden City",
                "The Junction", "Eastleigh Market", "Ngong Road Plaza", "CBD Area",
                "Upperhill Complex", "Karen Hub", "Lavington Mall", "Gigiri Complex",
                "Valley Arcade", "Diamond Plaza", "Sarit Centre", "Village Market",
                "Capital Centre", "Galleria Mall", "Two Rivers Mall", "Thika Road Mall"
            ]
            
            # Create 20 bins with random coordinates around Nairobi
            for i, location in enumerate(locations):
                # Generate random offset (roughly within 10km)
                lat_offset = random.uniform(-0.05, 0.05)
                lng_offset = random.uniform(-0.05, 0.05)
                
                new_bin = Bin(
                    location=location,
                    status=random.choice(['Empty', 'Half-full', 'Overflowing']),
                    last_updated=datetime.utcnow(),
                    latitude=base_lat + lat_offset,
                    longitude=base_lng + lng_offset,
                    owner_id=1  # Assign to admin user
                )
                db.session.add(new_bin)
            
            db.session.commit()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(bins_bp, url_prefix='/api/bins')
app.register_blueprint(reports_bp, url_prefix='/api/reports')
app.register_blueprint(collections_bp, url_prefix='/api/collections')

# Create database tables and initialize demo data
with app.app_context():
    db.create_all()
    init_demo_data()

if __name__ == '__main__':
    app.run(debug=True)