import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/GeneralStatistics.css';

const API = import.meta.env.VITE_API_URL;

export default function GeneralStatistics() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState({
    quizzes: true,
    groups: true
  });
  const [error, setError] = useState({
    quizzes: null,
    groups: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);
        if (userData.role !== 'teacher') {
          setError({
            quizzes: 'Access denied: Teacher privileges required',
            groups: 'Access denied: Teacher privileges required'
          });
          return;
        }

        const token = userData.token;
        console.log('Using token:', token);

        // Fetch Groups
        const groupResponse = await fetch(`${API}/api/Quiz/groups/`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          }
        });

        if (!groupResponse.ok) {
          throw new Error(`Groups access denied: ${groupResponse.status}`);
        }

        const groupData = await groupResponse.json();
        setGroups(groupData);

        // Fetch Quizzes
        const quizResponse = await fetch(`${API}/api/Quiz/quizzes/`, {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        
        if (!quizResponse.ok) {
          throw new Error(`Quiz access denied: ${quizResponse.status}`);
        }

        const quizData = await quizResponse.json();
        setQuizzes(quizData);

      } catch (err) {
        console.error("Authentication error:", err);
        setError({
          quizzes: err.message,
          groups: err.message
        });
      } finally {
        setLoading({
          quizzes: false,
          groups: false
        });
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="general-statistics">
      <h1 className="title">General Statistics</h1>

      <div className="grid">
        {/* Groups Card */}
        <div className="card">
          <h2 className="card-title">Student Groups</h2>
          <div className="card-content">
            {loading.groups ? (
              <div className="loading">Loading groups...</div>
            ) : error.groups ? (
              <div className="error">{error.groups}</div>
            ) : groups.length === 0 ? (
              <div className="no-data">No groups available</div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="item">
                  <div className="item-info">
                    <div className="item-text">
                      <strong>Group: {group.name}</strong>
                    </div>
                    <div className="item-text">
                      Number of students: {group.students?.length || 0}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quizzes Card */}
        <div className="card">
          <h2 className="card-title">Quiz Results</h2>
          <div className="card-content">
            {loading.quizzes ? (
              <div className="loading">Loading quizzes...</div>
            ) : error.quizzes ? (
              <div className="error">{error.quizzes}</div>
            ) : quizzes.length === 0 ? (
              <div className="no-data">No quizzes available</div>
            ) : (
              quizzes.map((quiz) => (
                <div key={quiz.id} className="item">
                  <div className="item-info">
                    <div className="item-text">
                      <strong>{quiz.title}</strong>
                    </div>
                    <div className="item-text"> 
                        Assigned to: {
                          quiz.assigned_groups?.length > 0
                            ? quiz.assigned_groups
                                .map(groupId => {
                                  const group = groups.find(g => g.id === groupId);
                                  return group ? ` ${group.name}` : ` ${groupId}`;
                                })
                                .join(', ')
                            : 'No groups'
                        }
                      </div>
                  </div>
                  <button 
                    className="item-button"
                    onClick={() => navigate(`/quiz-statistics/${quiz.id}`)}
                  >
                    View Results
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}