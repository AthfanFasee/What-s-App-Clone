import { initializeApp, getApps } from "firebase/app";
import{getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};


let firebaseApp

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
}

export const app = firebaseApp;


export const db = getFirestore(app);
export const auth = getAuth(app); //after authentication this auth variable will be filled with unique information like user name and id. it can be used later on to identify which author we wanna log out and stuffs
export const provider = new GoogleAuthProvider();

