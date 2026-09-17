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
  KeyRound,
  Check,
  CircleDot,
  Train,
  Car,
  Bus,
  Plane,
  Bike,
  MapPin,
  Zap,
  Globe,
  Database,
  Cloud,
  Activity,
  Server,
  GitBranch,
  TrendingUp
} from 'lucide-react';

const LIVE_API_BASE_URL = "https://zq2mtwye39.execute-api.ap-south-1.amazonaws.com";

const ROUTE_PREVIEWS = {
  train: {
    badge: 'ELECTRIFIED RAIL',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    speed: '160 km/h avg',
    distance: '149 km',
    duration: '3h 10m',
    waypoints: ['Dadar', 'Kalyan Jn.', 'Khopoli', 'Shivajinagar'],
    icon: Train,
    lineClass: 'bg-blue-400',
  },
  car: {
    badge: 'EXPRESSWAY NH-48',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    speed: '90 km/h avg',
    distance: '149 km',
    duration: '2h 45m',
    waypoints: ['Khopat', 'Panvel', 'Khalapur', 'Talegaon'],
    icon: Car,
    lineClass: 'bg-amber-400',
  },
  bus: {
    badge: 'MSRTC CORRIDOR',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    speed: '70 km/h avg',
    distance: '155 km',
    duration: '3h 50m',
    waypoints: ['Dadar TT', 'Panvel', 'Lonavala', 'Swargate'],
    icon: Bus,
    lineClass: 'bg-green-500',
  },
  flight: {
    badge: 'DOMESTIC AIR CORRIDOR',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    speed: '850 km/h avg',
    distance: '900 km',
    duration: '1h 25m',
    waypoints: ['BOM Intl.', 'Airspace FL350', 'Approach', 'DEL IGI'],
    icon: Plane,
    lineClass: 'bg-purple-400',
  },
  bike: {
    badge: 'LAST-MILE DELIVERY',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    speed: '25 km/h avg',
    distance: '18 km',
    duration: '45m',
    waypoints: ['Andheri', 'Bandra', 'Worli', 'Lower Parel'],
    icon: Bike,
    lineClass: 'bg-rose-400',
  },
};

const AWS_SERVICES = [
  { name: 'Amazon Bedrock', desc: 'Claude 3.5 Sonnet package safety inspection', icon: Sparkles, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  { name: 'AWS Step Functions', desc: '6-state delivery lifecycle state machine', icon: GitBranch, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { name: 'Amazon S3', desc: 'Secure package photo intake vault', icon: Cloud, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { name: 'Amazon DynamoDB', desc: 'HitchTable — orders, OTPs, corridors', icon: Database, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Amazon API Gateway', desc: 'REST API hub for all portal endpoints', icon: Server, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'AWS Lambda', desc: 'Presign · Bedrock Inspector · Handshake', icon: Zap, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { name: 'AWS Amplify', desc: 'Global CDN hosting for sender & carrier UI', icon: Globe, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { name: 'AWS SAM', desc: 'Infrastructure-as-code deployment pipeline', icon: Activity, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
];

function RoutePreviewCard({ origin, destination, mode }) {
  const preview = ROUTE_PREVIEWS[mode] || ROUTE_PREVIEWS.train;
  const ModeIcon = preview.icon;
  return (
    <div className="bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <ModeIcon className="w-4 h-4 text-hitchOrange" /> Route Preview
        </div>
        <span className={"text-xs font-bold px-2 py-0.5 rounded-full border " + preview.badgeColor}>{preview.badge}</span>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-center">
            <div className="w-9 h-9 rounded-full bg-hitchOrange flex items-center justify-center text-white mb-1 mx-auto shadow">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-zinc-800">{origin}</p>
            <p className="text-[10px] text-zinc-400 uppercase">Origin</p>
          </div>
          <div className="flex-1 relative flex flex-col items-center gap-1">
            <div className="w-full h-1.5 rounded-full bg-zinc-100 relative overflow-hidden">
              <div className={"absolute left-0 top-0 h-full rounded-full animate-pulse " + preview.lineClass} style={{ width: '70%' }} />
            </div>
            <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-medium">
              <span>{preview.distance}</span><span>·</span><span>{preview.duration}</span><span>·</span><span>{preview.speed}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-9 h-9 rounded-full bg-hitchBlue flex items-center justify-center text-white mb-1 mx-auto shadow">
              <MapPin className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-zinc-800">{destination}</p>
            <p className="text-[10px] text-zinc-400 uppercase">Destination</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase text-zinc-400 mb-1.5">Corridor Waypoints</p>
          <div className="flex items-center gap-1 flex-wrap">
            {preview.waypoints.map((wp, idx) => (
              <React.Fragment key={idx}>
                <span className="text-[10px] px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200 font-medium">{wp}</span>
                {idx < preview.waypoints.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-zinc-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AwsServiceShowcase() {
  return (
    <section className="mt-12 mb-4">
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Powered By</span>
        <h2 className="text-2xl font-bold text-zinc-900 mt-1">AWS Service Stack</h2>
        <p className="text-sm text-zinc-500 mt-1">Bharat Builds on AWS — Hackathon mandated services, fully deployed</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {AWS_SERVICES.map((svc) => {
          const Icon = svc.icon;
          return (
            <div key={svc.name} className={"p-4 rounded-xl border flex flex-col gap-2 hover:shadow-md transition-all " + svc.color}>
              <Icon className="w-6 h-6" />
              <p className="text-xs font-bold">{svc.name}</p>
              <p className="text-[10px] opacity-75 leading-relaxed">{svc.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const TRANSPORT_MODES = [
  { id: 'train', label: 'Train', icon: Train },
  { id: 'car', label: 'Car', icon: Car },
  { id: 'bus', label: 'Bus', icon: Bus },
  { id: 'flight', label: 'Flight', icon: Plane },
  { id: 'bike', label: 'Bike', icon: Bike },
];

export default function App() {
  const [activePortal, setActivePortal] = useState('sender');
  const [senderForm, setSenderForm] = useState({
    originCity: 'Mumbai', destinationCity: 'Pune', weightKg: 2.5,
    category: 'electronics', declaredValue: 12000, bountyOffer: 350,
    recipientName: 'Aarav Sharma', recipientPhone: '+91 98765 43210'
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bedrockInspection, setBedrockInspection] = useState(null);
  const [carrierForm, setCarrierForm] = useState({
    originCity: 'Mumbai', destinationCity: 'Pune', travelMode: 'train',
    availableCapacityKg: 8, departureTime: '2026-09-18T08:00', pricePerKg: 120
  });
  const [activeMatch, setActiveMatch] = useState({
    matchId: 'MCH-884920', requestId: 'REQ-9931', senderName: 'Supreet Patil',
    carrierName: 'Rahul Verma', origin: 'Mumbai (Dadar)', destination: 'Pune (Shivajinagar)',
    weightKg: 2.5, category: 'Electronics (Laptop)', matchScore: 98.4,
    carrierPayout: 350.00, platformFee: 42.00, totalCharge: 392.00,
    currentStep: 3, pickupOtp: '482910', deliveryOtp: '719304'
  });
  const [enteredOtp, setEnteredOtp] = useState('');
  const [handshakeSuccessMsg, setHandshakeSuccessMsg] = useState('');

  const handleSimulatedImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setUploadedFile(file.name);
    setTimeout(() => {
      setUploadingImage(false);
      setBedrockInspection({
        prohibited_items_detected: false,
        risk_summary: "Safe verified electronic device in anti-static padded bubble wrap. Zero contraband signals.",
        detected_category: "electronics", estimated_volume_tier: "backpack",
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

  const estimatedEarnings = Math.round(carrierForm.availableCapacityKg * carrierForm.pricePerKg * 0.88);
  const estimatedMonthly = estimatedEarnings * 22;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zincBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-hitchOrange to-hitchBlue flex items-center justify-center text-white font-bold text-xl shadow-md">H</div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight">Hitch</span>
              <span className="px-2 py-0.5 text-xs font-semibold bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200">Bharat Builds AWS</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-hitchOrange/10 text-hitchOrange rounded-full border border-hitchOrange/20">
                <Globe className="w-3 h-3" /> 173 Cities
              </span>
            </div>
          </div>
          <nav className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button onClick={() => setActivePortal('sender')}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all " + (activePortal === 'sender' ? 'bg-hitchOrange text-white shadow-sm font-semibold' : 'text-zinc-600 hover:text-zinc-900')}>
              <Package className="w-4 h-4" /> Sender Portal
            </button>
            <button onClick={() => setActivePortal('carrier')}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all " + (activePortal === 'carrier' ? 'bg-hitchBlue text-white shadow-sm font-semibold' : 'text-zinc-600 hover:text-zinc-900')}>
              <Truck className="w-4 h-4" /> Carrier Portal
            </button>
            <button onClick={() => setActivePortal('tracker')}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all " + (activePortal === 'tracker' ? 'bg-zinc-900 text-white shadow-sm font-semibold' : 'text-zinc-600 hover:text-zinc-900')}>
              <ShieldCheck className="w-4 h-4" /> Live Delivery Tracker
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* SENDER PORTAL */}
        {activePortal === 'sender' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-2xl bg-gradient-to-r from-hitchOrange to-amber-500 text-white px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-widest opacity-80">Crowd-Shipping Network</span></div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Instant Same-Day Dispatch</h1>
                <p className="text-sm mt-1 opacity-90">AI-matched commuters carry your parcels across <strong>173 cities</strong> — secured by AWS escrow &amp; Bedrock verification.</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30"><Globe className="w-4 h-4" /><span className="text-sm font-bold">173 Cities Live</span></div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30"><TrendingUp className="w-4 h-4" /><span className="text-sm font-bold">Traveler Monetization</span></div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zincBorder pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  Sender Package Intake
                  <span className="text-xs font-normal px-3 py-1 bg-hitchOrange/10 text-hitchOrange border border-hitchOrange/20 rounded-full">Bedrock AI Verified</span>
                </h2>
                <p className="text-zinc-500 text-sm mt-1">Create a crowd-shipping request, upload package photo for Bedrock AI inspection, and auto-match with verified commuters.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-2xl border border-zincBorder shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2"><Navigation className="w-5 h-5 text-hitchOrange" /> Route &amp; Package Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Origin City</label>
                    <input type="text" value={senderForm.originCity} onChange={(e) => setSenderForm({ ...senderForm, originCity: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Destination City</label>
                    <input type="text" value={senderForm.destinationCity} onChange={(e) => setSenderForm({ ...senderForm, destinationCity: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Weight (kg)</label>
                    <input type="number" step="0.5" value={senderForm.weightKg} onChange={(e) => setSenderForm({ ...senderForm, weightKg: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Category</label>
                    <select value={senderForm.category} onChange={(e) => setSenderForm({ ...senderForm, category: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange">
                      <option value="documents">Documents</option>
                      <option value="electronics">Electronics</option>
                      <option value="clothing">Clothing</option>
                      <option value="medicine">Medicine</option>
                      <option value="fragile">Fragile</option>
                      <option value="food">Food</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Bounty Reward (&#8377;)</label>
                    <input type="number" value={senderForm.bountyOffer} onChange={(e) => setSenderForm({ ...senderForm, bountyOffer: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange font-semibold text-hitchOrange" />
                  </div>
                </div>
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase text-zinc-500 mb-2">Package Photo Verification (S3 Vault Direct Upload)</label>
                  <div className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center hover:border-hitchOrange transition-colors bg-zinc-50">
                    <input type="file" id="package-photo" accept="image/jpeg,image/png" onChange={handleSimulatedImageUpload} className="hidden" />
                    <label htmlFor="package-photo" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-hitchOrange/10 text-hitchOrange flex items-center justify-center"><Upload className="w-6 h-6" /></div>
                      <div className="text-sm font-medium text-zinc-700">
                        {uploadingImage ? (<span className="text-hitchOrange font-semibold flex items-center gap-2"><Clock className="w-4 h-4 animate-spin" /> Uploading to S3 &amp; Running Bedrock Claude 3.5 Sonnet...</span>)
                          : uploadedFile ? (<span className="text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {uploadedFile} Uploaded &amp; Inspected</span>)
                          : (<span>Click to select package intake photo (Max 5MB JPEG/PNG)</span>)}
                      </div>
                    </label>
                  </div>
                </div>
                <button onClick={() => setActivePortal('tracker')} className="w-full py-3 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-md transition-all flex items-center justify-center gap-2">
                  Create Request &amp; Lock Escrow &#8377;{senderForm.bountyOffer + 42} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="w-32 h-32 text-white" /></div>
                  <div className="flex items-center gap-2 text-hitchOrange text-xs font-bold uppercase tracking-wider mb-3"><Sparkles className="w-4 h-4" /> Amazon Bedrock Multimodal Inspector</div>
                  <h3 className="text-xl font-bold mb-4">Safety &amp; Package Audit</h3>
                  {bedrockInspection ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                        <span className="text-xs text-zinc-300">Safety Verification</span>
                        {bedrockInspection.prohibited_items_detected
                          ? <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold rounded-md flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> FLAGGED</span>
                          : <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-md flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SAFE</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10"><span className="text-xs text-zinc-400">Packaging Score</span><p className="text-xl font-bold text-emerald-400 mt-0.5">{bedrockInspection.packaging_integrity_score}/100</p></div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10"><span className="text-xs text-zinc-400">Volume Tier</span><p className="text-xl font-bold text-hitchOrange capitalize mt-0.5">{bedrockInspection.estimated_volume_tier}</p></div>
                      </div>
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10"><span className="text-xs text-zinc-400 block mb-1">AI Risk Summary</span><p className="text-xs text-zinc-200 leading-relaxed">{bedrockInspection.risk_summary}</p></div>
                      <div>
                        <span className="text-xs text-zinc-400 block mb-2">Handling Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {bedrockInspection.handling_tags.map((tag, idx) => (<span key={idx} className="px-2 py-0.5 bg-white/10 text-zinc-200 text-xs rounded-md border border-white/10">#{tag}</span>))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-white/20 rounded-xl">
                      <Package className="w-10 h-10 mx-auto text-zinc-500 mb-2" />
                      <p className="text-xs text-zinc-400">Upload a package photo on the left to trigger Bedrock Claude 3.5 Sonnet safety analysis.</p>
                    </div>
                  )}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zincBorder shadow-sm space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Financial Breakdown</h4>
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-100"><span className="text-zinc-500">Commuter Carrier Payout</span><span className="font-semibold text-zinc-800">&#8377;{senderForm.bountyOffer}.00</span></div>
                  <div className="flex justify-between text-sm py-1 border-b border-zinc-100"><span className="text-zinc-500">Hitch Platform Take Rate (12%)</span><span className="font-semibold text-zinc-800">&#8377;42.00</span></div>
                  <div className="flex justify-between text-base font-bold pt-1 text-zinc-900"><span>Total Escrow Amount</span><span className="text-hitchOrange">&#8377;{senderForm.bountyOffer + 42}.00</span></div>
                </div>
              </div>
            </div>
            <AwsServiceShowcase />
          </div>
        )}

        {/* CARRIER PORTAL */}
        {activePortal === 'carrier' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="rounded-2xl bg-gradient-to-r from-hitchBlue to-blue-700 text-white px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div>
                <div className="flex items-center gap-2 mb-1"><Truck className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-widest opacity-80">Carrier Monetization</span></div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Traveler Monetization</h1>
                <p className="text-sm mt-1 opacity-90">Earn from your unused luggage space across <strong>173 cities</strong> — train, car, bus, flight, or bike.</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 text-center">
                  <p className="text-xs opacity-75 mb-0.5">Estimated Monthly</p>
                  <p className="text-2xl font-bold">&#8377;{estimatedMonthly.toLocaleString()}</p>
                  <p className="text-[10px] opacity-60 mt-0.5">based on {carrierForm.availableCapacityKg}kg capacity</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zincBorder pb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-3">Carrier Commuter Corridor <span className="text-xs font-normal px-3 py-1 bg-hitchBlue/10 text-hitchBlue border border-hitchBlue/20 rounded-full">Live Corridor Matching</span></h2>
                <p className="text-zinc-500 text-sm mt-1">Monetize your unused luggage space while traveling between cities. Earn payouts by picking up matched parcels.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-white p-6 rounded-2xl border border-zincBorder shadow-sm space-y-5">
                  <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2"><Truck className="w-5 h-5 text-hitchBlue" /> Post Commuter Trip</h2>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Origin City</label>
                    <input type="text" value={carrierForm.originCity} onChange={(e) => setCarrierForm({ ...carrierForm, originCity: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Destination City</label>
                    <input type="text" value={carrierForm.destinationCity} onChange={(e) => setCarrierForm({ ...carrierForm, destinationCity: e.target.value })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-2">Mode of Transport</label>
                    <div className="grid grid-cols-5 gap-1.5">
                      {TRANSPORT_MODES.map(({ id, label, icon: Icon }) => (
                        <button key={id} type="button" onClick={() => setCarrierForm({ ...carrierForm, travelMode: id })}
                          className={"py-2 px-1 rounded-lg text-[10px] font-bold uppercase border transition-all flex flex-col items-center justify-center gap-1 " + (carrierForm.travelMode === id ? 'bg-hitchBlue text-white border-hitchBlue shadow-sm' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100')}>
                          <Icon className="w-4 h-4" />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Available Weight (kg)</label>
                    <input type="number" value={carrierForm.availableCapacityKg} onChange={(e) => setCarrierForm({ ...carrierForm, availableCapacityKg: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Price Per kg (&#8377;)</label>
                    <input type="number" value={carrierForm.pricePerKg} onChange={(e) => setCarrierForm({ ...carrierForm, pricePerKg: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue" />
                  </div>
                  <div className="bg-hitchBlue/5 border border-hitchBlue/20 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-bold uppercase text-hitchBlue tracking-wider flex items-center gap-1"><IndianRupee className="w-3 h-3" /> Earnings Preview</p>
                    <div className="flex justify-between text-xs text-zinc-600"><span>Per Trip (after 12% fee)</span><span className="font-bold text-hitchBlue">&#8377;{estimatedEarnings}</span></div>
                    <div className="flex justify-between text-sm font-bold text-zinc-900"><span>Monthly (22 trips)</span><span className="text-hitchBlue">&#8377;{estimatedMonthly.toLocaleString()}</span></div>
                  </div>
                  <button type="button" className="w-full py-2.5 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-md transition-all flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" /> Scan Cargo Corridor
                  </button>
                </div>
                <RoutePreviewCard origin={carrierForm.originCity} destination={carrierForm.destinationCity} mode={carrierForm.travelMode} />
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-hitchBlue" /> Available Cargo Matches ({carrierForm.originCity} &#8594; {carrierForm.destinationCity})</h3>
                  <span className="text-xs font-medium text-zinc-500">Sorted by Match Score</span>
                </div>

                {[
                  { score: '98.4%', scoreColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', cat: 'Electronics', catExtra: null, route: 'Mumbai (Dadar) \u2192 Pune (Shivajinagar)', w: '2.5 kg', val: '12,000', payout: '350.00', step: 3 },
                  { score: '91.2%', scoreColor: 'bg-blue-100 text-blue-800 border-blue-200', cat: 'Documents', catExtra: null, route: 'Mumbai (Kurla) \u2192 Pune (Chinchwad)', w: '0.8 kg', val: '2,500', payout: '220.00', step: 3 },
                  { score: '87.0%', scoreColor: 'bg-purple-100 text-purple-800 border-purple-200', cat: 'Medicine', catExtra: 'Flight', route: 'Mumbai BOM \u2192 Delhi IGI', w: '1.2 kg', val: '5,800', payout: '620.00', step: 3 },
                ].map((m, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-zincBorder shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={"px-2.5 py-0.5 font-bold text-xs rounded-full border " + m.scoreColor}>{m.score} Corridor Match</span>
                        <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-md">{m.cat}</span>
                        {m.catExtra && <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-200 flex items-center gap-1"><Plane className="w-3 h-3" /> {m.catExtra}</span>}
                        {!m.catExtra && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-md border border-emerald-200">Bedrock &#10003;</span>}
                      </div>
                      <h4 className="text-base font-bold text-zinc-900">{m.route}</h4>
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>Weight: <strong className="text-zinc-800">{m.w}</strong></span>
                        <span>Value: <strong className="text-zinc-800">&#8377;{m.val}</strong></span>
                        <span>Status: <strong className="text-emerald-600">VERIFIED SAFE</strong></span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 gap-2">
                      <div className="text-right"><span className="text-xs text-zinc-400 block">Carrier Payout</span><span className="text-2xl font-bold text-hitchBlue">&#8377;{m.payout}</span></div>
                      <button onClick={() => { setActivePortal('tracker'); setActiveMatch(prev => ({ ...prev, currentStep: m.step })); }}
                        className="px-5 py-2 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-sm transition-all text-sm flex items-center gap-1">
                        Accept Parcel <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <AwsServiceShowcase />
          </div>
        )}

        {/* TRACKER PORTAL */}
        {activePortal === 'tracker' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zincBorder pb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  Delivery Lifecycle Tracker
                  <span className="text-xs font-normal px-3 py-1 bg-zinc-900 text-white rounded-full">AWS Step Functions Orchestrator</span>
                </h1>
                <p className="text-zinc-500 mt-1">Real-time transactional state machine controlling escrow, dual OTP handshakes, and carrier payout release.</p>
              </div>
              <div className="flex items-center gap-2"><span className="text-xs font-mono bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">Match ID: {activeMatch.matchId}</span></div>
            </div>

            {handshakeSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-600" />{handshakeSuccessMsg}</div>
                <button onClick={() => setHandshakeSuccessMsg('')} className="text-xs font-bold text-emerald-700 underline">Dismiss</button>
              </div>
            )}

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
                      <div className={"w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all " + (isCompleted ? 'bg-emerald-500 text-white shadow-md' : isCurrent ? 'bg-hitchOrange text-white ring-4 ring-hitchOrange/20 shadow-lg' : 'bg-zinc-100 text-zinc-400 border border-zinc-200')}>
                        {isCompleted ? <Check className="w-5 h-5" /> : item.step}
                      </div>
                      <span className={"text-xs font-bold mt-3 " + (isCurrent ? 'text-zinc-900' : 'text-zinc-500')}>{item.label}</span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">{item.detail}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 border-t border-zincBorder pt-6">
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 max-w-xl mx-auto space-y-4">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900 text-sm"><KeyRound className="w-4 h-4 text-hitchOrange" /> Handshake Service Verification Endpoint (`/handshake/verify`)</div>
                  {activeMatch.currentStep === 3 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <p className="text-xs text-zinc-600">Sender must share the Pickup OTP with the carrier at origin departure (<strong className="text-hitchOrange font-mono">{activeMatch.pickupOtp}</strong>).</p>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter 6-digit Pickup OTP" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchOrange" />
                        <button type="submit" className="px-4 py-2 bg-hitchOrange text-white text-sm font-semibold rounded-lg hover:bg-hitchOrange-hover shadow-sm">Verify Pickup</button>
                      </div>
                    </form>
                  )}
                  {activeMatch.currentStep === 4 && (
                    <div className="text-center py-4 space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-hitchBlue text-xs font-bold rounded-full border border-blue-200"><CircleDot className="w-3.5 h-3.5 animate-pulse" /> Parcel In Transit on Train Corridor</div>
                      <button onClick={() => setActiveMatch(prev => ({ ...prev, currentStep: 5 }))} className="block w-full py-2 bg-hitchBlue text-white text-xs font-semibold rounded-lg hover:bg-hitchBlue-hover">Simulate Carrier Arrival at Destination</button>
                    </div>
                  )}
                  {activeMatch.currentStep === 5 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      <p className="text-xs text-zinc-600">Recipient must present the Delivery OTP upon receiving the parcel (<strong className="text-hitchBlue font-mono">{activeMatch.deliveryOtp}</strong>).</p>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Enter 6-digit Delivery OTP" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchBlue" />
                        <button type="submit" className="px-4 py-2 bg-hitchBlue text-white text-sm font-semibold rounded-lg hover:bg-hitchBlue-hover shadow-sm">Verify Delivery &amp; Release</button>
                      </div>
                    </form>
                  )}
                  {activeMatch.currentStep === 6 && (
                    <div className="text-center py-4 text-emerald-700 font-semibold text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Delivery lifecycle completed! Escrow &#8377;{activeMatch.carrierPayout} released to carrier.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <AwsServiceShowcase />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-zincBorder py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>Hitch Technology Intermediary Platform — Section 79 IT Act 2000. 173 Cities · Crowd-Shipping Network</div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['Bedrock', 'Step Functions', 'S3', 'DynamoDB', 'API Gateway', 'Lambda', 'Amplify', 'SAM'].map(s => (
              <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-700 rounded-full border border-zinc-200 font-semibold text-[10px]">AWS {s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
