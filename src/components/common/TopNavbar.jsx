import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';
import { getUserName, countUnreadMessages } from '../../services/auth';

const TopNavbar = ({ user, onOpenLogin, onLogout }) => {
  const [userName, setUserName] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);

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

      countUnreadMessages(user.email)
        .then(count => {
          setUnreadMessages(count);
        })
        .catch(error => {
          console.error('Failed to fetch unread messages count:', error);
        });
    }
  }, [user]); 

  return (
    <header className="header">
      <div className="left-section">
      <div className="logo">AI-AID</div>
        {user && <span className="username">Hello {userName} </span>}
        {<span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f44336', marginLeft: '5px' }}>({unreadMessages} msg)</span>
      }
        {user && <Link to="/blog">Blog</Link>}
      </div>
      <div className="right-section">
        {user ? (
          <button className="logout-button" onClick={onLogout}>Logout</button>
        ) : (
          <button className="login-button" onClick={onOpenLogin}>Login</button>
        )}
      </div>
      </header>
    );
};

export default TopNavbar;
