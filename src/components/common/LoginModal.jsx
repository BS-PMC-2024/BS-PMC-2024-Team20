import React, { useState } from 'react';
import '../../styles/common.css'; 
import { loginUser } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
//Creating a login window BSPMS2420-11
const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
=======
import {ForgotPassword} from './ForgotPassword.js';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setError('');
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
    try {
      const { user, role } = await loginUser(email, password);
      onLoginSuccess(user, role);
      onClose();
      // Navigate to the appropriate dashboard
      if (role === 'student') navigate('/student/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'teacher') navigate('/teacher/dashboard');
    } catch (error) {
      console.error('Failed to log in:', error);
<<<<<<< HEAD
      setError('Failed to log in: ' + error.message);
    }
  };

=======
      //  setError('Failed to log in: ' + error.message);
    }
  };

  const handleForgotPassword = () => {
    ForgotPassword();
  };

>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
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
<<<<<<< HEAD
          {error && <div className="error-message">{error}</div>}
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
          <div className="form-actions">
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
          <p>Don't have an account? <span className="switch-link" onClick={onSwitchToRegister}>Register here</span></p>
<<<<<<< HEAD
          <p>Forgot Password? <span className="switch-link" onClick={() => { onClose(); navigate('/forgot-password'); }}>Restore Password</span></p>
=======
          <p>Forgot Password? <span className="switch-link" onClick={handleForgotPassword}>Restore Password</span></p>
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
<<<<<<< HEAD
=======

>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
