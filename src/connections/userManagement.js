// src/connections/userManagement.js
import { db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const createUserProfile = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data);
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
