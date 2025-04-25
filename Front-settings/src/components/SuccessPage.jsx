// src/components/SuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-sky-50 min-h-screen">
      <div className="bg-sky-500 rounded-full p-4 mb-4">
        <svg
          className="w-12 h-12 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-sky-500 mb-2">Success!</h2>
      <p className="text-sky-500 mb-6 text-center max-w-md">
        Your changes have been saved successfully. You can return to your profile to see the updates.
      </p>

      <Link
        to="/profile"
        className="bg-sky-500 text-white px-6 py-2 rounded-md text-lg font-medium hover:bg-sky-600 transition-colors"
      >
        Back to Profile
      </Link>
    </div>
  );
};

export default SuccessPage;
