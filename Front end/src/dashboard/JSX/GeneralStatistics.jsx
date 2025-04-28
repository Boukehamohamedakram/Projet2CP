import { useNavigate } from 'react-router-dom';
import '../CSS/GeneralStatistics.css'; // Import the component's own styles

function GeneralStatistics() {
  const navigate = useNavigate(); 

  return (
    <div className="general-statistics">
      <h1 className="title">General Statistics</h1>

      <div className="grid">
        {/* Quizzes Results */}
        <div className="card">
          <h2 className="card-title">Quizzes Results</h2>
          <div className="card-content">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="item">
                <div className="item-text">Quiz CS 101</div>
                <div className="item-text">B05-B06-B07</div>
                <button 
                  className="item-button"
                  onClick={() => navigate('/quiz-statistics')} 
                >
                  Access
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Students Groups */}
        <div className="card">
          <h2 className="card-title">Students Groups</h2>
          <div className="card-content">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="item">
                <div className="item-text">Group : 06</div>
                <div className="item-text">Section : B</div>
                <button 
                  className="item-button"
                  onClick={() => navigate('/quiz-statistics')}
                >
                  Access
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralStatistics;
