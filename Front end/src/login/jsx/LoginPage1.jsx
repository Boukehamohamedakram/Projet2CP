import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/LoginPage1.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", { email, password });
    // Add your authentication logic here
  };

  return (
    <div className="login-card">
      <div className="login-logo-container">
        <div className="logo-icon">
          {/* SVG code here */}
        </div>
        <h2 className="logo-text">QuizPI</h2>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label">Enter your e-mail address:</label>
          <div className="input-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-control"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Enter your Password:</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-control"
              placeholder="••••••••"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </span>
          </div>
        </div>

      
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
    

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}