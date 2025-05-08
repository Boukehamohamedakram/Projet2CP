# QuizPi - Embedded Quiz System

QuizPi is an embedded quiz system designed to facilitate real-time assessments in classrooms without internet connectivity using a Raspberry Pi as a local server and Wi-Fi access point

## Table of Contents

* [Features]
* [Technologies Used]
* [System Architecture]
* [Getting Started]
    * [Prerequisites]
    * [Installation]
    * [Configuration]
* [Usage]
    * [Teacher Web Application]
    * [Student Mobile Application]


## Features

* **Raspberry Pi Server:** Uses a Raspberry Pi as a local Wi-Fi access point and server to host the system.
* **Teacher Web Application:** Allows teachers to create, manage, and analyze quizzes.
* **Student Mobile Application:** Enables students to take quizzes and receive instant feedback.
* **Variety of Question Types:** Supports multiple choice, true/false, and short answer questions.
* **Real-time Monitoring:** Provides teachers with live updates on student progress and results.
* **User-friendly Interfaces:** Intuitive design for both teachers and students.
* **Secure Local Storage:** Quizzes and results are stored securely on the Raspberry Pi.
* **Offline Capability:** Operates entirely within a local network, eliminating the need for internet access.
* **Real-time Assessment:** Enables instant feedback and evaluation during class sessions.

  
## Technologies Used

* **Backend:** Django (Python framework)
* **Database:** SQLite
* **Backend API:** Django REST Framework (DRF) 
* **Frontend (Teacher Web App):** React, Vite, Tailwind CSS 
* **Frontend (Student Mobile App):** Flutter
* **Raspberry Pi Configuration:** Hostapd, DNSmask, Nginx, UFW

## System Architecture

The QuizPi system comprises three main components:

1.  **Raspberry Pi Server:** Acts as a local Wi-Fi access point and hosts the backend and teacher web application.
2.  **Teacher Web Application:** A web-based interface for teachers to manage quizzes.
3.  **Student Mobile Application:** A mobile app for students to take quizzes.



### Installation

1.  Clone the repository:

2.  Set up the Raspberry Pi:
    * Follow the instructions in the project report to configure the Raspberry Pi as a Wi-Fi access point and server.
3.  Install the backend dependencies.
4.  Set up the database.
5.  Install the teacher web application dependencies.
6.  Install the student mobile application dependencies.

### Configuration

* **Backend:**
    * Configure the database settings in `backend/settings.py`.
    * Set up any environment variables needed for the Django application.
* **Raspberry Pi:**
    * Configure the Wi-Fi settings using `hostapd` and `dnsmasq`.
    * Set up Nginx to serve the web applications and reverse proxy the backend. 
* **Web Application:**
    * Configure the API endpoint in the React application to point to the Raspberry Pi's IP address.
* **Mobile Application:**
    * Configure the API endpoint in the Flutter application.

## Usage

### Teacher Web Application Usage

1.  Access the teacher web application through a web browser connected to the Raspberry Pi's Wi-Fi network.
2.  Log in with the admin credentials.
3.  Create, edit, and manage quizzes.
4.  Monitor student progress and view results in real-time. 
5.  Manage student accounts. 
6.  View quiz statistics and generate reports.

### Student Mobile Application Usage

1.  Connect to the Raspberry Pi's Wi-Fi network.
2.  Open the student mobile application.
3.  Log in with the provided credentials.
4.  View available quizzes and select a quiz to take.
5.  Submit the quiz.
6.  View immediate feedback and results (if enabled).


## Acknowledgments

* We would like to thank our supervisors, Mr. A. SEHAD and Mr. A. MAHFOUDI, for their guidance and support. 
* We also thank our team members for their contributions and encouragement.
