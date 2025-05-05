import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import './Programmed.css';
import fxIcon from '../assets/fx-icon.png';

const API = import.meta.env.VITE_API_URL;

// Add valid categories constant at the top of the file
const VALID_CATEGORIES = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'literature', label: 'Literature' }
];

const isPastDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return false; // Changed from true to false to display quizzes with no dates
  const quizDateTime = new Date(dateTimeStr);
  const now = new Date();
  return quizDateTime < now;
};

export default function Programmed() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuiz, setEditingQuiz] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);
        if (userData.role !== 'teacher') {
          setError('Access denied: Teacher privileges required');
          return;
        }

        const token = userData.token;
        
        const response = await fetch(`${API}/api/Quiz/quizzes/`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Quiz access denied: ${response.status}`);
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [navigate]);

  const handleDelete = async (quizId) => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.token;

      const response = await fetch(`${API}/api/Quiz/quizzes/${quizId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      // Remove quiz from state
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete quiz');
    }
  };

  const handleEdit = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleUpdate = async (quizId, updatedData) => {
    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(userDataString);
      const token = userData.token;

      // Validate category
      if (!VALID_CATEGORIES.some(cat => cat.value === updatedData.category?.toLowerCase())) {
        setError(`Invalid category. Please choose from: ${VALID_CATEGORIES.map(cat => cat.label).join(', ')}`);
        return;
      }

      // Format the start_time properly
      let formattedStartTime = null;
      if (updatedData.start_time) {
        // Get date and time parts
        const datePart = updatedData.start_time.split('T')[0];
        const timePart = updatedData.start_time.split('T')[1]?.split('.')[0] || '00:00:00';
        
        // Create a date object in local time
        const localDate = new Date(`${datePart}T${timePart}`);
        // Convert to UTC
        formattedStartTime = new Date(
          localDate.getTime() - localDate.getTimezoneOffset() * 60000
        ).toISOString();
      }

      // Create the formatted data object with required fields
      const formattedData = {
        title: updatedData.title || '',
        category: updatedData.category.toLowerCase(),
        start_time: formattedStartTime,
        description: updatedData.description || 'No description',
        time_limit: updatedData.time_limit || 30,
        teacher: userData.id,
        is_published: updatedData.is_published ?? false,
        assigned_groups: updatedData.assigned_groups || [],
        max_attempts: updatedData.max_attempts || 2,
        is_active: updatedData.is_active ?? true
      };

      console.log('Sending formatted data:', formattedData); // Debug log

      const response = await fetch(`${API}/api/Quiz/quizzes/${quizId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        const errorMessage = errorData.start_time 
          ? `Start time error: ${errorData.start_time[0]}`
          : errorData.category
          ? `Category error: ${errorData.category[0]}`
          : 'Failed to update quiz';
        throw new Error(errorMessage);
      }

      const updatedQuiz = await response.json();
      setQuizzes(prevQuizzes => prevQuizzes.map(q => q.id === quizId ? updatedQuiz : q));
      setEditingQuiz(null);
      setError(null);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update quiz');
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    // Filter out past quizzes, but keep quizzes with no dates
    if (quiz.start_time && isPastDateTime(quiz.start_time)) {
      return false;
    }
    
    // Then apply search filter
    const searchLower = searchTerm.toLowerCase();
    return (
      (quiz.title && quiz.title.toLowerCase().includes(searchLower)) ||
      (quiz.category && quiz.category.toLowerCase().includes(searchLower)) ||
      (quiz.start_time && quiz.start_time.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      <NavBar />
      <main className="programmed-main">
        <h1 className="programmed-title">Programmed Quizzes</h1>

        <div className="programmed-filter-search">
          <input
            type="text"
            placeholder="Search by title, category or date..."
            className="ps-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="programmed-list">
          {loading ? (
            <div className="loading">Loading quizzes...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="no-data">
              {searchTerm ? "No matching quizzes found" : "No quizzes available"}
            </div>
          ) : (
            filteredQuizzes.map(q => (
              <div key={q.id} className="programmed-row">
                <div className="programmed-card">
                  <img src={fxIcon} alt="" className="card-icon" />
                  {editingQuiz === q.id ? (
                    <>
                      <input
                        type="text" // Add input type
                        className="card-title"
                        defaultValue={q.title || ''} // Add fallback empty string
                        placeholder="Enter title" // Add placeholder
                        onChange={(e) => {
                          const updated = { ...q, title: e.target.value };
                          setQuizzes(quizzes.map(quiz => quiz.id === q.id ? updated : quiz));
                        }}
                      />
                      <select
                        className="card-category"
                        value={q.category || ''}
                        onChange={(e) => {
                          const updated = { ...q, category: e.target.value };
                          setQuizzes(quizzes.map(quiz => quiz.id === q.id ? updated : quiz));
                        }}
                      >
                        <option value="">Select category</option>
                        {VALID_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="date"
                        className="card-date"
                        defaultValue={q.start_time ? q.start_time.split('T')[0] : ''}
                        onChange={(e) => {
                          const updated = { ...q, start_time: e.target.value };
                          setQuizzes(quizzes.map(quiz => quiz.id === q.id ? updated : quiz));
                        }}
                      />
                      <input
                        type="time"
                        className="card-time"
                        defaultValue={q.start_time ? 
                          new Date(q.start_time).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }) : ''
                        }
                        onChange={(e) => {
                          const [date] = q.start_time ? q.start_time.split('T') : [new Date().toISOString().split('T')[0]];
                          // Convert local time to UTC
                          const localTime = new Date(`${date}T${e.target.value}`);
                          const utcTime = new Date(localTime.getTime() - localTime.getTimezoneOffset() * 60000);
                          const updated = { ...q, start_time: utcTime.toISOString() };
                          setQuizzes(quizzes.map(quiz => quiz.id === q.id ? updated : quiz));
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div className="card-title">
                        {q.title || "Untitled Quiz"} {/* Add fallback text */}
                      </div>
                      <span className="card-category">
                        {VALID_CATEGORIES.find(cat => cat.value === q.category)?.label || "No category"}
                      </span>
                      <span className="card-date">
                        {q.start_time ? q.start_time.split('T')[0] : 'No date'}
                      </span>
                      <span className="card-time">
                        {q.start_time ? 
                          new Date(q.start_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: 'UTC' // Explicitly use UTC when displaying
                          }) 
                          : 'No time'
                        }
                      </span>
                    </>
                  )}
                  <button 
                    className="card-modify"
                    onClick={() => {
                      if (editingQuiz === q.id) {
                        handleUpdate(q.id, q);
                        setEditingQuiz(null);
                      } else {
                        setEditingQuiz(q.id);
                      }
                    }}
                  >
                    {editingQuiz === q.id ? 'confirm' : 'modify'}
                  </button>
                  <button 
                    className="card-delete"
                    onClick={() => {
                      if (editingQuiz === q.id) {
                        setEditingQuiz(null);
                        // Reset the quiz data
                        fetchQuizzes();
                      } else {
                        handleDelete(q.id);
                      }
                    }}
                  >
                    {editingQuiz === q.id ? 'cancel' : 'delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
