import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar
} from 'recharts';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../CSS/QuizStatistics.css";

function QuizStatistics() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quizData, setQuizData] = useState({
    total_students: 0,
    submitted_count: 0,
    completion_rate: 0,
    average_score: 0,
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

  // Add state for total group students
  const [totalGroupStudents, setTotalGroupStudents] = useState(0);

  // Add this helper function at the top of your component
  const getPerformanceInsights = (data) => {
    const avgScore = data.average_score;
    const completionRate = data.completion_rate * 100;
    const participationRate = (data.submitted_count / data.total_students) * 100;
  
    return {
      scoreStatus: avgScore >= 80 ? 'Excellent' : avgScore >= 60 ? 'Good' : avgScore >= 40 ? 'Fair' : 'Needs Improvement',
      completionStatus: completionRate >= 90 ? 'Excellent' : completionRate >= 70 ? 'Good' : completionRate >= 50 ? 'Fair' : 'Low',
      participationStatus: participationRate >= 90 ? 'High' : participationRate >= 70 ? 'Moderate' : 'Low',
      recommendations: [
        avgScore < 60 && 'Consider reviewing difficult topics with the class',
        completionRate < 70 && 'Follow up with students who haven\'t completed the quiz',
        participationRate < 70 && 'Encourage more student participation',
        data.hardest_question?.wrong_attempts > 0 && 'Review the most challenging question with the class'
      ].filter(Boolean)
    };
  };

  // Update the useEffect to fetch both analytics and group data
  useEffect(() => {
    const fetchQuizStatistics = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.token) {
          navigate('/login');
          return;
        }

        // Fetch both analytics and group data
        const [analyticsResponse, groupResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/Quiz/quizzes/${id}/analytics/`, {
            headers: { 'Authorization': `Token ${userData.token}` }
          }),
          fetch(`http://192.168.1.1:8000/api/Quiz/groups/`, {
            headers: { 'Authorization': `Token ${userData.token}` }
          })
        ]);

        if (!analyticsResponse.ok || !groupResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [analyticsData, groupData] = await Promise.all([
          analyticsResponse.json(),
          groupResponse.json()
        ]);

        const totalStudents = groupData.length; // Adjust based on your API response structure
        
        // Update quiz data with correct values
        setQuizData({
          total_students: totalStudents,
          submitted_count: analyticsData.top_students?.length || 0,
          completion_rate: totalStudents > 0 ? (analyticsData.top_students?.length / totalStudents) : 0,
          average_score: analyticsData.average_score || 0,
          top_students: analyticsData.top_students?.slice(0, 5) || [], // Limit to top 5
          hardest_question: analyticsData.hardest_question || {
            id: null,
            text: '',
            wrong_attempts: 0,
            total_attempts: 0
          }
        });

        setTotalGroupStudents(totalStudents);
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

  // Update the getScoreDistribution function
  const getScoreDistribution = () => {
    if (!Array.isArray(quizData.top_students) || quizData.top_students.length === 0) {
      return [];
    }
    
    const ranges = [
      { name: '0-20%', count: 0, color: '#FF8042' },
      { name: '21-40%', count: 0, color: '#FFBB28' },
      { name: '41-60%', count: 0, color: '#00C49F' },
      { name: '61-80%', count: 0, color: '#0088FE' },
      { name: '81-100%', count: 0, color: '#8884d8' }
    ];

    quizData.top_students.forEach(student => {
      const scorePercentage = (student.score / 10) * 100;
      if (scorePercentage <= 20) ranges[0].count++;
      else if (scorePercentage <= 40) ranges[1].count++;
      else if (scorePercentage <= 60) ranges[2].count++;
      else if (scorePercentage <= 80) ranges[3].count++;
      else ranges[4].count++;
    });

    return ranges.filter(range => range.count > 0);
  };

  // Get insights before rendering
  const insights = getPerformanceInsights(quizData);

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
              <span className="stat-value">{quizData.total_students}</span>
            </div>
            <div className="stat-row">
              <span>Present Students:</span>
              <span className="stat-value">{quizData.submitted_count}</span>
            </div>
            <div className="stat-row">
              <span>Average Score:</span>
              <span className="stat-value">
                {quizData.average_score.toFixed(2)}
              </span>
            </div>
            <div className="stat-row">
              <span>Completion Rate:</span>
              <span className="stat-value">
                {(quizData.completion_rate * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Score Distribution Card with Analysis */}
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
                    label={(entry) => `${entry.name}: ${entry.count}`}
                  >
                    {getScoreDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="score-distribution-analysis">
              <p>
                {getScoreDistribution().map(range => (
                  `${range.count} students scored in the ${range.name} range. `
                )).join('')}
              </p>
              <p>
                {(() => {
                  const distributions = getScoreDistribution();
                  const highScores = distributions.filter(r => r.name.includes('81-100')).reduce((acc, curr) => acc + curr.count, 0);
                  const lowScores = distributions.filter(r => r.name.includes('0-20') || r.name.includes('21-40')).reduce((acc, curr) => acc + curr.count, 0);
                  
                  if (highScores > lowScores) return "Overall, the class showed strong performance with more students scoring in higher ranges.";
                  if (lowScores > highScores) return "There's room for improvement as more students scored in lower ranges.";
                  return "The class shows a balanced distribution of scores across ranges.";
                })()}
              </p>
            </div>
          </div>

          {/* Performance Analysis Card - Simplified */}
          <div className="statistics-card performance-analysis">
            <h2>Performance Analysis</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[
                    {
                      name: 'Class Statistics',
                      avgScore: quizData.average_score,
                      completionRate: quizData.completion_rate * 100,
                      participationRate: (quizData.submitted_count / quizData.total_students) * 100
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgScore" name="Average Score %" fill="#8884d8" />
                  <Bar dataKey="completionRate" name="Completion Rate %" fill="#82ca9d" />
                  <Bar dataKey="participationRate" name="Participation Rate %" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* New Key Insights Card */}
          <div className="statistics-card key-insights-card">
            <h2>Key Insights</h2>
            <div className="metrics-overview">
              <div className="metric">
                <span className="metric-label">Class Performance</span>
                <span className={`metric-value ${insights.scoreStatus.toLowerCase()}`}>
                  {insights.scoreStatus}
                </span>
                <p>Average score: {quizData.average_score.toFixed(2)}%</p>
              </div>
              <div className="metric">
                <span className="metric-label">Completion Status</span>
                <span className={`metric-value ${insights.completionStatus.toLowerCase()}`}>
                  {insights.completionStatus}
                </span>
                <p>{quizData.submitted_count} out of {quizData.total_students} students completed</p>
              </div>
              <div className="metric">
                <span className="metric-label">Participation Level</span>
                <span className={`metric-value ${insights.participationStatus.toLowerCase()}`}>
                  {insights.participationStatus}
                </span>
                <p>{((quizData.submitted_count / quizData.total_students) * 100).toFixed(2)}% participation rate</p>
              </div>
            </div>
          </div>

          {/* Performance Trends Card */}
          <div className="statistics-card performance-analysis">
            <h2>Performance Analysis</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[
                    {
                      name: 'Class Statistics',
                      avgScore: quizData.average_score,
                      completionRate: quizData.completion_rate * 100,
                      participationRate: (quizData.submitted_count / quizData.total_students) * 100
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgScore" name="Average Score %" fill="#8884d8" />
                  <Bar dataKey="completionRate" name="Completion Rate %" fill="#82ca9d" />
                  <Bar dataKey="participationRate" name="Participation Rate %" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Enhanced Analysis Summary */}
            <div className="analysis-summary">
              {(() => {
                const insights = getPerformanceInsights(quizData);
                return (
                  <>
                    <h3>Key Insights</h3>
                    <div className="metrics-overview">
                      <div className="metric">
                        <span className="metric-label">Class Performance:</span>
                        <span className={`metric-value ${insights.scoreStatus.toLowerCase()}`}>
                          {insights.scoreStatus}
                        </span>
                        <p>Average score: {quizData.average_score.toFixed(2)}%</p>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Completion Status:</span>
                        <span className={`metric-value ${insights.completionStatus.toLowerCase()}`}>
                          {insights.completionStatus}
                        </span>
                        <p>{quizData.submitted_count} out of {quizData.total_students} students completed</p>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Participation Level:</span>
                        <span className={`metric-value ${insights.participationStatus.toLowerCase()}`}>
                          {insights.participationStatus}
                        </span>
                        <p>{((quizData.submitted_count / quizData.total_students) * 100).toFixed(2)}% participation rate</p>
                      </div>
                    </div>
                    
                    <div className="score-distribution-analysis">
                      <h3>Score Distribution Analysis</h3>
                      <p>
                        {getScoreDistribution().map(range => (
                          `${range.count} students scored in the ${range.name} range. `
                        )).join('')}
                      </p>
                      <p>
                        {(() => {
                          const distributions = getScoreDistribution();
                          const highScores = distributions.filter(r => r.name.includes('81-100')).reduce((acc, curr) => acc + curr.count, 0);
                          const lowScores = distributions.filter(r => r.name.includes('0-20') || r.name.includes('21-40')).reduce((acc, curr) => acc + curr.count, 0);
                          
                          if (highScores > lowScores) return "Overall, the class showed strong performance with more students scoring in higher ranges.";
                          if (lowScores > highScores) return "There's room for improvement as more students scored in lower ranges.";
                          return "The class shows a balanced distribution of scores across ranges.";
                        })()}
                      </p>
                    </div>

                    <div className="recommendations">
                      <h3>Recommendations</h3>
                      <ul>
                        {insights.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="statistics-card recommendations-card">
            <h2>Recommendations</h2>
            <div className="recommendations">
              <ul>
                {insights.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
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
            <h2>Top 5 Performers</h2>
            {Array.isArray(quizData.top_students) && quizData.top_students.map((student, index) => (
              <div key={student.id} className="student-row">
                <span className="rank">#{index + 1}</span>
                <span>{student.username}</span>
                <span className="score">{student.score.toFixed(1)}</span>
              </div>
            ))}
          </div>

          {/* Present Students Card */}
          <div className="statistics-card">
            <h2>Present Students ({quizData.submitted_count})</h2>
            {quizData.top_students && quizData.top_students.length > 0 ? (
              quizData.top_students.map((student) => (
                <div key={student.id || student.username} className="student-row">
                  <span>{student.username}</span>
                  <span className="score">{student.score.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No students have submitted yet.</p>
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