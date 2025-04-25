// src/components/ProfilePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const userData = {
    fullName: "John Doe",
    email: "john.doe@example.com",
    grade: "3rd Year",
    module: "Web Development",
  };

  return (
    <div className="flex justify-center py-12">
      <div className="bg-sky-400 rounded-lg p-8 w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="mb-6 sm:mb-0 sm:mr-6">
            <img
              src="/User-Avatar.png"
              alt="Profile"
              className="w-40 h-28 rounded-[50%] bg-sky-100 p-1" // Flattened image with a more elliptical shape
            />
          </div>

          <div className="text-white w-full">
            <div className="mb-4">
              <span className="text-xl font-bold">Full name: </span>
              <span className="text-lg">{userData.fullName}</span>
            </div>

            <div className="mb-4">
              <span className="text-xl font-bold">Email: </span>
              <span className="text-lg">{userData.email}</span>
            </div>

            <div className="mb-4">
              <span className="text-xl font-bold">Grade: </span>
              <span className="text-lg">{userData.grade}</span>
            </div>

            <div className="mb-4">
              <span className="text-xl font-bold">Module: </span>
              <span className="text-lg">{userData.module}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
          <Link
            to="/change-password"
            className="bg-white text-sky-500 text-center px-6 py-2 rounded-full hover:bg-sky-100 transition-colors"
          >
            Change Password
          </Link>

          <Link
            to="/edit-profile"
            className="bg-white text-sky-500 text-center px-6 py-2 rounded-full hover:bg-sky-100 transition-colors"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
