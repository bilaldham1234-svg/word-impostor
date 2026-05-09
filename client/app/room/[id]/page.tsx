"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";

const socket = io("https://word-impostor-msem.onrender.com");

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.id;

  const [players, setPlayers] = useState<any[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("playerName");

socket.emit("joinRoom", {
  roomId,
  name,
});

    socket.on("playersUpdate", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    socket.on("owner", () => {
      setIsOwner(true);
    });

    socket.on("gameStarted", () => {
      router.push(`/game/${roomId}`);
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("owner");
      socket.off("gameStarted");
    };
  }, []);

  const startGame = () => {
    socket.emit("startGame", roomId);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-30" />

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-purple-700 opacity-20 blur-[140px] rounded-full" />

      <div className="z-10 w-full max-w-5xl px-6 text-center">

        {/* Logo */}
        <h1 className="text-7xl font-extrabold tracking-[10px] text-white drop-shadow-[0_0_40px_#c084fc]">
          WORD
          <span className="block text-purple-400">IMPOSTOR</span>
        </h1>

        <p className="text-gray-400 mb-10 text-lg">
          Waiting for players...
        </p>

        {/* Room Code */}
        <div className="max-w-md mx-auto border border-purple-500 rounded-2xl p-6 bg-[#1111] shadow-[0_0_20px_#a855f7] mb-10">
          <p className="text-gray-400 mb-2">ROOM CODE</p>

          <h3 className="text-5xl font-bold tracking-[10px] text-purple-400">
            {roomId}
          </h3>
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {players.map((player: any, index: number) => (
            <div
              key={index}
              className="bg-[#111] border border-purple-500 rounded-2xl p-5 shadow-[0_0_20px_#581c87]"
            >
              <img
                src={`/${index + 1}.png`}
                className="w-20 h-20 mx-auto mb-3 rounded-xl"
              />

              <h3 className="font-bold text-lg">
                {player.name}
              </h3>

              <p className="text-green-400 text-sm mt-2">
                ● Ready
              </p>
            </div>
          ))}
        </div>

        {/* Start Button */}
        {isOwner && (
          <button
            onClick={startGame}
            className="px-10 py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 transition text-xl font-bold shadow-[0_0_30px_#c084fc]"
          >
            ▶ START GAME
          </button>
        )}
      </div>
    </main>
  );
}