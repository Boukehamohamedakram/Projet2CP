import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login/jsx/LoginPage1.jsx";
import ForgotPassword3 from "./login/jsx/ForgotPassword3.jsx";
import SignUpPage from "./login/jsx/SignUp.jsx";
import ChangeUserInfo from "./login/jsx/ChangeUserInfo.jsx";
import OTPVerification from "./login/jsx/OTPVerification4.jsx";
import Quizzes from "./quiz/Quizzes.jsx"; 
import GeneralStatistics from "./dashboard/JSX/GeneralStatistics.jsx";
import QuizStatistics from "./dashboard/JSX/QuizStatistics.jsx";
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
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/change-user-info" element={<ChangeUserInfo />} />
        <Route path="/dashboard" element={<GeneralStatistics/>} />
        <Route path="/quizstatistics" element={<QuizStatistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
