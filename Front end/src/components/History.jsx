import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import "./History.css";

export default function History() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadQuizzes() {
      setLoading(true);
      try {
        // 1) Get your saved JWT
        const token = localStorage.getItem("token");
        
        // Check if token exists
        if (!token) {
          console.log("No token found, redirecting to login");
          navigate("/login");
          return;
        }

        // 2) Read your Vite env var
        const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
        
        console.log("Attempting to fetch quizzes with token:", token.substring(0, 15) + "...");
        
        // 3) Fetch with Authorization header
        const res = await fetch(`${API}/api/Quiz/quizzes/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (res.status === 401) {
          console.log("Token expired or invalid, redirecting to login");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        console.log("Quizzes fetched successfully:", data.length);
        
        // 4) Map the data into the fields you want
        setQuizzes(
          data.map((q) => ({
            id: q.id,
            title: q.title,
            category: q.category,
            isActive: q.is_active,
            questions: q.questions.length,
            maxAttempts: q.max_attempts,
            timeLimit: q.time_limit,
          }))
        );
      } catch (err) {
        console.error("Error loading quizzes:", err);
        setError(err.message);
        
        // Check if error might be auth-related
        if (err.message.includes("401")) {
          localStorage.removeItem("token"); // Clear potentially invalid token
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadQuizzes();
  }, [navigate]);

  if (loading) return <div className="history-loading">Loading quizzes…</div>;
  if (error) return <div className="history-error">Error: {error}</div>;
  if (!quizzes.length)
    return <div className="history-empty">No quizzes found.</div>;

  return (
    <>
      <NavBar />
      <main className="history-main">
        <h1 className="history-title">Quiz History</h1>
        <ul className="history-list">
          {quizzes.map((q) => (
            <li key={q.id} className="history-card">
              <h2 className="history-title-text">{q.title}</h2>
              <p>Category: {q.category}</p>
              <p>Status: {q.isActive ? "Active" : "Closed"}</p>
              <p>Questions: {q.questions}</p>
              <p>Max Attempts: {q.maxAttempts}</p>
              <p>Time Limit: {q.timeLimit} min</p>
              <button
                className="history-action"
                onClick={() => navigate(`/quiz/${q.id}/detail`)}
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}