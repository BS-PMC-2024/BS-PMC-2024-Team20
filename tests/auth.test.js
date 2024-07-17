const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const { getAuth, signInWithEmailAndPassword, deleteUser, createUserWithEmailAndPassword, connectAuthEmulator } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, getDocs, collection, updateDoc, connectFirestoreEmulator } = require('firebase/firestore');
const React = require('react');
const { createMemoryHistory } = require('history');
const { Router } = require('react-router-dom');
const { render, act } = require('@testing-library/react');
const App = require('../src/App');

global.setImmediate = require('timers').setImmediate;

jest.setTimeout(30000);

let testEnv;
let auth;
let db;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'ai-aid',
    firestore: {
      host: 'localhost',
      port: 8080,
      rules: fs.readFileSync(path.join(__dirname, '../tests/firestore.rules'), 'utf8'),
    },
    auth: {
      host: 'localhost',
      port: 9099,
    },
  });
  process.env.USE_FIRESTORE_EMULATOR = 'true';
  auth = getAuth();
  connectAuthEmulator(auth, 'http://localhost:9099');
  db = getFirestore();
  connectFirestoreEmulator(db, 'localhost', 8080);
});

afterAll(async () => {
  await testEnv.cleanup();
  delete process.env.USE_FIRESTORE_EMULATOR;
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

const clearUserByEmail = async (email) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, 'password');
    if (user) {
      await deleteUser(user);
    }
  } catch (error) {
    // אם המשתמש לא קיים, נעבור הלאה
  }
};

const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      role: "student" // ברירת מחדל לסטודנט
    });
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("User data not found!");
    }
    const userData = userDoc.data();
    return { user, role: userData.role };
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

const getAllUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const users = [];
  usersSnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

const updateUserRole = async (uid, newRole) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { role: newRole });
};

const getRole = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    throw new Error("User data not found!");
  }
  const userData = userDoc.data();
  return userData.role;
};

test('registerUser should register a new user', async () => {
  const email = 'test@example.com';
  await clearUserByEmail(email);
  const user = await registerUser(email, 'password');
  expect(user).toBeDefined();
  expect(user.email).toBe(email);
});

test('loginUser should login a user', async () => {
  const email = 'test@example.com';
  await clearUserByEmail(email);  // Ensure the user is cleared before registration
  await registerUser(email, 'password');  // Ensure the user exists before trying to log in
  const { user, role } = await loginUser(email, 'password');
  expect(user).toBeDefined();
  expect(user.email).toBe(email);
  expect(role).toBe('student');
});

test('updateUserRole should update user role', async () => {
  const email = 'user@example.com';
  await clearUserByEmail(email);

  const user = await registerUser(email, 'password');
  await updateUserRole(user.uid, 'admin');

  const role = await getRole(user.uid);
  expect(role).toBe('admin');
});

afterEach(async () => {
  await testEnv.clearFirestore();
});
