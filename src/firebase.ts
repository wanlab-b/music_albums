import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDeoXXas5ip6Ii25dT3rQhM3Pq6LC8ffMo",
  authDomain: "music-album-3ad4f.firebaseapp.com",
  databaseURL: "https://music-album-3ad4f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "music-album-3ad4f",
  storageBucket: "music-album-3ad4f.firebasestorage.app",
  messagingSenderId: "1004435032747",
  appId: "1:1004435032747:web:be72e61d86b2cac71ec5ee",
  measurementId: "G-32D5CCMD3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;