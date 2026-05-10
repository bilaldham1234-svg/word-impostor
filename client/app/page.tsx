"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const socketRef = useRef<any>(null);

  useEffect(() => {
    socketRef.current = io(
      "https://word-impostor-server.onrender.com"
    );

    // إنشاء playerId ثابت
    let playerId =
      localStorage.getItem("playerId");

    if (!playerId) {
      playerId = crypto.randomUUID();

      localStorage.setItem(
        "playerId",
        playerId
      );
    }
  }, []);

  // إنشاء غرفة
  const createRoom = () => {
    if (!name) return;

    const roomId = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    const playerId =
      localStorage.getItem("playerId");

    localStorage.setItem(
      "playerName",
      name
    );

    socketRef.current.emit("createRoom", {
      roomId,
      name,
      playerId,
    });

    socketRef.current.on(
      "roomCreated",
      (room: string) => {
        window.location.href = `/room/${room}`;
      }
    );
  };

  // دخول غرفة
  const joinRoom = () => {
    if (!name || !joinCode) return;

    const playerId =
      localStorage.getItem("playerId");

    localStorage.setItem(
      "playerName",
      name
    );

    socketRef.current.emit("joinRoom", {
      roomId: joinCode,
      name,
      playerId,
    });

    window.location.href = `/room/${joinCode}`;
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-purple-700 opacity-20 blur-[140px] rounded-full" />

      <div className="z-10 bg-[#111] border border-purple-500 rounded-3xl p-10 w-full max-w-md shadow-[0_0_40px_#a855f7]">

        {/* Logo */}
        <h1 className="text-6xl font-black text-center tracking-widest text-white drop-shadow-[0_0_30px_#c084fc]">
          WORD
          <span className="block text-purple-300">
            IMPOSTOR
          </span>
        </h1>

        <p className="text-center text-gray-400 mt-4 mb-10">
          Multiplayer Party Game 😈
        </p>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full bg-black border border-purple-500 rounded-2xl px-5 py-4 mb-5 outline-none text-white"
        />

        {/* Join Code */}
        <input
          type="text"
          placeholder="Enter room code"
          value={joinCode}
          onChange={(e) =>
            setJoinCode(e.target.value)
          }
          className="w-full bg-black border border-purple-500 rounded-2xl px-5 py-4 mb-8 outline-none text-white"
        />

        {/* Buttons */}
        <button
          onClick={createRoom}
          className="w-full bg-purple-500 hover:bg-purple-600 transition py-4 rounded-2xl font-black text-xl mb-4 shadow-[0_0_25px_#a855f7]"
        >
          CREATE ROOM
        </button>

        <button
          onClick={joinRoom}
          className="w-full bg-[#222] hover:bg-[#333] transition py-4 rounded-2xl font-black text-xl border border-purple-500"
        >
          JOIN ROOM
        </button>

      </div>
    </main>
  );
}