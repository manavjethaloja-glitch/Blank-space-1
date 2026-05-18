import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google login success!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2] px-6">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-black text-white p-3 rounded-xl mb-3"
        >
          Login
        </button>

        <button
          onClick={signup}
          className="w-full border p-3 rounded-xl mb-3"
        >
          Create Account
        </button>

        <button
          onClick={googleLogin}
          className="w-full bg-red-500 text-white p-3 rounded-xl"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
