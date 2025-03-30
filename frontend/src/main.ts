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

socket.on("roomList", (rooms: string[]) => {
  const roomBtns = document.getElementById("roomBtns");
  if (roomBtns) {
    roomBtns.innerHTML = "";
    rooms.forEach((room) => {
      const roomBtn = document.createElement("button");
      roomBtn.innerHTML = room;
      roomBtns.appendChild(roomBtn);

      roomBtn.addEventListener("click", () => {
        selectedRoom = room;
        socket.emit("joinRoom", room);
        roomBtns.remove();
        const chatInput = document.getElementById(
          "chatContainer"
        ) as HTMLDivElement;
        chatInput.style.display = "block";
      });
    });
  }
});

document.getElementById("messageForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const theMessage = (
    document.getElementById("messageInput") as HTMLInputElement
  ).value;

  socket.emit("sendChatMessage", theMessage, selectedRoom);
});

socket.on("receivedChatMessage", (theMessage: string) => {
  const message = document.createElement("p");
  message.innerHTML = theMessage;
  document.getElementById("messages")?.appendChild(message);
});
