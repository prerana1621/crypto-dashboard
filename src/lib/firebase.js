// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVNyI00x4w0jk1pa66moWBrBB0nob0xNE",
  authDomain: "finhub-4f16c.firebaseapp.com",
  projectId: "finhub-4f16c",
  storageBucket: "finhub-4f16c.firebasestorage.app",
  messagingSenderId: "396142531956",
  appId: "1:396142531956:web:3b6face22538a9c8d00821",
  measurementId: "G-J7NWCJ7W1D"
};

// Initialize Firebase
const app = getApps.length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { auth, db };