import React, { useState } from 'react';
import { registerUser } from '../../services/auth';
<<<<<<< HEAD
import '../../styles/common.css'; // 
=======
import '../../styles/common.css'; // כולל את קובץ ה-CSS המאוחד
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24

const RegisterModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
<<<<<<< HEAD
  const [role, setRole] = useState('student');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(String(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must contain at least 8 characters, including upper/lowercase and numbers';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Save user info to firebase db
      await registerUser(email, password, firstName, lastName, role);
      onClose();
=======
  const [role, setRole] = useState('student'); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
            // Save user info to firebase db
      const user = await registerUser(email, password, firstName, lastName, role);
      onClose(); 
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
    } catch (err) {
      console.error('Failed to register user:', err);
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
<<<<<<< HEAD
            {errors.firstName && <p className="error">{errors.firstName}</p>}
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
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
<<<<<<< HEAD
            {errors.lastName && <p className="error">{errors.lastName}</p>}
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
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
<<<<<<< HEAD
            {errors.email && <p className="error">{errors.email}</p>}
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
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
<<<<<<< HEAD
            {errors.password && <p className="error">{errors.password}</p>}
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
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
<<<<<<< HEAD
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
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
          <div className="form-actions">
            <button type="submit">Register</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;
