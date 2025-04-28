import React from "react";
import "./ProfileCard.css";
import avatarPlaceholder from "../assets/avatar-placeholder.png";

// ← swap this path for your real avatar or make it a prop.

export default function ProfileCard({
  fullName = "John Doe",
  email = "john@example.com",
  onChangePassword = () => {},
  onUpdateProfile = () => {},
}) {
  return (
    <div className="profile-card">
      <div className="profile-avatar">
        <img src={avatarPlaceholder} alt="avatar" />
      </div>
      <div className="profile-details">
        <div className="detail">
          <span className="label">Full name:</span>
          <span className="value">{fullName}</span>
        </div>
        <div className="detail">
          <span className="label">Email:</span>
          <span className="value">{email}</span>
        </div>
      </div>
      <div className="profile-actions">
        <button className="btn-outline" onClick={onChangePassword}>
          Change password
        </button>
        <button className="btn-solid" onClick={onUpdateProfile}>
          Update Profile
        </button>
      </div>
    </div>
  );
}
