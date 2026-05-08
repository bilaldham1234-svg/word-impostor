"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function RoomPage() {
  const params = useParams();
  const roomId = params.id as string;

  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const socket = io("https://word-impostor-server.onrender.com");

    const playerName =
      localStorage.getItem("playerName") || "Player";

    socket.emit("joinRoom", {
      roomId: roomId,
      name: playerName,
    });

    socket.on("roomUpdate", (room) => {
      setPlayers(room.players);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">

        <h1 className="text-4xl font-bold mb-4">
          Waiting Room
        </h1>

        <p className="text-2xl mb-4">
          Room Code: {roomId}
        </p>

        <h2 className="text-2xl font-bold mb-2">
          Players:
        </h2>

        {players.map((player, index) => (
          <p
            key={index}
            className={
              index === 0
                ? "text-yellow-400 font-bold text-xl"
                : "text-green-400 text-lg"
            }
          >
            {index === 0 ? "👑 " : "🟢 "}
            {player.name}
          </p>
        ))}

      </div>
    </main>
  );
}