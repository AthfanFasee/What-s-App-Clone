import { Avatar,  IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useCollection } from 'react-firebase-hooks/firestore'
import { serverTimestamp, addDoc, query, where, onSnapshot, collection, orderBy, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase-config';
import Message from './Message';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useState } from 'react';
import TimeAgo from 'timeago-react'



function ChatScreen({chat, messages}) {

    console.log(messages);
    
    const [input, setInput] = useState("")

    const oppositeSideUserEmail = chat.users.filter(user => user !== auth.currentUser?.email)[0]
    
    const router = useRouter()   

    const messagesRef = collection(db, "messages");
    
    const theQuery = query(messagesRef, orderBy("timestamp", "asc"));

    const [messageSnapshot] = useCollection(theQuery) 
    //THIS IS WHERE I NEED TO FIX ERROR AND SHOW MESSAGE ONLY IN THE CORRECT CHAT



    const userCollectionRef = collection(db, "users");
    const OpponentChatRef = query(userCollectionRef, where("email", "==", oppositeSideUserEmail))
    const [OpponentUserSnapshot] = useCollection(OpponentChatRef)



    const showMessages = () => {

        if (messageSnapshot) {
            return messageSnapshot.docs.map(message => (
                <Message 
                chat={chat}
                key={message.id}
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime()
                }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    const sendMessage = (event) => {
        event.preventDefault();

        //update the Last seen
        const userRef = doc(db, "users", auth.currentUser.uid)

        setDoc(userRef, {

            lastSeen: serverTimestamp()

        }, {merge:true})


        const messagesRef = collection(db, "messages");
        addDoc(messagesRef, {
            id : chat.id,
            timestamp: serverTimestamp(),
            message: input,
            user: auth.currentUser?.email,
            photoURL: auth.currentUser?.photoURL
        })

        setInput("")
    }
    
    const opponenUser = OpponentUserSnapshot?.docs?.[0]?.data()


    return (
        <Container>
            <Header>
                {opponenUser? (<Avatar src={opponenUser?.photoURL} />) 
                :(
                    <Avatar>{oppositeSideUserEmail[0]}</Avatar>
                )}
                

                <HeaderInfo>

                    <h3>{oppositeSideUserEmail}</h3>
                    {messageSnapshot ? (
                        <p>Last active: {` `}
                        {opponenUser?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={opponenUser?.lastSeen?.toDate()} />
                        ) : "Unavailable"}
                        </p>
                    ) : (
                        <p>Loading Last Active...</p>
                    )}
                </HeaderInfo>
                   
                <HeaderIcons>

                <IconButton>
                    <AttachFileIcon />
                </IconButton>

                <IconButton>
                    <MoreVertIcon />
                </IconButton>

                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndofMessage />
            </MessageContainer>

            <InputContainer>
                <EmojiEmotionsIcon />
                <Input value={input} onChange={(event) => setInput(event.target.value)}/>
                <button hidden disabled={!input} type="submit" onClick={sendMessage}></button>
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div`

`
const Header = styled.div`
    position: sticky;
    z-index: 100;
    top:0;
    background-color: white;
    padding: 11px;
    height: 80px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`
const HeaderInfo = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

     >p {
         font-size: 14px;
         color: gray
     }

`
const HeaderIcons = styled.div`

`
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`
const EndofMessage = styled.div`

`
const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position:sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`
const Input = styled.input`
    flex: 1;
    outline: none;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;

`