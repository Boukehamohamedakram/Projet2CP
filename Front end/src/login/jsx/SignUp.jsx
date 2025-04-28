// SignUpPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginPage1.css";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = { username, email, password, role: "teacher" };
    console.log("Submitting:", payload);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/users/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("User registered successfully:", data);
        navigate("/login");
      } else {
        const errorMsg = data.error || data.message || JSON.stringify(data);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-logo-container">
          <div className="logo-icon">{/* add your logo here */}</div>
          <h2 className="logo-text">QuizPI</h2>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Enter your username:</label>
            <div className="input-field">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-control"
                placeholder="johndoe123"
              />
            </div>
          </div>

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
            <label className="form-label">Create a Password:</label>
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
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
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
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20
                             c-7 0-11-8-11-8a18.45 18.45 0 0 1
                             5.06-5.94M9.9 4.24A9.12 9.12 0 0 1
                             12 4c7 0 11 8 11 8a18.5 18.5 0 0 1
                             -2.16 3.19m-6.72-1.07a3 3 0 1 1
                             -4.24-4.24"
                    />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Sign Up
          </button>

          <div className="register-prompt">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
