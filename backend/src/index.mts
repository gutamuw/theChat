import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { registerRouter } from "./routes/registerRoute.mjs";
import { loginRouter } from "./routes/loginRoute.mjs";
import { auth } from "./middlewares/auth.mjs";
import { Message } from "./models/Chat.mjs";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { UserDto } from "./models/UserDto.mjs";
import Chat from "./models/ChatSchema.mjs";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const MONGOURI = process.env.MONGO_URI;

if (!MONGOURI) {
  throw new Error("MongoDB URI is not defined in .env file");
}

app.use("/register", registerRouter);
app.use("/login", loginRouter);

app.use(auth);

const server = createServer(app);
const io = new Server(server, {
  cors: { credentials: true, origin: true },
  cookie: true,
});

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  const cookies = cookie.parse(socket.handshake.headers.cookie || "");
  const loginCookie = cookies.login;

  const chats = await Chat.find();

  socket.emit("chatList", chats);

  socket.on("joinRoom", async (room: string) => {
    console.log("User joined room:", room);
    const chat = await Chat.findOne({ name: room });
    socket.join(room);

    socket.emit("roomMessages", chat?.messages || []);
  });

  socket.on(
    "sendChatMessage",
    async (theMessage: string, selectedRoom: string) => {
      const chatToUpdate = await Chat.findOne({ name: selectedRoom });

      if (chatToUpdate && loginCookie) {
        const user = jwt.decode(loginCookie) as UserDto;
        const newMessage: Message = {
          from: user.name,
          message: theMessage,
          time: new Date(),
        };

        chatToUpdate.messages.push(newMessage);
        await chatToUpdate.save();

        io.to(selectedRoom).emit("receivedChatMessage", newMessage);
      } else {
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server!" });
});

server.listen(PORT, async () => {
  await mongoose.connect(MONGOURI);
  console.log("Server is running on port 3000, connected to database.");
});
