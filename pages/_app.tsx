import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth, db} from '../firebase-config'
import Login from './login'
import Loading from '../components/Loading'
import { useEffect } from 'react'
import { serverTimestamp, setDoc, doc} from 'firebase/firestore'

function MyApp({ Component, pageProps }: AppProps) {

  //if the nobody is SignedIn only rendering the Login component
  const [user, loading] = useAuthState(auth) //using useAuthState instead simply using auth.currenUser, bcs I want the loading element
  
  useEffect(() => {
    if (user) { 
      const userCollectionRef = doc(db, "users", user.uid)       //using doc instead of collection to add with a custom id instead of automated id. When using doc need to pass an id as third argument(when using collection we only pass 2 arguments)
                                                                // also we use doc instead of collection whenever we use setDoc function
      setDoc(userCollectionRef, {   //setDoc updates data, also if the data doesnt alrdy exist to update it just creates the data instead showing error               
        email: user.email,
        lastSeen: serverTimestamp(), //consider adding this in ur blog post instead creating ur own time
        photoURL: user.photoURL
    }, {merge: true})
    }
  }, [user])

  //Rendering Loading while user reloads the page or right after SignIn
  if (loading) return <Loading />

  if (!user) return <Login/>
  return (
    
      <Component {...pageProps} />
   
  )
}

export default MyApp
