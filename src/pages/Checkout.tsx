import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Button } from '../components/Navbar';
import { Copy, Check, UploadCloud, AlertCircle, ShoppingBag, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Checkout() {
  const {
    cart,
    cartTotal,
    placeOrder,
    navigateTo,
    user
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment-qr' | 'success'>('details');

  // Order Details states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [street, setStreet] = useState(user.addresses[0]?.street || '');
  const [city, setCity] = useState(user.addresses[0]?.city || '');
  const [state, setState] = useState(user.addresses[0]?.state || '');
  const [postalCode, setPostalCode] = useState(user.addresses[0]?.postalCode || '');
  
  // Settle pricing formulas
  const deliveryFee = cartTotal >= 1499 ? 0 : 100;
  const grandTotal = cartTotal + deliveryFee;

  // Dynamic UPI configurable codes from env with secure fallback
  const upiVpa = (import.meta as any).env?.VITE_UPI_VPA || 'blankspace@icici';
  const upiPayee = (import.meta as any).env?.VITE_UPI_PAYEE || 'BLANK SPACE';
  const upiCustomQr = (import.meta as any).env?.VITE_UPI_QR_IMAGE || '';
  const upiUrl = `upi://pay?pa=${upiVpa}&pn=${encodeURIComponent(upiPayee)}&am=${grandTotal}&cu=INR`;

  // Payment Proof states
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && phone && street && city && state && postalCode) {
      setStep('payment-qr');
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txnId.trim()) {
      // Create Order payload
      const ord = placeOrder({
        items: cart.map((item) => ({
          product: item.product,
          size: item.size,
          quantity: item.quantity,
          priceAtPurchase: item.product.price
        })),
        subtotal: cartTotal,
        deliveryFee,
        total: grandTotal,
        name,
        email,
        phone,
        address: {
          street,
          city,
          state,
          postalCode,
          country: 'India'
        },
        paymentScreenshot: screenshotBase64 || undefined,
        upiTxnId: txnId
      });

      setCreatedOrderNumber(ord.id);
      setStep('success');
    }
  };

  return (
    <div id="checkout-page" className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 bg-grain select-none text-left font-sans">
      
      {/* Title */}
      <div className="flex justify-between items-baseline border-b border-brand-border pb-6 mb-10 text-xs font-mono uppercase tracking-widest text-brand-charcoal">
        <span>DROP ALLOCATION GATEWAY</span>
        <span>SECURITY PROTOCOL 256-BIT SSL</span>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: CONTACT DETAILS & SHIPPING FORM */}
        {step === 'details' && (
          <motion.div
            key="details-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Form */}
            <form onSubmit={handleFormSubmit} className="md:col-span-7 flex flex-col gap-5">
              <h2 className="font-serif text-2xl uppercase tracking-tight text-brand-black mb-2">SHIPPING & SHIPPING ADAPTER</h2>
              
              <div className="flex flex-col gap-2">
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="FULL NAME..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  id="checkout-email"
                  type="email"
                  required
                  placeholder="EMAIL PROTOCOL ADDRESS..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                />
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="CONTACT MOBILE NUMBER..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  id="checkout-street"
                  type="text"
                  required
                  placeholder="STREET APARTMENT CODE / FLAT HOUSE NO..."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <input
                  id="checkout-city"
                  type="text"
                  required
                  placeholder="CITY..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none column-span-1"
                />
                <input
                  id="checkout-state"
                  type="text"
                  required
                  placeholder="STATE..."
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none column-span-1"
                />
                <input
                  id="checkout-postal"
                  type="text"
                  required
                  placeholder="PINCODE..."
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="bg-white border border-brand-border p-3.5 text-xs font-mono uppercase tracking-wider text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none column-span-1"
                />
              </div>

              <div className="bg-brand-card/25 border border-brand-border p-4 rounded-xl flex items-start gap-4 select-none">
                <AlertCircle className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-xs text-brand-charcoal leading-relaxed">
                  <span className="font-mono text-[10px] font-bold text-[#111] uppercase tracking-wider">UPI MANUAL VERIFICATION PROCESS</span>
                  We currently compile payments manually to prevent automated bot checkouts of limited stocks. On the next screen, scan our secure QR code and upload payment proof to confirm stock allocation immediately.
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => navigateTo('shop')}
                  className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-brand-black flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> EXPLORE GARMENTS
                </button>
                
                <Button type="submit" variant="dark" size="md">
                  PROCEED TO PAYMENT SCREEN <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

            </form>

            {/* Price sidebar parameters summary */}
            <div className="md:col-span-5 p-6 border border-brand-border bg-white rounded-3xl shadow-sm text-left flex flex-col gap-5 select-none bg-grain">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider border-b border-brand-border pb-3">
                GARMENTS TO SECURE ({cart.length})
              </h3>
              
              <div className="flex flex-col gap-4 max-h-48 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center border-b border-zinc-100 last:border-0 pb-3 last:pb-0">
                    <img src={item.product.imagePrimary} alt={item.product.name} className="w-10 h-12 object-cover border border-zinc-200" />
                    <div className="flex-1 text-xs">
                      <p className="font-sans font-semibold line-clamp-1 uppercase">{item.product.name}</p>
                      <p className="font-mono text-[9px] text-zinc-400 mt-0.5">SIZE: {item.size} • QTY: {item.quantity}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-brand-black shrink-0">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-border pt-4 flex flex-col gap-1.5 font-mono text-[10px] uppercase text-zinc-500">
                <div className="flex justify-between">
                  <span>SUBTOTAL VALUE:</span>
                  <span className="text-zinc-900 font-sans font-semibold text-xs text-right">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>PACKAGING TRAN:</span>
                  <span className={`${deliveryFee === 0 ? 'text-emerald-600 font-bold' : 'text-zinc-900'} text-xs font-sans text-right`}>
                    {deliveryFee === 0 ? 'FREE' : '₹100'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-brand-border pt-3 mt-1.5 text-xs text-brand-black font-semibold font-sans">
                  <span>TOTAL COVETED COST:</span>
                  <span className="font-mono text-sm font-bold text-brand-black text-right">₹{grandTotal}</span>
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* STEP 2: UPI INTEGRATED QR SCREEN */}
        {step === 'payment-qr' && (
          <motion.div
            key="payment-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Payment Details Column */}
            <form onSubmit={handlePaymentSubmit} className="md:col-span-7 flex flex-col gap-5 text-left">
              <h2 className="font-serif text-2xl uppercase tracking-tight text-brand-black mb-1">UPI ALLOCATION PROTOCOLS</h2>
              
              <div className="border border-brand-border bg-white rounded-2xl p-6 flex flex-col gap-5 bg-grain selection:bg-brand-accent">
                {/* Copied virtual key layout */}
                <div className="flex justify-between items-center border-b border-brand-border/45 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 block uppercase">VIRTUAL PAYMENT ADDRESS</span>
                    <span className="font-mono text-sm font-bold text-brand-black uppercase select-all">{upiVpa}</span>
                  </div>
                  <button
                    id="copy-vpa-btn"
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-2.5 bg-brand-cream border border-brand-border hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase font-bold"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> COPIED VPA
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> COPY VPA KEY
                      </>
                    )}
                  </button>
                </div>

                {/* Input references */}
                <div className="flex flex-col gap-2 text-left">
                  <label htmlFor="upi-txn-input" className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">ENTER UPI TRANSACTION REFER_ID: (REQUIRED)</label>
                  <input
                    id="upi-txn-input"
                    type="text"
                    required
                    placeholder="e.g. TXN18274619..."
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    className="bg-brand-cream border border-brand-border px-3.5 py-3 text-sm font-mono text-brand-black placeholder-zinc-400 focus:outline-none focus:border-brand-black rounded-none"
                  />
                </div>

                {/* Screenshot File-Uploader */}
                <div className="flex flex-col gap-2 text-left">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">UPLOAD PAYMENT PROOF SCREENSHOT: (OPTIONAL)</span>
                  
                  <div className="border border-dashed border-brand-border p-6 rounded-xl flex flex-col items-center justify-center gap-3 relative hover:border-brand-accent transition-colors">
                    <input
                      id="screenshot-uploader-hidden"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <UploadCloud className="w-8 h-8 text-neutral-400" />
                    <p className="font-mono text-[10px] uppercase">
                      {isUploading ? 'CONVERTING PROOF BASE64...' : screenshotBase64 ? 'RECEIPT LOADED OK' : 'TAP TO SELECT PAYMENT SCREENSHOT'}
                    </p>
                    <span className="text-[9px] text-zinc-500">PNG OR JPG SUPPORTED • AUTOMATIC ADAPTIVE SIZE</span>
                  </div>

                  {screenshotBase64 && (
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center gap-1 font-mono text-[9px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        <Check className="w-3 h-3" /> PAYMENT SCREENSHOT ATTACHED
                      </span>
                    </div>
                  )}
                </div>

              </div>

              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 hover:text-brand-black flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> SECURE DETAILS EDIT
                </button>
                
                <Button type="submit" variant="dark" size="md">
                  SUBMIT CONFIRMED ALLOCATION
                </Button>
              </div>

            </form>

            {/* Static QR code visual Column sidebar */}
            <div className="md:col-span-5 p-6 border border-brand-border bg-white rounded-3xl shadow-sm flex flex-col items-center gap-6 select-none bg-grain">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest border-b border-brand-border pb-3 w-full text-center">
                SCAN TO REMIT COVETED FUNDS
              </span>
              
              <div className="p-4 bg-white border-2 border-brand-black rounded-2xl shadow-md w-48 h-48 flex items-center justify-center relative">
                {/* Decorative corners representing streetwear barcodes */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-brand-black" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-brand-black" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-brand-black" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-brand-black" />
                
                {/* Dynamically generated UPI QR Code and static alternative */}
                <img
                  src={upiCustomQr ? upiCustomQr : `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`}
                  alt="UPI Checkout QR"
                  className="w-[90%] h-[90%] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center">
                <span className="font-serif text-lg font-bold text-brand-black tracking-tight leading-none uppercase">₹{grandTotal}</span>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1.5">remit exact payable rate</p>
              </div>

              <div className="w-full text-center p-3 bg-brand-cream border border-brand-border/60 text-zinc-500 font-mono text-[9px] uppercase leading-relaxed rounded-xl tracking-wider">
                PAYMENT SUPPORTS ANY BANKING CLIENT (GPAY, PHONEPE, PAYTM, BHIM...)
              </div>
            </div>

          </motion.div>
        )}

        {/* STEP 3: TRANSACTION PLACED SUCCESS PANEL */}
        {step === 'success' && (
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 sm:p-16 border border-zinc-200 bg-white rounded-3xl text-center select-none bg-grain max-w-2xl mx-auto shadow-xl"
          >
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-300 animate-bounce mb-6">
              <Sparkles className="w-8 h-8 text-emerald-600 fill-current" />
            </div>

            <span className="font-mono text-[10px] sm:text-xs text-brand-accent tracking-[0.3em] uppercase">SEQUENCE TERMINAL OK</span>
            
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-black tracking-tight uppercase leading-none font-normal mt-3">
              ALLOCATION GRANTED
            </h2>

            <p className="font-sans text-xs sm:text-sm text-zinc-650 leading-relaxed max-w-md mx-auto mt-4">
              Your drops reference order <span className="font-mono font-bold text-brand-black text-base select-all border-b border-dashed border-brand-accent pb-0.5">{createdOrderNumber}</span> has been secure in our queue. Payment is undergoing immediate compiler inspection.
            </p>

            <div className="w-full border-t border-brand-border/45 pt-6 mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                id="success-btn-account"
                variant="dark"
                size="md"
                fullWidth
                onClick={() => navigateTo('account')}
              >
                TRACK ORDER STATUS
              </Button>
              <Button
                id="success-btn-shop"
                variant="outline"
                size="md"
                fullWidth
                onClick={() => navigateTo('shop')}
                className="border-brand-border"
              >
                CONTINUE BROWSE
              </Button>
            </div>

            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest mt-6 leading-relaxed">
              *A copy of this tracking ticket has been archived to your registered customer email aarav.agarwal@gmail.com
            </p>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
