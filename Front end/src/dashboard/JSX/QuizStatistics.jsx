import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

        const analyticsResponse = await fetch(`http://localhost:8000/api/Quiz/quizzes/${id}/analytics/`, {
          headers: {
            'Authorization': `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!analyticsResponse.ok) {
          throw new Error(`Failed to fetch quiz analytics: ${analyticsResponse.status}`);
        }

        const analyticsData = await analyticsResponse.json();

        const absentResponse = await fetch(`http://localhost:8000/api/Quiz/quizzes/${id}/absent-students/`, {
          headers: {
            'Authorization': `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!absentResponse.ok) {
          throw new Error(`Failed to fetch absent students: ${absentResponse.status}`);
        }

        const absentData = await absentResponse.json();

        setQuizData({
          title: analyticsData.title || 'Quiz Results',
          topStudents: analyticsData.top_students || [],
          absentStudents: absentData.absent_students || [],
          badQuestions: analyticsData.hardest_question ? [analyticsData.hardest_question] : [],
          gradeDistribution: analyticsData.grade_distribution || [],
          average: analyticsData.average_score || 0,
          completionRate: analyticsData.completion_rate || 0
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

  if (loading) {
    return (
      <div className="quiz-statistics">
        <NavBar />
        <div className="loading">Loading quiz statistics...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-statistics">
        <NavBar />
        <div className="error">
          {error}
          <button onClick={() => navigate('/dashboard')} className="back-button">
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="quiz-statistics">
        <h1 className="title">{quizData.title}</h1>
        <div className="statistics-section">
          <div className="important-statistics">
            <h2>Important Statistics</h2>
            <p>Average: {quizData.average}</p>
            <p>Completion Rate: {quizData.completionRate}%</p>
          </div>
          <div className="top-students">
            <h2>Top Students</h2>
            <ul>
              {quizData.topStudents.map(student => (
                <li key={student.id}>{student.username} - {student.score}</li>
              ))}
            </ul>
          </div>
          <div className="bad-questions">
            <h2>Bad Performance Questions</h2>
            {quizData.badQuestions.length > 0 ? (
              quizData.badQuestions.map((question, index) => (
                <div key={index}>
                  <p>Question: {question.text}</p>
                  <p>Wrong Attempts: {question.wrong_attempts}</p>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
          <div className="absent-students">
            <h2>Absent Students</h2>
            <ul>
              {quizData.absentStudents.map(student => (
                <li key={student.id}>{student.username} - {student.email}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default QuizStatistics;