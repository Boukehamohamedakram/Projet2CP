import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import EditProfilePage from './components/EditProfilePage';
import ChangePasswordPage from './components/ChangePasswordPage';
import SuccessPage from './components/SuccessPage';
import './App.css';

function App() {
  const [userInfo, setUserInfo] = useState({
    name: 'Chachoua Ali',
    email: 'chachoua@example.com',
    grade: '10th Grade',
    module: 'Mathematics'
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleUpdateProfile = (newInfo) => {
    setUserInfo({ ...userInfo, ...newInfo });
    setSuccessMessage('Profile Updated!');
  };

  const handleChangePassword = () => {
    setSuccessMessage('Password Changed!');
  };

  return (
    <Router>
      <div className="App bg-white min-h-screen flex flex-col justify-between">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-400 to-blue-500 p-3 flex justify-between items-center rounded-t-xl">
        <div className="text-white font-bold text-xl">
          <Link to="/">QuizPi</Link>
        </div>
        <nav className="flex space-x-8 items-center">
          <Link to="/" className="text-white hover:text-blue-100">HOME</Link>
          <Link to="/" className="text-white hover:text-blue-100">DASHBOARD</Link>
          <Link to="/" className="text-white hover:text-blue-100">STUDENT</Link>
          <div className="text-white flex items-center">
            <span>{userInfo.name}</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full ml-2 overflow-hidden">
              <img src="/User-Avatar.png" alt="User Avatar" className="w-full h-full object-contain" />
            </div>
          </div>
        </nav>
      </header>


        {/* Content */}
        <main className="flex-grow px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-2">☀</span>
              <span className="text-yellow-500 font-bold">GOOD MORNING</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{userInfo.name}</h1>
          </div>

          <Routes>
            <Route path="/" element={<ProfilePage userInfo={userInfo} />} />
            <Route path="/profile" element={<ProfilePage userInfo={userInfo} />} />
            <Route path="/edit-profile" element={<EditProfilePage userInfo={userInfo} onUpdate={handleUpdateProfile} />} />
            <Route path="/change-password" element={<ChangePasswordPage onChangePassword={handleChangePassword} />} />
            <Route path="/success" element={<SuccessPage message={successMessage} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-blue-500 text-white py-6">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold text-xl">@QuizPI</div>
              <img src="/raspberry-pi-logo.png" alt="Raspberry Pi Logo" className="h-6" />
            </div>
            <div className="text-sm">Reach us</div>
            <div className="flex justify-center space-x-6 mt-2">
              <div className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+23712345678</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>support@quizpi.co</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
