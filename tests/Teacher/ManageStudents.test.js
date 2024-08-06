const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { initializeApp } = require('firebase/app');
const fs = require('fs');
const path = require('path');
const { getAuth } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { getAllStudents } = require('../../src/services/auth');
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

  
  app = initializeApp({
    apiKey: 'fake-api-key',
    projectId: 'ai-aid',
  });

  auth = getAuth(app);
  db = getFirestore(app);
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


jest.mock('../../src/services/auth', () => ({
  getAllStudents: jest.fn(),
}));


test('getAllStudents should fetch all students', async () => {
  const mockStudents = [
    { id: '1', email: 'student1@example.com', firstName: 'John', lastName: 'Doe', role: 'student' },
    { id: '2', email: 'student2@example.com', firstName: 'Jane', lastName: 'Doe', role: 'student' },
  ];
  
  getAllStudents.mockResolvedValueOnce(mockStudents);

  const students = await getAllStudents();
  assert(students.length >= 2, 'Should return at least two students');
  assert.strictEqual(students[0].email, 'student1@example.com', 'First student email should match');
  assert.strictEqual(students[1].email, 'student2@example.com', 'Second student email should match');
});


test('getAllStudents should handle errors', async () => {
  getAllStudents.mockRejectedValueOnce(new Error('Failed to fetch students'));

  try {
    await getAllStudents();
    assert.fail('Expected an error to be thrown');
  } catch (error) {
    assert.strictEqual(error.message, 'Failed to fetch students', 'Should throw an error with the correct message');
  }
});
