// src/components/common/TopNavbar.jsx
import React from 'react';
<<<<<<< HEAD
import '../../styles/common.css';


=======
import { Link } from 'react-router-dom';
import '../../styles/common.css';

>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
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
<<<<<<< HEAD
//Creating a logout button BSPMS2420-23
=======
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24
