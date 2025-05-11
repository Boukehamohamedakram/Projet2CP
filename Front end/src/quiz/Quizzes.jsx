import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import './Quizzes.css';

const API = import.meta.env.VITE_API_URL;

const QUIZ_CATEGORIES = [
  { value: 'math', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'history', label: 'History' },
  { value: 'literature', label: 'Literature' }
];

const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice' },
  { value: 'tf', label: 'True/False' },
  { value: 'text', label: 'Screen-displayed Question' } // Changed from 'open' to 'text'
];

const Quizzes = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    time_limit: 30,
    max_attempts: 1,
    assigned_groups: [],
    start_time: '',
    end_time: '',
    teacher: ''
  });
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'mcq',
    marks: 1,
    options: ['', ''],
    correctAnswers: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch groups and teachers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          throw new Error('No authentication token found');
        }

        // Fetch groups
        const groupsResponse = await fetch(`${API}/api/Quiz/groups/`, {
          headers: {
            'Authorization': `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!groupsResponse.ok) {
          throw new Error('Failed to fetch groups');
        }

        const groupsData = await groupsResponse.json();
        setGroups(groupsData);

        // Fetch teachers
        const teachersResponse = await fetch(`${API}/api/users/users`, {
          headers: {
            'Authorization': `Token ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!teachersResponse.ok) {
          throw new Error('Failed to fetch teachers');
        }

        const teachersData = await teachersResponse.json();
        setTeachers(teachersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle group selection
  const handleGroupSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setQuizData((prev) => ({
      ...prev,
      assigned_groups: selectedOptions
    }));
  };

  const getDefaultOptions = (type) => {
    switch (type) {
      case 'tf':
        return ['True', 'False'];
      default:
        return ['', ''];
    }
  };

  // Handle question changes
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => {
      if (name === 'type') {
        return {
          ...prev,
          [name]: value,
          options: getDefaultOptions(value),
          correctAnswers: value === 'tf' ? [0] : [] // Default True as correct for T/F
        };
      }
      return {
        ...prev,
        [name]: name === "marks" ? parseInt(value, 10) : value
      };
    });
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt))
    }));
  };

  const handleCorrectAnswerToggle = (index) => {
    setCurrentQuestion((prev) => {
      const newCorrectAnswers = [...prev.correctAnswers];
      const position = newCorrectAnswers.indexOf(index);

      if (position > -1) {
        newCorrectAnswers.splice(position, 1);
      } else {
        newCorrectAnswers.push(index);
      }

      return {
        ...prev,
        correctAnswers: newCorrectAnswers
      };
    });
  };

  const handleAddOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correctAnswers: prev.correctAnswers.filter((i) => i !== index)
    }));
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => [...prev, currentQuestion]);
    setCurrentQuestion({
      text: '',
      type: 'mcq',
      marks: 1,
      options: ['', ''],
      correctAnswers: []
    });
  };

  // Submit quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate quiz fields
    if (!quizData.title || !quizData.category || !quizData.time_limit || !quizData.max_attempts) {
        setError("Please fill in all required quiz fields.");
        setLoading(false);
        return;
    }

    // Validate saved questions
    if (questions.length === 0) {
        setError("Please add at least one question.");
        setLoading(false);
        return;
    }

    try {
        const userData = JSON.parse(localStorage.getItem('userData'));

        // Step 1: Create the quiz
        const quizPayload = {
            ...quizData,
        };

        const quizResponse = await fetch(`${API}/api/Quiz/quizzes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userData.token}`
            },
            body: JSON.stringify(quizPayload)
        });

        if (!quizResponse.ok) {
            const errorData = await quizResponse.json();
            throw new Error('Failed to create quiz');
        }

        const quiz = await quizResponse.json();

        // Step 2: Create questions and options for the quiz
        const questionsPayload = {
            questions: questions.map((question) => ({
                text: question.type === 'text' ? 'Screen Question' : question.text, // Changed from 'open' to 'text'
                question_type: question.type,
                points: question.marks,
                options: question.options.map((option, index) => ({
                    text: option,
                    is_correct: question.correctAnswers.includes(index)
                }))
            }))
        };

        const questionsResponse = await fetch(`${API}/api/Quiz/quizzes/${quiz.id}/questions/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${userData.token}`
            },
            body: JSON.stringify(questionsPayload)
        });

        if (!questionsResponse.ok) {
            const errorData = await questionsResponse.json();
            console.error('Questions creation error:', errorData);
            throw new Error('Failed to create questions');
        }

        navigate('/programmed');
    } catch (err) {
        setError(err.message || 'Failed to create quiz or questions');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="quiz-container">
      <NavBar />
      <main className="quiz-content">
        <h1 className="quiz-title">Create New Quiz</h1>
        {error && <div className="error">{error}</div>}
        <form className="quiz-form" onSubmit={handleSubmit}>
          {/* Quiz Details */}
          <div className="form-group">
            <label htmlFor="title">Quiz Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={quizData.title}
              onChange={handleInputChange}
              placeholder="Enter quiz title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={quizData.description}
              onChange={handleInputChange}
              placeholder="Enter quiz description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={quizData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {QUIZ_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time_limit">Time Limit (minutes)</label>
            <input
              type="number"
              id="time_limit"
              name="time_limit"
              value={quizData.time_limit}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="max_attempts">Max Attempts</label>
            <input
              type="number"
              id="max_attempts"
              name="max_attempts"
              value={quizData.max_attempts}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="assigned_groups">Assign to Groups</label>
            <select
              id="assigned_groups"
              name="assigned_groups"
              multiple
              value={quizData.assigned_groups}
              onChange={handleGroupSelection}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="teacher">Assign Teacher</label>
            <select
              id="teacher"
              name="teacher"
              value={quizData.teacher}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start_time">Start Time</label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={quizData.start_time}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_time">End Time</label>
            <input
              type="datetime-local"
              id="end_time"
              name="end_time"
              value={quizData.end_time}
              onChange={handleInputChange}
            />
          </div>

          {/* Add question fields */}
          <h2>Add Questions</h2>
          <div className="form-group">
            <label htmlFor="question_text">Question Text</label>
            <textarea
              id="question_text"
              name="text"
              value={currentQuestion.text}
              onChange={handleQuestionChange}
              placeholder="Enter question text"
              required={currentQuestion.type !== 'text'} // Changed from 'open' to 'text'
              className={`question-input ${currentQuestion.type === 'text' ? 'optional' : ''}`}
            />
          </div>

          <div className="form-group">
            <label htmlFor="question_type">Question Type</label>
            <select
              id="question_type"
              name="type"
              value={currentQuestion.type}
              onChange={handleQuestionChange}
              required
            >
              {QUESTION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="question_points">Points</label>
            <input
              type="number"
              id="question_points"
              name="marks"
              value={currentQuestion.marks}
              onChange={handleQuestionChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Options</label>
            {currentQuestion.type === 'tf' ? (
              <div className="tf-options">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="tf-option">
                    <span>{option}</span>
                    <input
                      type="radio"
                      name="tfCorrect"
                      checked={currentQuestion.correctAnswers.includes(index)}
                      onChange={() => {
                        setCurrentQuestion(prev => ({
                          ...prev,
                          correctAnswers: [index]
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : currentQuestion.type === 'text' ? ( // Changed from 'open' to 'text'
              <div className="screen-options">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-group">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                    />
                    <input
                      type="checkbox"
                      checked={currentQuestion.correctAnswers.includes(index)}
                      onChange={() => handleCorrectAnswerToggle(index)}
                    />
                    <button type="button" onClick={() => handleRemoveOption(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddOption} className="add-option-btn">
                  Add Question
                </button>
              </div>
            ) : (
              <div className="form-group">
                <label>Options</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-group">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    <input
                      type="checkbox"
                      checked={currentQuestion.correctAnswers.includes(index)}
                      onChange={() => handleCorrectAnswerToggle(index)}
                    />
                    <button type="button" onClick={() => handleRemoveOption(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddOption}>
                  Add Option
                </button>
              </div>
            )}
          </div>

          {/* Save Question Button */}
          <button type="button" onClick={handleAddQuestion} className="save-question-button">
            Save Question
          </button>

          {/* Display Saved Questions */}
          <h3>Saved Questions</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index}>
                <strong>{question.text}</strong> ({question.type}) - {question.marks} points
                <ul>
                  {question.options.map((option, i) => (
                    <li key={i}>
                      {option} {question.correctAnswers.includes(i) ? "(Correct)" : ""}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Quiz'}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Quizzes;