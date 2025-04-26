import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Dashbord1.css";
import BlueVector from "../../assets/vectors.png"; // your wave image

const Dashboard = () => {
  const [showModules, setShowModules] = useState(false);
  const navigate = useNavigate();
  
  const toggleModules = () => setShowModules(!showModules);
  
  const stats = {
    moduleCount: 3,
    studentCount: 358,
    onlineUsers: 3,
    onlineUsersList: [
      { name: "Manseur Hicham", class: "B 06", activity: "23/0141" },
      { name: "Manseur Hicham", class: "B 06", activity: "23/0141" },
      { name: "Manseur Hicham", class: "B 06", activity: "23/0141" },
    ],
    modulesList: [
      { id: "ALG1", name: "ALG1", class: "B 06" },
      { id: "ALG3", name: "ALG3", class: "B 06" },
      { id: "ANUM", name: "ANUM", class: "B 06" },
    ],
  };
  
  // Function to handle module access and navigation
  const handleModuleAccess = (moduleId, moduleName, moduleClass) => {
    // Close the module overlay
    setShowModules(false);
    
    // Navigate to Module page with module information as state/params
    navigate(`/module/${moduleId}`, { 
      state: { 
        moduleId: moduleId,
        moduleName: moduleName,
        moduleClass: moduleClass
      } 
    });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">General Statistics</h1>
      <img src={BlueVector} alt="wave background" className="dashboard-wave" />
      
      <div className={`dashboard-content ${showModules ? "blurred" : ""}`}>
        <div className="stats-grid">
          <div className="stats-card">
            <h2 className="stats-card-title">Number of modules</h2>
            <div className="stats-card-value">{stats.moduleCount}</div>
            <button className="stats-card-button" onClick={toggleModules}>
              View all Modules
            </button>
          </div>
          <div className="stats-card">
            <h2 className="stats-card-title">Number of Students</h2>
            <div className="stats-card-value">{stats.studentCount}</div>
            <button className="stats-card-button">View all Students</button>
          </div>
        </div>
        
        <div className="online-users-section">
          <div className="online-users-header">
            <h2 className="online-users-title">Online Users</h2>
            <div className="online-users-count">
              {stats.onlineUsers}/{stats.studentCount}
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
              <button 
                className="module-button" 
                onClick={() => handleModuleAccess(mod.id, mod.name, mod.class)}
              >
                Access
              </button>
            </div>
          ))}
          <button onClick={toggleModules} className="close-button">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;