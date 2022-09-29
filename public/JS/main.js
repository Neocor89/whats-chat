const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

//: Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//: Message Submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  //: Message to server
  socket.emit("chatMessage", msg);

  //: Clear Input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//: outputMessage DOM

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
 <p class="text">
   ${message}
 </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
