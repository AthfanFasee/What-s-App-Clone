
import Head  from 'next/head';
import styled from 'styled-components';
import ChatScreen from '../../components/ChatScreen/ChatScreen';
import Sidebar from '../../components/Sidebar/Sidebar';
import {doc, getDocs, collection, orderBy, query, getDoc, where} from 'firebase/firestore';
import {auth, db} from '../../firebase-config';

function Chat({chatfromServer, messages}) { //chatfromServer will be having an id property but chats collection from friebase wont have one, bcs this chat right here is coming from serversiderendering after id is added

    const oppositeSideUserEmail = chatfromServer.users.filter(user => user !== auth.currentUser?.email)[0];


    return (
        <Container>
            <Head>
                <title>Chat with {oppositeSideUserEmail}</title>
            </Head>
            

            <Sidebar />

            <ChatContainer>
                <ChatScreen chatfromServer={chatfromServer} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat;



export async function getServerSideProps(context) { //U can look at this function as some uneEffect function but it runs before the component is even rendered bcs It is server side rendering

    

    
    //Prepare messages on the server
    

    let MessageQuery = query(collection(db, "messages"), where("id", "==", context.query.id), orderBy("timestamp", "asc")); //this will query ass messages for a uinque chat using the chatid we added when adding the message to server

    const data = await getDocs(MessageQuery) ;//when we getDocs the messages it contains same id for all messages for a same root( for a ingle chat) so cant use it as key so we gotta add a unique id before passing as props to our component so that we can map through it and can create message component for each messages later
                        //here we use getDocs not getDoc, it works like a query snapshot( hover over it) in that way in can render each time a new message is added.(this works like a snapshot)
    
    const messages = data.docs.map(doc => ({
        messageId: doc.id, //we are creating a new id property to the messages data we get from SSR as it doen't have a unique id for each message(it alrdy got an Id when we get doc but that id is common for all messages in a single chat(between same 2 users))
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));
    
 
    //Prep the chats
    const ref = doc(db, "chats", context.query.id); //context will give u an id which referes to page URL (chat/id(the id we got from snapshots bcs in chat component when we did route we used the id from snapshot to root those unique chat pages))

    const chatData = await getDoc(ref) //in here we use getDoc not getDocs bcs it's not a snapshot as the data is only needed once and it doesnt need a livetime update unlike query snapshot
    const chat = {  
        id: chatData.id, //We are adding a new id(the ID we get  from firebase for a unique chat(The id we got from snapshotting chat in sidebar is also the same id, bcs it's the id firebase gives for each chats)) to chatData(Bcs chatdata we get from getDoc doesn't have an id key or any value in it(only users array), but we need an id from the chat we get via serverside rendering later so that we can add it to messages to make them unique for a specific chat)
        ...chatData.data() //this right here will return the only data exists in our chat collection which is users array       
    };

    
    return {
        props: {
            messages: JSON.stringify(messages),
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