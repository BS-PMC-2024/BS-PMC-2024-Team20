import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';
import { getUserName } from '../../services/auth';

const TopNavbar = ({ user, onOpenLogin, onLogout }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      getUserName(user.uid)
        .then(name => {
          setUserName(name);
        })
        .catch(error => {
          console.error('Failed to fetch user name:', error);
          setUserName('User');
        });
    }
  }, [user]); 

  return (
    <header className="header">
      <div className="logo">AI-AID</div>
      
      <nav className="nav-links">
        {user && <Link to="/blog">Blog</Link>}
        {user ? (
          <>
            <span className="username">Hello, {userName} </span>
            <button className="logout-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="login-button" onClick={onOpenLogin}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default TopNavbar;
