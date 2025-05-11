import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../CSS/QuizStatistics.css";

function QuizStatistics() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [quizData, setQuizData] = useState({
    title: '',
    topStudents: [],
    absentStudents: [],
    badQuestions: [],
    average: 0,
    completionRate: 0,
    totalStudents: 0,
    submittedCount: 0
  });
  
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchQuizStatistics = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Quiz/quizzes/${id}/analytics/`, {
          headers: {
            'Authorization': `Token ${userData.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz statistics');
        }

        const data = await response.json();
        setQuizData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
        setLoading(false);
      }
    };

    fetchQuizStatistics();
  }, [id, navigate]);

  // Calculate score distribution for pie chart
  const getScoreDistribution = () => {
    if (!Array.isArray(quizData.topStudents)) return [];
    
    const ranges = [
      { name: '0-20%', count: 0 },
      { name: '21-40%', count: 0 },
      { name: '41-60%', count: 0 },
      { name: '61-80%', count: 0 },
      { name: '81-100%', count: 0 }
    ];

    quizData.topStudents.forEach(student => {
      const score = (student.score / student.maxScore) * 100;
      if (score <= 20) ranges[0].count++;
      else if (score <= 40) ranges[1].count++;
      else if (score <= 60) ranges[2].count++;
      else if (score <= 80) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className="quiz-statistics">
        <h1 className="quiz-statistics-title">{quizData.title || 'Quiz Statistics'}</h1>
        
        <div className="statistics-grid">
          {/* Important Statistics Card */}
          <div className="statistics-card">
            <h2>Overview</h2>
            <div className="stat-row">
              <span>Total Students:</span>
              <span className="stat-value">{quizData.totalStudents || 0}</span>
            </div>
            <div className="stat-row">
              <span>Submitted:</span>
              <span className="stat-value">{quizData.submittedCount || 0}</span>
            </div>
            <div className="stat-row">
              <span>Average Score:</span>
              <span className="stat-value">
                {typeof quizData.average === 'number' ? quizData.average.toFixed(2) : '0.00'}
              </span>
            </div>
            <div className="stat-row">
              <span>Completion Rate:</span>
              <span className="stat-value">
                {typeof quizData.completionRate === 'number' ? quizData.completionRate.toFixed(2) : 0}%
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
            {Array.isArray(quizData.badQuestions) && quizData.badQuestions.map((question, index) => (
              <div key={index} className="question-row">
                <span>Question {index + 1}:</span>
                <span>{question?.text}</span>
                <span className="failure-rate">
                  {question?.wrong_attempts}% failure rate
                </span>
              </div>
            ))}
          </div>

          {/* Top Performers Card */}
          <div className="statistics-card">
            <h2>Top Performers</h2>
            {Array.isArray(quizData.topStudents) && quizData.topStudents.map((student, index) => (
              <div key={index} className="student-row">
                <span className="rank">#{index + 1}</span>
                <span>{student?.username}</span>
                <span className="group">Group: {student?.group || 'N/A'}</span>
                <span className="score">{student?.score}/{student?.maxScore}</span>
              </div>
            ))}
          </div>

          {/* Absent Students Card */}
          <div className="statistics-card">
            <h2>Absent Students ({quizData.absentStudents?.length || 0})</h2>
            {Array.isArray(quizData.absentStudents) && quizData.absentStudents.map((student, index) => (
              <div key={index} className="student-row">
                <span>{student?.username}</span>
                <span>Group: {student?.group || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default QuizStatistics;