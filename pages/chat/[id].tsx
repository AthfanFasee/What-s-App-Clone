
import Head  from 'next/head';
import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen/ChatScreen';
import Sidebar from '../../components/Sidebar/Sidebar';
import {doc, getDocs, collection, orderBy, query, getDoc, where} from 'firebase/firestore';
import {auth, db} from '../../firebase-config';
import { GetServerSideProps } from 'next';

function Chat({chatfromServer, messagesFromServer}) { //chatfromServer will be having an id property but chats collection from friebase wont have one, bcs this chat right here is coming from serversiderendering after id is added

    const oppositeSideUserEmail = chatfromServer.users.filter(user => user !== auth.currentUser?.email)[0];


    return (
        <Container>
            <Head>
                <title>Chat with {oppositeSideUserEmail}</title>
            </Head>
            
            <Sidebar />

            <ChatContainer>
                <ChatScreen chatfromServer={chatfromServer} messagesFromServer={messagesFromServer}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat;



export async function getServerSideProps(context) :GetServerSideProps { //U can look at this function as some useEffect function but it runs before the component is even rendered bcs It is server side rendering
    
    //Prepare messages on server   

    let MessageQuery = query(collection(db, "messages"), where("id", "==", context.query.id), orderBy("timestamp", "asc")); 
    
    //here we use getDocs not getDoc, it works like a query snapshot in that way in can render each time a new message is added
    const data = await getDocs(MessageQuery);
                        
    
    const messages = data.docs.map(doc => ({
        messageId: doc.id, //we are creating a new id property to the messages data we get from SSR as it doesn't have an unique id for each message(it alrdy got an Id when we get doc but that id is common for all messages in a single chat(between same 2 users))
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));
    
 
    //Prep the chats on Server
    const ref = doc(db, "chats", context.query.id); //context will give u an id which referes to page URL (chat/id(the id we got from snapshots bcs in chat component when we did route we used the id from snapshot to root those unique chat pages))

    const chatData = await getDoc(ref) //in here we use getDoc not getDocs bcs it's not a snapshot as the data is only needed once and it doesnt need a livetime update unlike query snapshot
    const chat = {  
        id: chatData.id, //We are adding a new id(the ID we get  from firebase for a unique chat to chatData (Bcs chatdata we get from getDoc doesn't have an id key or any value in it(only users array), but we need an id from the chat we get via serverside rendering later so that we can add it to messages to make them unique for a specific chat)
        ...chatData.data()      
    };

    
    return {
        props: {
            messagesFromServer: JSON.stringify(messages),
            chatfromServer: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    
    ::-webkit-scrollbar {
        display: none
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`