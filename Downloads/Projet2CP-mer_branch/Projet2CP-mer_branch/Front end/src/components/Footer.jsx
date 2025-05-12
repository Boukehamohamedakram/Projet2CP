import React from 'react';
import './Footer.css';

// assets—make sure these live under src/assets/
import logo from '../assets/vect.png';           // your QuizPI logo
import raspberry from '../assets/raspberry.png';   // the Pi icon on the right
import phoneIcon from '../assets/phone.png';       // telephone icon
import emailIcon from '../assets/email.png';       // envelope icon

export default function Footer() {
  return (
    <footer className="quizpi-footer">
      <div className="quizpi-footer__container">
        {/* Left: logo + brand */}
        <div className="quizpi-footer__left">
          <img src={logo} alt="QuizPI Logo" className="quizpi-footer__logo" />
          <span className="quizpi-footer__brand">QuizPI</span>
        </div>

        {/* Divider */}
        <hr className="quizpi-footer__divider" />

        {/* Center: contact info */}
        <div className="quizpi-footer__center">
          <h3 className="quizpi-footer__title">Reach us</h3>
          <div className="quizpi-footer__contacts">
            <div className="quizpi-footer__item">
              <img src={phoneIcon} alt="Phone" />
              <span>+213732529352</span>
            </div>
            <div className="quizpi-footer__item">
              <img src={emailIcon} alt="Email" />
              <span>support@esi.dz</span>
            </div>
          </div>
        </div>

        {/* Right: Raspberry icon */}
        <div className="quizpi-footer__right">
          <img src={raspberry} alt="Raspberry Pi Icon" />
        </div>
      </div>
    </footer>
  );
}
