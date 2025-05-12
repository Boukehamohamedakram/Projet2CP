#!/bin/bash

# Step 1: Navigate to the backend directory where manage.py is located
cd "$(dirname "$0")/../Projet2CP/back end/BackQuiz"

# Step 2: Create and activate the virtual environment
python3 -m venv venv
source venv/bin/activate

# Step 3: Install backend dependencies from the requirements.txt file
pip install --upgrade pip
pip install -r "$(dirname "$0")/../Projet2CP/back end/requirements.txt"

# Step 4: Run Django database migrations
python manage.py migrate

# Step 5: Run the Django development server
python manage.py runserver 0.0.0.0:8000
