"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function RoomPage({
  params,
}: {
  params: { id: string };
}) {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const socket = io("https://word-impostor-server.onrender.com");

    const playerName = localStorage.getItem("playerName") || "Player";

    socket.emit("joinRoom", {
      roomId: params.id,
      name: playerName,
    });

    socket.on("roomUpdate", (room) => {
      setPlayers(room.players);
    });

    return () => {
      socket.disconnect();
    };
  }, [params.id]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Waiting Room
        </h1>

        <p className="text-2xl mb-4">
          Room Code: {params.id}
        </p>

        <h2 className="text-2xl font-bold mb-2">
          Players:
        </h2>

        {players.map((player, index) => (
          <p key={index} className="text-xl">
            {player.name}
          </p>
        ))}
      </div>
    </main>
  );
}