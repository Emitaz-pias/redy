// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCjKz796PCvTO9UFodZ49z1mNeBG482ROk",
  authDomain: "redy-b8f46.firebaseapp.com",
  projectId: "redy-b8f46",
  storageBucket: "redy-b8f46.firebasestorage.app",
  messagingSenderId: "913550199083",
  appId: "1:913550199083:web:051770d700d844795e9d6e",
  measurementId: "G-GJH9EM6SEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);