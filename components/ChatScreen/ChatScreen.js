import { Avatar,  Button,  IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useCollection } from 'react-firebase-hooks/firestore';
import { serverTimestamp, addDoc, query, where, onSnapshot, collection, orderBy, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase-config';
import Message from '../Message/Message';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useState, useRef, useEffect } from 'react';
import TimeAgo from 'timeago-react';
import SendIcon from '@mui/icons-material/Send';


function ChatScreen({chatfromServer, messagesFromServer}) {
    
    const endOfMessagesRef = useRef(null);  //for Auto scroll
    const BeginningMessageRef = useRef(null); //to prevent auto scrolling the first ever message

    
    const [input, setInput] = useState("");

    const oppositeSideUserEmail = chatfromServer.users.filter(user => user !== auth.currentUser?.email)[0];
    
    const router = useRouter()   ;


    //Snap Shotting Messages which belongs to a single chat (This is for client Side rendering incase SSR doesn't work)
    let MessageQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    MessageQuery = query(MessageQuery, where("id", "==", router.query.id));
    const [messageSnapshot] = useCollection(MessageQuery) ;

    //Getting Opposite Side User info to show in Header section
    const userCollectionRef = collection(db, "users");
    const OpponentChatRef = query(userCollectionRef, where("email", "==", oppositeSideUserEmail));
    const [OpponentUserSnapshot] = useCollection(OpponentChatRef);


    //Preventing auto scroll for the first message
    useEffect(() => {
        const scrolltoTop = () => {
            if(!messagesFromServer) {
                BeginningMessageRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest"
                })
            };
        }
        scrolltoTop();
    });

    const showMessages = () => {

        // This static render will only work if server render doesn't 
        if (messageSnapshot) {
            return messageSnapshot.docs.map(message => ( 
                <Message                                               
                key={message.id}                         //the id I use here comes from the snapshot I'm taking above(this id is unqiue for each message. This is not message.data().id(only this id is for defeining to which chat the message belongs and it's not unique)
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime()
                }}
                />
            ))
        } else {  //Here we are saying before the messagesnapshot even exists just render it from serverside before the client even loads the component.
            return JSON.parse(messagesFromServer).map(message => (
                <Message key={message.messageId} user={message.user} message={message}/>
            ))
        }
    };


    const scrolltoBottom = () => {
        if(messageSnapshot?.docs.length>1) {
            endOfMessagesRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            })
        }
        
    };

    const sendMessage = (event) => {
        event.preventDefault();

        //updating User who sends the message's Last seen
        const userRef = doc(db, "users", auth.currentUser.uid);

        setDoc(userRef, {

            lastSeen: serverTimestamp()

        }, {merge:true})


        let messagesRef = collection(db, "messages");
        
        addDoc(messagesRef, {
            id : chatfromServer.id,                  //We use this id later in SSR to query messages belongs to chat with this id
            timestamp: serverTimestamp(),
            message: input,
            user: auth.currentUser?.email,
            photoURL: auth.currentUser?.photoURL
        });

        setInput("");
        scrolltoBottom();
    };
    
    const opponenUser = OpponentUserSnapshot?.docs?.[0]?.data();


    return (
        <Container>
            <Header>
                {opponenUser? (<Avatar src={opponenUser?.photoURL} />) 
                :(
                    <Avatar>{oppositeSideUserEmail[0]}</Avatar>
                )}
                
                <HeaderInfo>
                    <h3>{oppositeSideUserEmail}</h3>
                    {/* Showing Last seen */}
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
                <BeginningofMessage ref={BeginningMessageRef} />
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

export default ChatScreen;

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
const BeginningofMessage = styled.div`
    margin-top: 1px;
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