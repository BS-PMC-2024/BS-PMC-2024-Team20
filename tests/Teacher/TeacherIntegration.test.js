const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { initializeApp, getApps, deleteApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { registerUser, getAllStudents } = require('../../src/services/auth');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

global.setImmediate = require('timers').setImmediate;

jest.setTimeout(30000);

let testEnv;
let app; 
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

  if (!getApps().length) {
    app = initializeApp({
      apiKey: 'fake-api-key',
      projectId: 'ai-aid',
    });
  } else {
    app = getApps()[0];
  }

  auth = getAuth(app);
  db = getFirestore(app);
});


afterAll(async () => {
  await testEnv.cleanup();
  delete process.env.USE_FIRESTORE_EMULATOR;

  if (app) {
    await deleteApp(app);
  }
});


beforeEach(async () => {
  await testEnv.clearFirestore();
});


afterEach(async () => {
  await testEnv.clearFirestore();
});

/*
 * tests teacher login and fetch students.
 */
test('Teacher can login and fetch students', async () => {
  // create a teacher 
  const teacherEmail = `teacher${Date.now()}@example.com`;
  const teacherPassword = 'password';
  const teacherFirstName = 'Teacher';
  const teacherLastName = 'User';
  const teacherRole = 'teacher';

  await registerUser(teacherEmail, teacherPassword, teacherFirstName, teacherLastName, teacherRole);
  console.log('Teacher registered:', teacherEmail);

  // create students
  const students = [
    { email: `student1${Date.now()}@example.com`, password: 'password', firstName: 'John', lastName: 'Doe', role: 'student' },
    { email: `student2${Date.now()}@example.com`, password: 'password', firstName: 'Jane', lastName: 'Doe', role: 'student' },
  ];
  for (const student of students) {
    await registerUser(student.email, student.password, student.firstName, student.lastName, student.role);
    console.log('Student registered:', student.email);
  }

  
  await signInWithEmailAndPassword(auth, teacherEmail, teacherPassword);
  const fetchedStudents = await getAllStudents();
  //console.log('Fetched Students:', fetchedStudents);

  assert(fetchedStudents.length >= students.length, 'Should return all students');
  students.forEach((student) => {
    const foundStudent = fetchedStudents.find(fetchedStudent => fetchedStudent.email === student.email);
    assert(foundStudent, `Student with email ${student.email} should be found`);
  });
});
