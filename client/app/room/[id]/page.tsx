"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";

const socket = io("https://word-impostor-server.onrender.com");

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();

  const roomId = params.id;

  const [players, setPlayers] = useState<any[]>([]);
  const [owner, setOwner] = useState("");
  const [impostorCount, setImpostorCount] = useState(1);

  useEffect(() => {
    const name = localStorage.getItem("playerName");

    socket.emit("joinRoom", {
      roomId,
      name,
    });

    socket.on("playersUpdate", (roomPlayers) => {
      setPlayers(roomPlayers);
    });

    socket.on("ownerUpdate", (roomOwner) => {
      setOwner(roomOwner);
    });

    socket.on("gameStarted", () => {
      router.push(`/game/${roomId}`);
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("ownerUpdate");
      socket.off("gameStarted");
    };
  }, []);

  const startGame = () => {
    socket.emit("startGame", {
      roomId,
      impostorCount,
    });
  };

  return (
    <main className="min-h-screen bg-[#111827] text-white flex flex-col items-center p-10">
      <h1 className="text-6xl font-bold mb-3 text-center">
        WORD IMPOSTOR
      </h1>

      <p className="mb-6 text-gray-300">
        Waiting for players...
      </p>

      <div className="bg-[#1f2937] border-4 border-purple-500 rounded-3xl px-20 py-8 mb-10 shadow-[0_0_50px_#a855f7]">
        <p className="text-center text-sm text-gray-400">
          ROOM CODE
        </p>

        <h2 className="text-6xl font-bold tracking-[10px]">
          {roomId}
        </h2>
      </div>

      {socket.id === owner && (
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => setImpostorCount(1)}
            className={`px-6 py-3 rounded-xl font-bold ${
              impostorCount === 1
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          >
            1 Impostor
          </button>

          <button
            onClick={() => setImpostorCount(2)}
            className={`px-6 py-3 rounded-xl font-bold ${
              impostorCount === 2
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          >
            2 Impostors
          </button>

          <button
            onClick={() => setImpostorCount(3)}
            className={`px-6 py-3 rounded-xl font-bold ${
              impostorCount === 3
                ? "bg-purple-600"
                : "bg-gray-700"
            }`}
          >
            3 Impostors
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-6 justify-center max-w-5xl">
        {players.map((player, index) => (
          <div
            key={index}
            className="bg-[#1f2937] border-4 border-purple-500 rounded-3xl p-6 w-52 text-center shadow-[0_0_30px_#a855f7]"
          >
            <img
              src={`/avatars/${(index % 5) + 1}.png`}
              className="w-24 h-24 mx-auto mb-4 rounded-xl"
            />

            <h2 className="text-2xl font-bold">
              {player.name}
            </h2>

            <p className="text-green-400 mt-2">
              ● Ready
            </p>
          </div>
        ))}
      </div>

      {socket.id === owner && (
        <button
          onClick={startGame}
          className="mt-12 bg-purple-600 hover:bg-purple-700 px-12 py-5 rounded-2xl text-3xl font-bold shadow-[0_0_30px_#a855f7]"
        >
          START
        </button>
      )}
    </main>
  );
}