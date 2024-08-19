import React, { useEffect, useState } from 'react';
import { getUserCountHistory } from '../../services/auth';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const UserCount = () => {
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
        label: 'User Count ',
        data: userCountHistory.map(data => data.count),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };

  return (
    <div>
      <h2>User Count Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default UserCount;
