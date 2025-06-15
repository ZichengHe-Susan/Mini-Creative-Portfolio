# Mini Creative Portfolio & Search App

A full-stack web application that allows creatives to create public portfolios and enables users to search for them based on creative fields and keywords.

## Tech Stack

- **Backend:** Django (Python) with Django REST Framework
- **Frontend:** React.js with React Router
- **Database:** PostgreSQL
- **Storage:** Local file storage for profile pictures
- **Styling:** CSS 

## Project Structure

```
creative-portfolio/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── creative_portfolio/          
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── creators/                    
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   └── media/
│       └── profile_pics/
├── frontend/
│   ├── package.json
│   ├── src/
│   │   ├── components/             
│   │   ├── pages/                
│   │   ├── services/              
│   │   ├── App.js
│   │   └── index.js
│   └── public/
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL
- Git

### Backend Setup (Django)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory:
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=creative_portfolio
DB_USER=your_db_user_name
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
```

5. Set up PostgreSQL database:
```bash
psql -U postgres -d DB_USER
```
loging with your DB_PASSWORD, and run in postgres shell
```bash
CREATE DATABASE creative_portfolio;
```
command/ctrl + D to exit

6. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

7. Populate initial creative fields (one-time):
```bash
python manage.py populate_fields
```

8. Start the Django development server:
```bash
python manage.py runserver
```

### Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

## API Endpoints

### Creators
- `GET /api/creators/` - List all creators with optional search/filter
- `POST /api/creators/` - Create a new creator
- `GET /api/creators/{id}/` - Get creator details
- `PUT /api/creators/{id}/` - Update creator
- `DELETE /api/creators/{id}/` - Delete creator
- `GET /api/search/` - Advanced search for creators

### Creative Fields
- `GET /api/creative-fields/` - List all creative fields
- `POST /api/creative-fields/` - Create a new creative field
- `GET /api/creative-fields/{id}/` - Get creative field details
