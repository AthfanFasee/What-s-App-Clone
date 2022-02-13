import { Avatar } from '@mui/material';
import styled from 'styled-components';
import { auth, db } from '../../firebase-config';
import { query, where, collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRouter } from 'next/router';



function Chat({id, users}) {


    const router = useRouter(); 

    const oppositeSideUserEmail = users.filter(userEmail => userEmail !== auth.currentUser.email)[0];
    //oppositeSideUserEmail is a single element array now. And we need to get the first element from it in order to get the email alone, that's why using [0]


     //so we are refering to Opposite user data and getting a snap to deploy his exact image near his chat
    const userCollectionRef = collection(db, "users");
    const OpponentChatRef = query(userCollectionRef, where("email", "==", oppositeSideUserEmail)); 
    const [OpponentUserSnapshot] = useCollection(OpponentChatRef);
   
    const enterChat = () => {
        router.push(`https://what-s-app-clone-git-main-athfanfasee.vercel.app/chat/${id}`);
    }

    const OpponentUser = OpponentUserSnapshot?.docs?.[0]?.data(); //meaning of data() is, if u console.log snapshot.docs.[0] u will find a very confusing array. we are just finding an Object with OpononetUser's info there using .data() (Ex: photoUrl: "dfsf")
    
    return (
        <Container onClick={enterChat}>

            {OpponentUser ?  (
            <UserAvatar src={OpponentUser?.photoURL} />

            ) : (

                <UserAvatar>{oppositeSideUserEmail[0]}</UserAvatar> 
            )}
            
            <p>{oppositeSideUserEmail}</p>
        </Container>
    )
}

export default Chat;

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