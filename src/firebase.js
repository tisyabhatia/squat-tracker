// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmcqQgeaASqQl8VQ1ffTXZHCYGaZ-66Bs",
  authDomain: "checkpoint-fitness.firebaseapp.com",
  projectId: "checkpoint-fitness",
  storageBucket: "checkpoint-fitness.firebasestorage.app",
  messagingSenderId: "220650745779",
  appId: "1:220650745779:web:ff3485d2fe7ab84f6f25c6",
  measurementId: "G-H1YDFC7FZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };