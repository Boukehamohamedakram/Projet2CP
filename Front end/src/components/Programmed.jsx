import React, { useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './Programmed.css';

import fxIcon      from '../assets/fx-icon.png';
import searchIcon  from '../assets/search-icon.png';

export default function Programmed() {
  const userName = localStorage.getItem('userName') || 'user_name';

  const [quizzes] = useState([
    { id:1, title:'Saturday night Quiz', category:'General Knowledge', date:'29/11/2024' },
    { id:2, title:'History Challenge',     category:'History',           date:'05/12/2024' },
    { id:3, title:'Science Pop Quiz',      category:'Science',           date:'12/12/2024' },
    { id:4, title:'Math Marathon',         category:'Mathematics',       date:'19/12/2024' },
    // …add more as needed
  ]);

  return (
    <>
      <NavBar />

      <main className="programmed-main">
        <h1 className="programmed-title">Programmed Quizzes</h1>

        <div className="programmed-filter-search">
          <img
            src={searchIcon}
            alt="Search"
            className="ps-icon"
          />

          <button className="ps-filter">
            Filter <span className="ps-arrow">▾</span>
          </button>

          <input
            type="text"
            placeholder="Search"
            className="ps-input"
          />
        </div>

        <div className="programmed-list">
          {quizzes.map(q => (
            <div key={q.id} className="programmed-row">
              <div className="programmed-card">
                <img src={fxIcon} alt="" className="card-icon" />
                <span className="card-title">{q.title}</span>
                <span className="card-category">{q.category}</span>
                <span className="card-date">{q.date}</span>
                <button className="card-delete">Delete</button>
                <button className="card-modify">Modify</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
