import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ResetPasswordPage5.css";
import axios from "axios";

const UpdateUserInfo = () => {
  const navigate = useNavigate();
  
  // States for form fields and status
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState("teacher"); // Add this line after other useState declarations
  
  // Backend URL
  const API = import.meta.env.VITE_API_URL;
  
  // Get authentication token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
    return token;
  };

  // Fetch current user data and ID from backend
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      
      try {
        const token = getAuthToken();
        const userId = localStorage.getItem("userId"); // Add this line
        
        // Check if token exists
        if (!token) {
          setError("No authentication token found. Please login again.");
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await axios.get(`${API}/api/users/users/`, {
          headers: {
            'Authorization': `Token ${token}`, // Changed from Bearer to Token
            'Content-Type': 'application/json'
          }
        });
        
        // Find the current user in the response array
        const users = response.data;
        const currentUser = users.find(user => user.id === parseInt(userId));
        
        if (currentUser) {
          setUsername(currentUser.username);
          setEmail(currentUser.email || '');
          setUserId(currentUser.id);
          console.log("User data loaded:", currentUser);
        } else {
          throw new Error("User not found");
        }
        
      } catch (err) {
        console.error("Error fetching user data:", err);
        
        if (err.response) {
          console.log("Full error response:", {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers
          });
          if (err.response.status === 401) {
            setError("Session expired. Please log in again.");
            setTimeout(() => navigate('/login'), 2000);
          } else {
            setError(`Error: ${err.response.data.message || "Something went wrong"}`);
          }
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, [navigate]);

  // Handle form submission to update user info
  const handleSubmit = async () => {
    // Form validation
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    
    if (!email.trim()) {
      setError("Email cannot be empty");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Check if we have a user ID
    if (!userId) {
      setError("User ID not found. Please reload the page.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const token = getAuthToken();
      
      // Update userData to match required structure
      const userData = {
        id: userId,
        username: username,
        email: email,
        role: role // This will be "teacher" by default
      };

      console.log("Sending data:", userData);

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
      
      console.log("Update response:", response.data);
      setSuccess(true);
    } catch (err) {
      console.error("Error updating user info:", err);
      
      // Add more detailed error logging
      if (err.response) {
        console.log("Full error response:", {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers
        });
        console.log("Error response data:", err.response.data);
        
        if (err.response.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate('/login'), 2000);
        } else if (err.response.status === 400) {
          // Extract specific validation errors from the response
          const errorMessage = err.response.data.detail || 
                             err.response.data.message || 
                             Object.values(err.response.data).flat().join(', ') ||
                             "Invalid data provided";
          setError(errorMessage);
        } else {
          setError(err.response.data.message || "Failed to update information");
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
          <h2>Information Updated!</h2>
          <p>Your profile information has been updated successfully.</p>

          <button
            className="reset-button"
            onClick={() => navigate('/parameters')}
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
        <h2>Update Your Information</h2>
        <p>Change your username or email address below.</p>

        {isLoading && <div className="loading-spinner">Loading...</div>}

        <div>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            onClick={handleSubmit}
            className="reset-button"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Information"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserInfo;