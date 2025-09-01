// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Function to check if all config keys are present
const isConfigComplete = (config: FirebaseOptions) => {
  return Object.values(config).every(value => value);
}

// Initialize Firebase
let app;
if (isConfigComplete(firebaseConfig)) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} else {
  console.error("Firebase config is incomplete. Please check your .env file.");
}


const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
