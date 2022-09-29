//: Node Packages
const path = require("path");
const http = require("http");

//: Dependencies
const socketio = require("socket.io");

const express = require("express");
const app = express();
const server = http.createServer(app);

//: moment formatting Date
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

//: Add socket into express server
const io = socketio(server);

//: Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botMsg = "WhatsChat Bot";

//: Run when server starts
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    //: Connect current user
    socket.emit("message", formatMessage(botMsg, "Welcome to WhatsChat !"));

    //: Users Connection
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botMsg, `${user.username} has joined the chat`)
      );
  });

  //: Listen Chat messages
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });

  //: Client disconnect
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botMsg, "User disconnected"));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
