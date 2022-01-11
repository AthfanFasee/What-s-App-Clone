import styled from 'styled-components';
import Head from 'next/head'
import { Button } from '@mui/material';
import { auth, provider } from '../firebase-config';
import {signInWithPopup} from 'firebase/auth'

function Login() {

    const signIn = () => {
        signInWithPopup(auth, provider).catch(alert)
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                
                <Logo src="https://www.freepnglogos.com/uploads/whatsapp-png-logo-1.png" />
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh; //this makes everything goes to the center of the page
    background-color: whitesmoke;
`
const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 5px
`
const Logo = styled.img`
    height:100px;
    width:100px;
    margin-bottom: 50px;
`
