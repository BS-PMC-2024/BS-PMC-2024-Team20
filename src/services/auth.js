import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { app } from '../connections/firebaseConfig'; 

const auth = getAuth(app);
const db = getFirestore(app);

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  await setDoc(doc(db, 'userRoles', user.uid), { role: 'student',email: email });
  
  return user;
};

/* BSPMS2420-4 This function verifies whether the user exists in the database,
 if so it will transfer him to the page specific to him, 
 otherwise it will show him an error message */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  const userRoleDoc = await getDoc(doc(db, 'userRoles', user.uid));
  if (!userRoleDoc.exists()) {
    throw new Error('No such user role document!');
  }
  const userRoleData = userRoleDoc.data();
  if (!userRoleData || !userRoleData.role) {
    throw new Error('No role found for user!');
  }
  const userRole = userRoleData.role;
  
  return { user, role: userRole };
};

export const getAllUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'userRoles'));
  const users = [];
  usersSnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};


export const updateUserRole = async (uid, newRole) => {
  await updateDoc(doc(db, 'userRoles', uid), { role: newRole });
};

export const getRole = async () => {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }
  
  const userRoleDoc = await getDoc(doc(db, 'userRoles', user.uid));
  if (!userRoleDoc.exists()) {
    throw new Error('No such user role document!');
  }
  
  const userRoleData = userRoleDoc.data();
  if (!userRoleData || !userRoleData.role) {
    throw new Error('No role found for user!');
  }
  
  return userRoleData.role;
};
