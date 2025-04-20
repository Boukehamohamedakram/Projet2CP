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
  
    const payload = {
      username,
      email,
      password,
      role: "teacher"
    };
  
    console.log("Submitting:", payload); // Debug line
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
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
    <div className="login-card">
      <div className="login-logo-container">
        <div className="logo-icon">{/* add the svg */}</div>
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
              {/* Eye toggle icons */}
            </span>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-button">
          Sign Up
        </button>
        <div className="login-link">
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
