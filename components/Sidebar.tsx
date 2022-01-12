import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import { Avatar, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator'
import {signOut} from 'firebase/auth'
import { auth, db } from '../firebase-config';
import { addDoc, query, where, onSnapshot, collection, orderBy } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from './Chat'

function Sidebar() {
    const chatCollectionRef = collection(db, "chats")
    const CurrentuserChatRef = query(chatCollectionRef, where("users", "array-contains", auth.currentUser.email)) //We only need to capture chat documents of the currenUser(Imagine I(athfanathfan@) started a chat with test@gmail.com. I only need to check chat documents where my email also exists in the users array. I dont wanna prevent another user from starting a chat with test@gmail.com. that's why gotta refer only to the chat documents where my email also exists(means those documents are for me or the currentuser LoggedIn)
    const [chatsSnapshot] = useCollection(CurrentuserChatRef) //I am using snapshot method from reacthooks bcs idk how to do it using firebase function(gotta check)


    

      

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wanna chat with")

            if (!input) return null

            if (EmailValidator.validate(input) && !ChatExistsAlrdy(input) && input !== auth.currentUser.email) {  //making sure currentuser doesnt connect with his own chat
                 
                addDoc(chatCollectionRef, {        //we need to add the chat in to the DB chats collection (Getting reference above under Sidebar Component)
                    users: [auth.currentUser.email, input]
                })
            }

    }
                                        //using !! to turn the return value in to true or false so that we can use it as a condition above in Create chat function(it will retrun true if the function normally returns any value or element)            
    const ChatExistsAlrdy = (inputEmail) => !!chatsSnapshot?.docs.find(chat => chat.data().users.find(user => user === inputEmail)?.length > 0) //This whole line basically just checks if input Email we pass via propms alrdy exists in chats or not
    //I can do something like this "const isInputAlrdyExists = !!chatSnapshot?.docs.find(chat => chat.data().users.find(user => user === input).length >0" but here I wont be having access to the input value. Bcs that exists inside Createchat function duh.
    //so that creating a ChatExistsAlrdy function and passing it inside Createchat function and returning true or false right there is a POG move
    //U can use this trick in ur other projects

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
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
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