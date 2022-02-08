import styled from 'styled-components'
import { auth } from '../firebase-config'
import moment from 'moment'

function Message({user, message}) {

    const MessgeType = user === auth.currentUser?.email ? SenderText : ReceiverText
    return (
        <Container>
                
                    <MessgeType>{message.message}
                    <TimeStamp>{message.timestamp? moment(message.timestamp).format('LT') : "..."}</TimeStamp>
                    </MessgeType>         
            
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

const TimeStamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;

`