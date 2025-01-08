# WasteFix

WasteFix is a robust waste management system designed to monitor and manage bin statuses using IoT simulations. This project integrates a Flask-based backend with a modern React frontend to provide a seamless and efficient solution for waste tracking and management.

## 🚀 Features

- **IoT Simulation Integration**: Tracks bin statuses in real-time.
- **API-Driven Architecture**: Backend API for bin updates and frontend data visualization.
- **Modern Frontend**: Built with React, TypeScript, Tailwind CSS, and Shadcn-UI for a dynamic and responsive UI.
- **Real-Time Updates**: Dashboard reflects the latest bin statuses and allows for management.
- **Database-Driven Design**: Pre-initialized bins align with IoT simulations for accuracy.

## 🛠️ Tech Stack

### Backend
- **Python**
- **Flask**
- **SQLAlchemy**

### Frontend
- **Vite**
- **TypeScript**
- **React**
- **Shadcn-UI**
- **Tailwind CSS**

### Others
- **IoT Simulation Tools**
- **REST APIs**

## 📂 Project Structure

```plaintext
wastefix/
├── backend/
│   ├── app.py                # Main Flask application
│   ├── models.py             # Database models
│   ├── routes/               # Flask routes
│   │   ├── bins.py           # Bin-related API routes
│   ├── templates/            # Flask templates (if any)
│   ├── static/               # Static files for Flask
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # React pages
│   │   ├── styles/           # Tailwind CSS styles
│   │   ├── App.tsx           # Main application entry point
│   │   ├── index.tsx         # React DOM entry
├── README.md                 # Project documentation
├── package.json              # Frontend dependencies
├── requirements.txt          # Backend dependencies

