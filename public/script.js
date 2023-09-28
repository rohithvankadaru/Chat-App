const btn = document.getElementById("join-chat");
const userNameInput = document.getElementById("username-input");
const userForm = document.getElementById("userLoginForm");
const chatRoomContainer = document.querySelector(".chatRoom-Container");


let userName;


btn.addEventListener("click", (event)=>{
    event.preventDefault();

    userName = userNameInput.value;

    if(userName){
        userForm.style.display = "none";
        chatRoomContainer.style.display = "block";
    }
})