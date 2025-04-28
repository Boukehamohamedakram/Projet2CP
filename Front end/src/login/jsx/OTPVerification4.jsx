import React, { useState, useRef, useEffect } from "react";
import "../css/OTPVerification4.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Focus on first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input after filling current one
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content contains only numbers
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const pastedChars = pastedData.slice(0, 4).split("");
    const newOtp = [...otp];

    pastedChars.forEach((char, index) => {
      if (index < 4) {
        newOtp[index] = char;
      }
    });

    setOtp(newOtp);

    // Focus on the appropriate input after pasting
    if (pastedChars.length < 4 && inputRefs.current[pastedChars.length]) {
      inputRefs.current[pastedChars.length].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    // Check if OTP is complete
    if (otp.some((digit) => digit === "")) {
      setError("Please enter the complete verification code");
      return;
    }

    console.log("Verifying OTP:", otp.join(""));
    // Add your OTP verification logic here
  };

  const handleResend = () => {
    console.log("Resending OTP");

    // Add your resend logic here
  };

  return (
    <div className="otp-verification-background">
      <div className="otp-verification-container">
        <div className="otp-verification-card">
          <h2>OTP Verification</h2>

          <p>
            Enter the verification code we just sent to your email address or
            phone number.
          </p>

          <form onSubmit={handleVerify}>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : null}
                  autoComplete="off"
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="verify-button">
              Verify
            </button>
          </form>

          <div className="resend-link">
            <span>Didn't receive a code? </span>
            <button onClick={handleResend} className="resend-button">
              Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
