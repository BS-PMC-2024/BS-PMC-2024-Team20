// src/pages/teacher/TeacherDashboard.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/common.css';
import '../../styles/teacher.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';

const TeacherDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // useEffect(() => {
  //   // Fetch user data from local storage
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   if (user && user.firstName && user.lastName) {
  //     setFirstName(user.firstName);
  //     setLastName(user.lastName);
  //   }

  //   // Update the date and time every second
  //   const timer = setInterval(() => {
  //     setCurrentDateTime(new Date());
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, []);


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
    { title: 'Grade Assignment 1', dueDate: '2024-07-18' },
    { title: 'Prepare for Physics Lecture', dueDate: '2024-07-20' },
  ];

  const messages = [
    { from: 'Student A', content: 'Could you please clarify the homework?' },
    { from: 'Admin', content: 'Staff meeting on Friday at 3 PM.' },
  ];

  const announcements = [
    { content: 'Assignment 1 has been graded.' },
    { content: 'Next week’s lecture will cover Chapter 5.' },
  ];

  return (
    <div className="teacher-dashboard">
      <h1>שלום {firstName} {lastName}!</h1>
      <div className="date-time">
        <p>{formatDateTime(currentDateTime)}</p>
      </div>
      <div className="section">
        <h2>שיעורים קרובים</h2>
        <ul>
          {upcomingClasses.map((classItem, index) => (
            <li key={index}>{classItem.subject} - {classItem.time}</li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>משימות להשלמה</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task.title} - תאריך יעד: {task.dueDate}</li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>הודעות אחרונות</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}><strong>{message.from}:</strong> {message.content}</li>
          ))}
        </ul>
      </div>
      <div className="section">
        <h2>הודעות ועדכונים</h2>
        <ul>
          {announcements.map((announcement, index) => (
            <li key={index}>{announcement.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherDashboard;
