 import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────
type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const UPI_ID = "7575076577@fam";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconUpload = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const IconPackage = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
function Field({
  label, name, value, onChange, error, type = "text", placeholder, optional, children,
}: {
  label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string; type?: string; placeholder?: string; optional?: boolean; children?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium tracking-wide text-[#4a4744] flex items-center gap-1.5">
        {label}
        {optional && <span className="text-[#a8a5a0] font-normal">(optional)</span>}
      </label>
      {children ? (
        <div className={`relative transition-all duration-200 ${focused ? "ring-2 ring-[#1a1a1a] ring-offset-1" : ""} ${error ? "ring-2 ring-red-400 ring-offset-1" : ""} rounded-xl`}>
          {children}
        </div>
      ) : (
        <div className={`relative rounded-xl transition-all duration-200 ${focused ? "ring-2 ring-[#1a1a1a] ring-offset-1" : "ring-1 ring-[#e0ddd8]"} ${error ? "ring-2 ring-red-400 ring-offset-1" : ""}`}>
          <input
            name={name} type={type} value={value} placeholder={placeholder}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-white text-[#1a1a1a] text-sm px-4 py-3.5 rounded-xl outline-none placeholder-[#c0bdb8]"
          />
        </div>
      )}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-red-500">{error}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Order Success Modal ──────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="bg-[#F8F6F2] rounded-3xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        {/* Animated check circle */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
          className="w-20 h-20 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6 text-[#F8F6F2]"
        >
          <IconCheck />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-playfair text-3xl font-medium text-[#1a1a1a] mb-3">Order Received!</h2>
          <p className="text-[#6b6864] text-sm leading-relaxed mb-2">
            Your order has been submitted successfully.
          </p>
          <p className="text-[#6b6864] text-sm leading-relaxed mb-8">
            Your payment screenshot will be verified within <span className="text-[#1a1a1a] font-medium">24 hours</span>. You'll receive a confirmation once approved.
          </p>

          <div className="bg-[#F0EDE7] rounded-2xl p-5 mb-8 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#6b6864]">
              <IconShield /> <span>Payment secured & encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6b6864]">
              <IconPackage /> <span>Ships within 3–5 business days</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#1a1a1a] text-[#F8F6F2] py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#333] transition-colors"
          >
            Back to Shop
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage({
  cart,
  onBack,
  onOrderSuccess,
}: {
  cart: CartItem[];
  onBack: () => void;
  onOrderSuccess: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    fullName: "", phone: "", email: "", address: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 75 ? 0 : 4.99;
  const total = subtotal + shipping;

  // ── Form Handlers ──
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) newErrors.phone = "Enter a valid 10-digit number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.address.trim()) newErrors.address = "Delivery address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "Please select a state";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Screenshot Handlers ──
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setScreenshotError("Please upload an image file.");
      return;
    }
    setScreenshot(file);
    setScreenshotError(null);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  // ── Copy UPI ──
  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validate();
    if (!valid) return;
    if (!screenshot) { setScreenshotError("Please upload your payment screenshot."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onOrderSuccess();
    onBack();
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F8F6F2]">
        <p className="font-playfair text-2xl text-[#1a1a1a]">Your bag is empty.</p>
        <button onClick={saveOrder} className="text-sm text-[#6b6864] underline underline-offset-4 hover:text-[#1a1a1a] transition-colors">
         confirm order
        </button>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>{showSuccess && <SuccessModal onClose={handleSuccessClose} />}</AnimatePresence>

      <div className="min-h-screen bg-[#F8F6F2]" style={{ fontFamily: "'Inter', sans-serif" }}>

        {/* ── Top Bar ── */}
        <div className="sticky top-0 z-40 bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#e0ddd8]">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-[#6b6864] hover:text-[#1a1a1a] transition-colors"
            >
              <IconArrowLeft /> Back to shop
            </button>
            <span className="font-playfair text-xl font-medium text-[#1a1a1a]">Blank Page</span>
            <div className="flex items-center gap-1.5 text-xs text-[#6b6864]">
              <IconShield /> <span className="hidden sm:inline">Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* ── Steps indicator ── */}
        <div className="border-b border-[#e0ddd8] bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 text-xs text-[#6b6864]">
              {["Cart", "Details", "Payment", "Confirm"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${i <= 2 ? "bg-[#1a1a1a] text-[#F8F6F2]" : "bg-[#e0ddd8] text-[#a8a5a0]"}`}>
                      {i < 2 ? "✓" : i + 1}
                    </span>
                    <span className={i <= 2 ? "text-[#1a1a1a] font-medium" : ""}>{step}</span>
                  </div>
                  {i < 3 && <div className="w-8 h-px bg-[#e0ddd8]" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

              {/* ════ LEFT COLUMN ════ */}
              <div className="space-y-6">

                {/* ── 1. Customer Details ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl border border-[#e0ddd8] p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <span className="w-7 h-7 rounded-full bg-[#1a1a1a] text-[#F8F6F2] text-xs font-semibold flex items-center justify-center">1</span>
                    <h2 className="font-playfair text-xl font-medium text-[#1a1a1a]">Your Details</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} placeholder="Rahul Sharma" />
                    <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="9876543210" type="tel" />
                    <div className="sm:col-span-2">
                      <Field label="Email Address" name="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="rahul@email.com" type="email" optional />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Delivery Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="House No., Street, Locality…">
                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="House No., Street, Locality…"
                          rows={3}
                          className="w-full bg-white text-[#1a1a1a] text-sm px-4 py-3.5 rounded-xl outline-none placeholder-[#c0bdb8] resize-none ring-1 ring-[#e0ddd8] focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1 transition-all"
                        />
                      </Field>
                    </div>
                    <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="Mumbai" />
                    <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state}>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className={`w-full bg-white text-sm px-4 py-3.5 rounded-xl outline-none ring-1 ring-[#e0ddd8] focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-1 transition-all appearance-none cursor-pointer ${form.state ? "text-[#1a1a1a]" : "text-[#c0bdb8]"}`}
                      >
                        <option value="" disabled>Select state</option>
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} placeholder="400001" />
                  </div>
                </motion.div>

                {/* ── 2. UPI Payment ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-white rounded-2xl border border-[#e0ddd8] p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <span className="w-7 h-7 rounded-full bg-[#1a1a1a] text-[#F8F6F2] text-xs font-semibold flex items-center justify-center">2</span>
                    <h2 className="font-playfair text-xl font-medium text-[#1a1a1a]">Complete Payment</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8 items-start">
                    {/* QR Card */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-full max-w-[220px] mx-auto">
                        <div className="bg-white border-2 border-[#e0ddd8] rounded-2xl p-5 shadow-sm">
                          {/* Corner accents */}
                          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#1a1a1a] rounded-tl-sm" />
                          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#1a1a1a] rounded-tr-sm" />
                          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#1a1a1a] rounded-bl-sm" />
                          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#1a1a1a] rounded-br-sm" />
                          <img src="/Blank-space/images/qr-placeholder.jpg" alt="UPI QR Code" className="w-full aspect-square object-contain" />
                        </div>
                        <p className="text-center text-[10px] tracking-widest uppercase text-[#a8a5a0] mt-3">Scan to Pay via UPI</p>
                      </div>
                    </div>

                    {/* UPI Details */}
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs tracking-widest uppercase text-[#6b6864] mb-2">UPI ID</p>
                        <div className="flex items-center gap-3 bg-[#F8F6F2] border border-[#e0ddd8] rounded-xl px-4 py-3.5">
                          <span className="flex-1 text-sm font-medium text-[#1a1a1a] font-mono tracking-wide">{UPI_ID}</span>
                          <button
                            type="button"
                            onClick={copyUPI}
                            className="flex items-center gap-1.5 text-xs text-[#6b6864] hover:text-[#1a1a1a] transition-colors shrink-0"
                          >
                            <AnimatePresence mode="wait">
                              {copied ? (
                                <motion.span key="copied" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                  className="text-green-600 font-medium">Copied ✓</motion.span>
                              ) : (
                                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                                  <IconCopy /> Copy
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#F8F6F2] rounded-xl p-4 space-y-2">
                        <p className="text-xs font-medium text-[#1a1a1a]">How to pay:</p>
                        {[
                          "Open any UPI app (GPay, PhonePe, Paytm…)",
                          `Send ₹${total.toFixed(2)} to the UPI ID above`,
                          "Take a screenshot of the success screen",
                          "Upload it below to confirm your order",
                        ].map((step, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <span className="w-4 h-4 rounded-full bg-[#e0ddd8] text-[#6b6864] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-xs text-[#6b6864] leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#6b6864]">
                        <IconShield />
                        <span>Your payment is safe. Manual verification within 24 hrs.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── 3. Screenshot Upload ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-white rounded-2xl border border-[#e0ddd8] p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <span className="w-7 h-7 rounded-full bg-[#1a1a1a] text-[#F8F6F2] text-xs font-semibold flex items-center justify-center">3</span>
                    <h2 className="font-playfair text-xl font-medium text-[#1a1a1a]">Upload Payment Screenshot</h2>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
                  />

                  {screenshotPreview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <img
                        src={screenshotPreview}
                        alt="Payment screenshot"
                        className="w-full max-h-72 object-contain rounded-xl border border-[#e0ddd8]"
                      />
                      <div className="absolute inset-0 bg-[#1a1a1a]/5 rounded-xl" />
                      <button
                        type="button"
                        onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                        className="absolute top-3 right-3 bg-white border border-[#e0ddd8] text-[#6b6864] hover:text-[#1a1a1a] rounded-full px-3 py-1 text-xs transition-colors shadow-sm"
                      >
                        Change
                      </button>
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                        <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">✓</span>
                        Screenshot uploaded — {screenshot?.name}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      animate={{ borderColor: dragging ? "#1a1a1a" : "#d8d5d0", backgroundColor: dragging ? "#F0EDE7" : "#F8F6F2" }}
                      transition={{ duration: 0.15 }}
                      className="w-full border-2 border-dashed rounded-2xl py-14 px-6 flex flex-col items-center gap-4 cursor-pointer hover:border-[#1a1a1a] hover:bg-[#F0EDE7] transition-colors group"
                    >
                      <motion.div
                        animate={{ y: dragging ? -6 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-[#a8a5a0] group-hover:text-[#1a1a1a] transition-colors"
                      >
                        <IconUpload />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-[#1a1a1a]">Upload Payment Screenshot</p>
                        <p className="text-xs text-[#a8a5a0] mt-1">Drag & drop or click to browse</p>
                        <p className="text-xs text-[#c0bdb8] mt-0.5">JPG, PNG, WEBP accepted</p>
                      </div>
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {screenshotError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs text-red-500 mt-2">{screenshotError}</motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* ── Submit Button (mobile) ── */}
                <div className="lg:hidden">
                  <SubmitButton loading={loading} total={total} />
                </div>
              </div>

              {/* ════ RIGHT COLUMN — Sticky Summary ════ */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="lg:sticky lg:top-[88px] space-y-4"
              >
                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl border border-[#e0ddd8] overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#e0ddd8]">
                    <h3 className="font-playfair text-lg font-medium text-[#1a1a1a]">Order Summary</h3>
                    <p className="text-xs text-[#a8a5a0] mt-0.5">{cart.reduce((s, i) => s + i.qty, 0)} item{cart.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}</p>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#f0ede7]">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 px-6 py-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F0EDE7]">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1a1a1a] text-[#F8F6F2] text-[9px] font-bold rounded-full flex items-center justify-center">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1a1a1a] leading-tight truncate">{item.name}</p>
                          <p className="text-xs text-[#a8a5a0] mt-0.5">Size: {item.size}</p>
                          <p className="text-sm font-medium text-[#1a1a1a] mt-1">${(item.price * item.qty).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="px-6 py-5 border-t border-[#e0ddd8] space-y-3">
                    <div className="flex justify-between text-sm text-[#6b6864]">
                      <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#6b6864]">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[#a8a5a0]">Free shipping on orders over $75</p>
                    )}
                    <div className="flex justify-between font-medium text-[#1a1a1a] text-base pt-2 border-t border-[#e0ddd8]">
                      <span>Total</span><span>${total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#a8a5a0]">Amount to pay via UPI: <span className="font-semibold text-[#1a1a1a] font-mono">₹{(total * 83.5).toFixed(0)}</span></p>
                  </div>
                </div>

                {/* Guarantees */}
                <div className="bg-[#F0EDE7] rounded-2xl p-5 space-y-3">
                  {[
                    { icon: "🔒", text: "Secure manual payment verification" },
                    { icon: "📦", text: "Ships in 3–5 business days" },
                    { icon: "↩️", text: "Free returns, no questions asked" },
                  ].map((g) => (
                    <div key={g.text} className="flex items-center gap-3 text-xs text-[#6b6864]">
                      <span>{g.icon}</span><span>{g.text}</span>
                    </div>
                  ))}
                </div>

                {/* Submit Button (desktop) */}
                <div className="hidden lg:block">
                  <SubmitButton loading={loading} total={total} />
                </div>
              </motion.div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Submit Button ────────────────────────────────────────────────────────────
function SubmitButton({ loading, total }: { loading: boolean; total: number }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading ? { scale: 1.015 } : {}}
      whileTap={!loading ? { scale: 0.985 } : {}}
      className="w-full bg-[#1a1a1a] text-[#F8F6F2] py-4 rounded-full text-sm tracking-widest uppercase disabled:opacity-70 disabled:cursor-not-allowed transition-colors hover:bg-[#2a2a2a] relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Verifying order…
          </motion.div>
        ) : (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Confirm Order — ${total.toFixed(2)}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
