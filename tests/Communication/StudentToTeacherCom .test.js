const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { sendMessage, receiveMessages, registerUser } = require('../../src/services/auth');
const assert = require('assert');

jest.setTimeout(30000);

let testEnv;
let auth;
let db;
let studentUser;
let teacherUser;

// נתוני המשתמשים
const studentInfo = {
  email: 'student@example.com',
  password: 'password',
  firstName: 'Teststudent',
  lastName: 'User',
  role: 'student'
};

const teacherInfo = {
  email: 'teacher@example.com',
  password: 'password',
  firstName: 'Testteacher',
  lastName: 'User',
  role: 'teacher'
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

  // register global users 
  studentUser = await registerUser(studentInfo.email, studentInfo.password, studentInfo.firstName, studentInfo.lastName, studentInfo.role);
  teacherUser = await registerUser(teacherInfo.email, teacherInfo.password, teacherInfo.firstName, teacherInfo.lastName, teacherInfo.role);
});

afterAll(async () => {
  await testEnv.cleanup();
  delete process.env.USE_FIRESTORE_EMULATOR;
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  // user login with
  await signInWithEmailAndPassword(auth, studentInfo.email, studentInfo.password);
});

afterEach(async () => {
  await testEnv.clearFirestore();
});
//git add "tests/Communication"

//git commit -m "BSPMS2420-37 creating a test for the Communication between student and teacher"
test('sendMessage should send a message to a teacher', async () => {
  const message = 'Hello, teacher!';

  await sendMessage(studentInfo.role, studentInfo.email, teacherInfo.role, teacherInfo.email, message);

  const messages = await receiveMessages(teacherInfo.email, studentInfo.role);

  assert(messages.length > 0, `Expected at least one message, but received ${messages.length}`);
  assert.strictEqual(messages[0].message, message, 'Message content should match');
});

//delete usersa from the database
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

/*fix git */
//git commit -m "BSPMS2420-34 Communication between student and teacher user story"
/*fix git */