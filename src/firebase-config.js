import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { FIREBASE } from "./config";


//const firebaseConfig = process.env.NODE_ENV === 'production' ? FIREBASE_PROD : FIREBASE_TEST;
const firebaseConfig = FIREBASE;

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
