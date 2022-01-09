import styled from 'styled-components'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import { Avatar, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator'

function Sidebar() {

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wanna chat with")

            if (!input) return null

            if (EmailValidator.validate(input)) {
                //we need to add the chat in to the DB chats collection
            }

    }


    return (
        <Container>

            {/* Setting up Sidebar Header */}
            <Header>

                <UserAvatar />

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