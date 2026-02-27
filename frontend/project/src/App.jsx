export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🎉 Tailwind is Working!
        </h1>
        <p className="text-gray-600 mb-6">
          If you see colors and styling, setup is correct.
        </p>
        <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition">
          Test Button
        </button>
      </div>
    </div>
  );
}