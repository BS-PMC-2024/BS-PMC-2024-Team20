import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail  } from 'firebase/auth';
import { getFirestore, doc,setDoc, getDoc, collection, getDocs,addDoc, updateDoc,serverTimestamp, deleteDoc, query  } from 'firebase/firestore';

import { app } from '../connections/firebaseConfig'; 



const auth = getAuth(app);
const db = getFirestore(app);

export const registerUser = async (email, password, firstName, lastName, role) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  //console.log(firstName, lastName, role);
  //when user is created the CountHistory function will be called to update the chart in the admin dashboard.
  await setDoc(doc(db, 'userRoles', user.uid), { role: role,email: email ,firstName :firstName,lastName:lastName});
  await updateUserCountHistory();
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

export const getUserName = async (uid) => {
  const userDocRef = doc(db, 'userRoles', uid); // Confirm 'userRoles' is the correct collection
  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log(userData.firstName);
      return userData.firstName;  // Check if 'firstName' is the correct field name
    } else {
      throw new Error('No such user!');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error; // Ensure that this error is something your calling function expects and handles
  }
};



export const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };
// admin data for static display 
  export const getUserCount = async () => {
    const usersSnapshot = await getDocs(collection(db, 'userRoles'));
    return usersSnapshot.size;
  };

  //to get the users history by creating a new document in firebase called : userCountHistory
export const getUserCountHistory = async () => {
  const db = getFirestore(app);
  const snapshot = await getDocs(collection(db, 'userCountHistory'));
  const userCountHistory = [];
  snapshot.forEach(doc => {
    userCountHistory.push({ time: doc.data().time.toDate(), count: doc.data().count });
  });
  return userCountHistory;
};
export const updateUserCountHistory = async () => {
  const userCount = await getUserCount();
  await addDoc(collection(db, 'userCountHistory'), {
    count: userCount,
    time: serverTimestamp()
  });
};
/*blog function that creating a new collection in the firebase DB */ 
export const fetchBlogMessages = async () => {
  const messagesSnapshot = await getDocs(collection(db, 'blogMessages'));
  const messagesList = [];
  messagesSnapshot.forEach(doc => {
    messagesList.push({ id: doc.id, ...doc.data() });
  });
  return messagesList;
};

export const addBlogMessage = async (content, sender) => {
  if (content.length > 100) {
    throw new Error('Message cannot exceed 100 characters.');
  }
  if (content.length <=0) {
    throw new Error('Message cannot be less then 0 characters.');
  }
  await addDoc(collection(db, 'blogMessages'), {
    content: content,
    sender: sender,
    timestamp: serverTimestamp()
  });
};



export const clearBlog = async () => {
  const q = query(collection(db, 'blogMessages'));
  const messagesSnapshot = await getDocs(q);
  const deletePromises = [];
  messagesSnapshot.forEach(doc => {
    deletePromises.push(deleteDoc(doc.ref));
  });
  await Promise.all(deletePromises);
};



export const sendMessage = async (fromRole, fromUser, toRole, toUser, message) => {
  if (message.length <= 0) {
    throw new Error('Message cannot be empty.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to send a message.');
  }

  try {
    await addDoc(collection(db, 'userMessages'), {
      fromRole,
      fromUser,
      toRole,
      toUser,
      message,
      sender: user.email,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message.');
  }
};

export const receiveMessages = async (userEmail, role) => {
  const messagesSnapshot = await getDocs(collection(db, 'userMessages'));
  const conversation = [];

  messagesSnapshot.forEach(doc => {
    const data = doc.data();
    if ((data.fromUser === userEmail && data.fromRole === role) || 
        (data.toUser === userEmail && data.toRole !== role)) {
      conversation.push({ id: doc.id, ...data });
    }
  });

  return conversation;
};

export const fetchConversation = async (userEmail, role) => {
  const messagesSnapshot = await getDocs(collection(db, 'userMessages'));
  const conversation = [];
  messagesSnapshot.forEach(doc => {
    const data = doc.data();
    if ((data.fromUser === userEmail && data.fromRole === role) || 
        (data.toUser === userEmail && data.toRole !== role)) {
      conversation.push({ id: doc.id, ...data });
    }
  });
  return conversation;
};
