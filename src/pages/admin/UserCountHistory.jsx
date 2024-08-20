import React, { useEffect, useState } from 'react';
import { getUserCountHistory } from '../../services/auth';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const UserCountHistory = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUserCountHistory = async () => {
      const history = await getUserCountHistory();
      if (history.length > 0) {
        const latestCount = history[history.length - 1].count;
        setUserCount(latestCount);
      }
    };

    fetchUserCountHistory();
  }, []);

  const targetCount = 50;
  const remainingCount = targetCount - userCount;

  const chartData = {
    labels: ['Current Users', 'Remaining to 100'],
    datasets: [
      {
        data: [userCount, remainingCount > 0 ? remainingCount : 0],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        hoverBackgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h2>User Count Progress</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default UserCountHistory;
