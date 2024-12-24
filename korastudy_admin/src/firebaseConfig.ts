// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBoWdbdSUdPMKmu5U03KZKElCdflQ8HIgk",
  authDomain: "korastudy-9b3d5.firebaseapp.com",
  databaseURL: "https://korastudy-9b3d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "korastudy-9b3d5",
  storageBucket: "korastudy-9b3d5.firebasestorage.app",
  messagingSenderId: "736538351274",
  appId: "1:736538351274:web:b6c7dcd8b625b0602662d3",
  measurementId: "G-F7CW9T1XR5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

const signOutUser = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
    })
    .catch((error) => {
      console.error(error);
    });
};

export { auth, db, signInWithGoogle, signOutUser, provider };