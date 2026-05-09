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

    io.to(roomId).emit(
      "playersUpdate",
      rooms[roomId].players
    );

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

    io.to(roomId).emit(
      "playersUpdate",
      rooms[roomId].players
    );
  });

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
        .map((player) => player.id);

      console.log(
        "IMPOSTORS:",
        room.impostors
      );

      io.to(roomId).emit("gameStarted");
    }
  );

  // إرسال الدور
  socket.on("getRole", ({ roomId }) => {
    const room = rooms[roomId];

    if (!room) return;

    // تحقق إذا اللاعب impostor
    const isImpostor =
      room.impostors.includes(socket.id);

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