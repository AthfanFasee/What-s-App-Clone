import '../styles/globals.css';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../firebase-config';
import Login from './login';
import Loading from '../components/Loading/Loading';
import { useEffect } from 'react';
import { serverTimestamp, setDoc, doc} from 'firebase/firestore';

function MyApp({ Component, pageProps }) {

  //using useAuthState instead simply using auth.currenUser, bcs I want the loading element
  const [user, loading] = useAuthState(auth); 
  
  //Creating a Document for each user who SignIn to the app
  useEffect(() => {
    if (user) { 
      const userDocRef = doc(db, "users", user.uid); 
            
      //setDoc updates data, also if the data doesnt alrdy exist to update it just creates the data instead showing error
      setDoc(userDocRef, {                  
        email: user.email,
        lastSeen: serverTimestamp(),
        photoURL: user.photoURL
    }, {merge: true})
    }
  }, [user]);

  //Rendering Loading while user reloads the page or right after SignIn
  if (loading) return <Loading />;


  //if nobody is SignedIn only rendering the Login component
  if (!user) return <Login/>;
  return (
    
      <Component {...pageProps} />
   
  )
};

export default MyApp;
