import React, { useEffect, useState } from 'react';
import '../../styles/studentdashboard.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faEnvelope, faLightbulb } from '@fortawesome/free-solid-svg-icons';

import 'react-calendar/dist/Calendar.css';
import { Card, CalendarCard, TimerCard } from '../../components/common/Card';

const StudentDashboard = () => {
  // משתני state להגדרת שם המשתמש והזמן הנוכחי
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // נתונים להדמיה (במקום קבלת מידע מפיירבייס)
  const tasks = [
    { title: 'Complete Assignment 1', dueDate: '2024-07-18' },
    { title: 'Prepare for Physics Test', dueDate: '2024-07-20' },
  ];

  const messages = [
    { from: 'Professor Smith', content: 'Don\'t forget to submit your assignment by Friday.' },
    { from: 'Admin', content: 'Campus will be closed on Monday.' },
  ];

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

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // פונקציה לעיצוב הזמן
  const formatDateTime = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <>
      { <h1>Hello {firstName} {lastName}!</h1> }
      <div className="date-time">
        <p>{formatDateTime(currentDateTime)}</p>
      </div>
      <div className="dashboard-container">
        <CalendarCard />
        <Card icon={<FontAwesomeIcon icon={faTasks} />} title="Tasks to Complete">
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>{task.title} - Due: {task.dueDate}</li>
            ))}
          </ul>
        </Card>
        <Card icon={<FontAwesomeIcon icon={faEnvelope} />} title="Recent Messages">
          <ul>
            {messages.map((message, index) => (
              <li key={index}><strong>{message.from}:</strong> {message.content}</li>
            ))}
          </ul>
        </Card>
        <Card icon={<FontAwesomeIcon icon={faLightbulb} />} title="Study Tips">
          <ul>
            <li>Take regular breaks to stay focused.</li>
            <li>Organize your study space.</li>
            <li>Use mnemonic devices to remember information.</li>
          </ul>
        </Card>
        <TimerCard />
      </div>
    </>
  );
};

export default StudentDashboard;
