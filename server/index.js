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
      owner: name,
      players: [],
      impostors: [],
      word: "",
    };

    rooms[roomId].players.push({
      id: socket.id,
      name,
    });

    socket.join(roomId);

    io.to(roomId).emit(
      "playersUpdate",
      rooms[roomId].players
    );

    io.to(roomId).emit(
      "ownerUpdate",
      rooms[roomId].owner
    );

    socket.emit("roomCreated", roomId);
  });

  // دخول غرفة
  socket.on("joinRoom", ({ roomId, name }) => {
    if (!rooms[roomId]) return;

    const alreadyExists = rooms[roomId].players.find(
      (player) => player.name === name
    );

    if (!alreadyExists) {
      rooms[roomId].players.push({
        id: socket.id,
        name,
      });
    } else {
      alreadyExists.id = socket.id;
    }

    socket.join(roomId);

    io.to(roomId).emit(
      "playersUpdate",
      rooms[roomId].players
    );

    io.to(roomId).emit(
      "ownerUpdate",
      rooms[roomId].owner
    );
  });

  // بدء اللعبة
  socket.on(
    "startGame",
    ({ roomId, impostorCount }) => {
      const room = rooms[roomId];

      if (!room) return;

      const randomWord =
        words[
          Math.floor(Math.random() * words.length)
        ];

      room.word = randomWord;

      const shuffledPlayers = [...room.players].sort(
        () => 0.5 - Math.random()
      );

      room.impostors = shuffledPlayers
        .slice(0, impostorCount)
        .map((player) => player.name);

      io.to(roomId).emit("gameStarted");
    }
  );

  // إعطاء الدور
  socket.on("getRole", ({ roomId, name }) => {
    const room = rooms[roomId];

    if (!room) return;

    const isImpostor =
      room.impostors.includes(name);

    if (isImpostor) {
      socket.emit("roleData", {
        role: "impostor",
        word: "???",
      });
    } else {
      socket.emit("roleData", {
        role: "player",
        word: room.word,
      });
    }
  });

  // خروج لاعب
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(
        (player) => player.id !== socket.id
      );

      io.to(roomId).emit(
        "playersUpdate",
        room.players
      );

      io.to(roomId).emit(
        "ownerUpdate",
        room.owner
      );
    }

    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});