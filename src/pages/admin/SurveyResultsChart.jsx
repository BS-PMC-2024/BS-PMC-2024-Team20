import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { app } from '../../connections/firebaseConfig';

const db = getFirestore(app);

const SurveyResultsChart = () => {
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    const fetchSurveyResults = async () => {
      const surveyDocRef = doc(db, 'surveys', 'SUS_Average');
      
      try {
        const surveyDoc = await getDoc(surveyDocRef);

        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          setSurveyData(surveyData);
        } else {
          console.log('No survey results found.');
        }
      } catch (error) {
        console.error('Error fetching survey results:', error);
      }
    };

    fetchSurveyResults();
  }, []);

  if (!surveyData) {
    return <div>Loading survey results...</div>;
  }

  const { averages, questions } = surveyData;

  const chartData = {
    labels: questions,
    datasets: [
      {
        data: averages,
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
      <h3>Survey Results (Average Scores)</h3>
      <Pie data={chartData} />
    </div>
  );
};

export default SurveyResultsChart;
