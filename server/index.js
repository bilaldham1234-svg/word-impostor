const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected");

  // إنشاء غرفة
  socket.on("createRoom", ({ roomId, name }) => {
    rooms[roomId] = {
      players: [],
    };

    rooms[roomId].players.push({
      id: socket.id,
      name,
    });

    socket.join(roomId);

    io.to(roomId).emit("playersUpdate", rooms[roomId].players);

    socket.emit("roomCreated", roomId);
  });

  // دخول غرفة
  socket.on("joinRoom", ({ roomId, name }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
      };
    }

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

    io.to(roomId).emit("playersUpdate", rooms[roomId].players);
  });

  // بدء اللعبة
  socket.on("startGame", (roomId) => {
    io.to(roomId).emit("gameStarted");
  });

  // خروج اللاعب
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId].players = rooms[roomId].players.filter(
        (player) => player.id !== socket.id
      );

      io.to(roomId).emit("playersUpdate", rooms[roomId].players);
    }

    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});