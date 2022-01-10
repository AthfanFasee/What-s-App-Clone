import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import { Avatar, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator'
import {signOut} from 'firebase/auth'
import { auth, db } from '../firebase-config';
import { addDoc, query, where, onSnapshot, collection } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat'

function Sidebar() {
    const chatCollectionRef = collection(db, "chats")
    const userChatRef = query(chatCollectionRef, where("users", "array-contains", auth.currentUser.email));
    const [chatsSnapshot] = useCollection(userChatRef) //I am using snapshot method from reacthooks bcs idk how to do it using firebase function(gotta check)


    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wanna chat with")

            if (!input) return null

            if (EmailValidator.validate(input) && !ChatExistsAlrdy(input) && input !== auth.currentUser.email) {  //making sure currentuser doesnt connect with his own chat
                const chatCollectionRef = collection(db, "chats")   //we need to add the chat in to the DB chats collection
                addDoc(chatCollectionRef, {                
                    users: [auth.currentUser.email, input]
                })
            }

    }

                                            //using !! to turn the return value in to true or false so that we can use it as a condition above in Create chat function            
    const ChatExistsAlrdy = (inputEmail) => !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === inputEmail)?.length > 0) //This whole line basically just checks if input Email we pass via propms alrdy exists in chats or not
    
    return (
        <Container>

            {/* Setting up Sidebar Header */}
            <Header>

                <UserAvatar src={auth.currentUser?.photoURL} onClick={() => signOut(auth)}/>

                <IconsContainer>


                    {/* Making MaterialIcons Clickable */}
                    <IconButton> 
                        <ChatIcon />
                    </IconButton>

                    <IconButton> 
                        <MoreVertIcon />
                    </IconButton>
                    

                </IconsContainer>

            </Header>

            {/* Setting up SearchBar under the SideBar Header */}
            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search in Chats"/>
            </Search>

            
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
            
             {/* list of Chats will come here    */}
             {chatsSnapshot?.docs.map((chat) => {
                 return <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
             })}
            
        </Container>
    )
}

export default Sidebar

const Container = styled.div`

`
const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;

`
const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`
const SidebarButton = styled(Button)`
    width: 100%;
    color: black;
    &&& {
        border-bottom: 1px solid whitesmoke;
        border-top: 1px solid whitesmoke;
    }
    

`
const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding:15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`
const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.7;
    }
`

const IconsContainer = styled.div`

`