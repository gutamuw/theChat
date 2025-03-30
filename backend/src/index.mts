import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { registerRouter } from "../routes/registerRoute.mjs";
import { loginRouter } from "../routes/loginRoute.mjs";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();

app.use(json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(cookieParser());

app.use("/register", registerRouter);
app.use("/login", loginRouter);

const rooms = ["Animals", "Food", "Sports"];

const server = createServer(app);
const io = new Server(server, {
  cors: { credentials: true, origin: true },
  cookie: true,
});

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("sendChatMessage", (theMessage: string, selectedRoom: string) => {
    io.to(selectedRoom).emit("receivedChatMessage", theMessage);
  });

  socket.emit("roomList", rooms);

  socket.on("joinRoom", (room: string) => {
    console.log("User joined room:", room);
    socket.join(room);
  });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server!" });
});

server.listen(3000, async () => {
  await mongoose.connect(
    "mongodb+srv://userDB:hej123hej123@cluster0.lxm2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Server is running on port 3000, connected to database.");
});
