import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../../services/auth';
import '../../styles/common.css';
import { Link } from 'react-router-dom';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsList = await getAllStudents();
        setStudents(studentsList);
        console.log('Students fetched:', studentsList); 
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }; 

    fetchStudents();
  }, []);

  return (
    <div className="manage-students">
      <h2>Manage Students</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id} className={`role-${student.role}`}>
              <td>{student.email}</td>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>
                <Link to={`/teacher/view-student/${student.id}`}>
                  <button className="view-button">View</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStudents;
