// src/pages/QuizStatistics.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import '../CSS/QuizStatistics.css';

export default function QuizStatistics() {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />

      <div className="quiz-statistics">
        <h1 className="title">Quiz Statistics</h1>

        <div className="grid">
          {/* Top Students */}
          <div className="card">
            <h2 className="card-title">Top Students</h2>
            <div className="card-content">
              {[
                { name: "Benarmas",   group: "B05", mark: "15.25" },
                { name: "Amirouche",   group: "B04", mark: "14.75" },
                { name: "Souilah",     group: "B02", mark: "14.20" },
                { name: "Zerari",      group: "B01", mark: "13.90" },
                { name: "Bouzid",      group: "B03", mark: "13.50" },
                { name: "Benkahla",    group: "B06", mark: "13.00" },
              ].map((student, idx) => (
                <div key={idx} className="item">
                  <div className="item-text">{student.name}</div>
                  <div className="item-text">{student.group}</div>
                  <div className="item-percentage">{student.mark}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Bad Performance Questions */}
            <div className="card">
              <h2 className="card-title">Bad Performance Questions</h2>
              <div className="card-content">
                {[60, 68, 72].map((percentage, idx) => (
                  <div key={idx} className="item">
                    <div className="item-text">Question : ............ ?</div>
                    <div className="item-percentage">{percentage} %</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Statistics */}
            <div className="card">
              <h2 className="card-title">Important Statistics</h2>
              <div className="card-content">
                <div className="item">
                  <div className="item-text">Average :</div>
                  <div className="item-percentage">12.78</div>
                </div>
                <div className="item">
                  <div className="item-text">Completion rate :</div>
                  <div className="item-percentage">68 %</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
