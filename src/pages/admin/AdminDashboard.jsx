import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { getUserCountHistory } from '../../services/auth';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const MySwal = withReactContent(Swal);

const AdminHome = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userTarget] = useState(100); 

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(app);
      const db = getFirestore(app);
      const user = auth.currentUser;

      if (user) {
        const userDoc = await getDoc(doc(db, 'userRoles', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
        }
      }
    };

    fetchUserData();
  }, []);

  const formatDateTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const openPhiChartPopup = async () => {
    const userCountHistory = await getUserCountHistory(); // להביא את היסטוריית המשתמשים
    const currentUserCount = userCountHistory.length > 0 ? userCountHistory[userCountHistory.length - 1].count : 0;
    const remainingUsers = userTarget - currentUserCount > 0 ? userTarget - currentUserCount : 0;

    const data = {
      labels: ['Actual Users', 'Remaining Users'],
      datasets: [{
        data: [currentUserCount, remainingUsers],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384']
      }]
    };

    MySwal.fire({
      title: 'User Count Target vs Actual',
      html: <Doughnut data={data} />,
      showCloseButton: true,
      confirmButtonText: 'Close',
      width: '600px',
      padding: '20px',
      customClass: {
        popup: 'custom-swal-popup'
      }
    });
  };

  return (
    <>
      <h1>Hello {firstName} {lastName}!</h1>
      <div className="date-time">
        <p>{formatDateTime(new Date())}</p>
      </div>
      <div className="section">
        <h2>Statistics</h2>
        <button className="statistic-preview" onClick={openPhiChartPopup}>
          <h3>User Target vs Actual</h3>
          <p>Click to view details</p>
        </button>
      </div>
    </>
  );
};

export default AdminHome;
