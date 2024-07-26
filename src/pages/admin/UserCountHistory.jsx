import React, { useEffect, useState } from 'react';
import { getUserCountHistory } from '../../services/auth';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Modal from 'react-modal';

const UserCountHistory = ({ isOpen, onRequestClose }) => {
  const [userCountHistory, setUserCountHistory] = useState([]);

  useEffect(() => {
    const fetchUserCountHistory = async () => {
      const history = await getUserCountHistory();
      setUserCountHistory(history);
    };

    fetchUserCountHistory();
  }, []);

  const chartData = {
    labels: userCountHistory.map(data => data.time.toLocaleString()),
    datasets: [
      {
        label: 'User Count Over Time',
        data: userCountHistory.map(data => data.count),
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
      contentLabel="User Count History"
    >
      <h2>User Count Over Time</h2>
      <button onClick={onRequestClose}>Close</button>
      <Line data={chartData} />
    </Modal>
  );
};

export default UserCountHistory;
