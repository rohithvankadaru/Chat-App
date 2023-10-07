var socket = io();
let userName = "";
let toUserName = "";
let file;
const joinChatBtn = document.getElementById("join-chat");
const userNameInput = document.getElementById("username-input");
const toUserNameInput = document.getElementById("toUsername-input");
const userForm = document.getElementById("userLoginForm");
const chatRoomContainer = document.querySelector(".chatRoom-Container");
const sendBtn = document.getElementById("send-btn");
const inputMessageTag = document.querySelector(".messageInput");
const messagesContainer = document.querySelector(".messages");
const fileInputBtn = document.getElementById('file-input');
const chooseFileBtn = document.getElementById('choose-file');
let userNameDisplay = document.getElementById('user-name-display');



joinChatBtn.addEventListener("click", (event) => {
    event.preventDefault();

    userName = userNameInput.value;
    toUserName = toUserNameInput.value;

    if (userName) {
        userForm.style.display = "none";
        chatRoomContainer.style.display = "block";
        socketFn();
        userNameDisplay.innerText = userName + ' --> ' + toUserName;
    }
});

function socketFn() {
    socket.on(`chat message ${userName}`, data => {
        if (data.id !== socket.id) {
            appendMessage(data, "received");
            const imgFile = readImgFile(data.file);
            if (imgFile) {
                appendFile(imgFile, 'received');
            }
        }
    })
}

function readImgFile(arrayBuffer) {
    return new Blob([arrayBuffer], { type: 'image/jpeg' });
}

inputMessageTag.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
        sendBtn.click();
    }
})

sendBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (inputMessageTag.value || file) {
        let data = {
            id: socket.id,
            userName: userName,
            toUserName: toUserName,
            message: inputMessageTag.value,
            file: file
        };
        socket.emit("chat message", data);
        appendMessage(data, "sent");
        if (data.file) {
            appendFile(data.file, 'sent');
        }
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
        msgDiv.setAttribute('class', 'message received')
        msgDiv.innerText = `${data.userName} : ${data.message}`;
    }
    messagesContainer.append(msgDiv);
}
function appendFile(imgArg, type) {
    const imgTag = document.createElement('img');
    imgTag.style.width = '12vw';
    imgTag.style.height = 'auto';
    if (type === 'sent') {
        imgTag.setAttribute('class', 'sent chatImg');
    } else {
        imgTag.setAttribute('class', 'received chatImg');
    }
    imgTag.src = URL.createObjectURL(imgArg);
    messagesContainer.appendChild(imgTag);
    file = '';
}

fileInputBtn.addEventListener('click', () => chooseFileBtn.click());
chooseFileBtn.addEventListener('change', () => {
    file = chooseFileBtn.files[0];
    sendBtn.click();
})