import React, { useEffect, useState } from 'react';
import '../../styles/studentdashboard.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faComments, faChartLine } from '@fortawesome/free-solid-svg-icons';

import 'react-calendar/dist/Calendar.css';
import { Card, TimerCard } from '../../components/common/Card';
import '../../styles/CalendarCard.css';
import UserCountHistory from './UserCountHistory'; // Import the UserCountHistory component
import UserCount from './UserCount'; // Import the UserCountHistory component
import SurveyResultsChart from './SurveyResultsChart';
import UserRolesChart from './UserRolesChart';
import FeedbackSurvey from './FeedbackSurvey';
import FeedbackList from './FeedbackList';


const AdminDashboard = () => {
  const [setFirstName] = useState('');
  const [ setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
            //setFirstName(userData.firstName);
            //setLastName(userData.lastName);
          }
        }
      }
    };

    fetchUserData();

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
    <>
     
      <div className="date-time">
        <p>{formatDateTime(currentDateTime)}</p>
      </div>
      <div className="dashboard-container">
        <Card icon={<FontAwesomeIcon icon={faChartLine} />} title="Admin Insights">
          <UserCount/>
        </Card>
       
        <Card icon={<FontAwesomeIcon icon={faChartLine} />} title="User Count History">
          <UserCountHistory />
        </Card>
        <Card icon={<FontAwesomeIcon icon={faChartLine} />} title="User Roles Distribution">
            <UserRolesChart />
        </Card>
        <Card icon={<FontAwesomeIcon icon={faChartLine} />} title="Survey Results">
          <SurveyResultsChart />
        </Card>
        <Card icon={<FontAwesomeIcon icon={faTasks} />} title="User Feedback Survey">
          <FeedbackSurvey />
        </Card>
        <Card icon={<FontAwesomeIcon icon={faComments} />} title="User Feedback">
          <FeedbackList />
        </Card>

      </div>
    </>
  );
};

export default AdminDashboard;
