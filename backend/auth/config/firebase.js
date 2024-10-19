/**
 * Initialize Firebase Admin SDK with environment variables.
 * This file sets up Firebase for database access and admin-related functionalities.
 */

const admin = require('firebase-admin'); 
const dotenv = require('dotenv'); 
const fs = require('fs'); 
dotenv.config(); 

/**
 * Initialize Firebase Admin with service account credentials.
 * The credentials are loaded securely from environment variables to avoid hardcoding sensitive data.
 */
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID, // Project ID of your Firebase app
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Private key (newlines properly formatted)
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL // Client email associated with the service account
  }),
  databaseURL: 'https://module-1-database-default-rtdb.firebaseio.com' // Firebase Realtime Database URL
});

/**
 * Get a reference to the Firebase Realtime Database.
 * The `db` object will be used to interact with the database in other parts of the application.
 */
const db = admin.database();

// Export the initialized Firebase admin and db for use in other files
module.exports = { admin, db };

