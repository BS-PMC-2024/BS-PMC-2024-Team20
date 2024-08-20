import React, { useEffect, useState } from 'react';
import '../../styles/studentdashboard.css';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert';

import 'react-calendar/dist/Calendar.css';
import { Card, TaskCard, CalendarCard, TimerCard } from '../../components/common/Card';
import '../../styles/CalendarCard.css';

const StudentDashboard = () => {
  const [firstName, setFirstName] = useState('');
  const [showSurveyAlert, setShowSurveyAlert] = useState(true);
  const navigate = useNavigate();
  const [lastName, setLastName] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [completedTasks, setCompletedTasks] = useState([]);
  const [tasks, setTasks] = useState([]);

  const handleSurveyRedirect = () => {
    setShowSurveyAlert(false);
    navigate('/customSurvey');
  };

  const handleDoNotShowAgain = () => {
    localStorage.setItem('dontShowSurveyAlert', 'true');
    setShowSurveyAlert(false);
  };

  const handleTaskComplete = (task) => {
    setCompletedTasks((prevTasks) => [...prevTasks, task]);
  };

  const handleTaskDone = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, done: true } : task
    );
    setTasks(updatedTasks);

    const completedTask = updatedTasks.find(task => task.id === taskId && task.done);
    if (completedTask) {
      handleTaskComplete(completedTask);
    }
  };

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

    const fetchTasks = async () => {
      const db = getFirestore(app);
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksSnapshot.docs.map(doc => doc.data());
      setTasks(tasksData);

      const completed = tasksData.filter(task => task.done === true);
      setCompletedTasks(completed);
    };

    fetchUserData();
    fetchTasks();

    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    const dontShowAgain = localStorage.getItem('dontShowSurveyAlert');
    if (dontShowAgain === 'true') {
      setShowSurveyAlert(true);
    }

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
      {showSurveyAlert && (
        <SweetAlert
          title="Hey Welcome"
          warning
          showCancel
          confirmBtnText="Enter Survey"
          cancelBtnText="Maybe Later"
          onConfirm={handleSurveyRedirect}
          onCancel={() => setShowSurveyAlert(false)}
          customButtons={
            <>
              <button
                className="btn btn-primary"
                onClick={handleSurveyRedirect}
              >
                Enter Survey
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowSurveyAlert(false)}
              >
                Maybe Later
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDoNotShowAgain}
              >
               Don't Show It Again
              </button>
            </>
          }
        >
          We recommend completing a short survey to enhance your learning experience.
        </SweetAlert>
      )}
      <div className="dashboard-container">
        <CalendarCard />
        <Card icon={<FontAwesomeIcon icon={faTasks} />} title="Completed Tasks">
          <ul className="card-content open">
            {completedTasks.length > 0 ? (
              completedTasks.map((task, index) => (
                <li key={index}>{task.title} - Due: {task.dueDate}</li>
              ))
            ) : (
              <li>No tasks completed yet.</li>
            )}
          </ul>
        </Card>
        <TaskCard tasks={tasks} onComplete={handleTaskDone} />
        <Card icon={<FontAwesomeIcon icon={faLightbulb} />} title="Study Tips">
          <ul className="card-content open">
            <li>Take regular breaks to stay focused.</li>
            <li>Organize your study space.</li>
            <li>Use mnemonic devices to remember information.</li>
          </ul>
        </Card>
        <TimerCard /> {/* הצגת ה-TimerCard */}
      </div>
    </>
  );
};

export default StudentDashboard;
