import React, { useState, useEffect, useRef } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import './Student.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Assets
import searchIcon from '../assets/search-icon.png';
import studentAvatar from '../assets/Avatar.png';

export default function Student() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    username: "",
    email: "",
    role: "student"
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    id: null,
    username: "",
    email: "",
    role: "student"
  });

  // Get API URL from environment variables
  const API = import.meta.env.VITE_API_URL;

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.get(`${API}/api/users/users/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Filter users with role "student" and transform data
      const studentUsers = response.data
        .filter(user => user.role === "student")
        .map(user => ({
          id: user.id,
          name: user.username,
          email: user.email,
          class: user.class || 'Not Assigned', // Add default value if class is not present
          studentId: user.student_id || `ST${user.id}` // Add default value if student_id is not present
        }));

      setStudents(studentUsers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [API]);

  // Function to handle single student creation
  const handleAddStudent = async () => {
    try {
      // Validate inputs
      if (!newStudent.username.trim()) {
        setError("Username is required");
        return;
      }
      if (!newStudent.email.trim()) {
        setError("Email is required");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newStudent.email)) {
        setError("Please enter a valid email address");
        return;
      }

      const payload = {
        username: newStudent.username,
        email: newStudent.email,
        password: "12345678", // Default password
        role: "student"
      };

      console.log("Creating student:", payload);

      const response = await fetch(`${API}/api/users/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Student created successfully:", data);
        // Refresh student list
        await fetchStudents();
        // Close modal and reset form
        setShowAddModal(false);
        setNewStudent({ username: "", email: "", role: "student" });
        setError("");
      } else {
        const errorMsg = data.error || data.message || JSON.stringify(data);
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Error creating student:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  // Function to handle bulk student upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log("Uploading file:", file.name);

      const response = await axios.post(
        `${API}/api/users/users/bulk-upload/`,
        formData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Upload response:", response.data);
      await fetchStudents(); // Refresh the student list
      setError(""); // Clear any existing errors
    } catch (err) {
      console.error("Error uploading file:", err);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.message || 
                          "Failed to upload file";
      setError(errorMessage);
    }
  };

  // Function to handle student management
  const handleManageStudent = (student) => {
    setSelectedStudent({
      id: student.id,
      username: student.name,
      email: student.email,
      role: "student"
    });
    setShowManageModal(true);
  };

  // Function to update student info
  const handleUpdateStudent = async () => {
    try {
      const token = getAuthToken();
      
      // Validate inputs
      if (!selectedStudent.username.trim()) {
        setError("Username cannot be empty");
        return;
      }
      
      if (!selectedStudent.email.trim()) {
        setError("Email cannot be empty");
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(selectedStudent.email)) {
        setError("Please enter a valid email address");
        return;
      }

      const userData = {
        id: selectedStudent.id,
        username: selectedStudent.username,
        email: selectedStudent.email,
        role: selectedStudent.role
      };

      const response = await axios.put(
        `${API}/api/users/users/${selectedStudent.id}/`,
        userData,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Update response:", response.data);
      setShowManageModal(false);
      await fetchStudents(); // Refresh the list
      setError("");
    } catch (err) {
      console.error("Error updating student:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to update student");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // Function to delete student
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      const token = getAuthToken();
      
      const response = await axios.delete(
        `${API}/api/users/users/${studentId}/`,
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Delete response:", response.data);
      await fetchStudents(); // Refresh the list
      setError("");
    } catch (err) {
      console.error("Error deleting student:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to delete student");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  // Enhanced search function
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase().trim();
    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.class.toLowerCase().includes(query) ||
      student.studentId.toString().toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <>
      <NavBar />
      <main className="student-main">
        <section className="student-header">
          <div className="student-actions">
            <h1 className="student-title">
              <button 
                className="add-student-btn"
                onClick={() => setShowAddModal(true)}
              >
                Add New Student <span className="student-add">＋</span>
              </button>
            </h1>
            
            {/* Bulk upload input */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button 
              className="bulk-upload-btn"
              onClick={() => fileInputRef.current.click()}
            >
              Bulk Upload
            </button>
          </div>

          <div className="student-filter-search">
            <img src={searchIcon} alt="Search" className="ss-icon" />
            <input
              type="text"
              placeholder="Search by name, email, class or ID"
              className="ss-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Student</h2>
              <div className="form-group">
                <label className="form-label">Enter student username:</label>
                <div className="input-field">
                  <input
                    type="text"
                    value={newStudent.username}
                    onChange={(e) => setNewStudent({
                      ...newStudent,
                      username: e.target.value
                    })}
                    required
                    className="input-control"
                    placeholder="student123"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Enter student email:</label>
                <div className="input-field">
                  <input
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({
                      ...newStudent,
                      email: e.target.value
                    })}
                    required
                    className="input-control"
                    placeholder="student@example.com"
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-buttons">
                <button 
                  onClick={handleAddStudent}
                  className="login-button"
                >
                  Add Student
                </button>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setError("");
                    setNewStudent({ username: "", email: "", role: "student" });
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Manage Student Modal */}
        {showManageModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Manage Student</h2>
              <div className="form-group">
                <label className="form-label">Username:</label>
                <div className="input-field">
                  <input
                    type="text"
                    value={selectedStudent.username}
                    onChange={(e) => setSelectedStudent({
                      ...selectedStudent,
                      username: e.target.value
                    })}
                    required
                    className="input-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email:</label>
                <div className="input-field">
                  <input
                    type="email"
                    value={selectedStudent.email}
                    onChange={(e) => setSelectedStudent({
                      ...selectedStudent,
                      email: e.target.value
                    })}
                    required
                    className="input-control"
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="modal-buttons">
                <button 
                  onClick={handleUpdateStudent}
                  className="login-button"
                >
                  Update Student
                </button>
                <button 
                  onClick={() => {
                    setShowManageModal(false);
                    setError("");
                    setSelectedStudent({
                      id: null,
                      username: "",
                      email: "",
                      role: "student"
                    });
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="student-list">
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <div key={student.id} className="student-row">
                <div className="student-card">
                  <img
                    src={studentAvatar}
                    alt={student.name}
                    className="student-avatar"
                  />
                  <span className="student-name">{student.name}</span>
                  <span className="student-class">{student.class}</span>
                  <span className="student-id">{student.studentId}</span>
                  <div className="student-actions-buttons">
                    <button 
                      className="student-manage"
                      onClick={() => handleManageStudent({
                        id: student.id,
                        name: student.name,
                        email: student.email
                      })}
                    >
                      Manage
                    </button>
                    <button 
                      className="student-delete"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              No students found matching "{searchQuery}"
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}