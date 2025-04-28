import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/ForgotPassword3.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    console.log("Sending code to:", email);
    // ✅ Additional logic (e.g., API call or localStorage)
    localStorage.setItem("resetEmail", email);

    // ✅ Navigate to verification page
    navigate("/otp-verification");
  };

  return (
    <>
      {/* Full-page background div */}
      <div className="page-background"></div>

      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <h2>Forgot Password?</h2>
          <p>
            Don't worry! It occurs. Please enter the email address linked with
            your account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Enter your e-mail address:</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="send-code-button">
              Send Code
            </button>
          </form>

          <div className="login-link">
            <span>Remember Password? </span>
            <Link to="/login">Login Now</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
