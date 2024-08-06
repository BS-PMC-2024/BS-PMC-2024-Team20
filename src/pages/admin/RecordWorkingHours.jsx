import React, { useState, useEffect } from 'react';
import { recordWorkingHours, getAdminWorkingHours } from '../../services/auth';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Modal from 'react-modal';
import '../../styles/common.css';
import '../../styles/admin.css';
import '../../styles/SprintMetric.css';

const RecordWorkingHours = () => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState(0);
  const [workingHours, setWorkingHours] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Set to false to not show the modal by default

  useEffect(() => {
    const fetchWorkingHours = async () => {
      const hours = await getAdminWorkingHours();
      setWorkingHours(hours);
    };

    fetchWorkingHours();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await recordWorkingHours(date, hours);
      alert('Working hours recorded successfully!');
    } catch (error) {
      console.error('Error recording working hours:', error);
      alert('Failed to record working hours.');
    }
  };

  const chartData = {
    labels: workingHours.map(data => data.date),
    datasets: [
      {
        label: 'Working Hours',
        data: workingHours.map(data => data.hours),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  return (
    <>
    
      <h2>Record and View Working Hours</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input 
            type="date" 
            className="form-group input"
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Hours:</label>
          <input 
            type="number" 
            className="form-group input"
            value={hours} 
            onChange={(e) => setHours(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="button button-spacing">Submit</button>
      </form>
      <button className="button button-spacing" onClick={() => setIsOpen(true)}>View Working Hours</button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        overlayClassName="custom-modal-overlay"
        className="custom-modal-content"
        contentLabel="Admin Working Hours"
      >
        <h2>Admin Working Hours</h2>
        <button className="button" onClick={() => setIsOpen(false)}>Close</button>
        <Line data={chartData} />
      </Modal>
    </>
  );
};

export default RecordWorkingHours;
