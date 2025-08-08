// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjKz796PCvTO9UFodZ49z1mNeBG482ROk",
  authDomain: "redy-b8f46.firebaseapp.com",
  projectId: "redy-b8f46",
  storageBucket: "redy-b8f46.firebasestorage.app",
  messagingSenderId: "913550199083",
  appId: "1:913550199083:web:7ffb08f2809d85ee5e9d6e",
  measurementId: "G-0RR84MQWLP"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
