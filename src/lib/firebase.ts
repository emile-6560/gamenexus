// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "gamefinder-98gjx",
  appId: "1:828350349866:web:26836bdac675ca87a8b953",
  storageBucket: "gamefinder-98gjx.firebasestorage.app",
  apiKey: "AIzaSyDNcz3asWkTPwguLkQ7mG_VVZUBuQQwzTM",
  authDomain: "gamefinder-98gjx.firebaseapp.com",
  messagingSenderId: "828350349866",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { app, auth };
