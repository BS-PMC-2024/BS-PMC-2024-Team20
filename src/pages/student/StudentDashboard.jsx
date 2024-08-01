import React, { useEffect, useState } from 'react';
import '../../styles/common.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';


const StudentDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
/*
  useEffect(() => {
    // Fetch user data from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.firstName && user.lastName) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }

    // Update the date and time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
*/
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

  // דוגמה לנתונים
  const upcomingClasses = [
    { subject: 'Mathematics', time: '10:00 AM' },
    { subject: 'Physics', time: '12:00 PM' },
  ];

  const tasks = [
    { title: 'Complete Assignment 1', dueDate: '2024-07-18' },
    { title: 'Prepare for Physics Test', dueDate: '2024-07-20' },
  ];

  const messages = [
    { from: 'Professor Smith', content: 'Don\'t forget to submit your assignment by Friday.' },
    { from: 'Admin', content: 'Campus will be closed on Monday.' },
  ];

  return (
    <>
      <h1>Hello {firstName} {lastName}!</h1>
      <div className="date-time">
        <p>{formatDateTime(currentDateTime)}</p>
      </div>
      <div className="section">
        <h2>Upcoming Classes</h2>
        <ul>
          {upcomingClasses.map((classItem, index) => (
            <li key={index}>{classItem.subject} - {classItem.time}</li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Tasks to Complete</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task.title} - Due: {task.dueDate}</li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Recent Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}><strong>{message.from}:</strong> {message.content}</li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>Study Tips</h2>
        <ul>
          <li>Take regular breaks to stay focused.</li>
          <li>Organize your study space.</li>
          <li>Use mnemonic devices to remember information.</li>
        </ul>
      </div>
    </>
  );
};

export default StudentDashboard;

