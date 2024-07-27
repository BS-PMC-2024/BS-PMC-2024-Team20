// src/components/common/TopNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';

const TopNavbar = ({ user, onOpenLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">AI-AID</div>
      <nav className="nav-links">
      {user && <Link to="/blog">Blog</Link>}
        {user ? (
          <button className="logout-button" onClick={onLogout}>Logout</button>
        ) : (
          <button className="login-button" onClick={onOpenLogin}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default TopNavbar;
