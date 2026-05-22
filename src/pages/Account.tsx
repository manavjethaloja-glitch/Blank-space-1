import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { Button } from '../components/Navbar';
import { Trash2, AlertCircle, ShieldAlert, Award, FileSpreadsheet, MapPin, Plus, CheckCircle, ArrowRight, UserCheck, Eye, Compass, PackageOpen, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Address } from '../types';

export default function Account() {
  const {
    user,
    orders,
    updateOrderStatus,
    addUserAddress,
    deleteUserAddress,
    navigateTo,
    selectProduct,
    isLoggedIn,
    logout
  } = useStore();

  React.useEffect(() => {
    if (!isLoggedIn) {
      navigateTo('login');
    }
  }, [isLoggedIn, navigateTo]);

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  
  // Form hooks for shipping addresses addition
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Form hooks for status admin modification
  const [selectedAdminOrderId, setSelectedAdminOrderId] = useState<string | null>(null);
  const [customTracking, setCustomTracking] = useState('');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (street && city && state && postalCode) {
      addUserAddress({
        street,
        city,
        state,
        postalCode,
        country,
        isDefault: user.addresses.length === 0
      });
      // Clear
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      setShowAddAddress(false);
    }
  };

  const handleAdminStatusChange = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status, customTracking ? customTracking : undefined);
    setCustomTracking('');
  };

  const activeAdminOrder = orders.find((o) => o.id === selectedAdminOrderId);

  return (
    <div id="account-page" className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-grain select-none text-left">
      
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-brand-border pb-8 mb-12">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-brand-charcoal tracking-[0.25em] uppercase">COLLECTOR TERMINAL</span>
          <h1 className="text-4xl sm:text-5xl font-serif text-brand-black tracking-tight leading-none uppercase font-normal">
            ADMINISTRATIVE PORTAL
          </h1>
        </div>

        {/* Toggle to Admin mode representation */}
        <button
          id="admin-console-toggle-btn"
          onClick={() => {
            setIsAdminMode(!isAdminMode);
            setSelectedAdminOrderId(null);
          }}
          className={`px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase border flex items-center gap-2.5 transition-all shadow-sm cursor-pointer ${
            isAdminMode
              ? 'bg-rose-950 border-rose-900 text-rose-300 font-bold'
              : 'bg-brand-black border-brand-black text-brand-cream hover:opacity-90'
          }`}
        >
          {isAdminMode ? (
            <>
              <ShieldAlert className="w-4 h-4 animate-pulse text-rose-400" /> CLOSE INTERNAL SALES CONSOLE
            </>
          ) : (
            <>
              <Compass className="w-4 h-4 text-brand-accent" /> ENTER BRAND CONSOLE (UPI COMPILER)
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isAdminMode ? (
          
          /* CLIENT ACCOUNT VIEW */
          <motion.div
            key="client-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Left Sidebar Profile Address specs */}
            <div className="lg:col-span-4 flex flex-col gap-8 text-left">
              
              {/* Profile Card Summary */}
              <div className="p-6 border border-brand-border bg-white rounded-2xl shadow-sm text-left flex flex-col gap-4 bg-grain">
                <div className="flex justify-between items-center ">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">ACCESS LEVEL SYSTEM: REGISTERED</span>
                  <Award className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold uppercase text-brand-black tracking-tight leading-none">
                    {user.name}
                  </h3>
                  <span className="font-mono text-xs text-zinc-400 mt-2 block">{user.email}</span>
                </div>
                <div className="border-t border-brand-border/45 pt-4 flex gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  <div>
                    <span>ORDERS Placed:</span> <span className="text-brand-black font-semibold font-sans">{orders.length}</span>
                  </div>
                  <div>
                    <span>MEMBERSHIP INDEX:</span> <span className="text-brand-accent font-bold">VANGUARD</span>
                  </div>
                </div>
                <button
                  id="account-logout-btn"
                  onClick={logout}
                  className="w-full text-center py-2.5 border border-brand-border hover:border-brand-black transition-all text-[9px] font-mono tracking-widest text-[#6B6864] hover:text-brand-black uppercase cursor-pointer"
                >
                  DE-SYNCHRONIZE SESSION (LOG OUT)
                </button>
              </div>

              {/* Addresses List Configuration section */}
              <div className="p-6 border border-brand-border bg-white rounded-2xl shadow-sm flex flex-col gap-5 text-left bg-grain">
                <div className="flex justify-between items-center border-b border-brand-border/45 pb-3">
                  <h4 className="font-mono text-xs font-bold tracking-widest uppercase text-brand-black flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-brand-charcoal" /> SECURE ADDRESS MATRIX
                  </h4>
                  <button
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-[10px] font-mono font-bold text-brand-accent uppercase hover:text-brand-black flex items-center gap-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD NEW
                  </button>
                </div>

                {/* Sub Address Submit fields */}
                <AnimatePresence>
                  {showAddAddress && (
                    <motion.form
                      onSubmit={handleAddressSubmit}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-b border-brand-border pb-5 mb-3 flex flex-col gap-3 font-mono text-[10px] uppercase"
                    >
                      <input
                        id="address-street"
                        type="text"
                        required
                        placeholder="STREET ADDRESS / APARTMENT CODE..."
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="bg-brand-cream border border-brand-border px-3 py-2 text-xs font-sans text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          id="address-city"
                          type="text"
                          required
                          placeholder="CITY..."
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="bg-brand-cream border border-brand-border px-3 py-2 text-xs font-sans text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                        />
                        <input
                          id="address-state"
                          type="text"
                          required
                          placeholder="STATE..."
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="bg-brand-cream border border-brand-border px-3 py-2 text-xs font-sans text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          id="address-postal"
                          type="text"
                          required
                          placeholder="PINCODE..."
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="bg-brand-cream border border-brand-border px-3 py-2 text-xs font-sans text-brand-black placeholder-zinc-450 focus:outline-none focus:border-brand-black rounded-none"
                        />
                        <select
                          id="address-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="bg-brand-cream border border-brand-border px-3 py-2 text-xs font-sans text-brand-black focus:outline-none focus:border-brand-black rounded-none"
                        >
                          <option value="India">India</option>
                          <option value="Japan">Japan</option>
                        </select>
                      </div>
                      <Button type="submit" variant="dark" size="sm">
                        SECURE IN ADDRESS REGISTRY
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Actual displayed list */}
                <div className="flex flex-col gap-4">
                  {user.addresses.map((addr) => (
                    <div id={`addr-item-${addr.id}`} key={addr.id} className="border border-brand-border p-4 bg-brand-cream/40 rounded-lg text-xs leading-normal relative">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[9px] font-bold bg-brand-black text-brand-cream px-1.5 py-0.5 tracking-wider mb-2 inline-block">
                          {addr.isDefault ? 'PRIMARY SHIP ADDRESS' : 'SHIPPING LOCATION'}
                        </span>
                        
                        <button
                          id={`addr-delete-${addr.id}`}
                          aria-label="Delete address"
                          onClick={() => deleteUserAddress(addr.id)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-sans text-xs text-brand-black">{addr.street}</p>
                      <p className="font-sans text-xs text-zinc-600 mt-0.5">{addr.city}, {addr.state} - {addr.postalCode}</p>
                      <p className="font-mono text-[9px] text-zinc-400 uppercase mt-2 tracking-widest">{addr.country.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Main Allocation Order History timelines */}
            <div className="lg:col-span-8 flex flex-col gap-8 text-left h-full">
              
              <div className="p-6 sm:p-8 border border-brand-border bg-white rounded-3xl shadow-sm text-left flex flex-col gap-6 bg-grain">
                <h4 className="font-serif text-2xl text-brand-black uppercase font-medium">
                  ALLOCATION HISTORY ({orders.length})
                </h4>
                
                {orders.length === 0 ? (
                  <div className="py-16 text-center border border-dashed border-brand-border rounded-xl flex flex-col items-center gap-3">
                    <PackageOpen className="w-10 h-10 text-brand-accent/50" />
                    <p className="font-serif text-zinc-400 italic text-base">You haven't requested any system drop allocations yet.</p>
                    <button onClick={() => navigateTo('shop')} className="font-mono text-[10px] uppercase tracking-widest font-semibold border-b border-brand-black mt-2">
                      SHOP EXCLUSIVE RELEASES
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <div
                        id={`order-status-card-${order.id}`}
                        key={order.id}
                        className="border border-brand-border bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-5 text-left h-full"
                      >
                        {/* Upper row header specs */}
                        <div className="flex flex-wrap justify-between items-baseline gap-4 border-b border-brand-border/45 pb-4">
                          <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-zinc-400 block uppercase tracking-widest">ORDER TRACK SERIAL</span>
                            <span className="font-mono text-sm font-semibold text-brand-black">{order.id}</span>
                          </div>
                          
                          <div className="flex flex-col sm:items-end">
                            <span className="font-mono text-[10px] text-zinc-400 block uppercase tracking-widest">ORDER SECURED ON</span>
                            <span className="font-mono text-xs">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className={`font-mono text-[10px] font-bold border px-3 py-1 ml-auto tracking-widest ${
                            order.status === 'Delivered' ? 'bg-emerald-55 border-emerald-300 text-emerald-800' :
                            order.status === 'Shipped' ? 'bg-indigo-55 border-indigo-250 text-indigo-850' :
                            order.status === 'Approved' ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse' :
                            'bg-amber-50 border-amber-250 text-amber-700 animate-pulse'
                          }`}>
                            {order.status.toUpperCase()}
                          </div>
                        </div>

                        {/* Order item details listings */}
                        <div className="flex flex-col gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center border-b border-zinc-100 last:border-none pb-4 last:pb-0">
                              <img
                                src={item.product.imagePrimary}
                                alt={item.product.name}
                                className="w-12 h-14 object-cover border border-zinc-200 shrink-0 cursor-pointer"
                                onClick={() => selectProduct(item.product.id)}
                              />
                              <div className="flex-1 flex justify-between items-center text-xs">
                                <div className="text-left font-sans font-medium hover:opacity-75 cursor-pointer uppercase" onClick={() => selectProduct(item.product.id)}>
                                  {item.product.name}
                                  <div className="font-mono text-[9px] text-zinc-400 block mt-1">SIZE: {item.size} • QTY: {item.quantity}</div>
                                </div>
                                <span className="font-mono font-bold text-zinc-900">₹{item.priceAtPurchase * item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipping status specifications drawer */}
                        <div className="bg-brand-cream/60 p-4 border border-brand-border font-mono text-[9px] text-zinc-500 uppercase flex flex-col sm:flex-row justify-between items-stretch gap-4 rounded-xl shrink-0">
                          <div>
                            <span className="block text-zinc-400 uppercase tracking-widest">DELIVERY STATUS ADAPTER</span>
                            <span className="text-brand-black font-semibold text-xs font-sans block mt-1">
                              {order.status === 'Manual Review' && "COMPILING PAYscreenshot VALIDATIONS..."}
                              {order.status === 'Approved' && "PAYMENT SECURED. DISPATCH PROTOCOLS INITIATED."}
                              {order.status === 'Shipped' && `IN TRANSIT PAN-INDIA VIA CUSTOM CARRIER.`}
                              {order.status === 'Delivered' && "GARMENT DELIVERED SAFELY TO ASSIGNED MATRIX."}
                            </span>
                          </div>

                          {order.trackingNumber && (
                            <div className="flex flex-col sm:items-end">
                              <span className="block text-zinc-400 uppercase tracking-widest">DHL EXPRESS TRACK CODES</span>
                              <span className="text-brand-accent font-bold font-mono text-xs mt-1 underline select-all cursor-copy">
                                {order.trackingNumber}
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        ) : (
          
          /* THE BRAND ADMIN COCKPIT (THE SALES COCKPIT) */
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 text-left"
          >
            {/* Left list block selector */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-6 border border-zinc-900 bg-zinc-950 text-neutral-300 rounded-2xl flex flex-col gap-4 font-mono select-none bg-grain">
                <div className="flex justify-between items-center">
                  <span className="text-rose-400 font-bold tracking-widest text-xs flex items-center gap-1">
                    <ShieldAlert className="w-4 h-4 text-rose-500" /> SECURE ROOT ACTIVE
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-800 text-[10px] text-white">PORT: Local</span>
                </div>
                <h3 className="text-white text-xl font-serif">BLANK SPACE SYSTEMS</h3>
                <p className="text-[11px] leading-relaxed text-zinc-500 uppercase">
                  Auditing checkout payments and manual UPI screenshot verification records. Update client cargo states reactive.
                </p>
              </div>

              {/* Order Pending reviewer lists */}
              <div className="p-5 border border-brand-border bg-white rounded-xl shadow-sm flex flex-col gap-4">
                <h4 className="font-mono text-xs font-bold text-brand-black uppercase tracking-wider border-b border-brand-border pb-3">
                  SALES TRANSACTION QUEUE ({orders.length})
                </h4>
                <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto">
                  {orders.map((o) => (
                    <button
                      id={`queue-item-${o.id}`}
                      key={o.id}
                      onClick={() => setSelectedAdminOrderId(o.id)}
                      className={`p-3 text-left border font-mono text-xs flex flex-col gap-1 transition-colors ${
                        selectedAdminOrderId === o.id
                          ? 'bg-zinc-100 border-zinc-900 border-2 font-bold'
                          : 'bg-white border-brand-border hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="font-bold text-zinc-900">{o.id}</span>
                        <span className={`text-[9px] font-bold border px-1.5 py-0.5 ${
                          o.status === 'Manual Review' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-zinc-100 text-zinc-650 border-zinc-200'
                        }`}>
                          {o.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-zinc-400 text-[10px] uppercase truncate">{o.name}</span>
                      <span className="text-brand-black font-semibold font-sans mt-0.5">₹{o.total}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right block: Admin Action detail panels */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {activeAdminOrder ? (
                <div className="p-6 sm:p-8 border border-brand-border bg-white rounded-3xl shadow-sm text-left flex flex-col gap-6 bg-grain">
                  
                  <div className="border-b border-brand-border pb-5 flex flex-wrap justify-between items-baseline gap-4 font-mono text-xs">
                    <div>
                      <span className="text-zinc-400 block uppercase">AUDITING SERIAL CODE</span>
                      <span className="text-base text-brand-black font-bold">{activeAdminOrder.id}</span>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <span className="text-zinc-400 block uppercase">CURRENT ALLOCATION STEP</span>
                      <span className="text-rose-600 font-bold block mt-0.5">{activeAdminOrder.status.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Customer credentials parameters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-brand-cream/40 p-5 rounded-xl border border-brand-border/45 font-mono text-[10px] text-zinc-500 uppercase">
                    <div>
                      <span className="block text-zinc-400">CUSTOMER NAME</span>
                      <span className="text-brand-black font-bold block font-sans text-xs mt-0.5">{activeAdminOrder.name}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-400">EMAIL</span>
                      <span className="text-brand-black font-bold block font-sans text-xs mt-0.5 leading-none break-all">{activeAdminOrder.email}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-400">PHONE CODE</span>
                      <span className="text-brand-black font-bold block font-sans text-xs mt-0.5">{activeAdminOrder.phone}</span>
                    </div>
                    <div>
                      <span className="block text-zinc-400">LOCATION CITY</span>
                      <span className="text-brand-text font-bold block font-sans text-xs mt-0.5">{activeAdminOrder.address.city}</span>
                    </div>
                  </div>

                  {/* UPI TRANSACTION CHECKS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-brand-border py-6 select-all">
                    
                    {/* Input references */}
                    <div className="flex flex-col gap-4 text-left font-mono">
                      <div>
                        <span className="text-zinc-400 text-[11px] uppercase tracking-widest block">CLIENT SUBMITTED ID</span>
                        <div className="bg-brand-orange bg-brand-card/75 border border-brand-border/80 px-4 py-3 mt-1 text-sm text-brand-black select-all rounded-lg select-all">
                          {activeAdminOrder.upiTxnId ? activeAdminOrder.upiTxnId : "MOCK_GATEWAY_REFERENCE_OK"}
                        </div>
                      </div>

                      {/* Manual tracking ID updates */}
                      <div className="flex flex-col gap-2.5 mt-2">
                        <label className="text-zinc-400 text-[11px] uppercase tracking-widest block">ALLOCATE DHL CODES (OPTIONAL):</label>
                        <input
                          id="tracking-number-input"
                          type="text"
                          placeholder="e.g. BS-DHL-9182746..."
                          value={customTracking}
                          onChange={(e) => setCustomTracking(e.target.value)}
                          className="bg-brand-cream border border-brand-border px-3.5 py-2 text-xs font-sans text-brand-black placeholder-zinc-400 focus:outline-none focus:border-brand-black rounded-none"
                        />
                      </div>
                    </div>

                    {/* Screenshot presentation */}
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-zinc-400 text-[11px] uppercase tracking-widest text-left block">SUBMITTED UPI PAYMENT PROOF:</span>
                      
                      <div className="relative h-64 border border-brand-border bg-brand-card rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
                        {activeAdminOrder.paymentScreenshot ? (
                          <img
                            src={activeAdminOrder.paymentScreenshot}
                            alt="Submitted payment receipt review"
                            className="w-full h-full object-contain pointer-events-auto"
                          />
                        ) : (
                          <div className="p-6 text-center text-zinc-400 flex flex-col items-center gap-2">
                            <Compass className="w-8 h-8 text-neutral-300 animate-spin" />
                            <p className="font-mono text-[10px] uppercase">USING LIVE CLOUD VERIFICATION PROOFS...</p>
                            <span className="text-[9px] text-zinc-500">MOCK AUTO-CONFIRM SYSTEM CAPABLE</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Operational button workflow trigger */}
                  <div className="flex flex-col gap-3">
                    <span className="font-mono text-zinc-400 text-[10px] uppercase tracking-widest block text-left">INITIATE NEXT CARGO TRANSIT SEQUENCE:</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        id="admin-btn-approve"
                        onClick={() => handleAdminStatusChange(activeAdminOrder.id, 'Approved')}
                        className="py-3 bg-brand-black border border-brand-black hover:bg-emerald-600 text-brand-cream font-mono text-[10px] font-bold tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                        disabled={activeAdminOrder.status === 'Approved'}
                      >
                        APPROVE PAYMENT REC
                      </button>
                      <button
                        id="admin-btn-ship"
                        onClick={() => handleAdminStatusChange(activeAdminOrder.id, 'Shipped')}
                        className="py-3 bg-brand-black border border-brand-black hover:bg-indigo-650 text-brand-cream font-mono text-[10px] font-bold tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                        disabled={activeAdminOrder.status === 'Shipped'}
                      >
                        SET IN TRANSIT [SHIPPED]
                      </button>
                      <button
                        id="admin-btn-deliver"
                        onClick={() => handleAdminStatusChange(activeAdminOrder.id, 'Delivered')}
                        className="py-3 bg-brand-black border border-brand-black hover:bg-teal-700 text-brand-cream font-mono text-[10px] font-bold tracking-widest uppercase transition-colors rounded-none cursor-pointer"
                        disabled={activeAdminOrder.status === 'Delivered'}
                      >
                        MARK COMPLETED DEL
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-24 border border-dashed border-brand-border rounded-xl text-center flex flex-col items-center justify-center gap-3">
                  <Compass className="w-10 h-10 text-rose-500/50" />
                  <p className="font-serif text-zinc-400 italic text-base">Select a transaction drop serial to auditing records.</p>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
