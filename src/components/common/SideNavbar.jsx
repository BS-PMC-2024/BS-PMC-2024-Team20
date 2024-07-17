// src/components/common/SideNavbar.jsx
import { Link } from 'react-router-dom';
import '../../styles/common.css';
import React from 'react';

const SideNavbar = ({ role }) => {
  return (
    <div className="side-navbar">
      <nav className="nav-links">
        {role === 'student' && (
          <>
            <Link to="/student/dashboard">Student Dashboard</Link>
          </>
        )}
        {role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
            <Link to="/admin/manage-users">Manage Users</Link>
          </>
        )}
        {role === 'teacher' && (
          <>
            <Link to="/teacher/dashboard">Teacher Dashboard</Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default SideNavbar;
