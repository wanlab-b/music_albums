import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// 환경 변수 설정 (Vite)
// .env 파일에 VITE_FIREBASE_... 로 시작하는 변수를 설정하면 해당 값을 사용합니다.
// 값이 없을 경우 기존 하드코딩된 값을 기본값으로 사용합니다.
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "AIzaSyDeoXXas5ip6Ii25dT3rQhM3Pq6LC8ffMo",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "music-album-3ad4f.firebaseapp.com",
  databaseURL: (import.meta as any).env.VITE_FIREBASE_DB_URL || "https://music-album-3ad4f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "music-album-3ad4f",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "music-album-3ad4f.firebasestorage.app",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1004435032747",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "1:1004435032747:web:be72e61d86b2cac71ec5ee",
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID || "G-32D5CCMD3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;