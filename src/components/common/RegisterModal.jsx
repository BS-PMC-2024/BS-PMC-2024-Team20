/*
import React, { useState } from 'react';
import { registerUser } from '../../services/auth';
import '../../styles/common.css'; // Includes the unified CSS file
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
import { registerUser } from '../../services/auth';
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
  const [showSurvey, setShowSurvey] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility

  const handleRegisterClick = (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setTermsError('You must accept the terms and conditions to register.');
    } else {
      setTermsError('');

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
              <div className="password-container">
                <input
                  type={showPassword ? 'text' : 'password'} // Toggle password visibility
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="showPassword" className="show-password-label">
                  <input
                    type="checkbox"
                    id="showPassword"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)} // Handle checkbox change
                  />
                  Show Password
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password:</label>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'} // Toggle confirm password visibility
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="showConfirmPassword" className="show-password-label">
                  <input
                    type="checkbox"
                    id="showConfirmPassword"
                    checked={showConfirmPassword}
                    onChange={(e) => setShowConfirmPassword(e.target.checked)} // Handle checkbox change
                  />
                  Show Password
                </label>
              </div>
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
            {/* Survey form code goes here */}
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
