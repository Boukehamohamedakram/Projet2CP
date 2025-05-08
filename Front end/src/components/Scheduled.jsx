import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import './Scheduled.css';

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
        
        <button className="create-quiz-btn" onClick={handleCreateNew}>
          Create New Quiz
        </button>

        <div className="scheduled-search">
          <input
            type="text"
            placeholder="Search scheduled quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="scheduled-search-input"
          />
        </div>

        {loading ? (
          <div className="scheduled-loading">Loading...</div>
        ) : error ? (
          <div className="scheduled-error">{error}</div>
        ) : (
          <div className="scheduled-list">
            {filteredQuizzes.length === 0 ? (
              <div className="no-data">
                <div className="no-data-text">
                  {searchTerm ? "No matching quizzes found" : "No scheduled quizzes available"}
                </div>
                
              </div>
            ) : (
              filteredQuizzes.map(quiz => (
                <div key={quiz.id} className="scheduled-card">
                  <div className="quiz-title">{quiz.title}</div>
                  
                  <span className="quiz-info">
                    <span className="quiz-category">{quiz.category}</span>
                  </span>
                  
                  <span className="quiz-info">
                    <span>Starts: {new Date(quiz.start_time).toLocaleString()}</span>
                  </span>
                  
                  <span className="quiz-info">
                    <span>Duration: {quiz.time_limit} min</span>
                    <span>Attempts: {quiz.max_attempts}</span>
                  </span>

                  <button 
                    className="continue-editing-btn"
                    onClick={() => handleContinueEditing(quiz.id)}
                  >
                    Continue Editing
                  </button>
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