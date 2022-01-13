
import Head  from 'next/head'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import {doc, getDocs, collection, orderBy, query, getDoc, where} from 'firebase/firestore'
import {auth, db} from '../../firebase-config'

function Chat({chat, messages}) {

    const oppositeSideUserEmail = chat.users.filter(user => user !== auth.currentUser?.email)[0]


    return (
        <Container>
            <Head>
                <title>Chat with {oppositeSideUserEmail}</title>
            </Head>
            

            <Sidebar />

            <ChatContainer>
                <ChatScreen chat={chat} messages={messages}/>
            </ChatContainer>
        </Container>
    )
}

export default Chat



export async function getServerSideProps(context) {

    const ref = doc(db, "chats", context.query.id);

    
    //Prepare messages on the server
    

    let MessageQuery = query(collection(db, "messages"), where("id", "==", context.query.id), orderBy("timestamp", "asc"));

    const data = await getDocs(MessageQuery)
    
    
    const messages = data.docs.map(doc => ({
        messageId: doc.id, //what's the purpose of this id???
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))
    
 
    //Prep the chats
    const chatRes = await getDoc(ref)
    const chat = {  //this whole function only happens in server.So even if u console.log(chat) u cant see it in webpage instead only in terminal
        id: chatRes.id,
        ...chatRes.data() //this right here will return the only data exists in our chat collection which is users array

    }


    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
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