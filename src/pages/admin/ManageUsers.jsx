import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, getUserSessionAverage } from '../../services/auth';
import '../../styles/common.css';
import Swal from 'sweetalert2';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getAllUsers();
      const usersWithAverages = await Promise.all(usersList.map(async (user) => {
        const averageTime = await getUserSessionAverage(user.id);
        return { ...user, averageTime };
      }));
      setUsers(usersWithAverages);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    await updateUserRole(uid, newRole);
    setUsers(users.map(user => user.id === uid ? { ...user, role: newRole } : user));
  };

  const handleDeleteUser = async (uid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/deleteUser/${uid}`, { method: 'DELETE' });
      if (response.ok) {
        setUsers(users.filter(user => user.id !== uid));
        alert('User deleted successfully.');
      } else {
        alert('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user.');
    }
  };

  //git add src\pages\admin\ManageUsers.jsx
//git commit -m "BSPMS2420-76 <handleShowSessionAverage>"
//git push origin ShimonBaruch
  const handleShowSessionAverage = async (uid, email) => {
    try {
      const averageTime = await getUserSessionAverage(uid);
      Swal.fire({
        title: 'Average Session Time',
        text: `The average session time for ${email} is ${averageTime} minutes.`,
        icon: 'info',
        confirmButtonText: 'Close',
      });
    } catch (error) {
      console.error('Error fetching session average:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch session average.',
        icon: 'error',
        confirmButtonText: 'Close',
      });
    }
  };
    //git add src\pages\admin\ManageUsers.jsx
  //git commit -m "BSPMS2420-79 <handleExportData>"
//git push origin ShimonBaruch
  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Role,First Name,Last Name,Average Time (minutes)\n" 
      + users.map(user => 
          `${user.email},${user.role},${user.firstName},${user.lastName},${user.averageTime ? user.averageTime : 'N/A'}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <button className="export-button" onClick={handleExportData}>Export Data</button>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Change Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={`role-${user.role}`}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>
                <select
                  className="role-select"
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  value={user.role}
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                </select>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                <button className="average-button" onClick={() => handleShowSessionAverage(user.id, user.email)}>Average Time</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
