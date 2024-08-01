// src/components/common/SideNavbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';

const SideNavbar = ({ role }) => {
  return (
    <div className="side-navbar">
      <nav className="nav-links">
        {role === 'student' && (
          <>
            <Link to="/student/dashboard">Student Dashboard</Link>
            <Link to="/StudentTeacherCom">talk to Teacher</Link>
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
            <Link to="/TeacherToStudentCom">talk to Student</Link>
            
          </>
        )}

      </nav>
    </div>
  );
};

export default SideNavbar;
