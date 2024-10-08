// src/components/common/SideNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common.css';

const SideNavbar = ({ role }) => {
  return (
    <div className="side-navbar">
      <nav className="nav-links">
        {role === 'student' && (
          <>
            <Link to="/student/dashboard">Student Dashboard</Link>
            <Link to="/StudentTeacherCom">Talk to Teacher</Link>
            <Link to="/student/StudentRecommendations">Teacher Recommendations</Link>
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
    <Link to="/TeacherToStudentCom">Talk to Student</Link>
    <Link to="/teacher/manage-students">Manage Students</Link>
            
            
          </>
        )}
        <Link to="/chat">Chat with AI</Link>
      </nav>
    </div>
  );
};

export default SideNavbar;


// for - admin - <Link to="/admin/record-working-hours">record-working-hours</Link>