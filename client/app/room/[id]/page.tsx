"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

const socket = io("https://word-impostor-server.onrender.com");

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id;

  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const name = localStorage.getItem("playerName");

    socket.emit("joinRoom", {
      roomId,
      name,
    });

    socket.on("playersUpdate", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    socket.on("gameStarted", () => {
      window.location.href = `/game/${roomId}`;
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("gameStarted");
    };
  }, [roomId]);

  const isOwner =
    players.length > 0 &&
    players[0]?.name === localStorage.getItem("playerName");

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-30" />

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-purple-700 opacity-20 blur-[140px] rounded-full top-[20%]" />

      <div className="z-10 w-full max-w-5xl px-6 text-center">

        {/* Logo */}
        <h1 className="text-7xl font-black tracking-widest text-white drop-shadow-[0_0_35px_#c084fc]">
          WORD
          <span className="block text-purple-300">
            IMPOSTOR
          </span>
        </h1>

        <p className="text-gray-300 mt-4 text-xl">
          Waiting for players...
        </p>

        {/* Room Code */}
        <div className="mt-10 mx-auto max-w-md border border-purple-500 rounded-3xl p-8 bg-[#111] shadow-[0_0_35px_#a855f7]">
          <p className="text-gray-400 mb-3">
            ROOM CODE
          </p>

          <h2 className="text-6xl font-black tracking-[10px] text-purple-200">
            {roomId}
          </h2>
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">

          {players.map((player: any, index: number) => (
            <div
              key={index}
              className="bg-[#111] border border-purple-500 rounded-3xl p-5 shadow-[0_0_20px_#a855f7]"
            >
              <img
                src={`/${(index % 10) + 1}.png`}
                className="w-24 h-24 mx-auto mb-4 rounded-2xl"
              />

              <h3 className="font-bold text-xl">
                {player.name}
              </h3>

              <p className="text-green-400 mt-2">
                ● Ready
              </p>
            </div>
          ))}

        </div>

        {/* Start Button */}
        {isOwner && (
          <button
            onClick={() => socket.emit("startGame", roomId)}
            className="mt-12 bg-purple-500 hover:bg-purple-600 px-10 py-5 rounded-3xl font-black text-2xl shadow-[0_0_30px_#a855f7] transition"
          >
            START GAME
          </button>
        )}

      </div>
    </main>
  );
}