import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePasswordPage({ onChangePassword }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    onChangePassword();
    navigate('/success');
  };

  return (
    <>
      

      <div className="max-w-md mx-auto bg-blue-400 rounded-lg p-6 text-white relative overflow-hidden mt-10">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Current password :</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              className="w-full bg-blue-300 border-none text-white p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">New password :</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              className="w-full bg-blue-300 border-none text-white p-2 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Confirm new password :</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-blue-300 border-none text-white p-2 rounded"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold"
            >
              Save All Changes
            </button>
          </div>
        </form>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white opacity-10 rounded-l-full"></div>
      </div>

      <footer className="text-center text-sm text-gray-300 mt-10 p-4">
        &copy; {new Date().getFullYear()} QuizPI. All rights reserved.
      </footer>
    </>
  );
}

export default ChangePasswordPage;
