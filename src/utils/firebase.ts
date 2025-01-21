// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS-YJf85c0uzYOkBLaz17a_t3lWYFhr-M",
  authDomain: "expense-tracker-89389.firebaseapp.com",
  projectId: "expense-tracker-89389",
  storageBucket: "expense-tracker-89389.firebasestorage.app",
  messagingSenderId: "865982093208",
  appId: "1:865982093208:web:3c7a907698382da323fded",
  measurementId: "G-BX8TNMNPDB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
