




import { BrowserRouter, Routes, Route } from "react-router-dom";
import  LoginPage from './login/jsx/LoginPage1.jsx';
import ForgotPassword3 from "./login/jsx/ForgotPassword3.jsx";
// Other imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword3 />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;