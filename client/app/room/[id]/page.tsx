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

  const isOwner = true;

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("playersUpdate", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    return () => {
      socket.off("playersUpdate");
    };
  }, []);


  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-30" />

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-purple-700 opacity-20 blur-[140px] rounded-full top-[-200px]" />

      <div className="z-10 w-full max-w-5xl px-6 text-center">

        {/* Logo */}
        <div className="mb-6">
          <img
            src="/logo.png"
            className="w-24 mx-auto mb-4"
          />

          <h1 className="text-6xl font-black tracking-wider">
            WORD
          </h1>

          <h2 className="text-7xl font-black text-purple-500 drop-shadow-[0_0_25px_#a855f7]">
            IMPOSTOR
          </h2>

          <p className="text-gray-300 mt-3 text-lg">
            Waiting for players...
          </p>
        </div>

        {/* Room Code */}
        <div className="max-w-md mx-auto border border-purple-500 rounded-2xl p-6 bg-[#111] shadow-[0_0_30px_#7e22ce] mb-10 relative">

          <p className="text-gray-400 mb-2">
            ROOM CODE
          </p>

          <h3 className="text-5xl font-bold tracking-[10px] text-purple-300">
            {roomId}
          </h3>

          <button
            className="absolute right-4 top-4 text-purple-300 hover:text-white"
          >
            📋
          </button>

        </div>

        {/* Players */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

          {players.map((player, index) => (
            <div
              key={index}
              className="bg-[#111] border border-purple-500 rounded-2xl p-5 shadow-[0_0_20px_#581c87]"
            >

              <img
                src={`/${index + 1}.png`}
                className="w-24 h-24 mx-auto mb-3 rounded-xl"
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
            onClick={() => router.push(`/game/${roomId}`)}
            className="px-16 py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 transition-all duration-300 text-2xl font-bold shadow-[0_0_30px_#9333ea]"
          >
            ▶ START GAME
          </button>
        )}

      </div>
    </main>
  );
}