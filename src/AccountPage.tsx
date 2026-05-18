import { auth } from "./firebase";

export default function AccountPage({ onBack }: { onBack: () => void }) {
  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-8">
      <button onClick={onBack} className="mb-8 bg-black text-white px-5 py-2 rounded-full">
        Back
      </button>

      <h1 className="text-4xl mb-10">My Details</h1>

      <div className="max-w-3xl space-y-8">
        <div>
          <p className="text-xs uppercase text-gray-500">Email</p>
          <p className="text-lg">{user?.email || "No email"}</p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500">Phone</p>
          <p className="text-lg">{user?.phoneNumber || "No phone added"}</p>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500">Name</p>
          <p className="text-lg">{user?.displayName || "Customer"}</p>
        </div>

        <button
          onClick={() => auth.signOut()}
          className="mt-10 underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
