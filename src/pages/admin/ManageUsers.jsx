import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole } from '../../services/auth';
import '../../styles/common.css';
//BSPMS2420-19
const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getAllUsers();
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (uid, newRole) => {
    await updateUserRole(uid, newRole);
    setUsers(users.map(user => user.id === uid ? { ...user, role: newRole } : user));
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={`role-${user.role}`}>
              <td>{user.email}</td>
              <td>{user.role}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
