import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login/jsx/LoginPage1.jsx";
import ForgotPassword3 from "./login/jsx/ForgotPassword3.jsx";
import SignUpPage from "./login/jsx/SignUp.jsx";
import OTPVerification from "./login/jsx/OTPVerification4.jsx";
// Other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword3 />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
