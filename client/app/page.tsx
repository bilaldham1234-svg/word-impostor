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
  localStorage.setItem("playerName", name);
  socketRef.current.emit("joinRoom", {
    roomId: joinCode,
    name,
  });

  window.location.href = `/room/${joinCode}`;
};

  

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f172a]">

      <div className="bg-[#1e293b] p-8 rounded-2xl shadow-2xl w-[350px] flex flex-col gap-4">

        <h1 className="text-white text-3xl font-bold text-center">
          🎮 Word Impostor
        </h1>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded bg-[#0f172a] text-white outline-none"
        />

        <input
          type="text"
          placeholder="Enter room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          className="p-3 rounded bg-[#0f172a] text-white outline-none"
        />

        <button
          onClick={createRoom}
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded font-bold"
        >
          Create Room
        </button>

        <button
          onClick={joinRoom}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded font-bold"
        >
          Join Room
        </button>

      </div>

    </main>
  );
}