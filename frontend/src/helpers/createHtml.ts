import { Message } from "../models/Chat";

export const createMessageHtml = (message: Message) => {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  const author = document.createElement("span");
  const time = document.createElement("time");
  const messageText = document.createElement("p");

  author.innerHTML = message.from;
  time.innerHTML = new Date(message.time).toLocaleTimeString();
  messageText.innerHTML = message.message;

  messageContainer.append(author, time, messageText);

  return messageContainer;
};
