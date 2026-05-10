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
  socket.on(
    "createRoom",
    ({ roomId, name, playerId }) => {
      rooms[roomId] = {
        owner: playerId,
        players: [],
        impostors: [],
        word: "",
      };

      rooms[roomId].players.push({
        socketId: socket.id,
        playerId,
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
    }
  );

  // دخول غرفة
  socket.on(
    "joinRoom",
    ({ roomId, name, playerId }) => {
      const room = rooms[roomId];

      if (!room) return;

      const existingPlayer =
        room.players.find(
          (player) =>
            player.playerId === playerId
        );

      if (existingPlayer) {
        // تحديث socket عند refresh
        existingPlayer.socketId = socket.id;
        existingPlayer.name = name;
      } else {
        room.players.push({
          socketId: socket.id,
          playerId,
          name,
        });
      }

      socket.join(roomId);

      io.to(roomId).emit(
        "playersUpdate",
        room.players
      );

      io.to(roomId).emit(
        "ownerUpdate",
        room.owner
      );
    }
  );

  // بدء اللعبة
  socket.on(
    "startGame",
    ({ roomId, impostorCount }) => {
      const room = rooms[roomId];

      if (!room) return;

      // اختيار كلمة
      const randomWord =
        words[
          Math.floor(Math.random() * words.length)
        ];

      room.word = randomWord;

      // خلط اللاعبين
      const shuffledPlayers = [...room.players].sort(
        () => 0.5 - Math.random()
      );

      // اختيار impostors
      room.impostors = shuffledPlayers
        .slice(0, impostorCount)
        .map((player) => player.playerId);

      io.to(roomId).emit("gameStarted");
    }
  );

  // إعطاء الدور
  socket.on(
    "getRole",
    ({ roomId, playerId }) => {
      const room = rooms[roomId];

      if (!room) return;

      const isImpostor =
        room.impostors.includes(playerId);

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
    }
  );

  // خروج لاعب
  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(
        (player) =>
          player.socketId !== socket.id
      );

      // إذا الغرفة فاضية احذفها
      if (room.players.length === 0) {
        delete rooms[roomId];
        continue;
      }

      // إذا الهوست طلع
      if (
        !room.players.find(
          (p) => p.playerId === room.owner
        )
      ) {
        room.owner =
          room.players[0].playerId;
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

    console.log("User disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});