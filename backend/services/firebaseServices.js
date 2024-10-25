import admin from 'firebase-admin'; // Import Firebase Admin SDK

// Initialize Firebase Admin SDK with application default credentials
admin.initializeApp({
  credential: admin.credential.applicationDefault(), 
  databaseURL: 'https://module-1-database-default-rtdb.firebaseio.com',
  // databaseURL: process.env.FIREBASE_DATABASE_URL, 
});

const db = admin.database();

export { db };