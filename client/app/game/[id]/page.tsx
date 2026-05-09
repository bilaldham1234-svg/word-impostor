"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

const socket = io("https://word-impostor-server.onrender.com");

export default function GamePage() {
  const params = useParams();
  const roomId = params.id;

  const [role, setRole] = useState("");
  const [word, setWord] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("playerName");

    socket.emit("getRole", {
      roomId,
      name,
    });

    socket.on("roleData", (data) => {
      setRole(data.role);
      setWord(data.word);
    });

    return () => {
      socket.off("roleData");
    };
  }, [roomId]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[700px] h-[700px] bg-purple-700 opacity-20 blur-[140px] rounded-full" />

      <div className="z-10 text-center px-6">

        {/* Logo */}
        <h1 className="text-7xl font-black tracking-widest text-white drop-shadow-[0_0_35px_#c084fc]">
          WORD
          <span className="block text-purple-300">
            IMPOSTOR
          </span>
        </h1>

        {/* Card */}
        <div className="mt-12 bg-[#111] border border-purple-500 rounded-3xl p-10 shadow-[0_0_35px_#a855f7] max-w-2xl mx-auto">

          {role === "impostor" ? (
            <>
              <h2 className="text-5xl font-black text-red-400">
                YOU ARE
              </h2>

              <h3 className="text-7xl font-black mt-4 text-red-500 drop-shadow-[0_0_20px_red]">
                IMPOSTOR
              </h3>

              <p className="mt-6 text-gray-300 text-xl">
                Try to guess the secret word 😈
              </p>

              <div className="mt-8 text-8xl">
                🕵️
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-green-400">
                YOUR WORD
              </h2>

              <h3 className="text-7xl font-black mt-6 text-purple-300 drop-shadow-[0_0_20px_#c084fc]">
                {word}
              </h3>

              <p className="mt-6 text-gray-300 text-xl">
                Don't let the impostor discover it 👀
              </p>

              <div className="mt-8 text-8xl">
                😎
              </div>
            </>
          )}

        </div>

      </div>
    </main>
  );
}