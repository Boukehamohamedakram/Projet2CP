import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfilePage({ userInfo, avatarType, setAvatarType, onUpdate }) {
  const [formData, setFormData] = useState({ ...userInfo });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    navigate('/success');
  };

  const toggleAvatar = () => {
    setAvatarType(avatarType === 'male' ? 'female' : 'male');
  };

  return (
    <div className="flex justify-center py-12">
      <div className="bg-sky-400 rounded-lg p-8 w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center sm:items-start">
          <div className="mb-6 sm:mb-0 sm:mr-6">
            <div className="w-32 h-32 rounded-full bg-sky-100 p-1 overflow-hidden relative">
              {avatarType === 'male' ? (
                <img 
                  src="/User-Avatar.png" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <img 
                  src="/User-Avatar.png" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover" 
                />
              )}
              <button
                type="button"
                onClick={toggleAvatar}
                className="absolute bottom-0 left-0 right-0 bg-blue-600 bg-opacity-80 text-xs py-2 text-white font-semibold w-full text-center hover:bg-blue-700 transition-colors"
              >
                Upload New Picture
              </button>
            </div>
          </div>

          <div className="text-white w-full">
            <div className="mb-4">
              <span className="text-xl font-bold">Full name : </span>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                className="bg-blue-300 border-none text-white p-1 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <span className="text-xl font-bold">Email : </span>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="bg-blue-300 border-none text-white p-1 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <span className="text-xl font-bold">Grade : </span>
              <input 
                type="text" 
                name="grade" 
                value={formData.grade} 
                onChange={handleChange} 
                className="bg-blue-300 border-none text-white p-1 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <span className="text-xl font-bold">Module : </span>
              <input 
                type="text" 
                name="module" 
                value={formData.module} 
                onChange={handleChange} 
                className="bg-blue-300 border-none text-white p-1 rounded w-full"
              />
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button 
                type="submit" 
                className="bg-white text-sky-500 text-center px-6 py-2 rounded-full hover:bg-sky-100 transition-colors"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
