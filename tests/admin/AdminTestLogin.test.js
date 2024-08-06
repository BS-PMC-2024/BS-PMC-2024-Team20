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




/**This test verifies that for a valid
 *  email we will receive a login */
test('loginstudentUser should login a user', async () => {
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

test('deleteUserById should delete a user', async () => {
  const email = 'deleteuser@example.com';
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';
  const role = 'student';

  await clearUserByEmail(email);
  const registeredUser = await registerUser(email, password, firstName, lastName, role);

   await fetch(`http://localhost:5000/api/deleteUser/${registeredUser.uid}`, {
    method: 'DELETE',
  });
  try {
    await signInWithEmailAndPassword(auth, email, password);
    throw new Error('User should have been deleted');
  } catch (error) {
    assert.strictEqual(error.code, 'auth/invalid-credential', 'User should be deleted from auth');
  }
});

test('updateUserRole should change the role of a user', async () => {
  const email = 'rolechange@example.com';
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';
  const initialRole = 'student';
  const newRole = 'admin';

  await clearUserByEmail(email);

  const user = await registerUser(email, password, firstName, lastName, initialRole);

  await updateUserRole(user.uid, newRole);

  const userRoleDoc = await getDoc(doc(db, 'userRoles', user.uid));
  const userRoleData = userRoleDoc.data();

  assert.strictEqual(userRoleData.role, newRole, 'User role should be updated to admin');
  await fetch(`http://localhost:5000/api/deleteUser/${user.uid}`, {
    method: 'DELETE',
  });
});

test('registerUser should fail with an invalid email', async () => {
  const invalidEmail = 'invalid-email';
  const password = 'password';
  const firstName = 'Test';
  const lastName = 'User';
  const role = 'teacher';
  var user ;
  try {
     user = await registerUser(invalidEmail, password, firstName, lastName, role);
    assert.fail('Expected an error to be thrown for invalid email');
  } catch (error) {
    assert(error, 'An error should be thrown for invalid email');
  }
  try {
    await fetch(`http://localhost:5000/api/deleteUser/${user.uid}`, {
      method: 'DELETE',});
  } catch (error) {
    
  }
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