import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import {auth,db} from '../firebase-config'
import Login from './login'
import Loading from '../components/Loading'
import { useEffect } from 'react'
import {addDoc, collection} from 'firebase/firestore'

function MyApp({ Component, pageProps }: AppProps) {

  //if the nobody is SignedIn only rendering the Login component
  const [user, loading] = useAuthState(auth)
  const postsCollectionRef = collection(db, "users")
  useEffect(() => {
    if (user) {
      db.collection('users')
    }
  }, [user])

  //Rendering Loading while user reloads the page or right after SignIn
  if (loading) return <Loading />

  if (!user) return <Login />
  return (
    
      <Component {...pageProps} />
   
  )
}

export default MyApp
