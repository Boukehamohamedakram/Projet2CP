import React, { useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './Parameters.css';
import defaultAvatar from '../assets/Avatar.png';
import successIcon from '../assets/success-icon.png';

export default function Parameters() {
  const userName = localStorage.getItem('userName') || 'user_name';

  const [view, setView] = useState('default');
  const [profile, setProfile] = useState({
    fullName: "Chachoua Ali",
    email: "ali@example.com",
    grade: "12",
    module: "Mathematics",
    avatar: defaultAvatar,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new1: '',
    new2: ''
  });

  const handleUpload = e => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(p => ({ ...p, avatar: url }));
    }
  };

  const saveProfile = () => setView('successProfile');
  const savePassword = () => setView('successPassword');
  const backToSettings = () => setView('default');

  return (
    <>
      <NavBar />
      <main className="parameters-main">
        <h1 className="parameters-heading">☀️ GOOD MORNING</h1>
        <h2 className="parameters-username">{userName}</h2>

        {view === 'default' && (
          <div className="parameters-card">
            <img src={profile.avatar} alt="avatar" className="parameters-avatar" />
            <div className="parameters-info">
              <p>Full name: <strong>{profile.fullName}</strong></p>
              <p>Email: <strong>{profile.email}</strong></p>
              <p>Grade: <strong>{profile.grade}</strong></p>
              <p>Module: <strong>{profile.module}</strong></p>
            </div>
            <div className="parameters-actions">
              <button onClick={() => setView('changePassword')}>
                Change password
              </button>
              <button onClick={() => setView('editProfile')}>
                Update Profile
              </button>
            </div>
          </div>
        )}

        {view === 'editProfile' && (
          <>
            <div className="parameters-card">
              <img src={profile.avatar} alt="avatar" className="parameters-avatar" />
              <div className="parameters-info">
                <p>Full name: <strong>{profile.fullName}</strong></p>
                <p>Email: <strong>{profile.email}</strong></p>
                <p>Grade: <strong>{profile.grade}</strong></p>
                <p>Module: <strong>{profile.module}</strong></p>
              </div>
              <div className="parameters-upload">
                <label className="upload-label">
                  Upload a new picture
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="upload-input"
                  />
                </label>
              </div>
            </div>
            <button className="parameters-save" onClick={saveProfile}>
              Save All Changes
            </button>
          </>
        )}

        {view === 'changePassword' && (
          <>
            <div className="parameters-card parameters-password-card">
              <div className="parameters-info">
                <p>Current password: <strong>{passwords.current}</strong></p>
                <p>New password: <strong>{passwords.new1}</strong></p>
                <p>New password: <strong>{passwords.new2}</strong></p>
              </div>
            </div>
            <button className="parameters-save" onClick={savePassword}>
              Save All Changes
            </button>
          </>
        )}

        {view === 'successProfile' && (
          <div className="parameters-success">
            <img src={successIcon} alt="success" />
            <h3>Profile Updated !</h3>
            <p>Your profile has been updated successfully.</p>
            <button onClick={backToSettings}>Back to settings</button>
          </div>
        )}

        {view === 'successPassword' && (
          <div className="parameters-success">
            <img src={successIcon} alt="success" />
            <h3>Password Changed !</h3>
            <p>Your password has been changed successfully.</p>
            <button onClick={backToSettings}>Back to settings</button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}