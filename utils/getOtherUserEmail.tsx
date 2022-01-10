    const getOtherUserEmail = (users, userLoggedIn) => (
    users?.filter(userToFilter => userToFilter !== userLoggedIn)[0]
)

export default getOtherUserEmail

//in Here what we are doing is
//We got the users array from the chatsnapshot(which we took for all the chats which contains the current authur's email)
//now in that users array we need to get the email which isn't the curren author's emain(means the person in opposite side's email)
//so that we can display the person we are chatting with's email in screen
//the filtering array will only contain the other user's email