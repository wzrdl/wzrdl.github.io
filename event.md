# 🌎 Event-Everywhere

A modern web application for discovering and sharing local events.

## 🌟 Features

- 📍 Map-based event browsing and search
- 🎯 Real-time event publishing and updates
- 💬 Event comments and interactions
- 👥 User account management
- ❤️ Event bookmarking system

## 🛠 Tech Stack

### Frontend
- Vue.js
- Element UI
- Interactive Maps Integration

### Backend
- FastAPI
- Python 3.10+
- MySQL 8.0+

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- Python 3.10 or higher
- MySQL 8.0 or higher

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ky1eYing/Event-Everywhere.git
```

```bash
cd Event-Everywhere
```


2. Backend Setup
```bash
cd backend
```
```bash
pip install -r requirements.txt
```
# Configure MySQL
1. open terminal and input
```bash
mysql -u root -p
```
```bash
CREATE DATABASE event_everywhere;
```
```bash
exit
```
2. Import database
```bash
mysql -u root -p event_everywhere < path/to/Event-Everywhere/event_everywhere.sql
```

3. Create `personal_config.py` in the backend directory:
```python
DATABASE_URL = "mysql+pymysql://root:your_password@localhost:3306/event_everywhere?charset=utf8mb4"
```

## Start backend server
```bash
python main.py
```

## Frontend Setup
```bash
cd frontend
```
```bash
npm install
```
## Start frontend server
```bash
npm run serve 
```
## Then click http://localhost:8080 to use the project

## 📚 Documentation

### API Documentation
- Backend API: http://localhost:8000/docs (available after starting backend server)
- Frontend API: http://localhost:8080 (default development server)


### Frontend Configuration
See [Vue CLI Configuration Reference](https://cli.vuejs.org/config/) for customization options.

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact
For any queries or support, please open an issue in the GitHub repository.