import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail  } from 'firebase/auth';
import { getFirestore, doc,setDoc, getDoc, collection, getDocs,addDoc, updateDoc,serverTimestamp, deleteDoc, query, where  } from 'firebase/firestore';

import { app } from '../connections/firebaseConfig'; 


const auth = getAuth(app);
const db = getFirestore(app);

export const registerUser = async (email, password, firstName, lastName, role, about) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  //console.log(firstName, lastName, role);
  //when user is created the CountHistory function will be called to update the chart in the admin dashboard.
  await setDoc(doc(db, 'userRoles', user.uid), { role: role,email: email ,firstName :firstName,lastName:lastName,about:about});
  await updateUserCountHistory();
  return user;
};

// export const saveStudentOverview = async (studentId, overviewData) => {
//   console.log('saveStudentOverview', studentId,overviewData);
//   try {
//     const studentOverviewRef = doc(db, 'studentOverview', studentId);
//     await setDoc(studentOverviewRef, overviewData);
//   } catch (error) {
//     console.error('Error saving student overview:', error);
//     throw error;
//   }
// };

// export const fetchStudentOverview = async (studentId) => {
//   try {
//     const studentOverviewRef = doc(db, 'studentOverview', studentId);
//     const docSnap = await getDoc(studentOverviewRef);

//     if (docSnap.exists()) {
//       return docSnap.data();
//     } else {
//       throw new Error('No such document!');
//     }
//   } catch (error) {
//     console.error('Error fetching student overview:', error);
//     throw error;
//   }
// };

export const getStudentOverview = async (studentId) => { 
  try { if (!studentId) { throw new Error('Student ID is required.');

   } 
  const studentDocRef = doc(db, 'studentOverview', studentId); 
  const studentDoc = await getDoc(studentDocRef); 
  if (!studentDoc.exists()) {
     console.log(`No student overview found for ID: ${studentId}`); return null; 
    } 
    const studentData = studentDoc.data(); 
    console.log(studentData); return studentData; 
  } catch (error) { 
    console.error('Error fetching student overview:', error);
     throw error; } 
  };

export const countUnreadMessages = async (userEmail) => {
  try {
    const q = query(
      collection(db, 'userMessages'),
      where('toUser', '==', userEmail),
      where('isRead', '==', false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting unread messages:', error);
    return 0;
  }
};


export const isTermsAccepted = (termsAccepted) => {
  return termsAccepted;
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

export const getRoleByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'userRoles');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Assuming email is unique and there's only one match
      const userData = userDoc.data();
      return userData.role; // Assuming the role is stored under 'role'
    } else {
      console.warn('No user found with email: ${email}');
      return null; // Return null if no user is found
    }
  } catch (error) {
    console.error('Error fetching role by email:', error);
    return null; // Return null in case of an error
  }
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
      timestamp: serverTimestamp(),
      isRead: false  // add a flag indicating whether the message is read
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message.');
  }
};
//add a function to indicate that the message is read
export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, 'userMessages', messageId);
    await updateDoc(messageRef, {
      isRead: true
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw new Error('Failed to mark message as read.');
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
//The function displays user messages from other users
//fix bug with AdminConversation  - BSPMS2420-67
export const AdminConversation = async (userEmail, role) => {
  const messagesSnapshot = await getDocs(collection(db, 'userMessages'));
  const conversation = [];
  messagesSnapshot.forEach(doc => {
    const data = doc.data();
    if ( (data.toUser === userEmail && data.toRole === role)) {
      conversation.push({ id: doc.id, ...data });
    }
  });
  return conversation;
};


export { db };

export const getAllStudents = async () => {
  const usersSnapshot = await getDocs(collection(db, 'userRoles'));
  const students = [];
  usersSnapshot.forEach(doc => {
    const userData = doc.data();
    if (userData.role === 'student') {
      students.push({ id: doc.id, ...userData });
    }
  });
  return students;
};

//git add src\services\auth.jsx
//git commit -m" BSPMS2420-71  - deleteUserByIdWhenTesting function for deleting users after test "

export const deleteUserByIdWhenTesting = async (userId) => {
  const userDocUsers = doc(db, 'users', userId);
  const userDocUserRoles = doc(db, 'userRoles', userId);
  
  await deleteDoc(userDocUsers);
  await deleteDoc(userDocUserRoles);
};

////sprint 2:

export const getAdminWorkingHours = async () => {
  const snapshot = await getDocs(collection(db, 'adminWorkingHours'));
  const workingHours = [];
  snapshot.forEach(doc => {
    workingHours.push({ date: doc.data().date.toDate().toLocaleDateString(), hours: doc.data().hours });
  });
  return workingHours;
};

export const recordWorkingHours = async (date, hours) => {
  await addDoc(collection(db, 'adminWorkingHours'), {
    date: new Date(date),
    hours,
    time: serverTimestamp()
  });
};
//git add ai-aid\src\services\auth.jsx
//git commit -m "BSPMS2420-82 <getUserSessionAverage>"
//git push origin ShimonBaruch
export const getUserSessionAverage = async (uid) => {
  const userRef = doc(db, "userlogtime", uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    return "N/A";// if no data is available
  }

  const userData = docSnap.data();
  const loginTimes = userData.loginTimes || [];
  const logoutTimes = userData.logoutTimes || [];

  if (loginTimes.length === 0 || logoutTimes.length === 0) {
    return "N/A"; 
  }

  let totalDuration = 0;
  for (let i = 0; i < loginTimes.length && i < logoutTimes.length; i++) {
    const loginTime = new Date(loginTimes[i]).getTime();
    const logoutTime = new Date(logoutTimes[i]).getTime();
    totalDuration += (logoutTime - loginTime);
  }

  const averageDuration = totalDuration / loginTimes.length;
  return Math.round(averageDuration / 60000); 
};

export const addTask = async (taskTitle, dueDate) => {
  try {
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'tasks'), {
        uid: user.uid,
        title: taskTitle,
        dueDate: dueDate,
        done: false 
      });
    }
  } catch (error) {
    console.error('Error adding task: ', error);
  }
};
export const markTaskAsDone = async (taskId) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      done: true
    });
  } catch (error) {
    console.error('Error marking task as done: ', error);
  }
};
//questions fot the survey:
const questions = [
  "I think that I would like to use this system frequently.",
  "I found the system unnecessarily complex.",
  "I thought the system was easy to use.",
  "I think that I would need the support of a technical person to be able to use this system.",
  "I found the various functions in this system were well integrated."
];
//this function takes the survy answers and puts them into the db and creates an avg 
export const updateSurveyAverage = async (surveyResults) => {
  const surveyDocRef = doc(db, 'surveys', 'SUS_Average');
  
  try {
    if (!Array.isArray(surveyResults)) {
      throw new Error('surveyResults must be an array.');
    }

    const surveyDoc = await getDoc(surveyDocRef);

    if (surveyDoc.exists()) {
      const currentData = surveyDoc.data();
      const currentAverages = currentData.averages || [];
      const currentCount = currentData.count || 0;

      const newAverages = questions.map((question, index) => {
        const currentAvg = currentAverages[index] || 0;
        return ((currentAvg * currentCount) + parseInt(surveyResults[index])) / (currentCount + 1);
      });

      const newCount = currentCount + 1;

      const updatedData = {
        averages: newAverages,
        count: newCount,
        questions: questions
      };

      await setDoc(surveyDocRef, updatedData);
    } else {
      const initialData = {
        averages: surveyResults.map(result => parseInt(result)),
        count: 1,
        questions: questions
      };

      await setDoc(surveyDocRef, initialData);
    }

    console.log('Survey results successfully updated.');
  } catch (error) {
    console.error('Error updating survey results:', error);
  }
};
export const displaySurveyResults = async () => {
  const surveyDocRef = doc(db, 'surveys', 'SUS_Average');
  
  try {
    const surveyDoc = await getDoc(surveyDocRef);

    if (surveyDoc.exists()) {
      const surveyData = surveyDoc.data();
      const { averages, count, questions } = surveyData;

      console.log(`Survey Results (Based on ${count} submissions):`);
      
      questions.forEach((question, index) => {
        console.log(`${question}`);
        console.log(`Average Score: ${averages[index].toFixed(2)}`);
        console.log('---------------------------');
      });

    } else {
      console.log('No survey results found.');
    }
  } catch (error) {
    console.error('Error fetching survey results:', error);
  }
};





export const saveUserFeedback = async (feedback) => {
  try {
    await addDoc(collection(db, 'feedbackSurvey'), {
      feedback,
      timestamp: new Date(),
    });
    console.log('User feedback successfully saved.');
  } catch (error) {
    console.error('Error saving user feedback:', error);
  }
};