import React, { useState } from "react";
import "../css/ResetPasswordPage5.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  // Get authentication token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
    return token;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!currentPassword) {
      setError("Please enter your current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const token = getAuthToken();
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");

      if (!token || !userId || !username) {
        setError("Authentication required. Please login again.");
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // First, verify current password
      const verifyData = {
        username: username,
        password: currentPassword
      };

      try {
        // Verify current password by attempting to login
        const verifyResponse = await axios.post(`${API}/api/users/login/`, verifyData);
        console.log("Password verification response:", verifyResponse.data);
        
        // If verification succeeds, proceed with password update
        const userResponse = await axios.get(`${API}/api/users/users/${userId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Update password
        const userData = {
          ...userResponse.data,
          password: newPassword
        };

        const response = await axios.put(
          `${API}/api/users/users/${userId}/`,
          userData,
          {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log("Password update response:", response.data);
        setSuccess(true);
        
      } catch (verifyErr) {
        console.error("Password verification failed:", verifyErr);
        setError("Current password is incorrect");
        setIsLoading(false);
        return;
      }
      
    } catch (err) {
      console.error("Error updating password:", err);

      if (err.response) {
        console.log("Full error response:", {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });

        if (err.response.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response.status === 400) {
          const errorMessage = err.response.data.detail || 
                             err.response.data.message || 
                             Object.values(err.response.data).flat().join(', ') ||
                             "Invalid password";
          setError(errorMessage);
        } else {
          setError("Failed to update password");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="password-reset-background">
        <div className="password-reset-container">
          <img
            src="src/assets/Successmark.png"
            alt="Success"
            className="success-image"
          />
          <h2>Password Changed!</h2>
          <p>Your password has been changed successfully.</p>

          <button
            className="reset-button"
            onClick={() => {
              navigate('/parameters');
            }}
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="password-reset-background"> 
      <div className="password-reset-container">
        <h2>Create New Password</h2>
        <p>Your new password must be unique from these previously used.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? "password" : "text"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "password" : "text"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm your new password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "password" : "text"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {isLoading && <div className="loading-spinner">Loading...</div>}

          <button 
            type="submit" 
            className="reset-button"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;