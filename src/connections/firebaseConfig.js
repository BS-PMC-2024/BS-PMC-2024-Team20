import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBqzjwey29Aafm8PGWG3gimEGtFRoSM7WI",
  authDomain: "ai-aid.firebaseapp.com",
  projectId: "ai-aid",
  storageBucket: "ai-aid.appspot.com",
  messagingSenderId: "926150015973",
  appId: "1:926150015973:web:05f8d08079076a76c28d0c",
  measurementId: "G-QBC1X5JR64"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
