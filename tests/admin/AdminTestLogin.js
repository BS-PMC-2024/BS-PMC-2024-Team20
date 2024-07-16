const assert = require('assert');
const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const fs = require('fs');
const path = require('path');
const { getAuth, signInWithEmailAndPassword, deleteUser, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, getDocs, collection, updateDoc } = require('firebase/firestore');
const { registerUser, loginUser } = require('../../src/services/auth');
const { app } = require('../../src/connections/firebaseConfig');

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
      rules: fs.readFileSync(path.join(__dirname, '../tests/firestore.rules'), 'utf8'),
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

/**This test verifies that for a valid
 *  email we will receive a login */
test('registerUser should register a new user', async () => {
    const email = 'test@example.com';
    await clearUserByEmail(email);
    const user = await registerUser(email, 'password');
    assert(user, 'User should be defined');
    assert.strictEqual(user.email, email, 'User email should match');
  });

/**This test verifies that for an invalid email
 *  we will receive an error message */
  test('registerUser should fail with an invalid email', async () => {
    const invalidEmail = 'invalid-email';
    try {
      await registerUser(invalidEmail, 'password');
      assert.fail('Expected an error to be thrown for invalid email');
    } catch (error) {
      assert(error, 'An error should be thrown for invalid email');
    }
  });
/**This test verifies that for an incorrect 
 * password (too short) we will receive an error*/
test('registerUser should fail with an invalid password', async () => {
  const email = 'test@example.com';
  const invalidPassword = '123'; 
  try {
    await registerUser(email, invalidPassword);
    assert.fail('Expected an error to be thrown for invalid password');
  } catch (error) {
    assert(error, 'An error should be thrown for invalid password');
  }
});

  test('loginUser should login a user', async () => {
    const email = 'test@example.com';
    await clearUserByEmail(email);  
    await registerUser(email, 'password'); 
    const { user, role } = await loginUser(email, 'password');
    assert(user, 'User should be defined');
    assert.strictEqual(user.email, email, 'User email should match');
    assert.strictEqual(role, 'student', 'User role should be student');
  });


/*=================================================================== */
/*
 ** This command checks what is available on port 8080 : **

   netstat -ano | findstr :8080
 */
/*=================================================================== */


/*
**This command kills the process on the above port : **

   taskkill /PID 1234 /F
 */

/*=================================================================== */

/*
 **This command runs the tests**
  
  firebase emulators:exec "npm test"

 */