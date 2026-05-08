"use client";

import { useParams, useRouter } from "next/navigation";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.id;

  const players = [
    { name: "Bilal" },
    { name: "Sarah" },
    { name: "Omar" },
    { name: "Maya" },
  ];

  const isOwner = true;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-700 opacity-20 blur-[120px] rounded-full top-[-100px]" />

      <div className="z-10 w-full max-w-4xl px-6 text-center">

        {/* Title */}
        <h1 className="text-6xl font-black tracking-wider">
          WORD
        </h1>

        <h2 className="text-7xl font-black text-purple-500 drop-shadow-[0_0_25px_#a855f7] mb-4">
          IMPOSTOR
        </h2>

        <p className="text-gray-400 mb-10 text-lg">
          Waiting for players...
        </p>

        {/* Room Code */}
        <div className="max-w-md mx-auto border border-purple-500 rounded-2xl p-6 bg-[#111] shadow-[0_0_30px_#7e22ce] mb-10">
          <p className="text-gray-400 mb-2">ROOM CODE</p>

          <h3 className="text-5xl font-bold tracking-[10px] text-purple-400">
            {roomId}
          </h3>
        </div>

        {/* Players */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

          {players.map((player, index) => (
            <div
              key={index}
              className="bg-[#111] border border-purple-500 rounded-2xl p-5 shadow-[0_0_20px_#581c87]"
            >
              <div className="text-5xl mb-3">🕵️</div>

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