// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC3SKnWZZLyuLLbKA4z5uHCkddcZ8cRDIg",
  authDomain: "taskpro-986c0.firebaseapp.com",
  projectId: "taskpro-986c0",
  storageBucket: "taskpro-986c0.appspot.com",
  messagingSenderId: "102470616208",
  appId: "1:102470616208:web:c7f9efcf23cb579aee4415",
  measurementId: "G-PMX1R647T7",
};

// const analytics = getAnalytics(app);

let app;

try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const db = getDatabase(app);

export { db };