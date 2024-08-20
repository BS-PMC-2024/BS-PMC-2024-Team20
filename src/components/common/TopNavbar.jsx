import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/common.css';
import { getUserName, countUnreadMessages } from '../../services/auth';
import '../../styles/transitionPages.css';
import { FaBell, FaDesktop, FaEllipsisV } from 'react-icons/fa'; // ייבוא אייקונים נוספים

const TopNavbar = ({ user, onOpenLogin, onLogout }) => {
  const [userName, setUserName] = useState('');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false); // מצב ה-Dropdown
  const navigate = useNavigate();

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="left-section">
        <div className="logo" onClick={() => navigate('/student/dashboard')} style={{ cursor: 'pointer' }}>
           <FaDesktop style={{ marginLeft: '8px' }} /> AI-AID
        </div>
        {user && (
          <>
            <Link to="/homepage" className="nav-link">Hello, {userName}</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
          </>
        )}
      </div>
      <div className="right-section">
        {user && (
          <div style={{ position: 'relative', marginRight: '20px', cursor: 'pointer' }}>
            <FaBell size={20} color="#f44336" />
            <span
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                backgroundColor: '#f44336',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
              }}
            >
              {unreadMessages}
            </span>
          </div>
        )}
        {user ? (
          <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
              <FaEllipsisV />
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button className="logout-button" onClick={onLogout}>Logout</button>
                {/* תפריט נוסף בהמשך */}
              </div>
            )}
          </div>
        ) : (
          <button className="login-button" onClick={onOpenLogin}>Login</button>
        )}
      </div>
    </header>
  );
};

export default TopNavbar;
