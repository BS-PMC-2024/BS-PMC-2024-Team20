import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';


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

if (process.env.USE_FIRESTORE_EMULATOR) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { app, auth, db };
