import React, { useState, useEffect } from 'react';

const Quizzes = () => {
  // Mock function to simulate saving a quiz
  const saveQuiz = (quiz, isDraft) => {
    console.log('Saving quiz:', quiz, 'Is draft:', isDraft);
    const id = `quiz-${Date.now()}`;
    return { success: true, message: `Quiz ${isDraft ? 'saved as draft' : 'published'} successfully!`, id };
  };

  const CreatedQuizzesPage = ({ quizzes, setQuizzes, setShowCreatedQuizzes }) => {
    const [showDrafts, setShowDrafts] = useState(false);
    const [saveResult, setSaveResult] = useState(null);

    const handleSaveQuizFromCreated = (quizData, isDraft) => {
      const quizToUpdate = { ...quizData };
      const result = saveQuiz(quizToUpdate, isDraft);
      setSaveResult(result);
     
      if (result.success) {
        setQuizzes(prevQuizzes => {
          const existingIndex = prevQuizzes.findIndex(q => q.id === quizToUpdate.id);
         
          if (existingIndex > -1) {
            const updatedQuizzes = [...prevQuizzes];
            updatedQuizzes[existingIndex] = {
              ...quizToUpdate,
              status: isDraft ? 'draft' : 'published'
            };
            return updatedQuizzes;
          } else {
            return [...prevQuizzes, {
              ...quizToUpdate,
              status: isDraft ? 'draft' : 'published',
              id: result.id || `${isDraft ? 'draft' : 'published'}-${Date.now()}`
            }];
          }
        });
        setShowCreatedQuizzes(false);
      }
    };

    const publishedQuizzes = quizzes.filter(quiz => quiz.status === 'published');
    const draftQuizzes = quizzes.filter(quiz => quiz.status === 'draft');

    return (
      <div style={{
        height: '100%',
        margin: 0,
        backgroundColor: '#f0f7ff',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
      }}>
        <div style={{ padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Created Quizzes</h1>
            <button
              onClick={() => setShowCreatedQuizzes(false)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Back to Quiz Creator
            </button>
          </div>

          {saveResult && (
            <div style={{
              backgroundColor: saveResult.success ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${saveResult.success ? '#34d399' : '#f87171'}`,
              color: saveResult.success ? '#065f46' : '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              position: 'relative'
            }}>
              <strong style={{ fontWeight: 'bold' }}>{saveResult.success ? "Success" : "Error"}</strong>
              <span style={{ display: 'block', marginTop: '0.25rem' }}>{saveResult.message}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {/* Published Quizzes */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#374151' }}>Published Quizzes</h2>
              {publishedQuizzes.length > 0 ? (
                publishedQuizzes.map(quiz => (
                  <div key={quiz.id} style={{
                    marginBottom: '1rem',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0, 0, 100, 0.1)',
                    borderRadius: '0.5rem',
                    padding: '1rem'
                  }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>{quiz.title}</h3>
                    <p style={{ color: '#6b7280' }}>Created: {quiz.createdAt}</p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <span style={{
                        display: 'inline-block',
                        backgroundColor: '#d1fae5',
                        color: '#065f46',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>Published</span>
                    </div>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleSaveQuizFromCreated(quiz, false)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button style={{
                        backgroundColor: '#e5e7eb',
                        color: '#1f2937',
                        fontWeight: 'bold',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}>View</button>
                      <button style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontWeight: 'bold',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#6b7280' }}>No published quizzes yet.</p>
              )}
            </div>

            {/* Draft Quizzes */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>Draft Quizzes</h2>
                <button
                  onClick={() => setShowDrafts(!showDrafts)}
                  style={{
                    backgroundColor: '#e5e7eb',
                    color: '#1f2937',
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {showDrafts ? 'Hide Drafts' : 'Show Drafts'}
                </button>
              </div>
              {showDrafts && (
                <>
                  {draftQuizzes.length > 0 ? (
                    draftQuizzes.map(quiz => (
                      <div key={quiz.id} style={{
                        marginBottom: '1rem',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 3px rgba(0, 0, 100, 0.1)',
                        borderRadius: '0.5rem',
                        padding: '1rem'
                      }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '500' }}>{quiz.title}</h3>
                        <p style={{ color: '#6b7280' }}>Created: {quiz.createdAt}</p>
                        <div style={{ marginTop: '0.5rem' }}>
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>Draft</span>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleSaveQuizFromCreated(quiz, true)}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              fontWeight: 'bold',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.25rem',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Edit
                          </button>
                          <button style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontWeight: 'bold',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}>Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#6b7280' }}>No draft quizzes.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [quizMetadata, setQuizMetadata] = useState({
    quizName: '',
    duration: 30,
    numQuestions: 1,
    totalMark: 10,
    section: '',
    group: ''
  });

  const [questions, setQuestions] = useState([
    { id: 1, type: 'trueOrFalse', text: '', mark: 0, answers: { true: false, false: false } }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showCreatedQuizzes, setShowCreatedQuizzes] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const targetNumQuestions = Number(quizMetadata.numQuestions) || 1;
   
    if (targetNumQuestions > questions.length) {
      const newQuestions = [...questions];
      for (let i = questions.length + 1; i <= targetNumQuestions; i++) {
        newQuestions.push({
          id: i,
          type: 'trueOrFalse',
          text: '',
          mark: 0,
          answers: { true: false, false: false }
        });
      }
      setQuestions(newQuestions);
    } else if (targetNumQuestions < questions.length) {
      const newQuestions = questions.slice(0, targetNumQuestions);
      setQuestions(newQuestions);
      if (currentQuestionIndex >= targetNumQuestions) {
        setCurrentQuestionIndex(targetNumQuestions - 1);
      }
    }
  }, [quizMetadata.numQuestions]);

  useEffect(() => {
    const totalMark = Number(quizMetadata.totalMark) || 0;
    const numQuestions = questions.length;
   
    if (totalMark > 0 && numQuestions > 0) {
      const markPerQuestion = Math.floor(totalMark / numQuestions);
      const remainder = totalMark % numQuestions;
     
      const newQuestions = questions.map((q, index) => ({
        ...q,
        mark: markPerQuestion + (index < remainder ? 1 : 0)
      }));
     
      setQuestions(newQuestions);
    }
  }, [quizMetadata.totalMark, quizMetadata.numQuestions]);

  const quizFields = [
    { id: 'quizName', label: 'Quiz Name', width: '100%', type: 'text' },
    { id: 'duration', label: 'Duration (mins)', width: '100%', type: 'number', min: 1 },
    { id: 'numQuestions', label: 'Number of Questions', width: '100%', type: 'number', min: 1, max: 100 },
    { id: 'totalMark', label: 'Total Mark', width: '100%', type: 'number', min: 0 },
    { id: 'section', label: 'Section', width: '100%', type: 'text' },
    { id: 'group', label: 'Group', width: '100%', type: 'text' },
  ];

  const handleMetadataChange = (field, value) => {
    setQuizMetadata({
      ...quizMetadata,
      [field]: value
    });
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleAddQuestion = () => {
    const newNumQuestions = questions.length + 1;
    handleMetadataChange('numQuestions', newNumQuestions);
   
    const newQuestion = {
      id: newNumQuestions,
      type: 'trueOrFalse',
      text: '',
      mark: 0,
      answers: { true: false, false: false }
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
   
    const totalMark = Number(quizMetadata.totalMark) || 0;
    if (totalMark > 0) {
      const markPerQuestion = Math.floor(totalMark / newNumQuestions);
      const remainder = totalMark % newNumQuestions;
     
      const updatedQuestions = [...questions, newQuestion].map((q, index) => ({
        ...q,
        mark: markPerQuestion + (index < remainder ? 1 : 0)
      }));
     
      setQuestions(updatedQuestions);
    }
  };

  const handleRemoveQuestion = () => {
    if (questions.length <= 1) return;
   
    const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
    setQuestions(newQuestions);
    handleMetadataChange('numQuestions', newQuestions.length);
   
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(newQuestions.length - 1);
    }
   
    const totalMark = Number(quizMetadata.totalMark) || 0;
    if (totalMark > 0 && newQuestions.length > 0) {
      const markPerQuestion = Math.floor(totalMark / newQuestions.length);
      const remainder = totalMark % newQuestions.length;
     
      const updatedQuestions = newQuestions.map((q, index) => ({
        ...q,
        mark: markPerQuestion + (index < remainder ? 1 : 0)
      }));
     
      setQuestions(updatedQuestions);
    }
  };

  const handleFinish = () => {
    setShowAllQuestions(true);
  };

  const updateQuestion = (updates) => {
    const newQuestions = questions.map((q, index) =>
      index === currentQuestionIndex ? { ...q, ...updates } : q
    );
    setQuestions(newQuestions);
   
    if ('mark' in updates) {
      const newTotalMark = newQuestions.reduce((sum, q) => sum + q.mark, 0);
      handleMetadataChange('totalMark', newTotalMark);
    }
  };

  const updateQuestionType = (newType) => {
    let newAnswers;
    switch (newType) {
      case 'trueOrFalse':
        newAnswers = { true: false, false: false };
        break;
      case 'multipleChoice':
        newAnswers = { options: ['', ''], correctAnswers: [] };
        break;
      case 'OnScreen':
        newAnswers = { options: ['', ''], correctAnswers: [] };
        break;
      default:
        newAnswers = { true: false, false: false };
    }
    updateQuestion({ type: newType, answers: newAnswers });
  };

  const handleSaveQuiz = (isDraft) => {
    const quizData = {
      ...quizMetadata,
      questions,
      createdAt: new Date().toLocaleDateString(),
      id: `quiz-${Date.now()}`,
      status: isDraft ? 'draft' : 'published'
    };
   
    const result = saveQuiz(quizData, isDraft);
   
    if (result.success) {
      setQuizzes(prev => [...prev, quizData]);
      setShowAllQuestions(false);
      setQuizMetadata({
        quizName: '',
        duration: 30,
        numQuestions: 1,
        totalMark: 10,
        section: '',
        group: ''
      });
      setQuestions([
        { id: 1, type: 'trueOrFalse', text: '', mark: 0, answers: { true: false, false: false } }
      ]);
      setCurrentQuestionIndex(0);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentTotalMarks = questions.reduce((sum, q) => sum + Number(q.mark || 0), 0);

  const formatTimeRemaining = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderAnswers = () => {
    switch (currentQuestion.type) {
      case 'trueOrFalse':
        const tfAnswers = currentQuestion.answers;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['true', 'false'].map((value) => (
              <div key={value} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '3rem',
                  backgroundColor: '#f0f7ff',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1rem',
                  transition: 'all 0.2s ease'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: '500', color: '#374151', textTransform: 'capitalize' }}>
                    {value}
                  </span>
                  <input
                    type="checkbox"
                    checked={tfAnswers[value]}
                    onChange={(e) => updateQuestion({ answers: { ...tfAnswers, [value]: e.target.checked } })}
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      borderRadius: '0.25rem',
                      border: '2px solid #3b82f6'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 'multipleChoice':
        const mcAnswers = currentQuestion.answers;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mcAnswers.options.map((option, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#fafbff',
                border: '1px solid #e2e8f0',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...mcAnswers.options];
                    newOptions[index] = e.target.value;
                    updateQuestion({ answers: { ...mcAnswers, options: newOptions } });
                  }}
                  style={{
                    flexGrow: 1,
                    height: '3rem',
                    backgroundColor: '#f0f7ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    padding: '0 0.75rem'
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="checkbox"
                  checked={mcAnswers.correctAnswers.includes(index)}
                  onChange={(e) => {
                    const newCorrectAnswers = [...mcAnswers.correctAnswers];
                    if (e.target.checked) {
                      newCorrectAnswers.push(index);
                    } else {
                      const indexToRemove = newCorrectAnswers.indexOf(index);
                      if (indexToRemove > -1) {
                        newCorrectAnswers.splice(indexToRemove, 1);
                      }
                    }
                    updateQuestion({ answers: { ...mcAnswers, correctAnswers: newCorrectAnswers } });
                  }}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    accentColor: '#3b82f6'
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => updateQuestion({ answers: { ...mcAnswers, options: [...mcAnswers.options, ''] } })}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              Add Option
            </button>
          </div>
        );
      case 'OnScreen':
        const NOAnswers = currentQuestion.answers;
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {NOAnswers.options.map((_, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#fafbff',
                border: '1px solid #e2e8f0',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease'
              }}>
                <span style={{
                  flexGrow: 1,
                  height: '3rem',
                  backgroundColor: '#f0f7ff',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  padding: '0 0.75rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  Option {index + 1}
                </span>
                <input
                  type="checkbox"
                  checked={NOAnswers.correctAnswers.includes(index)}
                  onChange={(e) => {
                    const newCorrectAnswers = [...NOAnswers.correctAnswers];
                    if (e.target.checked) {
                      newCorrectAnswers.push(index);
                    } else {
                      const indexToRemove = newCorrectAnswers.indexOf(index);
                      if (indexToRemove > -1) {
                        newCorrectAnswers.splice(indexToRemove, 1);
                      }
                    }
                    updateQuestion({ answers: { ...NOAnswers, correctAnswers: newCorrectAnswers } });
                  }}
                  style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    accentColor: '#3b82f6'
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => updateQuestion({ answers: { ...NOAnswers, options: [...NOAnswers.options, ''] } })}
              style={{
                alignSelf: 'flex-start',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              Add Option
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProgressDots = () => {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        gap: '6px'
      }}>
        {questions.map((_, index) => (
          <div
            key={index}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: index === currentQuestionIndex ? '#3b82f6' : '#cbd5e1',
              margin: '0 2px',
              transition: 'all 0.2s ease',
              transform: index === currentQuestionIndex ? 'scale(1.3)' : 'scale(1)',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentQuestionIndex(index)}
            title={`Question ${index + 1}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      height: '100%',
      margin: 0,
      backgroundColor: '#f0f7ff',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"
    }}>
      <div style={{
        width: '100%',
        maxWidth: '48rem',
        margin: '0 auto',
        padding: '1rem'
      }}>
        {!showCreatedQuizzes ? (
          <div style={{
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0, 0, 100, 0.1)',
            borderRadius: '0.5rem',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '1rem 1.5rem' }}>
              {!showAllQuestions ? (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    {quizFields.map((field) => (
                      <div key={field.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label htmlFor={field.id} style={{
                          marginBottom: '0.25rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#374151'
                        }}>
                          {field.label}
                        </label>
                        <input
                          id={field.id}
                          type={field.type}
                          min={field.min}
                          max={field.max}
                          value={quizMetadata[field.id]}
                          onChange={(e) => handleMetadataChange(field.id, e.target.value)}
                          style={{
                            height: '2rem',
                            width: '100%',
                            backgroundColor: '#f8faff',
                            borderRadius: '0.375rem',
                            border: '1px solid #e2e8f0',
                            padding: '0 0.5rem',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                 
                  <div style={{
                    backgroundColor: '#f0f7ff',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ color: '#1e40af', fontWeight: '500', marginRight: '0.5rem' }}>Duration:</div>
                      <div style={{ backgroundColor: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem' }}>
                        {formatTimeRemaining(quizMetadata.duration)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ color: '#1e40af', fontWeight: '500', marginRight: '0.5rem' }}>Questions:</div>
                      <div style={{ backgroundColor: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem' }}>
                        {currentQuestionIndex + 1} of {quizMetadata.numQuestions}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ color: '#1e40af', fontWeight: '500', marginRight: '0.5rem' }}>Marks:</div>
                      <div style={{ backgroundColor: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem' }}>
                        {currentTotalMarks} / {quizMetadata.totalMark}
                      </div>
                    </div>
                  </div>

                  {renderProgressDots()}

                  <div style={{
                    position: 'relative',
                    borderLeft: '4px solid #3b82f6',
                    paddingLeft: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fafbff',
                    padding: '1.25rem',
                    borderRadius: '0.5rem'
                  }}>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'black',
                      marginBottom: '1rem'
                    }}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h2>
                 
                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="questionType" style={{
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        display: 'block'
                      }}>
                        Question Type
                      </label>
                      <select
                        id="questionType"
                        value={currentQuestion.type}
                        onChange={(e) => updateQuestionType(e.target.value)}
                        style={{
                          width: '100%',
                          height: '3rem',
                          backgroundColor: '#f8faff',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0',
                          fontSize: '1rem',
                          padding: '0 0.75rem'
                        }}
                      >
                        <option value="trueOrFalse">True or False</option>
                        <option value="multipleChoice">Multiple Choice</option>
                        <option value="OnScreen">On Screen</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      {currentQuestion.type !== 'OnScreen' && (
                        <>
                          <label htmlFor="question" style={{
                            marginBottom: '0.5rem',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#374151',
                            display: 'block'
                          }}>
                            Question
                          </label>
                          <input
                            id="question"
                            value={currentQuestion.text}
                            onChange={(e) => updateQuestion({ text: e.target.value })}
                            style={{
                              width: '100%',
                              height: '3rem',
                              backgroundColor: '#f8faff',
                              borderRadius: '0.5rem',
                              border: '1px solid #e2e8f0',
                              padding: '0 0.75rem'
                            }}
                          />
                        </>
                      )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label htmlFor="mark" style={{
                        marginBottom: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#374151',
                        display: 'block'
                      }}>
                        Mark for this question
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          id="mark"
                          type="number"
                          value={currentQuestion.mark}
                          onChange={(e) => updateQuestion({ mark: Number(e.target.value) })}
                          style={{
                            width: '6rem',
                            height: '3rem',
                            backgroundColor: '#f8faff',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            padding: '0 0.75rem'
                          }}
                          min="0"
                        />
                        <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                          Total allocated: {currentTotalMarks}/{quizMetadata.totalMark}
                        </span>
                      </div>
                    </div>
                  </div>

                  <hr style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, #93c5fd, transparent)',
                    border: 'none',
                    margin: '1.5rem 0'
                  }} />

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      marginBottom: '0.75rem',
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151'
                    }}>
                      Answers
                    </label>
                    {renderAnswers()}
                  </div>

                  <hr style={{
                    height: '1px',
                    background: 'linear-gradient(to right, transparent, #93c5fd, transparent)',
                    border: 'none',
                    margin: '1.5rem 0'
                  }} />

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleAddQuestion}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Add Question
                    </button>
                    <button
                      onClick={handleRemoveQuestion}
                      disabled={questions.length <= 1}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        cursor: questions.length <= 1 ? 'not-allowed' : 'pointer',
                        opacity: questions.length <= 1 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Remove Question
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === questions.length - 1}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: currentQuestionIndex === questions.length - 1 ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Next
                    </button>
                    <button
                      onClick={handleFinish}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Finish
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'black',
                    marginBottom: '1.5rem'
                  }}>Quiz Summary</h2>
                 
                  <div style={{
                    backgroundColor: '#f0f7ff',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Quiz Details</h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '1rem'
                    }}>
                      <p><span style={{ fontWeight: '500' }}>Name:</span> {quizMetadata.quizName || 'Untitled Quiz'}</p>
                      <p><span style={{ fontWeight: '500' }}>Duration:</span> {quizMetadata.duration} minutes</p>
                      <p><span style={{ fontWeight: '500' }}>Questions:</span> {questions.length}</p>
                      <p><span style={{ fontWeight: '500' }}>Total Mark:</span> {quizMetadata.totalMark}</p>
                      <p><span style={{ fontWeight: '500' }}>Section:</span> {quizMetadata.section || '-'}</p>
                      <p><span style={{ fontWeight: '500' }}>Group:</span> {quizMetadata.group || '-'}</p>
                    </div>
                  </div>
                 
                  {questions.map((q, index) => (
                    <div key={q.id} style={{
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderLeft: '4px solid #3b82f6',
                      borderRadius: '0.5rem',
                      boxShadow: '0 2px 5px rgba(0, 0, 100, 0.05)',
                      transition: 'all 0.3s ease'
                    }}>
                      <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>Question {index + 1}</h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <p><span style={{ fontWeight: '500' }}>Type:</span> {q.type}</p>
                        <p><span style={{ fontWeight: '500' }}>Mark:</span> {q.mark}</p>
                      </div>
                      {q.type !== 'OnScreen' && <p><span style={{ fontWeight: '500' }}>Text:</span> {q.text || '(No question text)'}</p>}
                     
                      {q.type === 'trueOrFalse' && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                          <p style={{ fontWeight: '500' }}>Answers:</p>
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                            <span>True: {q.answers.true ? '✓' : '✗'}</span>
                            <span>False: {q.answers.false ? '✓' : '✗'}</span>
                          </div>
                        </div>
                      )}
                     
                      {(q.type === 'multipleChoice' || q.type === 'OnScreen') && (
                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem' }}>
                          <p style={{ fontWeight: '500' }}>Options:</p>
                          <ul style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {q.answers.options.map((option, i) => (
                              <li key={i} style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ display: 'inline-block', width: '1.5rem' }}>
                                  {q.answers.correctAnswers.includes(i) ? '✓' : ''}
                                </span>
                                <span>{q.type === 'multipleChoice' ? option || `(Option ${i+1})` : `Option ${i+1}`}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => setShowAllQuestions(false)}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Back to Editing
                    </button>
                    <button
                      onClick={() => handleSaveQuiz(true)}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        backgroundColor: '#d97706',
                        color: 'white',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={() => handleSaveQuiz(false)}
                      style={{
                        height: '2rem',
                        padding: '0 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        borderRadius: '0.375rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowCreatedQuizzes(true)}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  View Created Quizzes
                </button>
            </div>
          </div>
        ) : (
          <CreatedQuizzesPage
            quizzes={quizzes}
            setQuizzes={setQuizzes}
            setShowCreatedQuizzes={setShowCreatedQuizzes}
          />
        )}
      </div>
    </div>
  );
};

export default Quizzes;