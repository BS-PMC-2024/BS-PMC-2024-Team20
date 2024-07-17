// src/components/common/TopNavbar.jsx
import React from 'react';
import '../../styles/common.css';


const TopNavbar = ({ user, onOpenLogin, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">AI-AID</div>
      <nav className="nav-links">
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
//Creating a logout button BSPMS2420-23
