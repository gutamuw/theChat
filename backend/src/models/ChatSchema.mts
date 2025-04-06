import { model, Schema } from "mongoose";

const messageSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
});

const Chat = model("Chat", chatSchema);
export default Chat;
