import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faTasks } from '@fortawesome/free-solid-svg-icons';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../connections/firebaseConfig';
import { addTask, markTaskAsDone } from '../../services/auth';
import '../../styles/CalendarCard.css';
import '../../styles/transitionPages.css';

const db = getFirestore(app);
//git add src\components\common\Card.jsx
//git commit -m "BSPMS2420-84 <CardContainer>"
//git push origin ShimonBaruch




const CardContainer = ({ icon, title, children }) => {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

const CalendarCard = () => {
  const [date, setDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});

  useEffect(() => {
    const fetchTasksByDate = async () => {
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const tasksData = tasksSnapshot.docs
        .map(doc => doc.data())
        .filter(task => !task.done);

      const tasksGroupedByDate = tasksData.reduce((acc, task) => {
        const dueDate = new Date(task.dueDate).toDateString();
        if (!acc[dueDate]) {
          acc[dueDate] = [];
        }
        acc[dueDate].push(task.title);
        return acc;
      }, {});

      setTasksByDate(tasksGroupedByDate);
    };

    fetchTasksByDate();
  }, []);

  const tileContent = ({ date, view }) => {
    const dateStr = date.toDateString();
    if (view === 'month' && tasksByDate[dateStr]) {
      const tasksList = tasksByDate[dateStr].join(', ');
      return (
        <div className="task-tooltip">
          <span className="dot" style={{ backgroundColor: 'red', borderRadius: '50%', display: 'inline-block', width: '6px', height: '6px', marginLeft: '5px' }}></span>
          <span className="tooltiptext">{tasksList}</span>
        </div>
      );
    }
  };

  return (
    <CardContainer icon={<FontAwesomeIcon icon={faCalendarAlt} />} title="Weekly Calendar">
      <Calendar 
        onChange={setDate} 
        value={date}
        tileContent={tileContent}
      />
    </CardContainer>
  );
};

const TimerCard = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const playBeep = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();

    const playSingleBeep = () => {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, context.currentTime);
      oscillator.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    };

    for (let i = 0; i < 4; i++) {
      setTimeout(playSingleBeep, i * 200);
    }
  };

  useEffect(() => {
    if (isActive && time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            playBeep();
            setIsActive(false);
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, time]);

  const startTimer = () => {
    if (!isActive && time > 0) {
      setIsActive(true);
    }
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTime(0);
  };

  const handleTimeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0) {
      setTime(value);
    }
  };

  return (
    <CardContainer icon={<FontAwesomeIcon icon={faClock} />} title="Timer">
      <div>
        <input 
          type="number" 
          value={time} 
          onChange={handleTimeChange} 
          placeholder="Set time in seconds" 
          min="0" 
        />
        <h2>{time} seconds</h2>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </CardContainer>
  );
};

const TaskCard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchTasks = async () => {
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const tasksData = tasksSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(task => !task.done);
    setTasks(tasksData);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (taskTitle.trim() !== '' && dueDate.trim() !== '') {
      await addTask(taskTitle, dueDate);
      setTaskTitle('');
      setDueDate('');
      fetchTasks();
    }
  };

  const handleMarkAsDone = async (taskId) => {
    await markTaskAsDone(taskId);
    fetchTasks();
  };

  return (
    <CardContainer icon={<FontAwesomeIcon icon={faTasks} />} title="Tasks to Complete">
      <div>
        <input 
          type="text" 
          value={taskTitle} 
          onChange={(e) => setTaskTitle(e.target.value)} 
          placeholder="Enter task title" 
        />
        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          placeholder="Due date" 
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            {task.title} - Due: {task.dueDate} 
            <button onClick={() => handleMarkAsDone(task.id)}>Done</button>
          </li>
        ))}
      </ul>
    </CardContainer>
  );
};

export { CardContainer as Card, CalendarCard, TimerCard, TaskCard };
