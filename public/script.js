var socket = io();
let userName = "";
const joinChatBtn = document.getElementById("join-chat");
const userNameInput = document.getElementById("username-input");
const userForm = document.getElementById("userLoginForm");
const chatRoomContainer = document.querySelector(".chatRoom-Container");
const sendBtn = document.getElementById("send-btn");
const inputMessageTag = document.querySelector(".messageInput");
const messagesContainer = document.querySelector(".messages");



joinChatBtn.addEventListener("click", (event) => {
    event.preventDefault();

    userName = userNameInput.value;

    if (userName) {
        userForm.style.display = "none";
        chatRoomContainer.style.display = "block";
    }
});


sendBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (inputMessageTag.value) {
        let data = {
            id: socket.id,
            userName: userName,
            message: inputMessageTag.value
        };
        socket.emit("chat message", data);
        appendMessage(data, "sent");
        inputMessageTag.value = null;
    }
});

socket.on('chat message', data => {
    if (data.id !== socket.id) {
        appendMessage(data, "received")
    }
})


function appendMessage(data, type) {
    const msgDiv = document.createElement('div');
    msgDiv.innerText = `${data.userName} : ${data.message}`;
    if (type === 'sent') {
        msgDiv.setAttribute('class', 'message sent')
    }
    else {
        msgDiv.setAttribute('class', 'message received')
    }
    messagesContainer.append(msgDiv);
}