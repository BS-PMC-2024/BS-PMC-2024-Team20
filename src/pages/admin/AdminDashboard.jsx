import React, { useEffect, useState } from 'react';
import '../../styles/common.css';
//import '../../styles/admin.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import UserCountHistory from './UserCountHistory';
import { getUserCountHistory } from '../../services/auth';
import Modal from 'react-modal';

// הגדרת האלמנט הראשי של האפליקציה עבור react-modal
Modal.setAppElement('#root');

const AdminHome = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [isUserCountHistoryModalOpen, setIsUserCountHistoryModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, 'userRoles', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.firstName && userData.lastName) {
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
          }
        }
      }
    };

    fetchUserData();

    // Update the date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="main-content">
      <h1>Hello {firstName} {lastName}!</h1>
      <div className="date-time">
        <p>{formatDateTime(currentDateTime)}</p>
      </div>
      <div className="section">
        <h2>Statistics</h2>
        <button className="statistic-preview" onClick={() => setIsUserCountHistoryModalOpen(true)}>
          <h3>User Count History</h3>
          <p>Click to view details</p>
        </button>
      </div>

      <UserCountHistory
        isOpen={isUserCountHistoryModalOpen}
        onRequestClose={() => setIsUserCountHistoryModalOpen(false)}
      />
    </div>
  );
};

export default AdminHome;
