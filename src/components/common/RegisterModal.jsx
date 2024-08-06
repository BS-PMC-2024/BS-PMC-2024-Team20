/*
import React, { useState } from 'react';
import { registerUser, isTermsAccepted } from '../../services/auth';
import '../../styles/common.css'; // כולל את קובץ ה-CSS המאוחד

const RegisterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [registrationError, setRegistrationError] = useState('');

  const handleRegisterClick = (e) => {
    if (!termsAccepted) {
      setTermsError('You must accept the terms and conditions to register.');
      e.preventDefault(); // מניעת שליחת הטופס
    } else {
      setTermsError(''); // איפוס הודעת השגיאה במידה ותנאים התקבלו
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    setTermsError('');

    console.log("Submitting form...");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Role:", role);
    console.log("Terms Accepted:", termsAccepted);

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      console.log("Passwords do not match.");
      return;
    }

    try {
      await registerUser(email, password, firstName, lastName, role);
      console.log("User registered successfully.");
      onClose();
    } catch (err) {
      
      console.error('Failed to register user:', err);
      if (err.code === 'auth/email-already-in-use') {
        setRegistrationError('The email address is already in use by another account.');
      } else {
        setRegistrationError('Failed to register user. Please try again later.');
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
    console.log("Checkbox changed:", e.target.checked);
    if (e.target.checked) {
      setTermsError(''); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="terms">
              I accept the terms and conditions
            </label>
          </div>
          {termsError && <p className="error">{termsError}</p>}
          {registrationError && <p className="error">{registrationError}</p>}
          <div className="form-actions">
            <button type="submit" onClick={handleRegisterClick}>Register</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
*/
//sprint 3 -
import React, { useState } from 'react';
import { registerUser, isTermsAccepted } from '../../services/auth';
import '../../styles/common.css'; 
import '../../styles/survey.css';

const RegisterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const [showSurvey, setShowSurvey] = useState(false); // מצב שמנהל את הצגת השאלון

  // שאלון לסטודנטים
  const [about, setAbout] = useState(''); // תיבת טקסט 'ספר לי על עצמך'
  const [difficulty, setDifficulty] = useState(''); // dropdown לנושא הקשה
  const [preferredEnvironment, setPreferredEnvironment] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [learningStrategies, setLearningStrategies] = useState('');
  const [emotionalSupport, setEmotionalSupport] = useState('');
  const [studyTime, setStudyTime] = useState('');

  const handleRegisterClick = (e) => {
    e.preventDefault(); // prevent form submission

    if (!termsAccepted) {
      setTermsError('You must accept the terms and conditions to register.');
    } else {
      setTermsError('');

      // disply the survey only if the user is student
      if (role === 'student') {
        setShowSurvey(true);
      } else {
        handleSubmit(e); 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegistrationError('');
    setTermsError('');

    try {
      await registerUser(email, password, firstName, lastName, role);
      console.log("User registered successfully.");
      onClose();
    } catch (err) {
      console.error('Failed to register user:', err);
      if (err.code === 'auth/email-already-in-use') {
        setRegistrationError('The email address is already in use by another account.');
      } else {
        setRegistrationError('Failed to register user. Please try again later.');
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
    console.log("Checkbox changed:", e.target.checked);
    if (e.target.checked) {
      setTermsError(''); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Register</h2>
        {!showSurvey ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div className="form-group">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms">
                I accept the terms and conditions
              </label>
            </div>
            {termsError && <p className="error">{termsError}</p>}
            {registrationError && <p className="error">{registrationError}</p>}
            <div className="form-actions">
              <button type="submit" onClick={handleRegisterClick}>Register</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="about">tell me about yourself:</label>
              <textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows="4"
              />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">In which subject do you have difficulty:</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Choose a topic</option>
                <option value="math">Math</option>
                <option value="physics">Physics</option>
                <option value="programming">Software</option>
                <option value="electronics">electronics</option>
                <option value="mechanics">mechanics</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="preferred-environment">Preferred learning environment:</label>
              <select
                id="preferred-environment"
                value={preferredEnvironment}
                onChange={(e) => setPreferredEnvironment(e.target.value)}
              >
                <option value="">Select an environment</option>
                <option value="quiet">Completely silent</option>
                <option value="music">with music in the background</option>
                <option value="white-noise">with white noise</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="learning-goals">Educational goals:</label>
              <textarea
                id="learning-goals"
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                rows="2"
              />
            </div>
            <div className="form-group">
              <label htmlFor="learning-strategies">Preferred learning strategies:</label>
              <textarea
                id="learning-strategies"
                value={learningStrategies}
                onChange={(e) => setLearningStrategies(e.target.value)}
                rows="2"
              />
            </div>
            <div className="form-group">
              <label htmlFor="emotional-support">emotional support:</label>
              <select
                id="emotional-support"
                value={emotionalSupport}
                onChange={(e) => setEmotionalSupport(e.target.value)}
              >
                <option value="">Select Service</option>
                <option value="counseling">consultation</option>
                <option value="workshops">Time management workshops</option>
                <option value="emotional-support">emotional support</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="study-time">Preferred study times:</label>
              <select
                id="study-time"
                value={studyTime}
                onChange={(e) => setStudyTime(e.target.value)}
              >
                <option value="">Choose a time</option>
                <option value="morning">morning</option>
                <option value="afternoon">noon</option>
                <option value="night">night</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">Submit Survey</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
