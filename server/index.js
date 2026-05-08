const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // إنشاء غرفة
socket.on("createRoom", ({ roomId, name }) => {

  rooms[roomId] = {
    players: [
      {
        id: socket.id,
        name,
      },
    ],
  };

  socket.join(roomId);

  io.to(roomId).emit("roomUpdate", rooms[roomId]);

  socket.emit("roomCreated", roomId);

  console.log("Room created:", roomId);

});

  // دخول غرفة
  socket.on("joinRoom", ({ roomId, name }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
      };
    }

    // منع التكرار
    const alreadyExists = rooms[roomId].players.find(
      (player) => player.id === socket.id
    );

    if (!alreadyExists) {
      rooms[roomId].players.push({
        id: socket.id,
        name,
      });
    }

    socket.join(roomId);

    io.to(roomId).emit("roomUpdate", rooms[roomId]);

    socket.emit("joinedRoom", roomId);

    console.log(name, "joined room", roomId);
  });

  // خروج لاعب
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(
        (player) => player.id !== socket.id
      );

      io.to(roomId).emit("roomUpdate", rooms[roomId]);
    }

    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});