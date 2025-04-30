import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './Scheduled.css';

// assets (place these in src/assets/)
import fxIcon from '../assets/fx-icon.png';



export default function Scheduled() {
  const userName = localStorage.getItem('userName') || 'user_name';
  const [quizzes] = useState([
    {
      id: 1,
      created: '31/10/2024',
      title: 'Saturday night Quiz',
      category: 'General Knowledge',
      scheduledFor: '29/11/2024'
    },
    {
      id: 2,
      created: '31/10/2024',
      title: 'QUIZ',
      category: 'General Knowledge',
      scheduledFor: '29/11/2024'
    },
    {
      id: 3,
      created: '31/10/2024',
      title: 'QUIZ',
      category: 'General Knowledge',
      scheduledFor: '29/11/2024'
    },
    {
      id: 4,
      created: '31/10/2024',
      title: 'Saturday night Quiz',
      category: 'General Knowledge',
      scheduledFor: '29/11/2024'
    },
  ]);
 
  return (
    <>
      <NavBar />

      <main className="scheduled-main">
        <section className="scheduled-header">
          <div className="scheduled-greeting">
            <span className="sun">☀️</span>
            <span className="good-morning">GOOD MORNING</span>
          </div>
          <h1 className="user-name">{userName}</h1>
        </section>

        <button className="scheduled-new-btn">
          Create a new quiz
        </button>

        <div className="scheduled-list">
          {quizzes.map(q => (
            <div key={q.id} className="scheduled-row">
              <div className="created-date">{q.created}</div>

              <div className="scheduled-card">
                <img src={fxIcon} alt="" className="card-icon" />
                <span className="card-title">{q.title}</span>
                <span className="card-category">{q.category}</span>
                <span className="card-date">{q.scheduledFor}</span>
                <button className="card-action">Continue Creating</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
