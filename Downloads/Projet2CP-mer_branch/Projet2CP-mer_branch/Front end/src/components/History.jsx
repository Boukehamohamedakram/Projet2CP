import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./History.css";

const API = import.meta.env.VITE_API_URL;

const isPastDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return false;
  const quizDateTime = new Date(dateTimeStr);
  const now = new Date();
  return quizDateTime < now;
};

export default function History() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFinishedQuizzes = async () => {
      setLoading(true);
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);
        if (!userData.token) {
          throw new Error('Authentication token not found');
        }

        // Check if user is a teacher
        if (userData.role !== 'teacher') {
          throw new Error('Only teachers can view quiz history');
        }

        const response = await fetch(`${API}/api/Quiz/quizzes/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${userData.token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.status}`);
        }

        const data = await response.json();
        // Filter only finished quizzes (with past start_time)
        const finishedQuizzes = data.filter(quiz => 
          quiz.start_time && isPastDateTime(quiz.start_time)
        );
        setQuizzes(finishedQuizzes);
        setError(null);

      } catch (err) {
        console.error("Quiz history error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedQuizzes();
  }, [navigate]);

  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz => {
    const searchLower = searchTerm.toLowerCase();
    return (
      quiz.title?.toLowerCase().includes(searchLower) ||
      quiz.category?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="history-loading">Loading finished quizzes...</div>;
  if (error) return <div className="history-error">Error: {error}</div>;
  if (!quizzes.length) return <div className="history-empty">No finished quizzes found.</div>;

  return (
    <>
      <NavBar />
      <main className="history-main">
        <h1 className="history-title">History Quizzes</h1>
        <div className="history-search">
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
          />
        </div>
        <ul className="history-list">
          {filteredQuizzes.map((quiz) => (
            <li key={quiz.id} className="history-card">
              <div className="history-card-title">{quiz.title}</div>
              <span className="history-card-category">{quiz.category}</span>
              <span className="history-card-date">
                {new Date(quiz.start_time).toLocaleDateString()}
              </span>
              <span className="history-card-time">
                {new Date(quiz.start_time).toLocaleTimeString()}
              </span>
              <button className="history-view-results" onClick={() => navigate(`/quiz-statistics/${quiz.id}`)}>
                View Results
              </button>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}