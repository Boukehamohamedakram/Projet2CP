import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/GeneralStatistics.css';
import NavBar from '../../components/NavBar';  // Updated import path
import Footer from '../../components/Footer';
const API = import.meta.env.VITE_API_URL;

// Update the helper function
const isQuizOpened = (dateTimeStr) => {
  if (!dateTimeStr) return true; // Include quizzes with no dates
  const quizDateTime = new Date(dateTimeStr);
  const now = new Date();
  return quizDateTime < now; // Show if opening time has passed
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [quizData, setQuizData] = useState({ title: '', id: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);
        const token = userData.token;

        const groupResponse = await fetch(`${API}/api/Quiz/groups/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!groupResponse.ok) {
          throw new Error(`Groups access denied: ${groupResponse.status}`);
        }

        const groupData = await groupResponse.json();
        setGroups(groupData);

        const quizResponse = await fetch(`${API}/api/Quiz/quizzes/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
        });

        if (!quizResponse.ok) {
          throw new Error(`Quiz access denied: ${quizResponse.status}`);
        }

        const quizData = await quizResponse.json();
        setQuizzes(quizData);
      } catch (err) {
        setError({ quizzes: err.message, groups: err.message });
      } finally {
        setLoading({
          quizzes: false,
          groups: false
        });
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);

        const response = await fetch(`${API}/api/Quiz/quizzes/`, {
          headers: {
            "Authorization": `Token ${userData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz details");
        }

        const quizzes = await response.json();
        const quiz = quizzes.find(q => q.title === quizData.title);
        if (quiz) {
          setQuizData(prev => ({ ...prev, id: quiz.id }));
        }
      } catch (err) {
        console.error("Error fetching quiz details:", err);
      }
    };

    fetchQuizDetails();
  }, [quizData.title]);

  const getGroupCardClass = (groupsLength) => {
    if (groupsLength === 0) return 'card groups-card empty';
    if (groupsLength <= 3) return 'card groups-card few-items';
    return 'card groups-card many-items';
  };

  // Update the filtering and sorting logic
  const filteredQuizzes = quizzes
    .filter(quiz => {
      // Include quiz if it has no date or if opening time has passed
      const isOpen = !quiz.start_time || isQuizOpened(quiz.start_time);
      
      // Apply search filter if it exists
      if (searchTerm && isOpen) {
        const searchLower = searchTerm.toLowerCase();
        return (
          (quiz.title && quiz.title.toLowerCase().includes(searchLower)) ||
          (quiz.assigned_groups && quiz.assigned_groups.some(groupId => {
            const group = groups.find(g => g.id === groupId);
            return group && group.name.toLowerCase().includes(searchLower);
          }))
        );
      }
      return isOpen;
    })
    // Sort by date (most recently opened first, then no dates)
    .sort((a, b) => {
      // Put quizzes with no dates after those with dates
      if (!a.start_time) return 1;
      if (!b.start_time) return -1;
      // Sort by most recent first
      return new Date(b.start_time) - new Date(a.start_time);
    });

  return (
    <>
      <NavBar />
      <div className="general-statistics">
        <h1 className="title">General Statistics</h1>

        <div className="grid">
          {/* Groups Card */}
          <div className={getGroupCardClass(groups.length)}>
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
            
            {/* Add search input */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by quiz title or group..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="card-content">
              {loading.quizzes ? (
                <div className="loading">Loading quizzes...</div>
              ) : error.quizzes ? (
                <div className="error">{error.quizzes}</div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="no-data">
                  {searchTerm ? "No matching quizzes found" : "No quizzes available"}
                </div>
              ) : (
                filteredQuizzes.map((quiz) => (
                  <div key={quiz.id} className="item">
                    <div className="item-info">
                      <div className="item-text">
                        <strong>{quiz.title}</strong>
                      </div>
                      <div className="item-dates">
                        <span className="item-date">
                          {quiz.start_time ? quiz.start_time.split('T')[0] : 'No date'}
                        </span>
                        <span className="item-time">
                          {quiz.start_time ? 
                            new Date(quiz.start_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            }) 
                            : 'No time'
                          }
                        </span>
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
      <Footer />
    </>
  );
}