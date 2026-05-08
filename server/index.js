const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // إنشاء غرفة
  socket.on("createRoom", (roomId) => {
    rooms[roomId] = {
      players: []
    };

    socket.join(roomId);
    socket.emit("roomCreated", roomId);
io.to(roomId).emit("roomUpdate", rooms[roomId]);
    console.log("Room created:", roomId);
  });

  // دخول غرفة
socket.on("joinRoom", ({ roomId, name }) => {

  if (!rooms[roomId]) {
    socket.emit("error", "Room does not exist");
    return;
  }

  rooms[roomId].players.push({
    id: socket.id,
    name
  });

  socket.join(roomId);

  io.to(roomId).emit("roomUpdate", rooms[roomId]);

  console.log(name, "joined room", roomId);

  socket.emit("joinedRoom", roomId);

});
  // قطع الاتصال
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});