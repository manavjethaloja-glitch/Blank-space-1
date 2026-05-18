import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOgPyYAIuP-txKO4-4tPdh3tZ08bJ74J4",
  authDomain: "blank-space-store.firebaseapp.com",
  projectId: "blank-space-store",
  storageBucket: "blank-space-store.firebasestorage.app",
  messagingSenderId: "1001310953860",
  appId: "1:1001310953860:web:9796a2ad4d760b30197dd1",
  measurementId: "G-VC20WW5CSW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
