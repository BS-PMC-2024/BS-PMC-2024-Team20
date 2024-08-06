import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../services/auth'; 
import '../../styles/common.css'; 
import '../../styles/student.css';

const ViewStudent = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState(null);

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
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

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
        <div className="button-container">
          <button className="btn-back" onClick={() => window.history.back()}>Back</button>
        </div>
      </div>

      <div className="teacher-comments">
        <h3>
          Teacher Comments <span>{studentData.firstName} {studentData.lastName}</span>
        </h3>
        <form>
          <div className="form-group">
            <label htmlFor="impression">רושם:</label>
            <textarea id="impression" name="impression" className="comment-box"></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="improvement">שיפור:</label>
            <textarea id="improvement" name="improvement" className="comment-box"></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="recommendations">המלצות:</label>
            <textarea id="recommendations" name="recommendations" className="comment-box"></textarea>
          </div>
        </form>
      </div>
    </>
  );
};

export default ViewStudent;
