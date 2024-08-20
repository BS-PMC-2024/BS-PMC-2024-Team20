import React, { useEffect, useState } from 'react';
import { getStudentOverview,getUserName } from '../../services/auth';
import { getAuth } from 'firebase/auth';

const StudentRecommendations = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentOverview(user.uid);
        if (data) {
          setStudentData(data);
        } else {
          setError('No data found for this user.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!studentData) {
    return <div>No data found</div>;
  }

  return (
    <div>
        <h2>Recommendations:</h2>
        <p>{studentData.recommendations || 'No recommendations available'}</p>
    </div>
  );
};

export default StudentRecommendations;