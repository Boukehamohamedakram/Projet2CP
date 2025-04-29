import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './History.css';

import fxIcon      from '../assets/fx-icon.png';
import searchIcon  from '../assets/search-icon.png';



export default function History() {
  const userName = localStorage.getItem('userName') || 'user_name';
  const [historyItems] = useState([
    { id:1, title:'Saturday night Quiz', category:'General Knowledge', date:'29/11/2024' },
    { id:2, title:'Science Pop Quiz',    category:'Science',           date:'20/12/2024' },
    { id:3, title:'Math Marathon',        category:'Mathematics',       date:'15/01/2025' },
    // …etc.
  ]);


  return (
    <>
      <NavBar />

      <main className="history-main">
        <h1 className="history-title">History</h1>

        <div className="history-filter-search">
          <img
            src={searchIcon}
            alt="Search"
            className="history-filter-search__icon"
          />

          <button className="history-filter-search__filter">
            Filter <span className="history-filter-search__arrow">▾</span>
          </button>

          <input
            type="text"
            placeholder="Search"
            className="history-filter-search__input"
          />
        </div>

        <div className="history-list">
          {historyItems.map(item => (
            <div key={item.id} className="history-row">
              <div className="history-card">
                <img src={fxIcon} alt="" className="history-icon" />
                <span className="history-title-text">{item.title}</span>
                <span className="history-category">{item.category}</span>
                <span className="history-date">{item.date}</span>
                <button className="history-action">View Statistics</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
