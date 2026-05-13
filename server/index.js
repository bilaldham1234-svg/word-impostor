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
  "Pizza",
  "Tiger",
  "Football",
  "School",
  "Phone",
  "Burger",
  "Minecraft",
];

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("createRoom", ({ roomId, name, playerId }) => {
    rooms[roomId] = {
      owner: playerId,
      players: [],
      impostors: [],
      word: "",
    };

    rooms[roomId].players.push({
      id: playerId,
      socketId: socket.id,
      name,
    });

    socket.join(roomId);

    io.to(roomId).emit("playersUpdate", rooms[roomId].players);
    io.to(roomId).emit("ownerUpdate", rooms[roomId].owner);
  });

  socket.on("joinRoom", ({ roomId, name, playerId }) => {
    const room = rooms[roomId];

    if (!room) return;

    const existingPlayer = room.players.find(
      (p) => p.id === playerId
    );

    if (existingPlayer) {
      existingPlayer.socketId = socket.id;
    } else {
      room.players.push({
        id: playerId,
        socketId: socket.id,
        name,
      });
    }

    socket.join(roomId);

    io.to(roomId).emit("playersUpdate", room.players);
    io.to(roomId).emit("ownerUpdate", room.owner);
  });

  socket.on("startGame", ({ roomId, impostorCount }) => {
    const room = rooms[roomId];

    if (!room) return;

    const randomWord =
      words[Math.floor(Math.random() * words.length)];

    room.word = randomWord;

    const shuffledPlayers = [...room.players].sort(
      () => 0.5 - Math.random()
    );

    room.impostors = shuffledPlayers
      .slice(0, impostorCount)
      .map((p) => p.id);

    io.to(roomId).emit("gameStarted");
  });

  socket.on("getRole", ({ roomId, playerId }) => {
    const room = rooms[roomId];

    if (!room) return;

    const isImpostor =
      room.impostors.includes(playerId);

    socket.emit("roleData", {
      role: isImpostor ? "impostor" : "player",
      word: isImpostor ? "???" : room.word,
    });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(
        (p) => p.socketId !== socket.id
      );

      if (room.players.length === 0) {
        delete rooms[roomId];
        continue;
      }

      if (
        !room.players.find(
          (p) => p.id === room.owner
        )
      ) {
        room.owner = room.players[0].id;
      }

      io.to(roomId).emit(
        "playersUpdate",
        room.players
      );

      io.to(roomId).emit(
        "ownerUpdate",
        room.owner
      );
    }
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});