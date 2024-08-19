import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { app } from '../../connections/firebaseConfig';

const db = getFirestore(app);

const UserRolesChart = () => {
  const [rolesData, setRolesData] = useState({});

  useEffect(() => {
    const fetchUserRoles = async () => {
      const usersSnapshot = await getDocs(collection(db, 'userRoles'));
      const rolesCount = {};

      usersSnapshot.forEach(doc => {
        const role = doc.data().role;
        if (rolesCount[role]) {
          rolesCount[role]++;
        } else {
          rolesCount[role] = 1;
        }
      });

      setRolesData(rolesCount);
    };

    fetchUserRoles();
  }, []);

  const chartData = {
    labels: Object.keys(rolesData),
    datasets: [
      {
        data: Object.values(rolesData),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        hoverBackgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h3>User Distribution by Roles</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default UserRolesChart;
