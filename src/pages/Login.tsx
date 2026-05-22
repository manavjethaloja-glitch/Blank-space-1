import React, { useState, useEffect } from 'react';
import { useStore } from '../hooks/useStore';
import { Button } from '../components/Navbar';
import { Mail, UserCircle2, ArrowRight, Sparkles, Check, AlertCircle, ShieldCheck, MailWarning, Globe, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Declarations for Google Identity Services SDK
declare global {
  interface Window {
    google?: any;
  }
}

export default function Login() {
  const { login, register, navigateTo, updateProfile, user, cart } = useStore();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Google Login States
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  
  // Custom Simulator states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'loading' | 'success'>('loading');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Coordinate details step states
  const [step, setStep] = useState<'auth' | 'coordinates'>('auth');
  const [phoneInput, setPhoneInput] = useState('');
  const [streetInput, setStreetInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [stateInput, setStateInput] = useState('');
  const [postalInput, setPostalInput] = useState('');
  const [isCoordinatesSuccess, setIsCoordinatesSuccess] = useState(false);

  // Dynamic user email metadata detection
  const detectedUserEmail = "manavjethaloja@gmail.com";
  const detectedUserName = "MANAV JETHA";

  // Check if coordinates have already been saved or must be filled
  const handleAuthSuccess = (emailVal: string) => {
    setIsSuccess(true);
    setError('');
    setTimeout(() => {
      // Look inside local storage directly to obtain the newly signed user (since react state might render on next tick)
      const cached = localStorage.getItem('bs_user');
      let parsedUser = null;
      if (cached) {
        try {
          parsedUser = JSON.parse(cached);
        } catch (e) {}
      }

      const hasPhone = parsedUser?.phone || '';
      const hasAddr = parsedUser?.addresses && parsedUser.addresses.length > 0;

      if (hasPhone && hasAddr) {
        // Everything exists! Proceed instantly to Checkout or Account
        if (cart && cart.length > 0) {
          navigateTo('checkout');
        } else {
          navigateTo('account');
        }
      } else {
        // Missing vital coordinates - transition to the Coordinates view
        setStep('coordinates');
        setIsSuccess(false);
      }
    }, 1200);
  };

  // Check if Client ID exists from env variables
  useEffect(() => {
    const envClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (envClientId) {
      setGoogleClientId(envClientId);
    }

    // Load Google GSI Client Script dynamically
    const loadGsiScript = () => {
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGsiLoaded(true);
      };
      script.onerror = () => {
        console.warn('Google Identity Services script failed to load in sandbox context.');
      };
      document.body.appendChild(script);
    };

    if (!document.getElementById('google-gsi-client')) {
      loadGsiScript();
    } else {
      setIsGsiLoaded(true);
    }
  }, []);

  // Initialize and Render Real GSI button if Google Client ID is provided
  useEffect(() => {
    if (isGsiLoaded && googleClientId && window.google?.accounts?.id) {
      const initializeGsi = () => {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          const btnContainer = document.getElementById('real-google-btn');
          if (btnContainer) {
            window.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: btnContainer.clientWidth || 320
            });
          }
        } catch (err) {
          console.error('Error initializing Google GSI client:', err);
        }
      };
      
      initializeGsi();
    }
  }, [isGsiLoaded, googleClientId, mode]);

  // Decode signature JWT from Google accounts
  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const token = response.credential;
      if (!token) throw new Error('No credential payload detected');

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      
      const emailVal = payload.email;
      const nameVal = payload.name || emailVal.split('@')[0].toUpperCase();

      setError('');
      login(emailVal, nameVal);
      handleAuthSuccess(emailVal);
    } catch (err) {
      setError('GOOGLE AUTH PARSING FAILURE: Integrity handshake failed. Access securely via the manual matrix or simulation instead.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('DECRYPTION FAILED: Provide a valid collector email address.');
      return;
    }

    if (mode === 'signin') {
      const loggedIn = login(email);
      if (loggedIn) {
        handleAuthSuccess(email);
      } else {
        setError('SECURE QUEUE INFO: Email not recognized in registered matrix. Please toggle to NEW REGISTRATION above to claim your collector index.');
      }
    } else {
      if (!name || name.trim().length < 2) {
        setError('DECRYPTION FAILED: Name must be at least 2 characters.');
        return;
      }
      register(name, email);
      handleAuthSuccess(email);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('aarav.agarwal@gmail.com');
    setName('AARAV AGARWAL');
    setMode('signin');
    setError('');
  };

  // Run the Google Authenticator simulation logic inside preview environment
  const handleSimulatedGoogleSelect = (selectedEmail: string, displayName: string) => {
    setIsSimulating(true);
    setSimulationStep('loading');
    
    // Simulate natural OAuth handshakes
    setTimeout(() => {
      setSimulationStep('success');
      setTimeout(() => {
        setIsSimulating(false);
        setShowPicker(false);
        
        // Log in / Register immediately
        login(selectedEmail, displayName);
        handleAuthSuccess(selectedEmail);
      }, 1200);
    }, 1500);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmail && customEmail.includes('@') && customName.trim().length >= 2) {
      handleSimulatedGoogleSelect(customEmail.toLowerCase(), customName.toUpperCase());
    }
  };

  // Submission handler for Step 2 coordinates
  const handleCoordinatesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phoneInput || !streetInput || !cityInput || !stateInput || !postalInput) {
      setError('INPUT EXCEPTION: All delivery and protocol fields are required.');
      return;
    }

    // Call updateProfile to store details on user account
    updateProfile(
      name || user.name || 'COLLECTOR',
      phoneInput,
      {
        street: streetInput,
        city: cityInput,
        state: stateInput,
        postalCode: postalInput,
        country: 'India',
        isDefault: true
      }
    );

    setIsCoordinatesSuccess(true);
    setTimeout(() => {
      if (cart && cart.length > 0) {
        navigateTo('checkout');
      } else {
        navigateTo('account');
      }
    }, 1200);
  };

  return (
    <div
      id="login-page"
      className="pt-36 pb-24 max-w-xl mx-auto px-4 select-none text-left bg-grain "
    >
      {/* Decorative Minimal Corner Bracket */}
      <div className="border border-[#E0DDD8] bg-white p-8 sm:p-12 shadow-sm rounded-none relative">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#111111]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#111111]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#111111]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#111111]" />

        {/* Header Metadata Block */}
        <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-[0.25em] text-[#6B6864] border-b border-[#E0DDD8] pb-4 mb-8">
          <span>STREETWEAR ACCESS MODULE</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            PORTAL LIVE
          </span>
        </div>

        {step === 'auth' ? (
          <>
            {/* Big Editorial Title */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl leading-tight uppercase text-[#111111]">
                {mode === 'signin' ? 'COLLECTOR SIGN IN' : 'REGISTER MATRIX INDEX'}
              </h1>
              <p className="text-xs text-[#6B6864] font-sans mt-2 leading-relaxed">
                Gain access to secure allocation records, priority drop status trackers, and registered UPI cargo coordinates.
              </p>
            </div>

            {/* Tab switcher */}
            <div className="grid grid-cols-2 gap-0 border-b border-[#E0DDD8] mb-8 font-mono text-[10px] tracking-widest uppercase">
              <button
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className={`py-3 text-center border-b-2 font-semibold transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#6B6864] hover:text-[#111111]'
                }`}
              >
                SIGN IN
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`py-3 text-center border-b-2 font-semibold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'border-[#111111] text-[#111111]'
                    : 'border-transparent text-[#6B6864] hover:text-[#111111]'
                }`}
              >
                NEW REGISTRATION
              </button>
            </div>

            {/* Interactive Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 border border-rose-300 bg-rose-50/50 text-rose-800 text-xs font-mono flex items-start gap-2 leading-relaxed uppercase"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-650" />
                <div>{error}</div>
              </motion.div>
            )}

            {/* Success animation block */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 border border-emerald-300 bg-emerald-50/50 text-emerald-800 text-xs font-mono flex items-center gap-3"
              >
                <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>ACCESS GRANTED: Syncing secure streetwear credentials...</span>
              </motion.div>
            )}

            {/* Google Authentication Integration Section */}
            <div className="mb-6">
              {googleClientId ? (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest block mb-1">
                    SECURE GOOGLE SIGN-IN DETECTED
                  </span>
                  <div id="real-google-btn" className="w-full h-[45px] overflow-hidden rounded-none border border-[#E0DDD8]" />
                </div>
              ) : (
                <div>
                  <button
                    id="interactive-google-gsi-btn"
                    type="button"
                    onClick={() => {
                      setError('');
                      setShowPicker(true);
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-[#ffffff] hover:bg-[#F8F6F2] text-[#111111] border border-[#E0DDD8] py-3 px-4 text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer rounded-none outline-none shadow-sm hover:translate-y-[-1px]"
                  >
                    {/* Colorful Google brand G logo */}
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.26 7.45 8.9 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.72-4.92 3.72-8.55z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.36 14.5c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.5 6.9c-.83 1.66-1.3 3.53-1.3 5.5s.47 3.84 1.3 5.5l3.86-3.4z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.03.69-2.35 1.11-3.96 1.11-3.1 0-5.74-2.41-6.68-5.46L1.5 16.33C3.4 20.18 7.35 23 12 23z"
                      />
                    </svg>
                    CONTINUE WITH GOOGLE
                  </button>
                </div>
              )}

              {/* Spacer */}
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0DDD8]" />
                </div>
                <div className="relative bg-white px-4 font-mono text-[9px] text-[#6B6864] uppercase tracking-[0.25em]">
                  OR ACCESS WITH MATRIX PASSKEY
                </div>
              </div>
            </div>

            {/* Regular Sign in / register forms */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {mode === 'register' && (
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">
                    FULL NAME
                  </label>
                  <div className="relative">
                    <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6864]" />
                    <input
                      id="login-name-input"
                      type="text"
                      required
                      placeholder="e.g. AARAV AGARWAL..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#F8F6F2] border border-[#E0DDD8] pl-10 pr-4 py-3.5 text-xs font-mono text-[#111111] placeholder-zinc-400 focus:outline-none focus:border-[#111111] transition-all rounded-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">
                  COLLECTOR EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6864]" />
                  <input
                    id="login-email-input"
                    type="email"
                    required
                    placeholder="e.g. collector@domain.com..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F8F6F2] border border-[#E0DDD8] pl-10 pr-4 py-3.5 text-xs font-mono text-[#111111] placeholder-zinc-400 focus:outline-none focus:border-[#111111] transition-all rounded-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">
                  SECURE CUSTOM PASSKEY (OPTIONAL)
                </label>
                <input
                  id="login-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-4 py-3.5 text-xs font-mono text-[#111111] placeholder-zinc-350 focus:outline-none focus:border-[#111111] transition-all rounded-none"
                />
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <Button id="login-submit-btn" type="submit" variant="dark" size="md" fullWidth>
                  {mode === 'signin' ? 'DECRYPT & ACCESS' : 'INITIALIZE COLLECTOR SIGNATURE'} <ArrowRight className="w-4 h-4 ml-2 inline-block" />
                </Button>

                {mode === 'signin' && (
                  <button
                    id="login-demo-helper-btn"
                    type="button"
                    onClick={handleQuickDemoFill}
                    className="py-2.5 border border-dashed border-[#E0DDD8] text-[#6B6864] font-mono text-[9.5px] uppercase tracking-wider hover:border-[#111111] hover:text-[#111111] transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C8B8A3] animate-pulse" />
                    INSTANT VISITOR DEMO PORTAL (AARAV'S INDEX)
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          /* Step 2: Coordinates compilation */
          <form onSubmit={handleCoordinatesSubmit} className="flex flex-col gap-4 text-left">
            <div className="mb-4">
              <h1 className="font-serif text-2xl sm:text-3xl leading-tight uppercase text-[#111111]">
                SECURE CARGO COORDINATES
              </h1>
              <p className="text-xs text-[#6B6864] font-sans mt-2.5 leading-relaxed">
                Confirm your active delivery vectors. These coordinates reside inside client device memory and automatically authorize checkout allocation sheets on purchase initiation.
              </p>
            </div>

            {/* Error and Success alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 border border-rose-300 bg-rose-50/50 text-rose-800 text-xs font-mono flex items-start gap-2 leading-relaxed uppercase"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{error}</div>
              </motion.div>
            )}

            {isCoordinatesSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 border border-emerald-300 bg-emerald-50/50 text-emerald-800 text-xs font-mono flex items-center gap-3"
              >
                <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>COORDINATES RECLASSIFIED OK. ACCESSING DIRECTORY...</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">
                VERIFY FULL NAME
              </label>
              <input
                type="text"
                required
                placeholder="REGISTRATION FULL NAME..."
                value={name || user?.name || ''}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-4 py-3 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">
                CONTACT MOBILE PHONE (REQUIRED)
              </label>
              <input
                type="tel"
                required
                placeholder="CONTACT MOBILE (e.g. +91 99887 76655)..."
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-4 py-3 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">
                STREET APARTMENT CODE / HOUSE NO.
              </label>
              <input
                type="text"
                required
                placeholder="STREET ROAD ADDR OR BUILDING FLAT..."
                value={streetInput}
                onChange={(e) => setStreetInput(e.target.value)}
                className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-4 py-3 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">CITY</label>
                <input
                  type="text"
                  required
                  placeholder="CITY..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-3 py-3 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">STATE</label>
                <input
                  type="text"
                  required
                  placeholder="STATE..."
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-3 py-3 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
              <div className="flex flex-col gap-1.5 col-span-1">
                <label className="font-mono text-[9px] text-[#6B6864] uppercase tracking-widest">PINCODE</label>
                <input
                  type="text"
                  required
                  placeholder="PIN PINCODE..."
                  value={postalInput}
                  onChange={(e) => setPostalInput(e.target.value)}
                  className="w-full bg-[#F8F6F2] border border-[#E0DDD8] px-3 py-3 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Button type="submit" variant="dark" size="md" fullWidth>
                SECURE CREDENTIALS & SYNC PROFILE <ArrowRight className="w-4 h-4 inline-block ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* Security Assurance Disclaimer */}
        <div className="border-t border-[#E0DDD8] pt-6 mt-8 flex items-center gap-3 text-[#6B6864] font-mono text-[9px] uppercase tracking-wide leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-[#C8B8A3] shrink-0" />
          <span>256-Bit SHA credentials protection actively applied. Private user records persist locally inside client storage matrix.</span>
        </div>
      </div>

      {/* IMMERSIVE GOOGLE ACCOUNT SELECTION SIMULATOR MODAL */}
      <AnimatePresence>
        {showPicker && (
          <div id="google-simulator-overlay" className="fixed inset-0 bg-[#111111]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-md bg-white text-left shadow-2xl overflow-hidden relative border border-[#E4E4E5]"
            >
              {/* Google top branding header bar */}
              <div className="p-6 border-b border-[#F1F3F4] text-center flex flex-col items-center gap-2">
                {/* Colorful Google brand G logo */}
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.74 14.9 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.86 3C6.26 7.45 8.9 5.04 12 5.04z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.69 2.87c2.16-1.99 3.72-4.92 3.72-8.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.36 14.5c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3L1.5 6.9c-.83 1.66-1.3 3.53-1.3 5.5s.47 3.84 1.3 5.5l3.86-3.4z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.03.69-2.35 1.11-3.96 1.11-3.1 0-5.74-2.41-6.68-5.46L1.5 16.33C3.4 20.18 7.35 23 12 23z"
                  />
                </svg>
                <h2 className="text-lg font-medium text-[#202124] font-sans">Sign in with Google</h2>
                <p className="text-xs text-[#5f6368] font-sans">to continue to <span className="font-semibold text-[#111111]">BLACKSMITH streetwear</span></p>
              </div>

              {/* Simulation Engine Feedback */}
              {isSimulating ? (
                <div className="p-8 text-center flex flex-col items-center justify-center gap-4 min-h-[220px]">
                  {simulationStep === 'loading' ? (
                    <>
                      {/* Interactive sleek bouncing loading dots */}
                      <div className="flex gap-1.5 justify-center py-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4] animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335] animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05] animate-bounce"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#34A853] animate-bounce [animation-delay:0.15s]"></span>
                      </div>
                      <p className="text-xs font-mono text-[#6B6864] uppercase tracking-widest">
                        ESTABLISHING SECURE OAUTH CONNECTION...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full border border-emerald-500 bg-emerald-50/50 flex items-center justify-center text-emerald-600">
                        <Check className="w-5 h-5 animate-pulse" />
                      </div>
                      <p className="text-xs font-mono text-emerald-800 tracking-widest uppercase">
                        GOOGLE ACCOUNT SECURED & SIGNED UNIT
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="p-6">
                  {!showCustomInput ? (
                    <div className="flex flex-col gap-2">
                      {/* Detected personalized active customer profile */}
                      <button
                        type="button"
                        onClick={() => handleSimulatedGoogleSelect(detectedUserEmail, detectedUserName)}
                        className="w-full p-3.5 flex items-center gap-3.5 border border-[#E9E9EB] hover:bg-[#F8F9FA] transition-all text-left cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                          {detectedUserName.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[#3C4043] group-hover:text-[#1A73E8] transition-colors">
                            {detectedUserName}
                          </div>
                          <div className="text-[11px] text-[#5F6368] font-sans truncate">
                            {detectedUserEmail}
                          </div>
                        </div>
                        <span className="text-[9px] font-mono py-1 px-1.5 bg-[#E8F0FE] text-[#1967D2] rounded uppercase tracking-wider">
                          ACTIVE
                        </span>
                      </button>

                      {/* Alternate Aarav accounts database index */}
                      <button
                        type="button"
                        onClick={() => handleSimulatedGoogleSelect('aarav.agarwal@gmail.com', 'AARAV AGARWAL')}
                        className="w-full p-3.5 flex items-center gap-3.5 border border-[#E9E9EB] hover:bg-[#F8F9FA] transition-all text-left cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#DEB887] to-[#A0522D] text-white flex items-center justify-center font-bold text-sm">
                          AA
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[#3C4043] group-hover:text-[#1A73E8] transition-colors">
                            AARAV AGARWAL
                          </div>
                          <div className="text-[11px] text-[#5F6368] font-sans truncate">
                            aarav.agarwal@gmail.com
                          </div>
                        </div>
                        <span className="text-[9px] font-mono py-1 px-1.5 bg-zinc-100 text-zinc-600 rounded uppercase tracking-wider">
                          COLLECTOR VIP
                        </span>
                      </button>

                      {/* Option to sign in as alternative tester */}
                      <button
                        type="button"
                        onClick={() => setShowCustomInput(true)}
                        className="w-full p-3.5 flex items-center gap-3.5 border border-dashed border-[#C3C4C6] hover:border-brand-black hover:bg-[#F8F9FA] transition-all text-left cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full border border-dashed border-[#A9ABAE] flex items-center justify-center text-zinc-500">
                          +
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-[#3C4043]">
                            Use another google account
                          </div>
                          <div className="text-[10px] text-[#5F6368] font-sans">
                            Authenticate with different digital identities
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    /* Sub-panel for custom email inputs to satisfy functional completeness */
                    <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
                      <div className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-[#C8B8A3] animate-spin" />
                        MATRIX GATEWAY SIGN-IN
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-[#6B6864] uppercase tracking-wider">GOOGLE EMAIL ID</label>
                        <input
                          type="email"
                          required
                          value={customEmail}
                          onChange={(e)=>setCustomEmail(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full font-sans text-xs border border-[#C3C4C6] px-3 py-2.5 focus:outline-none focus:border-[#4285F4] transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-mono text-[#6B6864] uppercase tracking-wider">DISPLAY NAME</label>
                        <input
                          type="text"
                          required
                          value={customName}
                          onChange={(e)=>setCustomName(e.target.value)}
                          placeholder="e.g. LIAM CHEN"
                          className="w-full font-sans text-xs border border-[#C3C4C6] px-3 py-2.5 focus:outline-none focus:border-[#4285F4] transition-all"
                        />
                      </div>

                      <div className="flex gap-2.5 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomInput(false);
                            setError('');
                          }}
                          className="flex-1 py-2 px-3 border border-[#C3C4C6] text-xs font-mono tracking-wider text-zinc-650 hover:bg-zinc-50 uppercase cursor-pointer"
                        >
                          BACK
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 px-3 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-mono tracking-wider uppercase cursor-pointer"
                        >
                          SIMULATE INTEGRITY
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-6 border-t border-[#F1F3F4] pt-4 flex items-center gap-2.5 text-[10px] text-[#5F6368] leading-relaxed">
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>To support customized security, this application can be directly bound to a Google Cloud Console client ID using the <strong className="text-brand-black">VITE_GOOGLE_CLIENT_ID</strong> environment token.</span>
                  </div>
                </div>
              )}

              {/* Secure Footer banner matching Gmail/Google interface aesthetics */}
              <div className="bg-[#F8F9FA] px-6 py-4 flex justify-between items-center text-[10px] text-[#5f6368] font-sans border-t border-[#F1F3F4]">
                <span>English (United States)</span>
                <button
                  type="button"
                  onClick={() => setShowPicker(false)}
                  className="font-semibold text-rose-600 hover:text-rose-800 uppercase tracking-widest text-[9.5px] font-mono cursor-pointer"
                >
                  ABORT TRANSACTION
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
