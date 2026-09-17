import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  ArrowRight, 
  IndianRupee, 
  Search, 
  Lock, 
  KeyRound, 
  Check, 
  CircleDot, 
  ExternalLink,
  Info,
  Train,
  Car,
  Bus
} from 'lucide-react';

export default function App() {
  const [activePortal, setActivePortal] = useState('sender'); // 'sender' | 'carrier' | 'tracker'

  // Sender Portal Form State
  const [senderForm, setSenderForm] = useState({
    originCity: 'Mumbai',
    destinationCity: 'Pune',
    weightKg: 2.5,
    category: 'electronics',
    declaredValue: 12000,
    bountyOffer: 350,
    recipientName: 'Aarav Sharma',
    recipientPhone: '+91 98765 43210'
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bedrockInspection, setBedrockInspection] = useState(null);

  // Carrier Portal Form State
  const [carrierForm, setCarrierForm] = useState({
    originCity: 'Mumbai',
    destinationCity: 'Pune',
    travelMode: 'train',
    availableCapacityKg: 8,
    departureTime: '2026-09-18T08:00',
    pricePerKg: 120
  });

  // Active Simulated Match & Stepper State
  const [activeMatch, setActiveMatch] = useState({
    matchId: 'MCH-884920',
    requestId: 'REQ-9931',
    senderName: 'Supreet Patil',
    carrierName: 'Rahul Verma',
    origin: 'Mumbai (Dadar)',
    destination: 'Pune (Shivajinagar)',
    weightKg: 2.5,
    category: 'Electronics (Laptop)',
    matchScore: 98.4,
    carrierPayout: 350.00,
    platformFee: 42.00,
    totalCharge: 392.00,
    currentStep: 3, // 1: Escrow, 2: Accepted, 3: Pickup OTP, 4: In Transit, 5: Delivery OTP, 6: Released
    pickupOtp: '482910',
    deliveryOtp: '719304'
  });

  const [enteredOtp, setEnteredOtp] = useState('');
  const [handshakeSuccessMsg, setHandshakeSuccessMsg] = useState('');

  // S3 Intake & Bedrock Inspection Mock Simulation
  const handleSimulatedImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadedFile(file.name);

    setTimeout(() => {
      setUploadingImage(false);
      // Simulate Bedrock Claude 3.5 Sonnet Response
      setBedrockInspection({
        prohibited_items_detected: false,
        risk_summary: "Safe verified electronic device in anti-static padded bubble wrap. Zero contraband signals.",
        detected_category: "electronics",
        estimated_volume_tier: "backpack",
        packaging_integrity_score: 96,
        handling_tags: ["Fragile", "Keep Dry", "Handle with Care", "Verified Electronics"]
      });
    }, 1800);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!enteredOtp) return;

    if (activeMatch.currentStep === 3 && enteredOtp === activeMatch.pickupOtp) {
      setActiveMatch(prev => ({ ...prev, currentStep: 4 }));
      setHandshakeSuccessMsg('Pickup OTP verified! Order status updated to IN_TRANSIT.');
      setEnteredOtp('');
    } else if (activeMatch.currentStep === 5 && enteredOtp === activeMatch.deliveryOtp) {
      setActiveMatch(prev => ({ ...prev, currentStep: 6 }));
      setHandshakeSuccessMsg('Recipient OTP verified! Escrow payout released to carrier.');
      setEnteredOtp('');
    } else {
      alert('Invalid OTP verification code! Please check your SMS code.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zincBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-hitchOrange to-hitchBlue flex items-center justify-center text-white font-bold text-xl shadow-md">
              H
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-tight">Hitch</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200">
                Bharat Builds AWS
              </span>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <nav className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setActivePortal('sender')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePortal === 'sender'
                  ? 'bg-hitchOrange text-white shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Package className="w-4 h-4" />
              Sender Portal
            </button>
            <button
              onClick={() => setActivePortal('carrier')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePortal === 'carrier'
                  ? 'bg-hitchBlue text-white shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              Carrier Portal
            </button>
            <button
              onClick={() => setActivePortal('tracker')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activePortal === 'tracker'
                  ? 'bg-zinc-900 text-white shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Live Delivery Tracker
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =================================================================== */}
        {/* SENDER PORTAL VIEW */}
        {/* =================================================================== */}
        {activePortal === 'sender' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zincBorder pb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  Sender Package Intake
                  <span className="text-xs font-normal px-3 py-1 bg-hitchOrange-light text-hitchOrange border border-hitchOrange/20 rounded-full">
                    Hitch Orange Theme
                  </span>
                </h1>
                <p className="text-zinc-500 mt-1">
                  Create a crowd-shipping request, upload package photo for Bedrock AI inspection, and auto-match with verified commuters.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-2xl border border-zincBorder shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-hitchOrange" />
                  Route & Package Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Origin City</label>
                    <input
                      type="text"
                      value={senderForm.originCity}
                      onChange={(e) => setSenderForm({ ...senderForm, originCity: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Destination City</label>
                    <input
                      type="text"
                      value={senderForm.destinationCity}
                      onChange={(e) => setSenderForm({ ...senderForm, destinationCity: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={senderForm.weightKg}
                      onChange={(e) => setSenderForm({ ...senderForm, weightKg: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Category</label>
                    <select
                      value={senderForm.category}
                      onChange={(e) => setSenderForm({ ...senderForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange"
                    >
                      <option value="documents">Documents</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="medicine">Medicine</option>
                      <option value="fragile">Fragile</option>
                      <option value="food">Food</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Bounty Reward (₹)</label>
                    <input
                      type="number"
                      value={senderForm.bountyOffer}
                      onChange={(e) => setSenderForm({ ...senderForm, bountyOffer: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange font-semibold text-hitchOrange"
                    />
                  </div>
                </div>

                {/* S3 Intake Photo Drag & Drop Upload */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-2">
                    Package Photo Verification (S3 Vault Direct Upload)
                  </label>
                  <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-hitchOrange transition-colors bg-zinc-50">
                    <input
                      type="file"
                      id="package-photo"
                      accept="image/jpeg,image/png"
                      onChange={handleSimulatedImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="package-photo" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-hitchOrange-light text-hitchOrange flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-zinc-700">
                        {uploadingImage ? (
                          <span className="text-hitchOrange font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 animate-spin" /> Uploading to S3 & Running Bedrock Claude 3.5 Sonnet...
                          </span>
                        ) : uploadedFile ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> {uploadedFile} Uploaded & Inspected
                          </span>
                        ) : (
                          <span>Click to select package intake photo (Max 5MB JPEG/PNG)</span>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setActivePortal('tracker')}
                  className="w-full py-3 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Create Request & Lock Escrow ₹{senderForm.bountyOffer + 42}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bedrock AI Inspector Badge Readout Column */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32 text-white" />
                  </div>

                  <div className="flex items-center gap-2 text-hitchOrange text-xs font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="w-4 h-4" /> Amazon Bedrock Multimodal Inspector
                  </div>

                  <h3 className="text-xl font-bold mb-4">Safety & Package Audit</h3>

                  {bedrockInspection ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                        <span className="text-xs text-zinc-300">Safety Verification</span>
                        {bedrockInspection.prohibited_items_detected ? (
                          <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold rounded-md flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> FLAGGED
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-md flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SAFE
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <span className="text-xs text-zinc-400">Packaging Score</span>
                          <p className="text-xl font-bold text-emerald-400 mt-0.5">
                            {bedrockInspection.packaging_integrity_score}/100
                          </p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <span className="text-xs text-zinc-400">Volume Tier</span>
                          <p className="text-xl font-bold text-hitchOrange capitalize mt-0.5">
                            {bedrockInspection.estimated_volume_tier}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-xs text-zinc-400 block mb-1">AI Risk Summary</span>
                        <p className="text-xs text-zinc-200 leading-relaxed">
                          {bedrockInspection.risk_summary}
                        </p>
                      </div>

                      <div>
                        <span className="text-xs text-zinc-400 block mb-2">Handling Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {bedrockInspection.handling_tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white/10 text-zinc-200 text-xs rounded-md border border-white/10">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                      <Package className="w-10 h-10 mx-auto text-zinc-500 mb-2" />
                      <p className="text-xs text-zinc-400">
                        Upload a package photo on the left to trigger Bedrock Claude 3.5 Sonnet safety analysis.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pricing & Fee Breakdown Card */}
                <div className="bg-white p-6 rounded-2xl border border-zincBorder shadow-sm space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Financial Breakdown</h4>
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Commuter Carrier Payout</span>
                    <span className="font-semibold text-zinc-800">₹{senderForm.bountyOffer}.00</span>
                  </div>
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-100">
                    <span className="text-zinc-500">Hitch Platform Take Rate (12%)</span>
                    <span className="font-semibold text-zinc-800">₹42.00</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-1 text-zinc-900">
                    <span>Total Escrow Amount</span>
                    <span className="text-hitchOrange">₹{senderForm.bountyOffer + 42}.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* CARRIER PORTAL VIEW */}
        {/* =================================================================== */}
        {activePortal === 'carrier' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zincBorder pb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  Carrier Commuter Corridor
                  <span className="text-xs font-normal px-3 py-1 bg-hitchBlue-light text-hitchBlue border border-hitchBlue/20 rounded-full">
                    Hitch Blue Theme
                  </span>
                </h1>
                <p className="text-zinc-500 mt-1">
                  Monetize your unused luggage space while traveling between cities. Earn payouts by picking up matched parcels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Trip Planner Controls */}
              <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-zincBorder shadow-sm space-y-5">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-hitchBlue" />
                  Post Commuter Trip
                </h2>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Origin City</label>
                  <input
                    type="text"
                    value={carrierForm.originCity}
                    onChange={(e) => setCarrierForm({ ...carrierForm, originCity: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Destination City</label>
                  <input
                    type="text"
                    value={carrierForm.destinationCity}
                    onChange={(e) => setCarrierForm({ ...carrierForm, destinationCity: e.target.value })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Mode of Transport</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['train', 'car', 'bus'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setCarrierForm({ ...carrierForm, travelMode: mode })}
                        className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase border transition-all flex items-center justify-center gap-1 ${
                          carrierForm.travelMode === mode
                            ? 'bg-hitchBlue text-white border-hitchBlue shadow-sm'
                            : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {mode === 'train' && <Train className="w-3.5 h-3.5" />}
                        {mode === 'car' && <Car className="w-3.5 h-3.5" />}
                        {mode === 'bus' && <Bus className="w-3.5 h-3.5" />}
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Available Weight (kg)</label>
                  <input
                    type="number"
                    value={carrierForm.availableCapacityKg}
                    onChange={(e) => setCarrierForm({ ...carrierForm, availableCapacityKg: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue"
                  />
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" /> Scan Cargo Corridor
                </button>
              </div>

              {/* Corridor Radar Feed */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-hitchBlue" />
                    Available Cargo Matches ({carrierForm.originCity} → {carrierForm.destinationCity})
                  </h3>
                  <span className="text-xs font-medium text-zinc-500">Sorted by Match Score</span>
                </div>

                {/* Match Item 1 */}
                <div className="bg-white p-6 rounded-2xl border border-zincBorder shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                        98.4% Corridor Match
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-md">
                        Electronics
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-zinc-900">
                      Mumbai (Dadar) → Pune (Shivajinagar)
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Weight: <strong className="text-zinc-800">2.5 kg</strong></span>
                      <span>Declared Value: <strong className="text-zinc-800">₹12,000</strong></span>
                      <span>Bedrock Status: <strong className="text-emerald-600">VERIFIED SAFE</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 gap-2">
                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block">Carrier Payout</span>
                      <span className="text-2xl font-bold text-hitchBlue">₹350.00</span>
                    </div>
                    <button
                      onClick={() => {
                        setActivePortal('tracker');
                        setActiveMatch(prev => ({ ...prev, currentStep: 3 }));
                      }}
                      className="px-5 py-2 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-sm transition-all text-sm flex items-center gap-1"
                    >
                      Accept Parcel <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Match Item 2 */}
                <div className="bg-white p-6 rounded-2xl border border-zincBorder shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 font-bold text-xs rounded-full border border-blue-200">
                        91.2% Corridor Match
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-md">
                        Documents
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-zinc-900">
                      Mumbai (Kurla) → Pune (Chinchwad)
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Weight: <strong className="text-zinc-800">0.8 kg</strong></span>
                      <span>Declared Value: <strong className="text-zinc-800">₹2,500</strong></span>
                      <span>Bedrock Status: <strong className="text-emerald-600">VERIFIED SAFE</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 gap-2">
                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block">Carrier Payout</span>
                      <span className="text-2xl font-bold text-hitchBlue">₹220.00</span>
                    </div>
                    <button
                      onClick={() => {
                        setActivePortal('tracker');
                        setActiveMatch(prev => ({ ...prev, currentStep: 3 }));
                      }}
                      className="px-5 py-2 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-sm transition-all text-sm flex items-center gap-1"
                    >
                      Accept Parcel <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* LIVE DELIVERY TRACKER VIEW (STEP FUNCTIONS STEPPER) */}
        {/* =================================================================== */}
        {activePortal === 'tracker' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zincBorder pb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  Delivery Lifecycle Tracker
                  <span className="text-xs font-normal px-3 py-1 bg-zinc-900 text-white rounded-full">
                    AWS Step Functions Orchestrator
                  </span>
                </h1>
                <p className="text-zinc-500 mt-1">
                  Real-time transactional state machine controlling escrow, dual OTP handshakes, and carrier payout release.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
                  Match ID: {activeMatch.matchId}
                </span>
              </div>
            </div>

            {/* Notification Banner */}
            {handshakeSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {handshakeSuccessMsg}
                </div>
                <button
                  onClick={() => setHandshakeSuccessMsg('')}
                  className="text-xs font-bold text-emerald-700 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Step Functions Visual Stepper */}
            <div className="bg-white p-8 rounded-2xl border border-zincBorder shadow-sm space-y-8">
              <h2 className="text-lg font-bold text-zinc-900">Step Functions Execution Lifecycle</h2>

              <div className="relative flex flex-col md:flex-row justify-between gap-4">
                {[
                  { step: 1, label: 'Hold Escrow', detail: 'DynamoDB Updated' },
                  { step: 2, label: 'Carrier Accepted', detail: 'Task Token Callback' },
                  { step: 3, label: 'Pickup Handshake', detail: 'Sender OTP Verification' },
                  { step: 4, label: 'In Transit', detail: 'GPS Corridor Active' },
                  { step: 5, label: 'Delivery Handshake', detail: 'Recipient OTP Verification' },
                  { step: 6, label: 'Release Payout', detail: 'Escrow Cleared' },
                ].map((item) => {
                  const isCompleted = activeMatch.currentStep > item.step;
                  const isCurrent = activeMatch.currentStep === item.step;

                  return (
                    <div key={item.step} className="flex-1 flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isCurrent
                            ? 'bg-hitchOrange text-white ring-4 ring-hitchOrange/20 shadow-lg'
                            : 'bg-zinc-100 text-zinc-400 border border-zinc-200'
                        }`}
                      >
                        {isCompleted ? <Check className="w-5 h-5" /> : item.step}
                      </div>
                      <span className={`text-xs font-bold mt-3 ${isCurrent ? 'text-zinc-900' : 'text-zinc-500'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{item.detail}</span>
                    </div>
                  );
                })}
              </div>

              {/* Handshake Verification Interactive Panel */}
              <div className="mt-8 border-t border-zincBorder pt-6">
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 max-w-xl mx-auto space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900 text-sm">
                    <KeyRound className="w-4 h-4 text-hitchOrange" />
                    Handshake Service Verification Endpoint (`/handshake/verify`)
                  </div>

                  {activeMatch.currentStep === 3 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <p className="text-xs text-zinc-600">
                        Sender must share the Pickup OTP with the carrier at origin departure (<strong className="text-hitchOrange font-mono">{activeMatch.pickupOtp}</strong>).
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit Pickup OTP"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchOrange"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-hitchOrange text-white text-sm font-semibold rounded-lg hover:bg-hitchOrange-hover shadow-sm"
                        >
                          Verify Pickup
                        </button>
                      </div>
                    </form>
                  )}

                  {activeMatch.currentStep === 4 && (
                    <div className="text-center py-4 space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-hitchBlue text-xs font-bold rounded-full border border-blue-200">
                        <CircleDot className="w-3.5 h-3.5 animate-pulse" /> Parcel In Transit on Train Corridor
                      </div>
                      <button
                        onClick={() => setActiveMatch(prev => ({ ...prev, currentStep: 5 }))}
                        className="block w-full py-2 bg-hitchBlue text-white text-xs font-semibold rounded-lg hover:bg-hitchBlue-hover"
                      >
                        Simulate Carrier Arrival at Destination
                      </button>
                    </div>
                  )}

                  {activeMatch.currentStep === 5 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <p className="text-xs text-zinc-600">
                        Recipient must present the Delivery OTP upon receiving the parcel (<strong className="text-hitchBlue font-mono">{activeMatch.deliveryOtp}</strong>).
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit Delivery OTP"
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchBlue"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-hitchBlue text-white text-sm font-semibold rounded-lg hover:bg-hitchBlue-hover shadow-sm"
                        >
                          Verify Delivery & Release
                        </button>
                      </div>
                    </form>
                  )}

                  {activeMatch.currentStep === 6 && (
                    <div className="text-center py-4 text-emerald-700 font-semibold text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Delivery lifecycle completed successfully! Escrow ₹{activeMatch.carrierPayout} released to carrier account.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zincBorder py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Hitch Technology Intermediary Platform — Facilitated under Section 79 IT Act 2000.
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-zinc-700">AWS Services: Bedrock, Step Functions, S3, DynamoDB, SAM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
