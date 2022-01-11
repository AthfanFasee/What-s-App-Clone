
import Head  from 'next/head'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen'
import Sidebar from '../../components/Sidebar'
import {doc, getDocs, collection, orderBy, query, limit, getDoc, onSnapshot} from 'firebase/firestore'
import {auth, db} from '../../firebase-config'

function Chat({chat, messages}) {




    return (
        <Container>
            <Head>
                <title>Chat</title>
            </Head>
            

            <Sidebar />

            <ChatContainer>
                <ChatScreen />
            </ChatContainer>
        </Container>
    )
}

export default Chat



// export async function getServerSideProps(context) {
//     const userCollectionRef = doc(db, "chats", context.query.id)
    
//     //Prepare messages on the server
  


//     const messagesqueryRef =  query(userCollectionRef, orderBy("timestamp", "asc")); //asc means asscending order

//      const data = await getDocs(messagesqueryRef)

//     const messages = data.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//     }))
    
//     const ReadyMessages =  messages.map(messages => ({
//         ...messages,
//         timestamp: messages.timestamp.toDate().getTime()
//     }))

//     //Prep the chats
//     const chatRes = await getDoc(userCollectionRef)
//     const chat = {
//         id: chatRes.id,
//         ...chatRes.data()

//     }

//     console.log(chat, messages)

//     return {
//         props: {
//             messages: JSON.stringify(messages),
//             chat: chat
//         }
//     }
// }

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