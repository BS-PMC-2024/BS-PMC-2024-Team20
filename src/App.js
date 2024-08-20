import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from './components/common/Layout';
import LoginModal from './components/common/LoginModal';
import RegisterModal from './components/common/RegisterModal';
import HomePage from './pages/HomePage';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import { auth } from './connections/firebaseConfig';
import { getRole } from './services/auth';
import  saveUserSession  from './services/saveUserSession';




import Blog from './components/common/blog';
// Communication
import StudentTeacherTOCom from './components/Communication/StudentToTeacherCom';
import TeacherToStudentCom from './components/Communication/TeacherToStudentCom';

import TermsOfService from './pages/TermsOfService';
import Footer from './components/common/Footer';
import ContactAdmin from './components/Communication/ContactAdmin.jsx';
import SendContactAdmin from './components/Communication/SendContactAdmin.jsx';
import Chat from './components/common/Chat'; // ייבוא הקומפוננטה Chat
import ChatIcon from './components/common/ChatIcon'; // ייבוא הקומפוננטה ChatIcon
import ViewStudent from './pages/teacher/ViewStudent';
import ManageStudents from './pages/teacher/ManageStudents';

import AdminWorkingHours from './pages/admin/AdminWorkingHours';
import RecordWorkingHours from './pages/admin/RecordWorkingHours'

import StudentRecommendations from './pages/student/StudentRecommendations';

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('userRole'));
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userRole = await getRole(user.uid);
        setRole(userRole);
        localStorage.setItem('userRole', userRole);
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('userRole');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const storedRole = localStorage.getItem('userRole');
      if (storedRole) {
        setRole(storedRole);
      } else if (user) {
        const userRole = await getRole(user.uid);
        setRole(userRole);
        localStorage.setItem('userRole', userRole);
      }
    };
    checkUser();
  }, [navigate, user]);

  const handleLogout = async () => {
    try {
      await saveUserSession("logout"); 
      await auth.signOut();
      setUser(null);
      setRole(null);
      localStorage.removeItem('userRole');
      Swal.fire({
        title: 'Logout successfuly!',
        text: 'click confirm to continue',
        icon: 'success',
        confirmButtonText: 'confirm',
        customClass: {
          confirmButton: 'swal-button'
        }
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  return (
    <Layout user={user} role={role} onOpenLogin={() => setIsLoginOpen(true)} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms-of-service" element={<TermsOfService />} /> 
        {role === 'student' && <Route path="/student/dashboard" element={<StudentDashboard />} />}
        {role === 'student' && (
        <>
          <Route path="/student/StudentRecommendations" element={<StudentRecommendations />} />
        </>
        )}
        {role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
            <Route path="/contact-admin" element={<ContactAdmin />} />
            <Route path="/admin/working-hours" element={<AdminWorkingHours />} />
            <Route path="/admin/record-working-hours" element={<RecordWorkingHours />} />
           
          </>
        )}
        {role === 'teacher' && <Route path="/teacher/dashboard" element={<TeacherDashboard />} />}
        {role === 'teacher' && (
        <>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/manage-students" element={<ManageStudents />} />
          <Route path="/teacher/view-student/:studentId" element={<ViewStudent />} />
        </>
        )}


        <Route path="/blog" element={<Blog />} />
        <Route path="/StudentTeacherCom" element={<StudentTeacherTOCom />} />
        <Route path="/TeacherToStudentCom" element={<TeacherToStudentCom />} />
        <Route path="/send-contact-admin" element={<SendContactAdmin />} />
        <Route path="/terms-of-service" element={<TermsOfService />} /> 
        <Route path="/chat" element={<Chat />} /> {/* הוספת הראוט לקומפוננטת Chat */}
      </Routes>
      <LoginModal  
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
        onLoginSuccess={(user, role) => {
          setUser(user);
          setRole(role);
          saveUserSession("login"); 
          localStorage.setItem('userRole', role);
        }}
      />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      
      <ChatIcon /> {  } <Footer />
      
    </Layout>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
