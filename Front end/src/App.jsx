import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./login/jsx/LoginPage1.jsx";
import CreateNewPassword from "./login/jsx/ResetPasswordPage5.jsx";
import SignUpPage from "./login/jsx/SignUp.jsx";
import Quizzes from "./quiz/Quizzes.jsx";
import GeneralStatistics from "./dashboard/JSX/GeneralStatistics.jsx";
import QuizStatistics from "./dashboard/JSX/QuizStatistics.jsx";
import UpdateUserInfo from "./login/jsx/UpdateUserInfo.jsx";
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
        <Route path="/change-password" element={<CreateNewPassword />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/create/:id" element={<Quizzes />} />
        <Route path="/create" element={<Quizzes />} />
        <Route path="/dashboard" element={<GeneralStatistics />} />
        <Route path="/quiz-statistics" element={<QuizStatistics />} />
        <Route path="/navbar" element={<NavBar />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/scheduled" element={<Scheduled />} />
        <Route path="/create-quiz" element={<Quizzes />} />
        <Route path="/quiz-editor/:id" element={<Quizzes />} />
        <Route path="/history" element={<History />} />
        <Route path="/programmed" element={<Programmed />} />
        <Route path="/student" element={<Student />} />
        <Route path="/parameters"     element={<Parameters />} /> 
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/update-user-info" element={<UpdateUserInfo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
