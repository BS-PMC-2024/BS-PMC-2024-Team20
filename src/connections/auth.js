// src/services/auth.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const auth = getAuth();
const db = getFirestore();

/*It is a function that communicates with the database, basically what it does is to 
save the user according to 2 records, one is a deductive record and the other is created by
 the measure, and there is no such thing, the second list stores the roles of the users 
When a user logs in, he deductively assumes the role of a student*/
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      role: "student"
    });
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
