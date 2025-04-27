import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login/jsx/LoginPage1.jsx";
import ForgotPassword3 from "./login/jsx/ForgotPassword3.jsx";
import SignUpPage from "./login/jsx/SignUp.jsx";
import OTPVerification from "./login/jsx/OTPVerification4.jsx";
import Dashboard from "./dashbord/jsx/dashbord1.jsx";
import Module from "./dashbord/jsx/Dashbord2.jsx";
import Quizzes from "./quiz/Quizzes.jsx"; // Import your CSS file for styling




// Other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/module/:moduleId" element={<Module />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword3 />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quizzes" element={<Quizzes />} />
    
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
