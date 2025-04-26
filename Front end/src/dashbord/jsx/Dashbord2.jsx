import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "../css/Dashbord1.css";
import BlueVector from "../../assets/vectors.png"; // your wave image

const Module = () => {
  const { moduleId } = useParams();
  const location = useLocation();
  const moduleData = location.state || {};
  
  const [showModules, setShowModules] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false);
  
  const toggleModules = () => {
    setShowModules(!showModules);
    setShowQuizzes(false);
  };
  
  const toggleQuizzes = () => {
    setShowQuizzes(!showQuizzes);
    setShowModules(false);
  };
  
  // Use the module information passed from the Dashboard
  const [currentModule, setCurrentModule] = useState({
    id: moduleData.moduleId || moduleId || "Unknown",
    name: moduleData.moduleName || moduleId || "Unknown Module",
    class: moduleData.moduleClass || "Unknown Class"
  });
  
  // Module stats - these could be fetched based on the moduleId
  const stats = {
    quizCount: 5,
    studentCount: 270,
    classAverage: "13,75/20",
    onlineUsers: 3,
    totalUsers: 60,
    onlineUsersList: [
      { name: "Manseur Hicham", class: "B 06", activity: "23/0141" },
      { name: "Manseur Hicham", class: "B 06", activity: "23/0141" },
      { name: "Manseur Hicham", class: "B 06", activity: "23/0141" },
    ],
    modulesList: [
      { name: "ALG1", class: "B 06" },
      { name: "ALG3", class: "B 06" },
      { name: "ANUM", class: "B 06" },
    ],
    quizzesList: [
      { name: "Quiz : Chapter 1", class: "B 06" },
      { name: "Quiz : Chapter 2", class: "B 06" },
      { name: "Quiz : Chapter 3", class: "B 06" },
    ],
    generalStats: {
      lastCreatedQuiz: "18/20",
      attendance: "95 %",
      completionRate: "92 %"
    }
  };

  // Effect to update page title or fetch module-specific data
  useEffect(() => {
    // You could fetch module-specific data here based on moduleId
    document.title = `Module: ${currentModule.name}`;
  }, [currentModule.name]);

  return (
    <div className="dashboard-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="dashboard-title">
          Module Statistics: {currentModule.name} ({currentModule.class})
        </h1>
        <Link to="/" style={{ 
          color: "#0664AE", 
          textDecoration: "none", 
          fontWeight: "bold",
          marginRight: "20px",
          backgroundColor: "#eaf2f8",
          padding: "8px 15px",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          Back to Dashboard
        </Link>
      </div>
      
      <img src={BlueVector} alt="wave background" className="dashboard-wave" />
      <div className={`dashboard-content ${showModules || showQuizzes ? "blurred" : ""}`}>
        <div className="stats-grid">
          <div className="stats-card">
            <h2 className="stats-card-title">Number of Created Quizzes</h2>
            <div className="stats-card-value">{stats.quizCount}</div>
            <button className="stats-card-button" onClick={toggleQuizzes}>
              View all Quizzes
            </button>
          </div>
          <div className="stats-card">
            <h2 className="stats-card-title">Number of Students</h2>
            <div className="stats-card-value">{stats.studentCount}</div>
            <button className="stats-card-button">View all Students</button>
          </div>
          <div className="stats-card">
            <h2 className="stats-card-title">Class Average:</h2>
            <div className="stats-card-value2">{stats.classAverage}</div>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stats-card modules-card">
            <h2 className="stats-card-title">General Statistics for {currentModule.name}</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
              <p>Last created quiz : {stats.generalStats.lastCreatedQuiz}</p>
              <p>Attendance : {stats.generalStats.attendance}</p>
              <p>Completion rate : {stats.generalStats.completionRate}</p>
            </div>
          </div>
        </div>
        
        <div className="online-users-section">
          <div className="online-users-header">
            <h2 className="online-users-title">Online Users</h2>
            <div className="online-users-count">
              {stats.onlineUsers}/{stats.totalUsers}
            </div>
          </div>
          <div className="online-users-list">
            {stats.onlineUsersList.map((user, index) => (
              <div className="user-row" key={index}>
                <div className="user-name">{user.name}</div>
                <div className="user-class">{user.class}</div>
                <div className="user-activity">{user.activity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showModules && (
        <div className="modules-overlay">
          <h2 style={{ color: "#0664AE" }}>Available Modules</h2>
          {stats.modulesList.map((mod, index) => (
            <div className="module-box" key={index}>
              Module : {mod.name} {mod.class}{" "}
              <button className="module-button">Access</button>
            </div>
          ))}
          <button onClick={toggleModules} className="close-button">
            Close
          </button>
        </div>
      )}
      
      {showQuizzes && (
        <div className="modules-overlay">
          <h2 style={{ color: "#0664AE" }}>Available Quizzes for {currentModule.name}</h2>
          {stats.quizzesList.map((quiz, index) => (
            <div className="module-box" key={index}>
              {quiz.name} {quiz.class}{" "}
              <button className="module-button">Access</button>
            </div>
          ))}
          <button onClick={toggleQuizzes} className="close-button">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Module;