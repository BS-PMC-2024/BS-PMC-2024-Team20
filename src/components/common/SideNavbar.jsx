// src/components/common/SideNavbar.jsx
<<<<<<< HEAD
import { Link } from 'react-router-dom';
import '../../styles/common.css';
import React from 'react';
=======
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';
>>>>>>> 9d49a5e338295bbf171f1a7ded71b99da1ad2d24

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
