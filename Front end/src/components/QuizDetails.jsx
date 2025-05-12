import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import './QuizDetails.css';

const API = import.meta.env.VITE_API_URL;

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.token) {
          navigate('/login');
          return;
        }

        // Fetch quiz details with questions included
        const quizResponse = await fetch(`${API}/api/Quiz/quizzes/${id}/`, {
          headers: {
            'Authorization': `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!quizResponse.ok) {
          throw new Error('Failed to fetch quiz details');
        }

        const quizDetails = await quizResponse.json();
        setQuizData(quizDetails);

      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, navigate]);

  if (loading) return <div className="loading">Loading quiz details...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <NavBar />
      <main className="quiz-details-main">
        <h1 className="quiz-details-title">{quizData?.title || 'Quiz Details'}</h1>
        
        <div className="quiz-info">
          <p><strong>Category:</strong> {quizData?.category}</p>
          <p><strong>Time Limit:</strong> {quizData?.time_limit} minutes</p>
          <p><strong>Max Attempts:</strong> {quizData?.max_attempts}</p>
          <p><strong>Start Time:</strong> {quizData?.start_time ? new Date(quizData.start_time).toLocaleString() : 'Not set'}</p>
          <p><strong>End Time:</strong> {quizData?.end_time ? new Date(quizData.end_time).toLocaleString() : 'Not set'}</p>
        </div>

        <div className="questions-list">
          <h2>Questions</h2>
          {quizData?.questions?.map((question, index) => (
            <div key={question.id} className="question-card">
              <h3>Question {index + 1}</h3>
              <p className="question-text">{question.text}</p>
              <p className="question-type">Type: {question.question_type}</p>
              <p className="question-points">Points: {question.points}</p>
              
              <div className="options-list">
                <h4>Options:</h4>
                {question.options.map((option) => (
                  <div key={option.id} className={`option ${option.is_correct ? 'correct' : ''}`}>
                    <span className="option-text">{option.text}</span>
                    {option.is_correct && <span className="correct-badge">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </main>
      <Footer />
    </>
  );
}