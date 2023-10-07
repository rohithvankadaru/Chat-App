var socket = io();
let userName = "";
let toUserName = "";
const joinChatBtn = document.getElementById("join-chat");
const userNameInput = document.getElementById("username-input");
const toUserNameInput = document.getElementById("toUsername-input");
const userForm = document.getElementById("userLoginForm");
const chatRoomContainer = document.querySelector(".chatRoom-Container");
const sendBtn = document.getElementById("send-btn");
const inputMessageTag = document.querySelector(".messageInput");
const messagesContainer = document.querySelector(".messages");



joinChatBtn.addEventListener("click", (event) => {
    event.preventDefault();

    userName = userNameInput.value;
    toUserName = toUserNameInput.value;

    if (userName) {
        userForm.style.display = "none";
        chatRoomContainer.style.display = "block";
        socket.on(`chat message ${userName}`, data => {
            if (data.id !== socket.id) {
                appendMessage(data, "received")
            }
        })
    }
});

inputMessageTag.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
        sendBtn.click();
    }
})

sendBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (inputMessageTag.value) {
        let data = {
            id: socket.id,
            userName: userName,
            toUserName: toUserName,
            message: inputMessageTag.value
        };
        socket.emit("chat message", data);
        appendMessage(data, "sent");
        inputMessageTag.value = null;
    }
});



function appendMessage(data, type) {
    const msgDiv = document.createElement('div');
    if (type === 'sent') {
        msgDiv.setAttribute('class', 'message sent')
        msgDiv.innerText = `${data.message}`;
    }
    else {
        msgDiv.innerText = `${data.userName} : ${data.message}`;
        msgDiv.setAttribute('class', 'message received')
    }
    messagesContainer.append(msgDiv);
}