import firebase from "firebase/app";
import "firebase/storage";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxpqRfhE0kbWr-q_JaIc4Ej1K8bKFioys",
  authDomain: "minnamo.firebaseapp.com",
  projectId: "minnamo",
  storageBucket: "minnamo.appspot.com",
  messagingSenderId: "579388972856",
  appId: "1:579388972856:web:a5f056102d133ef4862bcd",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage()
export const storageRef = storage.ref();

const provider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = () => auth.signInWithPopup(provider);
