var socket = io();
let userName = "";
let toUserName = "";
let file;
const joinChatBtn = document.getElementById("join-chat");
const userNameInput = document.getElementById("username-input");
const toUserNameInput = document.getElementById("toUsername-input");
const startPageContainer = document.getElementById("start-page-container");
const chatRoomContainer = document.querySelector(".chatRoom-Container");
const sendBtn = document.getElementById("send-btn");
const inputMessageTag = document.querySelector(".messageInput");
const messagesContainer = document.querySelector(".messages");
const fileInputBtn = document.getElementById('file-input');
const chooseFileBtn = document.getElementById('choose-file');
const recentUsersSection = document.getElementById('recent-users-section');
const recentChatsClearBtn = document.getElementById('recent-chats-clear-btn');

let userNameDisplay = document.getElementById('user-name-display');


function renderRecentChats() {
    let recentChatsString = localStorage.getItem('recentChats');
    if (recentChatsString) {
        const recentChatsArray = JSON.parse(recentChatsString);
        recentChatsArray.forEach(element => {
            recentUsersSection.innerHTML = recentUsersSection.innerHTML + `<div id="recent-user">${element}</div>`
        });
    }
}
renderRecentChats();

function addUserInStroage(user) {
    let recentChatsString = localStorage.getItem('recentChats');
    let recentChatsArray = [];
    if (recentChatsString) {
        recentChatsArray = JSON.parse(recentChatsString);
    }
    recentChatsArray.push(user);
    localStorage.setItem('recentChats', JSON.stringify(recentChatsArray));
}

recentChatsClearBtn.addEventListener('click', () => {
    localStorage.clear();
    recentUsersSection.innerHTML = '';
});

joinChatBtn.addEventListener("click", (event) => {
    event.preventDefault();

    userName = userNameInput.value;
    toUserName = toUserNameInput.value;


    if (userName && toUserName) {
        addUserInStroage(toUserName);
        startPageContainer.style.display = "none";
        chatRoomContainer.style.display = "block";
        socketOnFn();
        userNameDisplay.innerText = userName + ' --> ' + toUserName;
    }
});

function socketOnFn() {
    socket.on(`chat message ${userName}`, data => {
        if (data.id !== socket.id) {
            appendMessage(data, "received");
            if (data.file) {
                const imgFile = readImgFile(data.file);
                appendFile(imgFile, 'received');
            }
        }
    })
}

function readImgFile(arrayBuffer) {
    return new Blob([arrayBuffer], { type: 'image/*' });
}

inputMessageTag.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
        sendBtn.click();
    }
});

inputMessageTag.addEventListener('focus', () => {
    if (window.innerHeight <= 1048 && window.innerWidth <= 500) {
        messagesContainer.style.height = '35vh';
        document.body.style.height = '40vh';
    }
});
inputMessageTag.addEventListener('blur', () => {
    messagesContainer.style.height = '82.5vh';
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
        appendFile(data.file, 'sent');
        inputMessageTag.value = null;
    }
});



function appendMessage(data, type) {
    if (!data.message) return;
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
    msgDiv.scrollIntoView({ behavior: "smooth" });
}
function appendFile(imgArg, type) {
    if (!imgArg) return;
    const imgTag = document.createElement('img');
    if (type === 'sent') {
        imgTag.setAttribute('class', 'sent chatImg');
    } else {
        imgTag.setAttribute('class', 'received chatImg');
    }
    imgTag.src = URL.createObjectURL(imgArg);
    messagesContainer.appendChild(imgTag);
    file = '';
    imgTag.addEventListener('load', () => {
        imgTag.scrollIntoView({
            block: "end",
            behavior: "smooth"
        });
    })
}

fileInputBtn.addEventListener('click', () => chooseFileBtn.click());
chooseFileBtn.addEventListener('change', () => {
    file = chooseFileBtn.files[0];
    sendBtn.click();
})