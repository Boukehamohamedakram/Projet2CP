import React, { useState } from "react";
import "../css/ResetPasswordPage5.css"; // Adjust the path as necessary

const CreateNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    console.log("Password reset to:", newPassword);
    setSuccess(true);
    setError("");
  };

  if (success) {
    return (
      
      <div className="password-reset-container">
        {/* Add your success image here - you'll need to import it first */}
        {
          <img
            src="src/assets/Successmark.png"
            alt="Success"
            className="success-image"
          />
        }
        <h2>Password Changed!</h2>
        <p>Your password has been changed successfully.</p>

        <button
          className="reset-button"
          onClick={() => {
            // Add navigation logic here (e.g., using react-router)
            // window.location.href = '/login';
          }}
        >
          Back to Login
        </button>
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
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
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
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
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

        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
    </div>
  );
};

export default CreateNewPassword;
