"use client";

import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://word-impostor-msem.onrender.com");

export default function Home() {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] =
    useState("");

  const createRoom = () => {
    if (!name) return;

    const roomId = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    const playerId = crypto.randomUUID();

    localStorage.setItem(
      "playerName",
      name
    );

    localStorage.setItem(
      "playerId",
      playerId
    );

    socket.emit("createRoom", {
      roomId,
      name,
      playerId,
    });

    socket.on("roomCreated", (room) => {
      window.location.href = `/room/${room}`;
    });
  };

  const joinRoom = () => {
    if (!name || !joinCode) return;

    const playerId = crypto.randomUUID();

    localStorage.setItem(
      "playerName",
      name
    );

    localStorage.setItem(
      "playerId",
      playerId
    );

    window.location.href = `/room/${joinCode}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-[#111] p-10 rounded-3xl w-[400px] border border-purple-500 shadow-[0_0_35px_#a855f7]">

        <h1 className="text-5xl font-black text-center mb-8">
          WORD
          <span className="block text-purple-400">
            IMPOSTOR
          </span>
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full p-4 rounded-2xl bg-[#222] mb-4 outline-none"
        />

        <input
          type="text"
          placeholder="Enter room code"
          value={joinCode}
          onChange={(e) =>
            setJoinCode(e.target.value)
          }
          className="w-full p-4 rounded-2xl bg-[#222] mb-6 outline-none"
        />

        <button
          onClick={createRoom}
          className="w-full bg-green-500 hover:bg-green-600 py-4 rounded-2xl font-bold text-xl mb-4"
        >
          Create Room
        </button>

        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 hover:bg-blue-600 py-4 rounded-2xl font-bold text-xl"
        >
          Join Room
        </button>

      </div>
    </main>
  );
}