export default function RoomPage({
  params,
}: {
  params: { id: string };
}) {

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">

      <div className="text-center">

        <h1 className="text-4xl font-bold mb-4">
          Waiting Room
        </h1>

        <p className="text-2xl">
          Room Code: {params.id}
        </p>

      </div>

    </main>
  );
}