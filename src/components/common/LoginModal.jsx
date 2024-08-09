import React, { useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/common.css'; 
import { loginUser } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import {ForgotPassword} from './ForgotPassword.jsx';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
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
      //  setError('Failed to log in: ' + error.message);
      if (error.message.includes('not registered')) {
        Swal.fire({
          icon: 'error',
          title: 'Not Registered',
          text: 'User is not registered. Please register first.',
          confirmButtonText: 'OK'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Failed to log in: ' + 'please register first!',
          confirmButtonText: 'OK'
        });
    }
  };}

  const handleForgotPassword = () => {
    ForgotPassword();
  };

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
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)} 
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <div className="form-actions">
            <button type="submit">Login</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
          <p>Don't have an account? <span className="switch-link" onClick={onSwitchToRegister}>Register here</span></p>
          <p>Forgot Password? <span className="switch-link" onClick={handleForgotPassword}>Restore Password</span></p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;