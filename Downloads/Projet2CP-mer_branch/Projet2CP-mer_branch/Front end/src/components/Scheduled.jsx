import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import './Scheduled.css';
import fxIcon from '../assets/fx-icon.png';

const API = import.meta.env.VITE_API_URL;

export default function Scheduled() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchScheduledQuizzes = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);
        const token = userData.token;

        const response = await fetch(`${API}/api/Quiz/quizzes/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scheduled quizzes');
        }

        const data = await response.json();
        // Filter for quizzes that haven't started yet
        const scheduledQuizzes = data.filter(quiz => 
          quiz.start_time && new Date(quiz.start_time) > new Date()
        );
        setQuizzes(scheduledQuizzes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledQuizzes();
  }, [navigate]);

  const handleCreateNew = () => {
    navigate('/create-quiz');
  };

  const handleContinueEditing = (quizId) => {
    navigate(`/quiz-editor/${quizId}`);
  };

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quiz.title?.toLowerCase().includes(searchLower) ||
      quiz.category?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <NavBar />
      <main className="scheduled-main">
        <h1 className="scheduled-title">Scheduled Quizzes</h1>

        <div className="scheduled-search">
          <input
            type="text"
            placeholder="Search scheduled quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="scheduled-search-input"
          />
        </div>

        <button 
          className="create-quiz-btn"
          onClick={handleCreateNew}
        >
          Create New Quiz
        </button>

        {loading ? (
          <div className="scheduled-loading">Loading...</div>
        ) : error ? (
          <div className="scheduled-error">{error}</div>
        ) : (
          <div className="scheduled-list">
            {filteredQuizzes.length === 0 ? (
              <div className="scheduled-empty">
                <p>No scheduled quizzes found</p>
              </div>
            ) : (
              filteredQuizzes.map(quiz => (
                <div key={quiz.id} className="scheduled-row">
                  <div className="scheduled-card">
                    <img src={fxIcon} alt="" className="card-icon" />
                    <div className="card-title">{quiz.title || "Untitled Quiz"}</div>
                    <span className="card-category">{quiz.category || "No category"}</span>
                    <span className="card-date">
                      {quiz.start_time ? quiz.start_time.split('T')[0] : 'No date'}
                    </span>
                    <span className="card-time">
                      {quiz.start_time ? 
                        new Date(quiz.start_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          timeZone: 'UTC'
                        }) 
                        : 'No time'
                      }
                    </span>
                    <button 
                      className="card-preview"
                      onClick={() => navigate(`/quiz/${quiz.id}/quiz-details`)}
                    >
                      Preview
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}