import React, { useState, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const Card = ({ icon, title, children }) => {
  return (
    <div className="card">
      {/* השתמש ברכיב FontAwesomeIcon להצגת האייקון */}
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

const CalendarCard = () => {
  const [date, setDate] = useState(new Date());

  return (
    <Card icon={<FontAwesomeIcon icon={faCalendarAlt} />} title="Weekly Calendar">
      <Calendar onChange={setDate} value={date} />
    </Card>
  );
};

const TimerCard = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
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

  return (
    <Card icon={<FontAwesomeIcon icon={faClock} />} title="Timer">
      <div>
        <h2>{time} seconds</h2>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </Card>
  );
};

export { Card, CalendarCard, TimerCard };
