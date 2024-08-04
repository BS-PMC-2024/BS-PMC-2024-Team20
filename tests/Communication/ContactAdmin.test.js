const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, deleteDoc, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { AdminConversation,sendMessage,registerUser } = require('../../src/services/auth');
const assert = require('assert');

jest.setTimeout(30000);

let testEnv;
let auth;
let db;
let adminUser;
let otherUser;


const adminInfo = {
  email: 'admin@example.com',
  password: 'password',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin'
};

const otherInfo = {
  email: 'user@example.com',
  password: 'password',
  firstName: 'Other',
  lastName: 'User',
  role: 'student'
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'ai-aid',
    firestore: {
      host: 'localhost',
      port: 8080,
      rules: fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8'),
    },
    auth: {
      host: 'localhost',
      port: 9099,
    },
  });
  process.env.USE_FIRESTORE_EMULATOR = 'true';
  auth = getAuth();
  db = getFirestore();

  // Register global users
  adminUser = await registerUser(adminInfo.email, adminInfo.password, adminInfo.firstName, adminInfo.lastName, adminInfo.role);
  otherUser = await registerUser(otherInfo.email, otherInfo.password, otherInfo.firstName, otherInfo.lastName, otherInfo.role);
});

afterAll(async () => {
    try {
      await fetch(`http://localhost:5000/api/deleteUser/${studentUser.uid}`, {
        method: 'DELETE',
      });
      await fetch(`http://localhost:5000/api/deleteUser/${teacherUser.uid}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  });

beforeEach(async () => {
  await testEnv.clearFirestore();
  await signInWithEmailAndPassword(auth, adminInfo.email, adminInfo.password);
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

// This test checks whether the admin received the message sent to him from another user (not an admin)
test('AdminConversation should fetch messages for admin', async () => {
  // Create a message for the admin
  await sendMessage(otherInfo.role, otherInfo.email, adminInfo.role, adminInfo.email, 'Test message for admin');

  const messages = await AdminConversation(adminInfo.email, adminInfo.role);
  assert(messages.length > 0, 'Expected at least one message for admin');
});


