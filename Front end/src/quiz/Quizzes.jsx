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
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'true_false', label: 'True/False' }
];

const Quizzes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  
  // Quiz form state
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    time_limit: 30,
    max_attempts: 1,
    assigned_groups: [],
    is_published: false,
    start_time: null,
    end_time: null
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple_choice',
    text: '',
    marks: 1,
    options: ['', ''],
    correctAnswers: []
  });

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
          console.log('No user data found');
          navigate('/login');
          return;
        }

        const userData = JSON.parse(userDataString);
        console.log('User data found:', userData); // Debug log

        // Check if user is a teacher
        if (userData.role !== 'teacher') {
          console.log('User is not a teacher');
          navigate('/');
          return;
        }

        // Skip token verification since we already have a valid session
        setLoading(false);

      } catch (error) {
        console.error('Authentication error:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Fetch only groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || !userData.token) {
          throw new Error('No authentication token found');
        }

        console.log('Fetching groups with token:', userData.token); // Debug log
        
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
      } catch (err) {
        setError('Error loading groups');
        console.error('Groups fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle group selection
  const handleGroupSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setQuizData(prev => ({
      ...prev,
      assigned_groups: selectedOptions
    }));
  };

  // Handle question changes
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const handleCorrectAnswerToggle = (index) => {
    setCurrentQuestion(prev => {
      const newCorrectAnswers = [...prev.correctAnswers];
      const position = newCorrectAnswers.indexOf(index);
      
      if (position > -1) {
        // Remove if already selected
        newCorrectAnswers.splice(position, 1);
      } else {
        // Add new correct answer
        if (prev.type === 'single_choice') {
          // For single choice, clear previous answers
          newCorrectAnswers.splice(0, newCorrectAnswers.length);
        }
        newCorrectAnswers.push(index);
      }
      
      console.log('Updated correct answers:', newCorrectAnswers); // Debug log
      return {
        ...prev,
        correctAnswers: newCorrectAnswers
      };
    });
  };

  const handleAddOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
      correctAnswers: prev.correctAnswers.filter(i => i !== index)
        .map(i => i > index ? i - 1 : i)
    }));
  };

  const handleSaveQuestion = () => {
    // Only save if the question has content
    if (currentQuestion.text && currentQuestion.options.some(opt => opt.trim())) {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex] = {...currentQuestion}; // Create a new object
      setQuestions(newQuestions);
      console.log('Saved question:', currentQuestion);
      console.log('Updated questions array:', newQuestions);
    }
  };

  const handleNextQuestion = () => {
    handleSaveQuestion();
    if (currentQuestionIndex === questions.length) {
      setQuestions([...questions, currentQuestion]);
    }
    setCurrentQuestionIndex(prev => prev + 1);
    setCurrentQuestion({
      type: 'multiple_choice',
      text: '',
      marks: 1,
      options: ['', ''],
      correctAnswers: []
    });
  };

  const handlePreviousQuestion = () => {
    handleSaveQuestion();
    setCurrentQuestionIndex(prev => prev - 1);
    setCurrentQuestion(questions[currentQuestionIndex - 1]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Save current question if it's valid
    if (currentQuestion.text && 
        currentQuestion.options.some(opt => opt.trim()) && 
        currentQuestion.correctAnswers.length > 0) {
      handleSaveQuestion();
    }

    // Get final questions array
    const allQuestions = questions.filter(q => 
      q.text && 
      q.options.some(opt => opt.trim()) && 
      q.correctAnswers.length > 0
    );

    if (allQuestions.length === 0) {
      setError('Please add at least one valid question');
      return;
    }

    setLoading(true);

    try {
      const userDataString = localStorage.getItem('userData');
      if (!userDataString) throw new Error('Please login to continue');
      
      const userData = JSON.parse(userDataString);

      // First create the quiz without questions
      const quizPayload = {
        title: quizData.title,
        description: quizData.description || 'None',
        category: quizData.category,
        time_limit: parseInt(quizData.time_limit),
        max_attempts: parseInt(quizData.max_attempts),
        is_published: quizData.is_published,
        start_time: quizData.start_time,
        end_time: quizData.end_time,
        teacher: userData.id,
        assigned_groups: quizData.assigned_groups
      };

      // Create quiz
      const quizResponse = await fetch(`${API}/api/Quiz/quizzes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizPayload)
      });

      if (!quizResponse.ok) {
        const errorData = await quizResponse.json();
        throw new Error(errorData.detail || 'Failed to create quiz');
      }

      const createdQuiz = await quizResponse.json();
      console.log('Quiz created:', createdQuiz);

      // Prepare all questions for the POST request
      const questionsPayload = allQuestions.map(question => {
        const validOptions = question.options
          .filter(opt => opt.trim())
          .map((optionText, index) => {
            const originalIndex = question.options.indexOf(optionText);
            return {
              text: optionText.trim(),
              is_correct: question.correctAnswers.includes(originalIndex)
            };
          });

        return {
          text: question.text.trim(),
          points: parseInt(question.marks),
          type: 'mcq',
          options: validOptions
        };
      });

      console.log('Sending questions payload:', JSON.stringify(questionsPayload, null, 2));

      // Use POST to add questions to the quiz
      const questionsResponse = await fetch(`${API}/api/Quiz/quizzes/questions/${createdQuiz.id}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${userData.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionsPayload)
      });

      if (!questionsResponse.ok) {
        const errorData = await questionsResponse.json();
        console.error('Questions creation error:', errorData);
        throw new Error(
          Array.isArray(errorData) ? errorData.join(', ') :
          typeof errorData === 'object' ? Object.entries(errorData).map(([k,v]) => `${k}: ${v}`).join(', ') :
          'Failed to add questions to quiz'
        );
      }

      const updatedQuiz = await questionsResponse.json();
      console.log('Quiz updated with questions:', updatedQuiz);

      // Show success message before navigating
      setError(null); // Clear any existing errors
      alert('Quiz successfully created!'); // Simple success notification

      navigate('/programmed', {
        state: { 
          success: true,
          message: 'Quiz created successfully',
          quizId: createdQuiz.id
        }
      });
    } catch (err) {
      setError(err.message);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <NavBar />
      <main className="quiz-content">
        <h1 className="quiz-title">Create New Quiz</h1>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <form className="quiz-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Quiz Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={quizData.title}
                onChange={handleInputChange}
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
                required
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
                {QUIZ_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
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
              <label htmlFor="max_attempts">Maximum Attempts</label>
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
              <label htmlFor="assigned_groups">Assign Groups</label>
              <select
                id="assigned_groups"
                name="assigned_groups"
                multiple
                value={quizData.assigned_groups}
                onChange={handleGroupSelection}
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="is_published">Publish Quiz</label>
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                checked={quizData.is_published}
                onChange={(e) => setQuizData(prev => ({
                  ...prev,
                  is_published: e.target.checked
                }))}
              />
            </div>
            <div className="form-group">
              <label htmlFor="start_time">Start Time</label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={quizData.start_time || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="end_time">End Time</label>
              <input
                type="datetime-local"
                id="end_time"
                name="end_time"
                value={quizData.end_time || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="question-section">
              <h2>Question {currentQuestionIndex + 1}</h2>
              <div className="form-group">
                <label htmlFor="questionType">Question Type</label>
                <select
                  id="questionType"
                  name="type"
                  value={currentQuestion.type}
                  onChange={handleQuestionChange}
                >
                  {QUESTION_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="questionText">Question Text</label>
                <textarea
                  id="questionText"
                  name="text"
                  value={currentQuestion.text}
                  onChange={handleQuestionChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="marks">Marks</label>
                <input
                  type="number"
                  id="marks"
                  name="marks"
                  value={currentQuestion.marks}
                  onChange={handleQuestionChange}
                  min="1"
                  required
                />
              </div>
              <div className="options-section">
                <label>Options</label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="option-group">
                    <input
                      type={currentQuestion.type === 'single_choice' ? 'radio' : 'checkbox'}
                      checked={currentQuestion.correctAnswers.includes(index)}
                      onChange={() => handleCorrectAnswerToggle(index)}
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {currentQuestion.options.length > 2 && (
                      <button type="button" onClick={() => handleRemoveOption(index)}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddOption}>
                  Add Option
                </button>
              </div>
              <div className="question-navigation">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </button>
                <button type="button" onClick={handleNextQuestion}>
                  Next Question
                </button>
              </div>
            </div>
            <div className="button-group">
              <button type="button" onClick={() => navigate(-1)}>
                Cancel Quiz
              </button>
              <button type="submit">
                Finish Quiz
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Quizzes;