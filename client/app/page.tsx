"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io("https://word-impostor-server.onrender.com");
  }, []);

  const createRoom = () => {
    if (!name) return;

    const id = Math.floor(10000 + Math.random() * 90000).toString();

    localStorage.setItem("playerName", name);

    socketRef.current.emit("createRoom", {
      roomId: id,
      name,
    });

    socketRef.current.on("roomCreated", (room: string) => {
      window.location.href = `/room/${room}`;
    });
  };

  const joinRoom = () => {
    if (!name || !joinCode) return;

    localStorage.setItem("playerName", name);

    window.location.href = `/room/${joinCode}`;
  };

  return (
    <main className="min-h-screen bg-[#0b0b16] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#1a1a2e] p-8 rounded-3xl shadow-[0_0_40px_#8b5cf6]">
        <h1 className="text-5xl font-bold text-center mb-8 text-purple-300">
          🎮 Word Impostor
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#111] text-white mb-4 outline-none"
        />

        <input
          type="text"
          placeholder="Enter room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#111] text-white mb-6 outline-none"
        />

        <button
          onClick={createRoom}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl mb-4"
        >
          Create Room
        </button>

        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl"
        >
          Join Room
        </button>
      </div>
    </main>
  );
}