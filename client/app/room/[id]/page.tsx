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

    socket.emit("joinRoom", roomId);

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

  }, [roomId, router]);

  const startGame = () => {
    socket.emit("startGame", roomId);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

      <div className="absolute w-[500px] h-[500px] bg-purple-700 opacity-20 blur-[120px] rounded-full top-[-100px]" />

      <div className="z-10 w-full max-w-4xl px-6 text-center">

        <h1 className="text-6xl font-black tracking-wider">
          WORD
        </h1>

        <h2 className="text-7xl font-black text-purple-500 drop-shadow-[0_0_25px_#a855f7] mb-4">
          IMPOSTOR
        </h2>

        <p className="text-gray-400 mb-10 text-lg">
          Waiting for players...
        </p>

        <div className="max-w-md mx-auto border border-purple-500 rounded-2xl p-6 bg-[#111] shadow-[0_0_30px_#7e22ce] mb-10">
          <p className="text-gray-400 mb-2">ROOM CODE</p>

          <h3 className="text-5xl font-bold tracking-[10px] text-purple-400">
            {roomId}
          </h3>
        </div>

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

        {isOwner && (
          <button
            onClick={startGame}
            className="px-16 py-5 rounded-2xl bg-purple-600 hover:bg-purple-500 transition-all duration-300 text-2xl font-bold shadow-[0_0_30px_#9333ea]"
          >
            ▶ START GAME
          </button>
        )}

      </div>
    </main>
  );
}