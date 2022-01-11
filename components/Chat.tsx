import { Avatar } from '@mui/material'
import styled from 'styled-components'
import { auth, db } from '../firebase-config'
import { addDoc, query, where, onSnapshot, collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'



function Chat({id, users}) {


    const router = useRouter() //default next js function for rooting another component(same as Navigation in React)

    const oppositeSideUserEmail = users.filter(user => user !== auth.currentUser.email)[0]
    //after filtering users array and only getting a single array with opponentUser's email, saving it to a varibale called oppositeSideUserEmail(filter fucntion will always return an array not a single element)
    //oppositeSideUserEmail is a singleelement array now. so we need to get the first element from it in order to get the email alone, that's why using [0]

    const userCollectionRef = collection(db, "users")
    const OpponentChatRef = query(userCollectionRef, where("email", "==", oppositeSideUserEmail))
    //When the opposite side user loggedIn in his webapp, in our Users collection, just like it did for us, it will also create a document for that opposite side user as well in firebase
    //so we are refering to his data and getting a snap so that we can use his data to deploy his exact image near his chat
    
    const [OpponentUserSnapshot] = useCollection(OpponentChatRef)
   
    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    const OpponentUser = OpponentUserSnapshot?.docs?.[0]?.data() //meaning of data() is, if u console.log snapshot.docs.[0] u will find a very confusing array. we are just finding an Object with OpononetUser's info(Ex: photoUrl: "dfsf") there using .data()
    
    return (
        <Container onClick={enterChat}>

            {OpponentUser ?  (
            <UserAvatar src={OpponentUser?.photoURL} /> //gotta find out why my src isnt working

            ) : (

                <UserAvatar>{oppositeSideUserEmail[0]}</UserAvatar> //oppositeSideUserEmail is a string and we are just using its first letter[0] here
            )}
            
            <p>{oppositeSideUserEmail}</p>
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