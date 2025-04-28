// src/components/ChangeUserInfo/ChangeUserInfo.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/ForgotPassword3.css";

export default function ChangeUserInfo() {
  const navigate = useNavigate();

  // pull “current” values from localStorage (or your store)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    setUsername(storedName);
    setEmail(storedEmail);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // save
    localStorage.setItem("userName", username.trim());
    localStorage.setItem("userEmail", email.trim());

    // redirect where you need
    navigate("/profile");
  };

  return (
    <>
      <div className="page-background" />
      <div className="change-info-container">
        <div className="change-info-card">
          <h2>Update Profile</h2>
          <p>Modify your username and/or email below.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <div className="input-wrapper">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="send-code-button">
              Save Changes
            </button>
          </form>

          <div className="login-link">
            <span>Cancel? </span>
            <Link to="/profile">Back to Profile</Link>
          </div>
        </div>
      </div>
    </>
  );
}
