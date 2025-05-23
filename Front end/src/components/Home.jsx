import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add this import
import NavBar from './NavBar';
import Footer from './Footer';
import './Home.css';

// assets — make sure you’ve placed these under src/assets/
import illustration from '../assets/illustration.png';
import createIcon    from '../assets/create-icon.png';
import scheduledIcon from '../assets/scheduled-icon.png';
import historyIcon   from '../assets/history-icon.png';


const API = import.meta.env.VITE_API_URL;
export default function Home() {
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        // Debug logs
        console.log('Token:', token);
        console.log('UserId:', userId);
        console.log('UserId from localStorage:', userId);
        
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch(`${API}/api/users/users/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const users = await response.json();
          console.log('All users:', users);
          console.log('Users array:', users);
          console.log('Parsed UserId:', parseInt(userId, 10));
          
          const currentUser = users.find(user => {
            const parsedUserId = parseInt(userId, 10);
            console.log('Comparing:', user.id, parsedUserId);
            return user.id === parsedUserId;
          });
          
          console.log('Found user:', currentUser);
          
          if (currentUser) {
            setUserName(currentUser.username);
            localStorage.setItem('userId', currentUser.id);
          } else {
            console.log('No matching user found');
            setUserName('User');
          }
        } else {
          console.error('Failed to fetch user data:', response.status);
          setUserName('User');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserName('User');
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <NavBar />

      <main className="home-main">
        {/* Left: illustration + text */}
        <section className="home-main__greeting">
          <div className="home-main__heading">
            <span className="home-main__sun">☀️</span>
            <span className="home-main__good-morning">GOOD MORNING</span>
          </div>
          <h1 className="home-main__name">Pr.{userName}</h1>
          <p className="home-main__welcome">
            Welcome to your Quiz Dashboard!<br/>
            Create, manage, and track your quizzes with ease. 
            Stay organized and keep your quizzes up to date!
          </p>
        </section>

        {/* Illustration */}
        <img
          className="home-main__illustration"
          src={illustration}
          alt="Hand writing on paper"
        />

        {/* Right: action cards */}
        <section className="home-main__cards">
          <Link to="/scheduled" className="home-card">
            <img src={createIcon} alt="Create new quiz" />
            <span>Create New Quiz</span>
          </Link>
          <Link to="/programmed" className="home-card">
            <img src={scheduledIcon} alt="Programmed quizzes" />
            <span>Programmed Quizzes</span>
          </Link>
          <Link to="/history" className="home-card">
            <img src={historyIcon} alt="Quiz history" />
            <span>History</span>
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
}
