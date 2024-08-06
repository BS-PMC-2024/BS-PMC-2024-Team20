
import 'firebase/auth';
import 'firebase/firestore';
// קוד שמשתמש במודול firebase

// הורד את קובץ מפתח השירות שלך מה- Firebase Console
const serviceAccount = require('./ai-aid-firebase-adminsdk-c313i-1bdc26f499.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const deleteUserById = async (uid) => {
  try {
    await db.collection('userRoles').doc(uid).delete();
    await db.collection('blogMessages').doc(uid).delete();
    await auth.deleteUser(uid);
    
    console.log(`Successfully deleted user with UID: ${uid}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = { admin, db, auth, deleteUserById };
