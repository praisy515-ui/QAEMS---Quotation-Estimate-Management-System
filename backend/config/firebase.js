const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let firebaseEnabled = false;
let db = null;
let auth = null;

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
  try {
    const formattedPrivateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: formattedPrivateKey,
      }),
    });
    db = admin.firestore();
    auth = admin.auth();
    firebaseEnabled = true;
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (err) {
    console.error("Firebase Admin SDK failed to initialize. Falling back to local DB:", err.message);
  }
} else {
  console.warn("Firebase environment variables missing. Running in LOCAL MOCK DATABASE MODE.");
}

module.exports = {
  admin,
  db,
  auth,
  firebaseEnabled
};
