import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../CSS/QuizStatistics.css";

function QuizStatistics() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quizData, setQuizData] = useState({
    total_students: 0,
    present_students: 0,
    average_score: 0,
    completion_rate: 0,
    top_students: [],
    hardest_question: {
      id: null,
      text: '',
      wrong_attempts: 0,
      total_attempts: 0
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchQuizStatistics = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.token) {
          navigate('/login');
          return;
        }

        // Fetch analytics data
        const analyticsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/Quiz/quizzes/${id}/analytics/`, {
          headers: {
            'Authorization': `Token ${userData.token}`
          }
        });

        if (!analyticsResponse.ok) {
          throw new Error('Failed to fetch quiz analytics');
        }

        const analyticsData = await analyticsResponse.json();
        console.log('Analytics Data:', analyticsData);

        // Fetch absent students data
        const absentResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/Quiz/quizzes/${id}/absent-students/`, {
          headers: {
            'Authorization': `Token ${userData.token}`
          }
        });

        if (!absentResponse.ok) {
          throw new Error('Failed to fetch absent students');
        }

        const absentData = await absentResponse.json();
        console.log('Absent Students Data:', absentData);

        // Update state with fetched data
        setQuizData({
          total_students: analyticsData.total_students || 0,
          submitted_count: analyticsData.submitted_count || 0,
          absent_students: absentData.absent_students || [],
          average_score: analyticsData.average_score || 0,
          completion_rate: analyticsData.completion_rate || 0,
          top_students: analyticsData.top_students || [],
          hardest_question: analyticsData.hardest_question || { id: null, text: '', wrong_attempts: 0, total_attempts: 0 }
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuizStatistics();
  }, [id, navigate]);

  useEffect(() => {
    console.log('Updated quizData:', quizData);
  }, [quizData]);

  // Calculate score distribution for pie chart
  const getScoreDistribution = () => {
    if (!Array.isArray(quizData.top_students) || quizData.top_students.length === 0) {
      return [];
    }
    
    const ranges = [
      { name: '0-20%', count: 0 },
      { name: '21-40%', count: 0 },
      { name: '41-60%', count: 0 },
      { name: '61-80%', count: 0 },
      { name: '81-100%', count: 0 }
    ];

    quizData.top_students.forEach(student => {
      const score = student.score;
      if (score <= 2) ranges[0].count++;
      else if (score <= 4) ranges[1].count++;
      else if (score <= 6) ranges[2].count++;
      else if (score <= 8) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error loading quiz statistics: {error}
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="quiz-statistics">
        <h1 className="quiz-statistics-title">{quizData.title || 'Quiz Statistics'}</h1>
        
        <div className="statistics-grid">
          {/* Overview Card */}
          <div className="statistics-card">
            <h2>Overview</h2>
            <div className="stat-row">
              <span>Total Students:</span>
              <span className="stat-value">{quizData.total_students || 0}</span>
            </div>
            <div className="stat-row">
              <span>Submitted:</span>
              <span className="stat-value">{quizData.submitted_count || 0}</span>
            </div>
            <div className="stat-row">
              <span>Absent Students:</span>
              <span className="stat-value">{quizData.absent_students?.length || 0}</span>
            </div>
            <div className="stat-row">
              <span>Average Score:</span>
              <span className="stat-value">
                {typeof quizData.average_score === 'number' ? quizData.average_score.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="stat-row">
              <span>Completion Rate:</span>
              <span className="stat-value">
                {typeof quizData.completion_rate === 'number' ? quizData.completion_rate.toFixed(2) : 0}%
              </span>
            </div>
          </div>

          {/* Score Distribution Chart */}
          <div className="statistics-card">
            <h2>Score Distribution</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={getScoreDistribution()}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {getScoreDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bad Performance Questions Card */}
          <div className="statistics-card">
            <h2>Questions Needing Attention</h2>
            {quizData.hardest_question && (
              <div className="question-row">
                <span>Hardest Question:</span>
                <span>{quizData.hardest_question.text}</span>
                <span className="failure-rate">
                  {quizData.hardest_question.total_attempts > 0 
                    ? `${Math.round((quizData.hardest_question.wrong_attempts / quizData.hardest_question.total_attempts) * 100)}% failure rate`
                    : 'No attempts'}
                </span>
              </div>
            )}
          </div>

          {/* Top Performers Card */}
          <div className="statistics-card">
            <h2>Top Performers</h2>
            {Array.isArray(quizData.top_students) && quizData.top_students.map((student, index) => (
              <div key={student.id} className="student-row">
                <span className="rank">#{index + 1}</span>
                <span>{student.username}</span>
                <span className="score">{student.score.toFixed(1)}</span>
              </div>
            ))}
          </div>

          {/* Absent Students Card */}
          <div className="statistics-card">
            <h2>Absent Students ({quizData.absent_students?.length || 0})</h2>
            {Array.isArray(quizData.absent_students) && quizData.absent_students.length > 0 ? (
              quizData.absent_students.map((student, index) => (
                <div key={index} className="student-row">
                  <span>{student.username}</span>
                  <span>Group: {student.group || 'N/A'}</span>
                </div>
              ))
            ) : (
              <p>No absent students.</p>
            )}
          </div>
        </div>
        <button className="back-button">Back</button>
      </div>
      <Footer />
    </>
  );
}

export default QuizStatistics;