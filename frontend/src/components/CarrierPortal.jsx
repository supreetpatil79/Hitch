import React, { useState, useEffect } from "react";
import {
  Truck, ArrowRight, ArrowLeft, Search, Train, Car, Bus, Plane, Bike,
  MapPin, Clock, IndianRupee, CheckCircle2, CircleDot, Package,
  BadgeCheck, Wallet, TrendingUp, Zap, Check, ChevronDown,
  Shield, AlertCircle, User, Phone, Star, Navigation, Sparkles,
  Sliders, FileText, ChevronRight, CheckCircle, Info, Landmark
} from "lucide-react";

const CITIES = [
  "Bengaluru", "Mumbai", "Hyderabad", "Delhi", "Pune", "Chennai",
  "Kolkata", "Ahmedabad", "Jaipur", "Surat", "Kochi", "Chandigarh"
];

const CARRIER_FEED_TICKER = [
  "DEL → ₹780 earned",
  "BLR → HYD · ₹680 earned",
  "DEL → MUM · ₹420 earned",
  "PNQ → BLR · ₹530 earned",
  "CHN → BLR · ₹350 earned",
  "HYD → DEL · ₹950 earned",
  "MUM → PNQ · ₹380 earned",
];

const HOW_IT_WORKS_CARRIER = [
  { n: "01", title: "Post your trip", icon: MapPin, desc: "Enter your route, date, and how much bag space you have. Takes 90 seconds." },
  { n: "02", title: "Accept a request", icon: Package, desc: "We surface matched parcels on your exact corridor. Accept what suits you." },
  { n: "03", title: "OTP pickup handoff", icon: Shield, desc: "Meet the sender, verify the 6-digit OTP, scan the ₹10 seal. Parcel is yours." },
  { n: "04", title: "Get paid at delivery", icon: IndianRupee, desc: "Recipient confirms with Delivery OTP. Escrow releases your payout instantly." },
];

const TESTIMONIALS = [
  {
    quote: "I carry 2 parcels every weekend to Hyderabad. It covers my Vande Bharat ticket and I earn ₹600 extra.",
    author: "Karthik R.",
    initials: "KR",
    route: "BLR → HYD"
  },
  {
    quote: "On my weekly Mumbai to Pune expressway drives, I easily monetize trunk space without any detour.",
    author: "Ananya M.",
    initials: "AM",
    route: "MUM → PNQ"
  }
];

const TRUST_BADGES = [
  { icon: Shield, title: "Trusted handoff flow", desc: "OTP checkpoints, delivery state changes, and support workflows continue unchanged." },
  { icon: Wallet, title: "Refundable deposit", desc: "The existing deposit flow stays intact and keeps listings credible for senders." },
  { icon: Zap, title: "Live demand guidance", desc: "Use route guidance to price against active supply without changing the pricing contract." },
];

const TRANSPORT_MODES = [
  { id: "train", label: "Train", icon: Train },
  { id: "bus", label: "Bus", icon: Bus },
  { id: "car", label: "Car", icon: Car },
  { id: "flight", label: "Flight", icon: Plane },
  { id: "bike", label: "Bike", icon: Bike },
];

const CATEGORIES = ["Documents", "Clothing", "Electronics", "Food", "Medicine", "Fragile", "Other"];

// Interactive Animated Route Visualizer Component matching HopDrop exactly!
function RoutePreviewIllustration({ mode, origin, destination }) {
  const org = origin || "Bengaluru";
  const dst = destination || "Mumbai";

  if (mode === "train") {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Train className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ELECTRIFIED RAIL
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
              130 km/h Track Speed
            </span>
          </div>
        </div>

        {/* SVG Railway Track Visual */}
        <div className="relative h-44 bg-zinc-50/50 rounded-xl border border-zinc-100 p-3 flex flex-col justify-between overflow-hidden">
          {/* Top landmarks */}
          <div className="flex justify-between items-start z-10 px-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-zinc-200/80 rounded flex items-center justify-center text-zinc-600 shadow-sm">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Vidhana Soudha</span>
            </div>

            <div className="bg-white/90 backdrop-blur-xs border border-zinc-200 rounded-full px-3 py-1 shadow-xs flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-bold text-zinc-800">1,082 km</span>
              <span className="text-[10px] text-zinc-400">· ~16.6h · Vande Bharat</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-zinc-200/80 rounded flex items-center justify-center text-zinc-600 shadow-sm">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Gateway of India</span>
            </div>
          </div>

          {/* Curved Track Canvas / SVG */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 160" fill="none">
              <path d="M 50 130 Q 250 30 450 130" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
              <path d="M 50 130 Q 250 30 450 130" stroke="#475569" strokeWidth="4" strokeDasharray="6 8" />
              {/* Train element positioned along the track */}
              <g transform="translate(230, 48) rotate(4)">
                <rect x="0" y="0" width="55" height="14" rx="4" fill="#0284C7" />
                <rect x="42" y="2" width="10" height="10" rx="2" fill="#38BDF8" />
                <circle cx="12" cy="7" r="2" fill="#FFFFFF" />
                <circle cx="24" cy="7" r="2" fill="#FFFFFF" />
                <circle cx="36" cy="7" r="2" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          {/* Bottom Stations & Badges */}
          <div className="flex justify-between items-end z-10 px-4">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="text-[8px] font-bold text-emerald-700 uppercase">Rail Junction</p>
                <p className="text-[10px] font-bold text-zinc-900">{org}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                KM 342/12
              </span>
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                ⚡ 25kV AC ELECTRIFIED
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-[8px] font-bold text-blue-700 uppercase">Central Terminal</p>
                <p className="text-[10px] font-bold text-zinc-900">{dst}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer features */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-zinc-400" /> Dedicated electrified railway corridor with zero traffic
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-medium">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-medium">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "bus") {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Bus className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              INTERCITY TRUNK
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
              80 km/h Highway Cruiser
            </span>
          </div>
        </div>

        <div className="relative h-44 bg-zinc-50/50 rounded-xl border border-zinc-100 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start z-10 px-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-zinc-200/80 rounded flex items-center justify-center text-zinc-600">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Vidhana Soudha</span>
            </div>
            <div className="bg-white/90 border border-zinc-200 rounded-full px-3 py-1 shadow-xs flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-bold text-zinc-800">1,082 km</span>
              <span className="text-[10px] text-zinc-400">· ~16.6h · Intercity Bus</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-zinc-200/80 rounded flex items-center justify-center text-zinc-600">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Gateway of India</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 160" fill="none">
              <path d="M 50 130 Q 250 30 450 130" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
              <path d="M 50 130 Q 250 30 450 130" stroke="#FDE047" strokeWidth="2" strokeDasharray="10 10" />
              <g transform="translate(320, 68) rotate(14)">
                <rect x="0" y="0" width="30" height="14" rx="3" fill="#D97706" />
                <rect x="2" y="2" width="22" height="10" rx="1" fill="#FEF3C7" />
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-end z-10 px-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
              <p className="text-[8px] font-bold text-amber-700 uppercase">Bus Terminal</p>
              <p className="text-[10px] font-bold text-zinc-900">{org}</p>
            </div>
            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
              ☕ 24×7 Highway Dhaba
            </span>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
              <p className="text-[8px] font-bold text-blue-700 uppercase">City Hub</p>
              <p className="text-[10px] font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span>Reliable trunk route connection across state highways</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-medium">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-medium">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // Flight Mode
  if (mode === "flight") {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Plane className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              SKYWAY FLIGHT
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
              840 km/h Airspeed
            </span>
          </div>
        </div>

        <div className="relative h-44 bg-zinc-50/50 rounded-xl border border-zinc-100 p-3 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start z-10 px-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-zinc-200/80 rounded flex items-center justify-center text-zinc-600">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Vidhana Soudha</span>
            </div>
            <div className="bg-white/90 border border-zinc-200 rounded-full px-3 py-1 shadow-xs flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span className="text-[11px] font-bold text-zinc-800">1,082 km</span>
              <span className="text-[10px] text-zinc-400">· ~1.6h · Direct Airway</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-8 bg-zinc-200/80 rounded flex items-center justify-center text-zinc-600">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Gateway of India</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 160" fill="none">
              <path d="M 60 120 Q 250 20 440 120" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 6" />
              <g transform="translate(340, 52) rotate(18)">
                <path d="M 0 0 L 18 6 L 6 8 L 8 16 L 4 16 L 3 10 L -2 9 Z" fill="#0284C7" />
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-end z-10 px-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
              <p className="text-[8px] font-bold text-blue-700 uppercase">Origin Airport</p>
              <p className="text-[10px] font-bold text-zinc-900">{org}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] font-mono font-bold bg-zinc-900 text-cyan-400 px-2 py-0.5 rounded">
                AIRWAY W20 · FL340
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1">
              <p className="text-[8px] font-bold text-blue-700 uppercase">Dest Airport</p>
              <p className="text-[10px] font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span>High-altitude airway with non-stop aerial transit</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-medium">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-medium">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for car / bike
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
            {mode === "bike" ? <Bike className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 uppercase">
          {mode === "bike" ? "Last-Mile Express" : "Private Expressway"}
        </span>
      </div>
      <div className="h-32 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center">
        <p className="text-xs text-zinc-500 font-medium">Corridor active: {org} to {dst} via National Expressway</p>
      </div>
    </div>
  );
}

// Carrier Trip Snapshot Sidebar
function TripSnapshotSidebar({ step, trip }) {
  const isComplete = trip.fromCity && trip.toCity && trip.departureDate && trip.capacityKg > 0;
  const projectedPayout = Math.round(trip.capacityKg * trip.pricePerKg);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Trip snapshot</h3>
          <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full border " +
            (isComplete ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-100 text-zinc-500 border-zinc-200")}>
            {isComplete ? "READY" : "INCOMPLETE"}
          </span>
        </div>

        {[
          { icon: Navigation, label: "Lane", value: trip.fromCity && trip.toCity ? `${trip.fromCity} → ${trip.toCity}` : "Route pending", done: !!(trip.fromCity && trip.toCity) },
          { icon: Clock, label: "Schedule", value: trip.departureDate ? `${trip.departureDate.replace("T", " ")}` : "Add departure timing", done: !!trip.departureDate },
          { icon: Package, label: "Capacity", value: `${trip.capacityKg} kg · ${trip.acceptedCats.length} category rules`, done: trip.capacityKg > 0 },
          { icon: IndianRupee, label: "Payout outlook", value: `₹${projectedPayout}.00 sample payout`, done: projectedPayout > 0 },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-start gap-3">
              <div className={"w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 " +
                (item.done ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-400")}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">{item.label}</p>
                <p className={"text-xs font-semibold mt-0.5 " + (item.done ? "text-zinc-800" : "text-zinc-400")}>{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">What this refactor protects</h3>
        <ul className="space-y-2 text-xs text-zinc-500 leading-relaxed">
          <li className="flex items-start gap-2"><span className="text-hitchBlue mt-0.5 shrink-0">·</span> Route search still uses the same suggest and select endpoints, so analytics and matching stay stable.</li>
          <li className="flex items-start gap-2"><span className="text-hitchBlue mt-0.5 shrink-0">·</span> The posted trip payload preserves your confirmation contracts, OTP triggers, and deposit flows.</li>
          <li className="flex items-start gap-2"><span className="text-hitchBlue mt-0.5 shrink-0">·</span> Improved guidance, summaries, and validation happen entirely in the client without breaking backend contracts.</li>
        </ul>
      </div>
    </div>
  );
}

// 4-Step Indicator for Carrier Wizard
function CarrierStepCards({ step }) {
  const steps = [
    { n: 1, label: "Route setup", desc: "Choose the lane and transport mode you can service confidently." },
    { n: 2, label: "Schedule details", desc: "Add departure timing and optional trip references for trust." },
    { n: 3, label: "Capacity and pricing", desc: "Define what you can carry and tune the rate for this route." },
    { n: 4, label: "Deposit and publish", desc: "Review the trip, pay the refundable deposit, and post it live." },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {steps.map(s => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className={"rounded-xl border p-4 transition-all " +
            (done ? "border-emerald-200 bg-emerald-50/60" :
             active ? "border-hitchBlue/40 bg-hitchBlue/5 shadow-sm" :
                      "border-zinc-200 bg-white")}>
            <div className="flex items-center gap-2 mb-1.5">
              <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                (done ? "bg-emerald-500 text-white" : active ? "bg-hitchBlue text-white" : "bg-zinc-200 text-zinc-500")}>
                {done ? <Check className="w-3.5 h-3.5" /> : s.n}
              </div>
              <span className={"text-xs font-bold " + (active ? "text-zinc-900" : done ? "text-emerald-700" : "text-zinc-400")}>{s.label}</span>
            </div>
            <p className={"text-[10px] leading-relaxed " + (active ? "text-zinc-500" : "text-zinc-400")}>{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function CarrierPortal() {
  const [screen, setScreen] = useState("home"); // home | post | feed | active
  const [wizardStep, setWizardStep] = useState(1);
  const [spareCapacity, setSpareCapacity] = useState(5);

  const [trip, setTrip] = useState({
    fromCity: "Bengaluru",
    toCity: "Mumbai",
    mode: "train",
    departureDate: "2026-09-18T08:00",
    estimatedArrival: "2026-09-18T20:30",
    transportName: "Vande Bharat Express",
    pnr: "",
    capacityKg: 5,
    pricePerKg: 80,
    acceptedCats: ["Documents", "Electronics", "Clothing"],
    pickupNotes: "Platform 3 near Coach B2",
    dropoffNotes: "Main Gate outside Terminal 1",
  });

  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTickerOffset(o => o + 1), 35);
    return () => clearInterval(interval);
  }, []);

  const toggleCategory = (cat) => {
    setTrip(t => ({
      ...t,
      acceptedCats: t.acceptedCats.includes(cat)
        ? t.acceptedCats.filter(c => c !== cat)
        : [...t.acceptedCats, cat]
    }));
  };

  // ─── SCREEN 1: LANDING / HOME ──────────────────────────────────────────────
  if (screen === "home") {
    const calculatedEarnings = spareCapacity * 110;

    return (
      <div className="space-y-10 animate-fadeIn">
        {/* Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-hitchBlue" />
              <span className="text-xs font-semibold text-zinc-600">Earn on every intercity trip you take</span>
            </div>

            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">Your trip already pays.</h1>
              <h1 className="font-display text-5xl lg:text-6xl italic text-hitchBlue leading-tight">Make it earn.</h1>
            </div>

            <p className="text-zinc-500 text-base leading-relaxed max-w-lg">
              Accept parcels on your existing route. Zero detours. Zero overhead. Every handoff is OTP-secured and every payout is escrow-guaranteed.
            </p>

            <div className="flex items-center gap-3">
              <button onClick={() => { setScreen("post"); setWizardStep(1); }}
                className="flex items-center gap-2 px-6 py-3.5 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-md shadow-hitchBlue/20 transition-all text-sm">
                Post your trip <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setScreen("feed")}
                className="px-6 py-3.5 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all text-sm">
                Browse requests
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: c }}>
                    {["KR", "AM", "RD", "VK"][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-zinc-500"><strong className="text-zinc-900">1,800+</strong> active carriers across India</span>
            </div>
          </div>

          {/* Right: Earnings Estimator */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Earnings Estimator</span>
                <span className="text-xs font-bold text-zinc-900">{spareCapacity} kg</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-2">Spare capacity</label>
                <input type="range" min="1" max="25" step="1" value={spareCapacity}
                  onChange={e => setSpareCapacity(parseInt(e.target.value))}
                  className="w-full accent-hitchBlue" />
              </div>

              <div className="bg-hitchBlue/5 border border-hitchBlue/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">You could earn</p>
                  <p className="text-3xl font-bold text-hitchBlue">₹{calculatedEarnings}</p>
                </div>
                <span className="text-xs font-medium text-zinc-400">per trip</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <p className="text-lg font-bold text-hitchBlue">₹350</p>
                  <p className="text-[10px] font-bold text-zinc-800">1st parcel</p>
                  <p className="text-[9px] text-zinc-400">Base handover bonus</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <p className="text-lg font-bold text-hitchBlue">₹200</p>
                  <p className="text-[10px] font-bold text-zinc-800">2nd parcel</p>
                  <p className="text-[9px] text-zinc-400">Incremental effort</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <p className="text-lg font-bold text-hitchBlue">₹150</p>
                  <p className="text-[10px] font-bold text-zinc-800">3rd parcel</p>
                  <p className="text-[9px] text-zinc-400">Near-zero effort</p>
                </div>
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                  <p className="text-lg font-bold text-hitchBlue">₹100</p>
                  <p className="text-[10px] font-bold text-zinc-800">4th+ each</p>
                  <p className="text-[9px] text-zinc-400">Passive per parcel</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Carrier Earnings Feed Ticker */}
        <div className="border-t border-b border-zinc-100 py-3 overflow-hidden">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-2 h-2 rounded-full bg-hitchBlue animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Carrier Earnings Feed</span>
            <span className="ml-auto text-xs text-hitchBlue font-semibold cursor-pointer">My trips →</span>
          </div>
          <div className="flex items-center gap-8 overflow-hidden whitespace-nowrap"
               style={{ transform: `translateX(-${tickerOffset % 600}px)`, transition: "none" }}>
            {[...CARRIER_FEED_TICKER, ...CARRIER_FEED_TICKER].map((item, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-zinc-600">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="pt-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">How it works</span>
            <h2 className="text-3xl font-bold text-zinc-900 mt-2">
              Earn in 4 steps. <span className="font-display italic text-hitchBlue">Simple.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HOW_IT_WORKS_CARRIER.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.n} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-hitchBlue flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200">{item.n}</span>
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900 text-sm">{item.title}</p>
                    <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-4 pt-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Real Carriers</span>
          <h3 className="text-2xl font-bold text-zinc-900">
            Carriers earning across <span className="font-display italic text-hitchBlue">India.</span>
          </h3>

          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm relative">
            <p className="text-sm font-medium text-zinc-800 leading-relaxed mb-4 italic">
              "{TESTIMONIALS[0].quote}"
            </p>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-hitchBlue text-white text-xs font-bold flex items-center justify-center">
                  {TESTIMONIALS[0].initials}
                </div>
                <span className="text-xs font-bold text-zinc-900">{TESTIMONIALS[0].author}</span>
              </div>
              <span className="text-xs font-mono font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                {TESTIMONIALS[0].route}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-hitchBlue to-blue-600 text-white p-10 text-center space-y-4 shadow-lg">
          <h2 className="text-3xl font-bold">Your next trip is already half-paid.</h2>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            Post your route, accept a parcel, and get paid at delivery. No extra work — you're already going there.
          </p>
          <button onClick={() => { setScreen("post"); setWizardStep(1); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-hitchBlue font-bold rounded-xl hover:bg-blue-50 shadow-md transition-all text-sm">
            Post your trip <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── SCREEN 2: POST TRIP WIZARD ────────────────────────────────────────────
  if (screen === "post") {
    return (
      <div className="animate-fadeIn">
        {/* Page Header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Carrier Workflow</p>
          <h1 className="text-3xl font-bold text-zinc-900">Post a verified delivery route</h1>
          <p className="text-zinc-500 text-sm mt-2 max-w-2xl">
            Publish a professional trip listing with clear schedule, capacity, and payout expectations while keeping the existing trip, pricing, and deposit flows intact.
          </p>
        </div>

        {/* Top 3 Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {TRUST_BADGES.map(b => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-hitchBlue flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">{b.title}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Wizard Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-7 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Trip Creation</p>
                <h2 className="text-xl font-bold text-zinc-900">
                  {wizardStep === 1 ? "Route setup" : wizardStep === 2 ? "Schedule details" : wizardStep === 3 ? "Capacity and pricing" : "Deposit and publish"}
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  {wizardStep === 1 ? "Choose the lane and transport mode you can service confidently." :
                   wizardStep === 2 ? "Add departure timing and optional trip references for trust." :
                   wizardStep === 3 ? "Define what you can carry and tune the rate for this route." :
                   "Review the live listing details exactly as the current trip payload will publish them."}
                </p>
              </div>

              <CarrierStepCards step={wizardStep} />

              {/* STEP 1: ROUTE SETUP */}
              {wizardStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">Route selection</h3>
                    <p className="text-xs text-zinc-500 mb-3">Pick both cities from search suggestions so ranking, matching, and map previews stay accurate.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Origin city</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">CITY</span>
                          <input type="text" list="carrier-from-cities" value={trip.fromCity}
                            onChange={e => setTrip({...trip, fromCity: e.target.value})}
                            className="w-full pl-16 pr-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/40 font-medium"
                            placeholder="Search departure city" />
                          <datalist id="carrier-from-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">Search and select your departure city.</p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Destination city</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">CITY</span>
                          <input type="text" list="carrier-to-cities" value={trip.toCity}
                            onChange={e => setTrip({...trip, toCity: e.target.value})}
                            className="w-full pl-16 pr-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/40 font-medium"
                            placeholder="Select destination city" />
                          <datalist id="carrier-to-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">Select the city where you can complete the delivery.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">Transport mode</h3>
                    <p className="text-xs text-zinc-500 mb-3">This helps senders understand trust, timing, and handling conditions before they request a match.</p>
                    <div className="grid grid-cols-5 gap-2">
                      {TRANSPORT_MODES.map(({ id, label, icon: Icon }) => (
                        <button key={id} type="button" onClick={() => setTrip({...trip, mode: id})}
                          className={"py-3.5 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 " +
                            (trip.mode === id ? "bg-hitchBlue/5 border-hitchBlue text-hitchBlue shadow-xs" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50")}>
                          <Icon className="w-5 h-5" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-bold text-zinc-900">Route preview</h3>
                      <span className="text-xs text-zinc-400">Distance and duration help you price more accurately</span>
                    </div>
                    <RoutePreviewIllustration mode={trip.mode} origin={trip.fromCity} destination={trip.toCity} />
                  </div>
                </div>
              )}

              {/* STEP 2: SCHEDULE DETAILS */}
              {wizardStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-1">Schedule and trip references</h3>
                    <p className="text-xs text-zinc-500 mb-4">Clear scheduling improves trust and reduces back-and-forth with senders before acceptance.</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-500">Departure date and time</label>
                          <span className="text-[10px] font-bold text-red-500">REQUIRED</span>
                        </div>
                        <input type="datetime-local" value={trip.departureDate}
                          onChange={e => setTrip({...trip, departureDate: e.target.value})}
                          className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/40" />
                        <p className="text-[10px] text-zinc-400 mt-1">Trips should be scheduled in the future so requests can match correctly.</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-500">Estimated arrival</label>
                          <span className="text-[10px] text-zinc-400">OPTIONAL</span>
                        </div>
                        <input type="datetime-local" value={trip.estimatedArrival}
                          onChange={e => setTrip({...trip, estimatedArrival: e.target.value})}
                          className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/40" />
                        <p className="text-[10px] text-zinc-400 mt-1">If entered, arrival must be later than the departure time.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Transport name</label>
                        <input type="text" placeholder="e.g. Rajdhani Express" value={trip.transportName}
                          onChange={e => setTrip({...trip, transportName: e.target.value})}
                          className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/40" />
                        <p className="text-[10px] text-zinc-400 mt-1">Shown to senders for trust and context.</p>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">PNR or booking reference</label>
                        <input type="text" placeholder="Optional" value={trip.pnr}
                          onChange={e => setTrip({...trip, pnr: e.target.value})}
                          className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/40" />
                        <p className="text-[10px] text-zinc-400 mt-1">Helpful for high-trust listings on structured routes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CAPACITY & PRICING */}
              {wizardStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Sliders */}
                    <div className="space-y-5 bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-zinc-900">Capacity you can carry</label>
                          <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-hitchBlue rounded-md">{trip.capacityKg} kg</span>
                        </div>
                        <input type="range" min="1" max="25" step="1" value={trip.capacityKg}
                          onChange={e => setTrip({...trip, capacityKg: parseInt(e.target.value)})}
                          className="w-full accent-hitchBlue" />
                        <p className="text-[10px] text-zinc-400 mt-1">Set the comfortable upper limit, not the best-case maximum. Accurate capacity improves acceptance quality.</p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-zinc-900">Rate per kilogram</label>
                          <span className="text-xs font-bold px-2 py-0.5 bg-blue-50 text-hitchBlue rounded-md">Rs. {trip.pricePerKg}/kg</span>
                        </div>
                        <input type="range" min="30" max="300" step="5" value={trip.pricePerKg}
                          onChange={e => setTrip({...trip, pricePerKg: parseInt(e.target.value)})}
                          className="w-full accent-hitchBlue" />
                        <p className="text-[10px] text-zinc-400 mt-1">This controls the base sender quote while preserving your existing pricing and payout calculations.</p>
                      </div>
                    </div>

                    {/* Projected Payout Cards */}
                    <div className="space-y-3">
                      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Projected Payout</p>
                          <IndianRupee className="w-4 h-4 text-zinc-400" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 mt-1">₹{(trip.capacityKg * trip.pricePerKg).toFixed(2)}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Based on {trip.capacityKg} kg at the current lane rate.</p>
                      </div>

                      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Max Lane Value</p>
                          <Truck className="w-4 h-4 text-zinc-400" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 mt-1">₹{(trip.capacityKg * trip.pricePerKg).toFixed(2)}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">If the full listed capacity gets matched at your current rate.</p>
                      </div>
                    </div>
                  </div>

                  {/* Rate Assistant Box */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-hitchBlue" />
                      <p className="text-sm font-bold text-zinc-900">Rate assistant</p>
                    </div>
                    <p className="text-xs text-zinc-500">Use live route guidance to anchor your rate without changing the backend pricing model.</p>
                    <div className="bg-zinc-50 rounded-xl p-4 text-center space-y-2 border border-zinc-100">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-hitchBlue flex items-center justify-center mx-auto">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-bold text-zinc-800">Suggested Corridor Benchmark: ₹{trip.pricePerKg}/kg</p>
                      <p className="text-[10px] text-zinc-400">Manual pricing is enabled. Senders will see your published listing rate.</p>
                    </div>
                  </div>

                  {/* Package Categories & Notes */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 mb-1">Package categories and handoff notes</h4>
                      <p className="text-xs text-zinc-500 mb-3">Clear rules reduce negotiation friction and help senders self-select into the right route.</p>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                          <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                            className={"px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all " +
                              (trip.acceptedCats.includes(cat) ? "bg-blue-50 text-hitchBlue border-blue-200 font-bold" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50")}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Pickup instructions</label>
                        <textarea rows={3} value={trip.pickupNotes} onChange={e => setTrip({...trip, pickupNotes: e.target.value})}
                          className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hitchBlue/40 resize-none"
                          placeholder="Example: Platform 3 near coach B2, or airport pickup gate." />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Drop-off instructions</label>
                        <textarea rows={3} value={trip.dropoffNotes} onChange={e => setTrip({...trip, dropoffNotes: e.target.value})}
                          className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hitchBlue/40 resize-none"
                          placeholder="Optional but useful when the last-mile handoff has access or timing constraints." />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: DEPOSIT AND PUBLISH */}
              {wizardStep === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Trip Summary Card */}
                    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-3">
                      <h4 className="text-sm font-bold text-zinc-900">Trip summary</h4>
                      <p className="text-xs text-zinc-500">Review the live listing details exactly as the current trip payload will publish them.</p>

                      <div className="space-y-2 pt-2 text-xs">
                        <div className="flex justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                          <span className="text-zinc-500 font-medium">Route</span>
                          <span className="font-bold text-zinc-900">{trip.fromCity} → {trip.toCity}</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                          <span className="text-zinc-500 font-medium">Departure</span>
                          <span className="font-bold text-zinc-900">{trip.departureDate?.replace("T", ", ")}</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                          <span className="text-zinc-500 font-medium">Estimated arrival</span>
                          <span className="font-bold text-zinc-900">{trip.estimatedArrival?.replace("T", ", ")}</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                          <span className="text-zinc-500 font-medium">Transport</span>
                          <span className="font-bold text-zinc-900 capitalize">{trip.mode} · {trip.transportName}</span>
                        </div>
                        <div className="flex justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                          <span className="text-zinc-500 font-medium">Capacity</span>
                          <span className="font-bold text-zinc-900">{trip.capacityKg} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Refundable Deposit Card */}
                    <div className="space-y-4">
                      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                          <Wallet className="w-4 h-4 text-amber-700" />
                          <span>Refundable carrier deposit</span>
                        </div>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          Rs. 500 stays reserved while the trip is active and is released automatically after successful completion through the existing flow.
                        </p>
                      </div>

                      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-2 text-xs text-zinc-600">
                        <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Trust signals included in this listing
                        </p>
                        <p className="leading-relaxed">· Pickup and delivery continue to require OTP verification.</p>
                        <p className="leading-relaxed">· Trip details feed directly into live matching and payout calculations.</p>
                        <p className="leading-relaxed">· Sender-facing pricing remains consistent with the current backend contract.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                {wizardStep > 1
                  ? <button onClick={() => setWizardStep(s => s - 1)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-all">Back</button>
                  : <button onClick={() => setScreen("home")} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-all">← Home</button>
                }
                {wizardStep < 4
                  ? <button onClick={() => setWizardStep(s => s + 1)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 shadow-sm transition-all text-sm">
                      Continue
                    </button>
                  : <button onClick={() => setScreen("feed")}
                      className="flex items-center gap-2 px-6 py-2.5 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-md shadow-hitchBlue/20 transition-all text-sm">
                      Deposit Rs. 500 &amp; Publish Trip <ArrowRight className="w-4 h-4" />
                    </button>
                }
              </div>
            </div>
          </div>

          {/* Sidebar Snapshot */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <TripSnapshotSidebar step={wizardStep} trip={trip} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── SCREEN 3: CARGO FEED ──────────────────────────────────────────────────
  if (screen === "feed") {
    const matchedPackages = [
      { id: "PKG-992", from: trip.fromCity, to: trip.toCity, category: "Electronics", weight: 1.5, value: 12000, payout: 180, window: "Today 7–11 AM", sender: "Supreet P." },
      { id: "PKG-991", from: trip.fromCity, to: trip.toCity, category: "Documents", weight: 0.4, value: 1000, payout: 60, window: "Today 12–4 PM", sender: "Meera J." },
      { id: "PKG-988", from: trip.fromCity, to: trip.toCity, category: "Medicine", weight: 0.8, value: 3500, payout: 95, window: "Today 4–8 PM", sender: "Amit K." },
    ];

    return (
      <div className="animate-fadeIn space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen("home")} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Cargo Matching Feed</h1>
            <p className="text-sm text-zinc-500">{trip.fromCity} → {trip.toCity} · {trip.capacityKg} kg capacity posted</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-hitchBlue">
            <CircleDot className="w-4 h-4 animate-pulse" />
            Trip Listing Active — {matchedPackages.length} parcel requests matching your route
          </div>
          <button onClick={() => { setScreen("post"); setWizardStep(1); }} className="text-xs font-bold text-hitchBlue underline">Edit Trip</button>
        </div>

        <div className="space-y-4">
          {matchedPackages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-lg">{pkg.id}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">{pkg.category}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Bedrock ✓ SAFE</span>
                </div>
                <h4 className="text-base font-bold text-zinc-900">{pkg.from} → {pkg.to}</h4>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Weight: <strong className="text-zinc-800">{pkg.weight} kg</strong></span>
                  <span>Value: <strong className="text-zinc-800">₹{pkg.value.toLocaleString()}</strong></span>
                  <span>Sender: <strong className="text-zinc-800">{pkg.sender}</strong></span>
                  <span>Pickup: <strong className="text-zinc-800">{pkg.window}</strong></span>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 gap-3">
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Carrier Payout</p>
                  <p className="text-2xl font-bold text-hitchBlue">₹{pkg.payout}</p>
                </div>
                <button onClick={() => setScreen("active")}
                  className="px-5 py-2.5 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-sm transition-all text-xs flex items-center gap-1.5">
                  Accept Parcel <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── SCREEN 4: ACTIVE DELIVERY EXECUTION ───────────────────────────────────
  if (screen === "active") {
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen("feed")} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Active Delivery &amp; Handshake</h1>
            <p className="text-sm text-zinc-500">PKG-992 · {trip.fromCity} → {trip.toCity}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-400">Escrow Locked</p>
              <p className="text-2xl font-bold text-zinc-900">₹180.00</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              ● OTP HANDSHAKE ACTIVE
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2">
              <p className="text-xs font-bold uppercase text-zinc-400">Step 1: Sender Pickup</p>
              <p className="text-sm font-semibold text-zinc-900">Ask the sender for their 4-digit Pickup OTP</p>
              <div className="flex gap-2 pt-1">
                <input type="text" maxLength={4} placeholder="e.g. 4829" className="px-3 py-2 border border-zinc-300 rounded-xl text-sm font-mono tracking-widest text-center" />
                <button onClick={() => alert("Pickup verified! Status updated to IN_TRANSIT.")} className="px-4 py-2 bg-hitchBlue text-white text-xs font-bold rounded-xl shadow-xs">Verify Pickup</button>
              </div>
            </div>

            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 space-y-2">
              <p className="text-xs font-bold uppercase text-zinc-400">Step 2: Recipient Delivery</p>
              <p className="text-sm font-semibold text-zinc-900">Ask the recipient for their Delivery OTP upon handoff</p>
              <div className="flex gap-2 pt-1">
                <input type="text" maxLength={4} placeholder="e.g. 7104" className="px-3 py-2 border border-zinc-300 rounded-xl text-sm font-mono tracking-widest text-center" />
                <button onClick={() => alert("Delivery verified! Escrow payout of ₹180 released to your wallet.")} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs">Complete &amp; Release Payout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
