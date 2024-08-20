import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../services/auth'; 
import '../../styles/common.css'; 
import '../../styles/student.css';

const ViewStudent = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [overviewData, setOverviewData] = useState({
    impression: '',
    improvement: '',
    recommendations: ''
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!studentId) {
          console.error('Invalid student ID');
          return;
        }
        const studentDocRef = doc(db, 'userRoles', studentId);
        const studentDoc = await getDoc(studentDocRef);
        if (studentDoc.exists()) {
          setStudentData(studentDoc.data());
        } else {
          console.error('No such student!');
        }

        const overviewDocRef = doc(db, 'studentOverview', studentId);
        console.log(studentId);
        const overviewDoc = await getDoc(overviewDocRef);
        if (overviewDoc.exists()) {
          setOverviewData(overviewDoc.data());
        }

      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const overviewDocRef = doc(db, 'studentOverview', studentId);
      console.log(studentId);
      await setDoc(overviewDocRef, overviewData); 
      alert('Overview updated successfully!');
    } catch (error) {
      console.error('Error updating overview:', error);
    }
  };

  if (!studentData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="view-student">
        <h2>Student Profile</h2>
        <p><strong>First Name:</strong> {studentData.firstName}</p>
        <p><strong>Last Name:</strong> {studentData.lastName}</p>
        <p><strong>Email:</strong> <span className="highlight">{studentData.email}</span></p>
        <p><strong>Role:</strong> {studentData.role}</p>
        <h3>Latest Overview Information</h3>
        <p><strong>Impression:</strong> {overviewData.impression || 'No data available'}</p>
        <p><strong>Improvement:</strong> {overviewData.improvement || 'No data available'}</p>
        <p><strong>Recommendations:</strong> {overviewData.recommendations || 'No data available'}</p>
        
        <div className="button-container">
          <button className="btn-back" onClick={() => window.history.back()}>Back</button>
        </div>
      </div>

      <div className="teacher-comments">
        <h3>
          Teacher Comments <span>{studentData.firstName} {studentData.lastName}</span>
        </h3>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="impression">:רושם</label>
            <textarea
              id="impression"
              name="impression"
              className="comment-box"
              value={overviewData.impression}
              onChange={(e) => setOverviewData({ ...overviewData, impression: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="improvement">:שיפור</label>
            <textarea
              id="improvement"
              name="improvement"
              className="comment-box"
              value={overviewData.improvement}
              onChange={(e) => setOverviewData({ ...overviewData, improvement: e.target.value })}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="recommendations">:המלצות</label>
            <textarea
              id="recommendations"
              name="recommendations"
              className="comment-box"
              value={overviewData.recommendations}
              onChange={(e) => setOverviewData({ ...overviewData, recommendations: e.target.value })}
            ></textarea>
          </div>
          <div className="button-container">
            <button type="submit" className="btn-back">Save</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ViewStudent;
