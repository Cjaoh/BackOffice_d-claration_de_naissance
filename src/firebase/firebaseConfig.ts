import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";  
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtAMgS6Om-XRSROxu86PrnIV7XlXGYCkI",
  authDomain: "etatcivil-d7daa.firebaseapp.com",
  projectId: "etatcivil-d7daa",
  storageBucket: "etatcivil-d7daa.appspot.com", // <-- Correction ici
  messagingSenderId: "95444634348",
  appId: "1:95444634348:web:404b92382ca07dfc0cf3c9",
  measurementId: "G-811JYW9VJK"
};


const app = initializeApp(firebaseConfig);


// Analytics is initialized but not used in this application
// const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const db = getFirestore(app);
