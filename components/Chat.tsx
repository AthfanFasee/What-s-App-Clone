import { Avatar } from '@mui/material'
import styled from 'styled-components'
import { auth, db } from '../firebase-config'
import getOtherUserEmail from '../utils/getOtherUserEmail'
import { addDoc, query, where, onSnapshot, collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

function Chat({id, users}) {

    const oppositeSideUser = getOtherUserEmail(users, auth.currentUser?.email )
    //after filtering users array and only getting opponentUser's email, saving it to a varibale called oppositeSideUser


    const userCollectionRef = collection(db, "users")
    const userChatRef = query(userCollectionRef, where("email", "==", oppositeSideUser))
    //When the opposite side user loggedIn in his webapp, in our Users collection, just like it did for us, it will also create a document for that opposite side user as well in firebase
    //so we are refering to his data and getting a snap so that we can use his data to deploy his exact image near his chat
    
    const [OpponentUserSnapshot] = useCollection(userChatRef)
    console.log(OpponentUserSnapshot?.docs?.[0]?.data())
    const OpponentUser = OpponentUserSnapshot?.docs?.[0]?.data() //meaning of data() is, if u console.log snapshot.docs.[0] u will find a very confusing array. we are just finding an array called data there using .data()
    console.log(OpponentUser)
    return (
        <Container>

            {OpponentUser ?  (
            <UserAvatar src={OpponentUser?.photoURL} /> //gotta find out why my src isnt working

            ) : (

                <UserAvatar>{oppositeSideUser[0]}</UserAvatar>
            )}
            
            <p>{oppositeSideUser}</p>
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`