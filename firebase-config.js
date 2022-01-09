import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"

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

export const app = firebaseApp
export const auth = getAuth(app)
