// import React from 'react';

// const StudentDashboard = () => {
//   return (
//     <div>
//       <h1>Student Dashboard</h1>
//     </div>
//   );
// };

// export default StudentDashboard;


import React, { useEffect, useState } from 'react';
import '../../styles/common.css';

const StudentDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
    <div className="main-content">
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
    </div>
  );
};

export default StudentDashboard;

