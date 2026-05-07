"use client";

import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
const [joinCode, setJoinCode] = useState("");
  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io("https://word-impostor-1.onrender.com");
  }, []);

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 7);

    socketRef.current.emit("createRoom", id);

    socketRef.current.on("roomCreated", (room: string) => {
      setRoomId(room);
    });
  };
const joinRoom = () => {
  socketRef.current.emit("joinRoom", {
    roomId: joinCode,
    name,
  });

  alert("Joined Room: " + joinCode);
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
      
      <div className="w-full max-w-md p-6 rounded-2xl bg-gray-800/60 backdrop-blur-lg shadow-2xl border border-gray-700">
        
        <h1 className="text-3xl font-bold text-center mb-6">
          🎮 Word Impostor
        </h1>

        <input
          className="w-full p-3 mb-4 rounded bg-gray-900 text-white outline-none border border-gray-700 focus:border-green-500"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
<input
  className="w-full p-3 mb-4 rounded bg-gray-900 text-white outline-none border border-gray-700 focus:border-blue-500"
  placeholder="Enter room code"
  value={joinCode}
  onChange={(e) => setJoinCode(e.target.value)}
/>
        {roomId && (
          <div className="text-center mb-4 text-green-400 font-semibold">
            Room Code: <span className="text-white">{roomId}</span>
          </div>
        )}

        <button
          onClick={createRoom}
          className="w-full mb-3 bg-green-500 hover:bg-green-600 transition-all py-2 rounded font-semibold"
        >
          Create Room
        </button>

        <button
          onClick={joinRoom}
          className="w-full bg-blue-500 hover:bg-blue-600 transition-all py-2 rounded font-semibold"
        >
          Join Room
        </button>

      </div>
    </div>
  );
} 