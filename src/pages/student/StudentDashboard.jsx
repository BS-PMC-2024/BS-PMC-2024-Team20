import React, { useEffect, useState } from 'react';
import '../../styles/studentdashboard.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faEnvelope, faLightbulb } from '@fortawesome/free-solid-svg-icons';

import 'react-calendar/dist/Calendar.css';
import { Card, TaskCard, TimerCard, CalendarCard } from '../../components/common/Card';
import '../../styles/CalendarCard.css';




//git add src\pages\student\StudentDashboard.jsx
//git commit -m "BSPMS2420-85 <StudentDashboard- tools dispaly>"
//git push origin ShimonBaruch


const StudentDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [completedTasks, setCompletedTasks] = useState([]);

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

    const fetchCompletedTasks = async () => {
      const db = getFirestore(app);
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksSnapshot.docs.map(doc => doc.data());
      const completed = tasksData.filter(task => task.done === true);
      setCompletedTasks(completed);
    };

    fetchUserData();
    fetchCompletedTasks();

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
      <h1>Hello {firstName} {lastName}!</h1>
      <div className="date-time">
        <p>{formatDateTime(currentDateTime)}</p>
      </div>
      <div className="dashboard-container">
        <CalendarCard />
        <Card icon={<FontAwesomeIcon icon={faTasks} />} title="Completed Tasks">
          <ul>
            {completedTasks.map((task, index) => (
              <li key={index}>{task.title} - Due: {task.dueDate}</li>
            ))}
          </ul>
        </Card>
        <TaskCard />
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
