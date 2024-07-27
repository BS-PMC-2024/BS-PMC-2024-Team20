const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const { getAuth, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');
const { getFirestore, doc, getDoc, deleteDoc, collection, getDocs } = require('firebase/firestore');
const { registerUser, loginUser, updateUserRole } = require('../../src/services/auth');
const fetch = require('node-fetch');
const assert = require('assert');

global.setImmediate = require('timers').setImmediate;

jest.setTimeout(30000);

let testEnv;
let auth;
let db;
/*
This function is used to initialize an emulator testing environment 
for Firestore and Authentication. It receives a settings object
 that includes the information about the project, Firestore rules, 
 and connection information to Firestore and authentication in the emulator. 
 It then initializes the auth and db connections.


 emulator = Simulates a work environment.
*/
beforeAll(async () => {
  /*set env */
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
  /*use local emulator to set env  */
  process.env.USE_FIRESTORE_EMULATOR = 'true';
  auth = getAuth();
  db = getFirestore();
});
/**Cleaning the emulator after testing */
afterAll(async () => {
  await testEnv.cleanup();
  delete process.env.USE_FIRESTORE_EMULATOR;
});
/**Cleans up the Firestore emulator to ensure that
 *  every test starts from an empty and clean database. */
beforeEach(async () => {
  await testEnv.clearFirestore();
});

/** <- same -> Cleans up the Firestore emulator to ensure that
 *  every test starts from an empty and clean database. */
afterEach(async () => {
    await testEnv.clearFirestore();
    //await new Promise((resolve) => setImmediate(resolve));

  });


const clearUserByEmail = async (email) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, 'password');
    if (user) {
      await deleteUser(user);
    }
  } catch (error) {
    //if the user dont exiest then keep going  ..
  }
};


test('login student User should login a user', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const firstName = 'Test';
    const lastName = 'User';
    const role = 'student';
  
    await clearUserByEmail(email);
    const user = await registerUser(email, password, firstName, lastName, role);
    const { user: loggedInUser, role: userRole } = await loginUser(email, password);
  
    assert(loggedInUser, 'student should be defined');
    assert.strictEqual(loggedInUser.email, email, 'student email should match');
    assert.strictEqual(userRole, role, 'User role should be student');
    await fetch(`http://localhost:5000/api/deleteUser/${user.uid}`, {
      method: 'DELETE',
    });
  });