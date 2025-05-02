import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

import logo from '../assets/Vector.png';
import userAvatar from '../assets/Avatar.png';

export default function NavBar() {
  return (
    <nav className="quizpi-navbar">
      <Link to="/home" className="quizpi-navbar__logo">
        <img src={logo} alt="Logo" />
      </Link>

      <ul className="quizpi-navbar__links">
        <li><Link to="/home">HOME</Link></li>
        <li><Link to="/dashboard">DASHBOARD</Link></li>
        <li><Link to="/student">STUDENT</Link></li>
      </ul>

      <Link to="/parameters" className="quizpi-navbar__profile">
        <span className="quizpi-navbar__username">Settings</span>
        <img
          className="quizpi-navbar__avatar"
          src={userAvatar}
          alt="Settings avatar"
        />
      </Link>
    </nav>
  );
}
