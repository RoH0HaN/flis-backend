import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCjjCMSjBvzdanc-CAITxpGb4bC5tl9WlM",
  authDomain: "flis-storage.firebaseapp.com",
  projectId: "flis-storage",
  storageBucket: "flis-storage.appspot.com",
  messagingSenderId: "122310950852",
  appId: "1:122310950852:web:79cf6f85bb20f69c0b2e91",
};

// -- Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const storageRef = firebase.storage().ref();
export default firebase;
