import { initializeApp, getApps } from "firebase/app"
import{getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCiJT12Wifbake8f1y27jX_TyLRrjjXipQ",
  authDomain: "what-sappnew.firebaseapp.com",
  projectId: "what-sappnew",
  storageBucket: "what-sappnew.appspot.com",
  messagingSenderId: "182101031250",
  appId: "1:182101031250:web:45cbbc3ef8d159cb50e28b"
};

let firebaseApp

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
}

const app = firebaseApp


export const db = getFirestore(app)
export const auth = getAuth(app) //after authentication this auth variable will be filled with unique information like user name and id. it can be used later on to identify which author we wanna log out and stuffs
export const provider = new GoogleAuthProvider()

