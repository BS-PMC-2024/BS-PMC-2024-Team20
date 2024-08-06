import React, { useEffect, useState } from 'react';
import { getAdminWorkingHours } from '../../services/auth';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Modal from 'react-modal';
import '../../styles/common.css';
import '../../styles/admin.css';
import '../../styles/SprintMetric.css';

const AdminWorkingHours = ({ isOpen, onRequestClose }) => {
  const [workingHours, setWorkingHours] = useState([]);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      const hours = await getAdminWorkingHours();
      setWorkingHours(hours);
    };

    fetchWorkingHours();
  }, []);

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
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="custom-modal-overlay"
      className="custom-modal-content"
      contentLabel="Admin Working Hours"
    >
      <h2>Admin Working Hours</h2>
      <button className="button" onClick={onRequestClose}>Close</button>
      <Line data={chartData} />
    </Modal>
  );
};

export default AdminWorkingHours;
