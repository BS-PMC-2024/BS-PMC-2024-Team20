const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const { getAuth, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const { registerUser, addBlogMessage } = require('../../src/services/auth');
const assert = require('assert');
const fetch = require('node-fetch');

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
});

afterAll(async () => {
  await testEnv.cleanup();
  delete process.env.USE_FIRESTORE_EMULATOR;
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

const clearUserByEmail = async (email) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, 'password');
    if (user) {
      await deleteUser(user);
    }
  } catch (error) {
    
  }
};

test('addBlogMessage should not add a message exceeding 100 characters', async () => {
  const email = 'testuser@example.com';
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';
  const role = 'student';

  await clearUserByEmail(email);
  const registeredUser = await registerUser(email, password, firstName, lastName, role);
  await signInWithEmailAndPassword(auth, email, password);

  const longMessageContent = 'A'.repeat(101);

  try {
    await addBlogMessage(longMessageContent, email);
    throw new Error('Message exceeding 100 characters should not be sent');
  } catch (error) {
    assert.strictEqual(error.message, 'Message cannot exceed 100 characters.', 'The error message should match');
  }

  await fetch(`http://localhost:5000/api/deleteUser/${registeredUser.uid}`, {
    method: 'DELETE',
  });
});
