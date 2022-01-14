import { Avatar,  Button,  IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useCollection } from 'react-firebase-hooks/firestore'
import { serverTimestamp, addDoc, query, where, onSnapshot, collection, orderBy, doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase-config';
import Message from './Message';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useState, useRef } from 'react';
import TimeAgo from 'timeago-react'
import SendIcon from '@mui/icons-material/Send';


function ChatScreen({chat, messages}) {

    const endOfMessagesRef = useRef(null)
    
    const [input, setInput] = useState("")

    const oppositeSideUserEmail = chat.users.filter(user => user !== auth.currentUser?.email)[0]
    
    const router = useRouter()   

    let MessageQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));
 
    MessageQuery = query(MessageQuery, where("id", "==", router.query.id));

    const [messageSnapshot] = useCollection(MessageQuery) 
    //THIS IS WHERE I NEED TO FIX ERROR AND SHOW MESSAGE ONLY IN THE CORRECT CHAT



    const userCollectionRef = collection(db, "users");
    const OpponentChatRef = query(userCollectionRef, where("email", "==", oppositeSideUserEmail))
    const [OpponentUserSnapshot] = useCollection(OpponentChatRef)



    const showMessages = () => {

        if (messageSnapshot) {
            return messageSnapshot.docs.map(message => (
                <Message 
                chat={chat}          //I DONT QUITE UNDERSTAND THIS PART. FOR now what I knw is the if is for static render and else part is for server render and my server render isnt working properly but static render does
                key={message.id}
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime()
                }}
                />
            ))
        } else {  //here we are saying before the messagesnapshot even exists just render it from serverside before the client even loads the component.
            return JSON.parse(messages).map(message => (
                <Message key={message.messageId} user={message.user} message={message} chat={chat}/>
                //My biggest Mistake was here and it was to use same chat.id which exists in all messages coming via server as the key. Instead i should have used something unique for each texts
                //I never knew a single wrong key could cause this much of a bug!!!!
            ))
        }
    }


    const scrolltoBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        })
    }

    const sendMessage = (event) => {
        event.preventDefault();

        //update the Last seen
        const userRef = doc(db, "users", auth.currentUser.uid)

        setDoc(userRef, {

            lastSeen: serverTimestamp()

        }, {merge:true})


        let messagesRef = collection(db, "messages");
        
        addDoc(messagesRef, {
            id : chat.id,
            timestamp: serverTimestamp(),
            message: input,
            user: auth.currentUser?.email,
            photoURL: auth.currentUser?.photoURL
        })

        setInput("")
        scrolltoBottom()
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
                <EndofMessage ref={endOfMessagesRef}/>
            </MessageContainer>

            <InputContainer>
                <EmojiEmotionsIcon />
                <Input value={input} onChange={(event) => setInput(event.target.value)}/>
                <Button disabled={!input} endIcon={<SendIcon />}></Button>
                
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
    margin-bottom: 50px;
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