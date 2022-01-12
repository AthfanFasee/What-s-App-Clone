import styled from 'styled-components'

function Message({user, message, chat}) {
    return (
        <Container>
            {message?.id === chat?.id &&
                <TextContainer>{message.message}</TextContainer>
            }
            
        </Container>
    )
}

export default Message

const Container = styled.div`

`
const TextContainer = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 50px;
    padding-bottom: 25px;
    position: relative;
    text-align: right;
`

const SenderText = styled(TextContainer)`
    margin-left: auto;
    background-color: #dcf8c6;

`

const ReceiverText = styled(TextContainer)`
    background-color: whitesmoke;
    text-align: left;
`