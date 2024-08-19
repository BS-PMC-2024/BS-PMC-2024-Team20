import { getFirestore, doc, updateDoc, arrayUnion, setDoc,getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

export const saveUserSession = async (action) => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, "userlogtime", user.uid);

    const timestamp = new Date().toISOString();
    let updateData;

    if (action === "login") {
      updateData = { loginTimes: arrayUnion(timestamp) };
    } else if (action === "logout") {
      updateData = { logoutTimes: arrayUnion(timestamp) };
    }

    try {
      const docSnapshot = await getDoc(userRef);
      if (!docSnapshot.exists()) {
        await setDoc(userRef, { loginTimes: [], logoutTimes: [] });
      }

      await updateDoc(userRef, updateData);
      console.log(`User ${action} time saved successfully at ${timestamp}`);
    } catch (error) {
      console.error(`Error saving user ${action} time:`, error);
    }
  }
};


export default saveUserSession;
