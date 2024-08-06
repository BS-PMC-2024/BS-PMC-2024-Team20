const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { initializeApp, getApps, deleteApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');
const { registerUser, updateUserRole, getAllUsers, deleteUserByIdWhenTesting } = require('../../src/services/auth');
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

  if (getApps().length > 0) {
    await deleteApp(app);
  }
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});


afterEach(async () => {
  await testEnv.clearFirestore();
});


test('Admin can login, fetch users, update role and delete user', async () => {
  const adminEmail = 'admin5admin5@example.com';
  const adminPassword = 'password';
  const adminFirstName = 'Admin';
  const adminLastName = 'User';
  const adminRole = 'admin';

  await registerUser(adminEmail, adminPassword, adminFirstName, adminLastName, adminRole);

  const users = [
    { email: 'user1student1@example.com', password: 'password', firstName: 'John', lastName: 'Doe', role: 'student' },
    { email: 'user2student2@example.com', password: 'password', firstName: 'Jane', lastName: 'Doe', role: 'student' },
  ];
  for (const user of users) {
    await registerUser(user.email, user.password, user.firstName, user.lastName, user.role);
  }

  await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
  const fetchedUsers = await getAllUsers();
  console.log('Fetched Users:', fetchedUsers);

  assert(fetchedUsers.length >= users.length, `Should return at least ${users.length} users`);
  users.forEach((user) => {
    const fetchedUser = fetchedUsers.find((u) => u.email === user.email);
    assert(fetchedUser, `User with email ${user.email} should be fetched`);
  });

  
  const userToUpdate = fetchedUsers.find((u) => u.email === users[0].email);
  const newRole = 'admin';
  await updateUserRole(userToUpdate.id, newRole);
  const updatedUsers = await getAllUsers();
  //console.log('Updated Users:', updatedUsers);

  // user role needs to be updated
  const updatedUser = updatedUsers.find((u) => u.id === userToUpdate.id);
  assert.strictEqual(updatedUser.role, newRole, 'User role should be updated');

  //delete user
  await deleteUserByIdWhenTesting(userToUpdate.id);
  const finalUsers = await getAllUsers();
 // console.log('Final Users:', finalUsers);

  
  assert.strictEqual(finalUsers.length, fetchedUsers.length - 1, 'User count should decrease by one');
});

// firebase emulators:exec "npx jest tests/admin/AdminIntegration.test.js"

//git commit -m" BSPMS2420-70 - AdminIntegration test "