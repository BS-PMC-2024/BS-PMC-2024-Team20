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
import ForgotPassword from './services/ForgotPassword.js';

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

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      setRole(null);
      localStorage.removeItem('userRole');
      Swal.fire({
        title: 'התנתקת בהצלחה',
        text: 'לחץ על אישור להמשך',
        icon: 'success',
        confirmButtonText: 'אישור',
        customClass: {
          confirmButton: 'swal-button'
        }
      }).then(() => {
        navigate('/');
      });
    });
  };

  return (
    <Layout user={user} role={role} onOpenLogin={() => setIsLoginOpen(true)} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        {role === 'student' && <Route path="/student/dashboard" element={<StudentDashboard />} />}
        {role === 'admin' && (
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />
          </>
        )}
        {role === 'teacher' && <Route path="/teacher/dashboard" element={<TeacherDashboard />} />}
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
          localStorage.setItem('userRole', role);
        }}
      />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </Layout>
  );
};

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;


/*import sweetalert2

npm install sweetalert2

*/