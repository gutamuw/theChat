import { createMessageHtml } from "./helpers/createHtml";
import { Chat, Message } from "./models/Chat";
import "./style.css";
import { io } from "socket.io-client";

const cookies = document.cookie.split("; ");
const loginCookie = cookies.find((cookie) => cookie.startsWith("login="));

if (!loginCookie) {
  window.location.href = "/login.html";
}

document.getElementById("logout")?.addEventListener("click", () => {
  //sätter cookie till en gammal tid så att den tas bort
  document.cookie = "login=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/login.html";
});

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

socket.on("message", (message) => {
  console.log(message);
});

export let selectedRoom = "";

socket.on("chatList", (chats: Chat[]) => {
  const roomBtns = document.getElementById("roomBtns");
  if (roomBtns) {
    roomBtns.innerHTML = "";
    chats.forEach((chat) => {
      const roomBtn = document.createElement("button");
      roomBtn.innerHTML = chat.name;
      roomBtns.appendChild(roomBtn);

      roomBtn.addEventListener("click", () => {
        selectedRoom = chat.name;
        const currentRoomTitle = document.getElementById(
          "currentRoomTitle"
        ) as HTMLHeadingElement;
        currentRoomTitle.innerHTML = `You've entered the chat: ${chat.name}`;

        socket.emit("joinRoom", chat.name);
        roomBtns.remove();

        const chatInput = document.getElementById(
          "chatContainer"
        ) as HTMLDivElement;
        chatInput.style.display = "block";
      });
    });
  }
});

socket.on("roomMessages", (messages: Message[]) => {
  const messagesContainer = document.getElementById(
    "messages"
  ) as HTMLDivElement;
  messagesContainer.innerHTML = "";

  messages.forEach((message) => {
    const messageHtml = createMessageHtml(message);
    messagesContainer.appendChild(messageHtml);
  });
});

document.getElementById("messageForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const theMessage = (
    document.getElementById("messageInput") as HTMLInputElement
  ).value;

  socket.emit("sendChatMessage", theMessage, selectedRoom);

  (document.getElementById("messageInput") as HTMLInputElement).value = "";
});

socket.on("receivedChatMessage", (theMessage: Message) => {
  const message = createMessageHtml(theMessage);
  document.getElementById("messages")?.appendChild(message);
});
