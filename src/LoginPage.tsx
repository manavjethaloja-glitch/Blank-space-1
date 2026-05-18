import { useState } from "react";
import {
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

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

    window.location.hash = "";
    window.location.href = "/Blank-space/";
  } catch (error: any) {
    alert(error.message);
  }
};

  const googleLogin = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
    alert("Google login success!");

    window.location.hash = "";
    window.location.href = "/Blank-space/";
  } catch (error: any) {
    alert(error.message);
  }
};

  const sendOTP = async () => {
    try {
      const verifier = new RecaptchaVerifier(
        "recaptcha-container",
        {},
        auth
      );

      const result = await signInWithPhoneNumber(
        auth,
        phone,
        verifier
      );

      setConfirmationResult(result);
      alert("OTP Sent!");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const verifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      alert("Phone login successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white font-sans text-xs tracking-wider uppercase text-black">
      
      {/* LEFT SIDE: LOGIN FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-16 lg:p-24 min-h-screen">
        
        {/* Brand Header */}
        <div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-none mb-16 font-serif">
            BLANK SPACE
          </h1>
          <h2 className="text-xs font-semibold tracking-widest text-neutral-500 mb-8">
            LOG IN OR REGISTER
          </h2>
        </div>

        {/* Input & Form Area */}
        <div className="max-w-sm w-full my-auto space-y-6">
          <div className="relative">
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-neutral-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-neutral-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={login}
              className="w-full border border-black py-3 text-center hover:bg-black hover:text-white transition-all font-medium tracking-widest"
            >
              CONTINUE
            </button>
            <button
              onClick={signup}
              className="w-full border border-neutral-300 py-3 text-center text-neutral-500 hover:border-black hover:text-black transition-all font-medium tracking-widest"
            >
              CREATE AN ACCOUNT
            </button>
          </div>

          {/* Phone / OTP Authentication Section */}
          <div className="border-t border-neutral-200 pt-8 mt-8 space-y-4">
            <h3 className="text-[10px] font-semibold text-neutral-400 tracking-widest mb-2">
              ACCESS WITH PHONE NUMBER
            </h3>
            
            <input
              type="text"
              placeholder="+91 9876543210"
              className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-neutral-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            
            <button
              onClick={sendOTP}
              className="w-full border border-neutral-300 py-2 text-center text-neutral-600 hover:border-black hover:text-black transition-all text-[11px]"
            >
              SEND OTP
            </button>

            <div id="recaptcha-container" className="my-2"></div>

            <input
              type="text"
              placeholder="ENTER 6-DIGIT OTP"
              className="w-full border-b border-neutral-300 py-2 focus:outline-none focus:border-black transition-colors bg-transparent placeholder-neutral-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOTP}
              className="w-full border border-black py-2 text-center bg-black text-white hover:bg-neutral-800 transition-all text-[11px]"
            >
              VERIFY OTP
            </button>
          </div>

          {/* Social Access Section */}
          <div className="pt-6 space-y-3">
            <p className="text-[10px] text-neutral-400 leading-normal normal-case tracking-normal mb-2">
              By logging in with your social login, I agree to link my account in accordance with the <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
            
            <button
              onClick={googleLogin}
              className="w-full border border-neutral-300 py-3 flex items-center justify-center space-x-2 hover:border-black transition-all font-medium tracking-widest"
            >
              <span>CONTINUE WITH GOOGLE</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-12">
          <a href="#help" className="text-neutral-400 hover:text-black transition-colors text-[10px] font-medium tracking-widest">
            HELP
          </a>
        </div>
      </div>

      {/* RIGHT SIDE: EDITORIAL HERO IMAGE */}
      <div className="hidden md:block md:w-1/2 h-screen sticky top-0">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
          alt="Editorial Fashion Background"
          className="w-full h-full object-cover object-center grayscale font-light"
        />
      </div>

    </div>
  );
}
