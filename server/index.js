const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./ai-aid-firebase-adminsdk-c313i-1bdc26f499.json');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

app.delete('/api/deleteUser/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    await db.collection('userRoles').doc(uid).delete();
    await auth.deleteUser(uid);

    res.status(200).send(`Successfully deleted user with UID: ${uid}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
