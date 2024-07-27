const express = require('express');
const { deleteUserById } = require('./firebaseAdmin');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.delete('/api/deleteUser/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    await deleteUserById(uid);
    res.status(200).send({ message: `User with UID ${uid} deleted successfully` });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete user', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// turn the server on to listen on port 3001
//node src/services/server.js