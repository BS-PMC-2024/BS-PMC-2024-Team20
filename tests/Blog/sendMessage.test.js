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

test('addBlogMessage should add a message successfully', async () => {
  const email = 'testuser@example.com';
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';
  const role = 'student';

  await clearUserByEmail(email);
  const registeredUser = await registerUser(email, password, firstName, lastName, role);
  await signInWithEmailAndPassword(auth, email, password);

  const messageContent = 'This is a test message';
  await addBlogMessage(messageContent, email);

  const messagesSnapshot = await getDocs(collection(db, 'blogMessages'));
  const messages = [];
  messagesSnapshot.forEach(doc => {
    messages.push(doc.data());
  });

  const addedMessage = messages.find(message => message.content === messageContent && message.sender === email);

  assert(addedMessage, 'The message should be found in the blog');
  assert.strictEqual(addedMessage.content, messageContent, 'The message content should match');
  assert.strictEqual(addedMessage.sender, email, 'The sender email should match');

  await fetch(`http://localhost:5000/api/deleteUser/${registeredUser.uid}`, {
    method: 'DELETE',
  });
});
