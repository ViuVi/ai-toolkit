export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">
          🧠 AI Toolkit
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Yapay Zeka Araçları Tek Platformda
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition">
            Başla
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition">
            Daha Fazla
          </button>
        </div>
      </div>
    </div>
  );
}