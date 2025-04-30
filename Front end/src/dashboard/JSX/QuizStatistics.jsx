import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "../CSS/QuizStatistics.css"; 

function QuizStatistics() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Add state for quiz data
  const [quizData, setQuizData] = useState({
    title: '',
    topStudents: [],
    absentStudents: [],
    badQuestions: [],
    gradeDistribution: [],
    average: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizStatistics = async () => {
      try {
        if (!id) {
          throw new Error('Quiz ID not provided');
        }

        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData?.token) {
          navigate('/login');
          return;
        }

        // Updated endpoint to match Django URL structure
        const response = await fetch(`http://localhost:8000/api/Quiz/results/${id}/`, {
          headers: {
            'Authorization': `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
            endpoint: `http://localhost:8000/api/Quiz/results/${id}/`
          });
          throw new Error(`Failed to fetch quiz statistics: ${response.status}`);
        }

        const data = await response.json();
        console.log('Quiz statistics data:', data);

        setQuizData({
          title: data.title || 'Quiz Results',
          topStudents: data.top_students || [],
          absentStudents: data.absent_students || [],
          badQuestions: data.bad_questions || [],
          gradeDistribution: data.grade_distribution || [],
          average: data.average || 0,
          completionRate: data.completion_rate || 0
        });

      } catch (err) {
        console.error('Detailed error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizStatistics();
  }, [id, navigate]);

  // Handle loading state
  if (loading) {
    return <div className="quiz-statistics">
      <div className="loading">Loading quiz statistics...</div>
    </div>;
  }

  // Handle error state
  if (error) {
    return <div className="quiz-statistics">
      <div className="error">
        {error}
        <button onClick={() => navigate('/dashboard')} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </div>;
  }

  // Rest of your rendering code...
  return (
    <div className="quiz-statistics">
      <h1 className="title">{quizData.title}</h1>
      {/* ... existing JSX using quizData instead of hardcoded values ... */}
    </div>
  );
}

export default QuizStatistics;