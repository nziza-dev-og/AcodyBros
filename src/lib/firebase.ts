import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAS_Dx0ETAT9yc7meEQbnB4fHAH2v_zoGs",
  authDomain: "acodybros.firebaseapp.com",
  projectId: "acodybros",
  storageBucket: "acodybros.appspot.com",
  messagingSenderId: "70086141045",
  appId: "1:70086141045:web:ee54228057a0a75060043c",
  measurementId: "G-1KQNFDSLCB"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
