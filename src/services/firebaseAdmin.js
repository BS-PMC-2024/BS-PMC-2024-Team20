import axios from 'axios';

const deleteUserById = async (uid) => {
  try {
    await axios.delete(`http://localhost:5000/deleteUser/${uid}`);
    console.log(`Successfully deleted user with UID: ${uid}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export { deleteUserById };
