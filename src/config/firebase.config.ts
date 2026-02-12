import admin from 'firebase-admin';
import dotenv from 'dotenv';


dotenv.config();


// Load Firebase service account credentials from environment variabless
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newlines in private key
    }),
  });
}

export const firebaseAuth = admin.auth();