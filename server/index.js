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

const words = [
  "Apple",
  "Banana",
  "Pizza",
  "Tiger",
  "Football",
  "Minecraft",
  "Phone",
  "Car",
  "Burger",
  "School",
];

io.on("connection", (socket) => {
  console.log("User connected");

  // إنشاء غرفة
  socket.on("createRoom", ({ roomId, name }) => {
    rooms[roomId] = {
      players: [],
      impostors: [],
      word: "",
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
        impostors: [],
        word: "",
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
    const room = rooms[roomId];

    if (!room) return;

    // اختيار كلمة عشوائية
    const randomWord =
      words[Math.floor(Math.random() * words.length)];

    room.word = randomWord;

    // اختيار impostor عشوائي
    const randomPlayer =
      room.players[
        Math.floor(Math.random() * room.players.length)
      ];

    room.impostors = [randomPlayer.id];

    io.to(roomId).emit("gameStarted");
  });

  // إرسال الدور
  socket.on("getRole", ({ roomId, name }) => {
    const room = rooms[roomId];

    if (!room) return;

    const isImpostor =
      room.impostors.includes(socket.id);

    if (isImpostor) {
      socket.emit("roleData", {
        role: "impostor",
        word: "",
      });
    } else {
      socket.emit("roleData", {
        role: "player",
        word: room.word,
      });
    }
  });

  // خروج اللاعب
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId].players =
        rooms[roomId].players.filter(
          (player) => player.id !== socket.id
        );

      io.to(roomId).emit(
        "playersUpdate",
        rooms[roomId].players
      );
    }

    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});