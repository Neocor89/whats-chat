const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketio(server);

//: Set static folder
app.use(express.static(path.join(__dirname, "public")));

//: Run when server starts
io.on("connection", (socket) => {
  //: Connect current user
  socket.emit("message", "Welcome to WhatsChat !");

  //: Users Connection
  socket.broadcast.emit("message", "A user has joined the chat");

  //: Client disconnect
  socket.on("disconnect", () => {
    io.emit("message", "User disconnected");
  });

  //: Listen Chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
