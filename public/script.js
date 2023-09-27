const btn = document.getElementById("join-chat");
const userNameInput = document.getElementById("username-input");
const userForm = document.getElementById("userForm");
const chatRoomContainer = document.querySelector(".chatRoom-Container");


let userName;


btn.addEventListener("click", (event)=>{
    event.preventDefault();
    chatRoomContainer.style.display = "block";

    userName = userNameInput.value;

    if(userName){
        userForm.style.display = "none";
    }
})