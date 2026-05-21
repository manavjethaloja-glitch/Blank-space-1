import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

type PurchaseItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
};

const INR = (price: number) => `₹${Math.round(price * 85)}`;

export default function AccountPage({ onBuyAgain }: { onBuyAgain?: (items: PurchaseItem[]) => void; }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("MY DETAILS");

  // Form states for profile editing
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || "");
        
        // Fetch extra fields from Firestore if you use it
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || "Customer");
            setPhone(data.phone || currentUser.phoneNumber || "No phone added");
          } else {
            setName(currentUser.displayName || "Customer");
            setPhone(currentUser.phoneNumber || "No phone added");
          }
        } catch (e) {
          setName(currentUser.displayName || "Customer");
          setPhone(currentUser.phoneNumber || "No phone added");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async () => {
  if (!user) return;

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: name,
        phone: phone,
        email: email,
        uid: user.uid,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    alert("DETAILS UPDATED SUCCESSFULLY");
  } catch (error: any) {
    alert(error.message);
  }
};

  const handleSignOut = () => {
    signOut(auth).then(() => {
      alert("SIGNED OUT SUCCESSFULLY");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-xs tracking-widest font-mono uppercase">
        LOADING...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-xs tracking-widest p-6 text-center space-y-4">
        <p className="uppercase">PLEASE LOG IN TO VIEW YOUR ACCOUNT DETAILS</p>
        <button 
          onClick={() => {
  window.location.hash = "/login";
  window.location.reload();
}}
          className="border border-black px-6 py-3 uppercase text-[11px] tracking-widest font-medium"
        >
          GO TO LOGIN
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white font-sans text-xs tracking-wider text-black uppercase selection:bg-black selection:text-white">
      
      {/* GLOBAL HEADER BAR */}
      <header className="w-full border-b border-neutral-100 px-6 md:px-12 py-6 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => window.history.back()} 
            className="font-serif text-2xl font-black tracking-tighter leading-none hover:opacity-70 transition-opacity"
          >
            BLANK SPACE
          </button>
        </div>
        <div className="relative max-w-xs w-32 md:w-48">
          <input 
            type="text" 
            placeholder="SEARCH" 
            className="w-full border-b border-black py-1 pr-6 bg-transparent focus:outline-none placeholder-neutral-400 text-[11px]"
          />
        </div>
      </header>

      {/* DASHBOARD WORKSPACE GRID */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20">
        
        {/* COLUMN 1: LEFT NAVIGATION INDEX */}
        <nav className="col-span-1 md:col-span-3 space-y-3 pt-2">
          {[
            "RETURNS",
            "FAVOURITES",
            "MY DETAILS",
            "SETTINGS",
            "NOTIFICATIONS",
          ].map((tab, idx) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left block py-1 font-medium tracking-widest transition-colors hover:text-black ${
                activeTab === tab ? "text-black font-semibold" : "text-neutral-400"
              }`}
            >
              | 0{idx + 1} | {tab}
            </button>
          ))}

          {/* Editorial Thumbnail Context Decorator */}
          <div className="hidden md:block pt-8">
            <div className="w-32 aspect-[3/2] overflow-hidden bg-neutral-100 grayscale">
              <img 
                src="https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=300&q=80" 
                alt="Minimalist Architecture Context"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[9px] text-neutral-400 tracking-normal normal-case mt-3 leading-relaxed max-w-[150px]">
              Manage your personal preferences, primary operational addresses, and delivery criteria.
            </p>
          </div>
        </nav>

        {/* COLUMN 2: CENTER DYNAMIC DATA CONTAINER */}
        <main className="col-span-1 md:col-span-6 space-y-12">
          <div>
            <h2 className="text-sm font-semibold tracking-widest mb-2 text-neutral-800">
              {activeTab}
            </h2>
            <p className="text-[10px] text-neutral-400 tracking-normal normal-case">
              Review and adjust settings belonging to your global profile node.
            </p>
          </div>

          {activeTab === "MY DETAILS" ? (
            <div className="space-y-8">
              
              {/* Dynamic Read-only / Read-Write Data Inputs */}
              <div className="space-y-6">
                <div className="group relative border-b border-neutral-200 focus-within:border-black transition-colors pb-1">
                  <label className="block text-[10px] text-neutral-400 font-medium tracking-widest">EMAIL</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full py-1 bg-transparent focus:outline-none text-neutral-500 cursor-not-allowed font-mono text-[11px]"
                  />
                  <span className="absolute right-0 bottom-2 text-[9px] text-neutral-300 font-medium">LOCKED</span>
                </div>

                <div className="group relative border-b border-neutral-200 focus-within:border-black transition-colors pb-1">
                  <label className="block text-[10px] text-neutral-400 font-medium tracking-widest">NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ENTER YOUR NAME"
                    className="w-full py-1 bg-transparent focus:outline-none text-[11px]"
                  />
                </div>

                <div className="group relative border-b border-neutral-200 focus-within:border-black transition-colors pb-1">
                  <label className="block text-[10px] text-neutral-400 font-medium tracking-widest">PHONE</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ENTER PHONE NUMBER"
                    className="w-full py-1 bg-transparent focus:outline-none text-[11px]"
                  />
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleUpdateProfile}
                  className="w-full border border-black py-3 text-center bg-black text-white hover:bg-neutral-900 transition-colors tracking-widest font-medium text-[11px]"
                >
                  SAVE CHANGES
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full border border-neutral-200 py-3 text-center text-neutral-400 hover:text-black hover:border-black transition-colors tracking-widest font-medium text-[11px]"
                >
                  SIGN OUT
                </button>
              </div>
            </div>
          ) : (
            /* Fallback State placeholders for unbuilt options */
            <div className="border border-dashed border-neutral-200 p-12 text-center text-neutral-400">
              NO CONTEXT FILED UNDER {activeTab} YET
            </div>
          )}
        </main>

        {/* COLUMN 3: RIGHT PANEL CONTEXT UTILITIES */}
        <aside className="col-span-1 md:col-span-3 text-right hidden lg:flex flex-col justify-between pt-2 space-y-4 border-l border-neutral-100 pl-8 h-fit">
          <div className="space-y-1">
            <h3 className="font-bold text-black tracking-widest text-[11px]">{name}</h3>
            <p className="text-neutral-400 text-[10px] font-mono lowercase tracking-normal truncate max-w-[180px]">
              {email}
            </p>
          </div>
          <div className="space-y-2 pt-6 text-[10px]">
            <a href="#help" className="block text-neutral-400 hover:text-black transition-colors">HELP</a>
            <a href="#orders" className="block text-neutral-400 hover:text-black transition-colors">TRACK SHIPMENTS</a>
            <a href="#legal" className="block text-neutral-400 hover:text-black transition-colors">LEGAL STATEMENTS</a>
          </div>
        </aside>

      </div>
    </div>
  );
}
