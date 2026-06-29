import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";  
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWuVaKKj-hJjOpQJDMiB9ardxceQhWJvA",
  authDomain: "etatcivil-cjaoh.firebaseapp.com",
  projectId: "etatcivil-cjaoh",
  storageBucket: "etatcivil-cjaoh.firebasestorage.app",
  messagingSenderId: "612239957830",
  appId: "1:612239957830:web:ae2178317a48a89f440f47"
};

const app = initializeApp(firebaseConfig);


// Analytics is initialized but not used in this application
// const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const db = getFirestore(app);
