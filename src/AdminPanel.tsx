export default function AdminPanel({ onBack }) {
  return (
    <div className="min-h-screen bg-[#F8F6F2] p-8">
      
      <button
        onClick={onBack}
        className="mb-6 bg-black text-white px-4 py-2 rounded-full"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">
        Admin Panel
      </h1>

      <div className="bg-white rounded-2xl p-6 shadow">
        <p className="text-gray-600">
          Orders will appear here.
        </p>
      </div>

    </div>
  );
}
