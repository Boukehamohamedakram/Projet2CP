import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './Home.css';

// assets — make sure you’ve placed these under src/assets/
import illustration from '../assets/illustration.png';
import createIcon    from '../assets/create-icon.png';
import scheduledIcon from '../assets/scheduled-icon.png';
import historyIcon   from '../assets/history-icon.png';


export default function Home() {
  const userName = localStorage.getItem('userName') || 'user_name';

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
          <h1 className="home-main__name">{userName}</h1>
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
          <a href="/create" className="home-card">
            <img src={createIcon} alt="Create new quiz" />
            <span>Create New Quiz</span>
          </a>
          <a href="/programmed" className="home-card">
            <img src={scheduledIcon} alt="Scheduled quizzes" />
            <span>Programmed Quizzes</span>
          </a>
          <a href="/history" className="home-card">
            <img src={historyIcon} alt="Quiz history" />
            <span>History</span>
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}
