import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login/jsx/LoginPage1.jsx";
import ForgotPassword3 from "./login/jsx/ForgotPassword3.jsx";
import SignUpPage from "./login/jsx/SignUp.jsx";
import ChangeUserInfo from "./login/jsx/ChangeUserInfo.jsx";
import OTPVerification from "./login/jsx/OTPVerification4.jsx";
import Quizzes from "./quiz/Quizzes.jsx";
import GeneralStatistics from "./dashboard/JSX/GeneralStatistics.jsx";
import QuizStatistics from "./dashboard/JSX/QuizStatistics.jsx";
// Other imp
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home";
import Scheduled from './components/Scheduled';
import History from './components/History';
import Programmed from './components/Programmed';
import Student from './components/Student';
import Parameters from './components/Parameters'; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword3 />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/create" element={<Quizzes />} /> 
        <Route path="/change-user-info" element={<ChangeUserInfo />} />
        <Route path="/dashboard" element={<GeneralStatistics />} />
        <Route path="/quiz-statistics" element={<QuizStatistics />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/scheduled" element={<Scheduled />} />
        <Route path="/history" element={<History />} />
        <Route path="/programmed" element={<Programmed />} />
        <Route path="/student" element={<Student />} />
        <Route path="/parameters"     element={<Parameters />} /> 
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
