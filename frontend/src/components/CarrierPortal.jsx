import React, { useState } from "react";
import {
  Truck, ArrowRight, ArrowLeft, Search, Train, Car, Bus, Plane, Bike,
  MapPin, Clock, IndianRupee, CheckCircle2, CircleDot, Package,
  BadgeCheck, Wallet, TrendingUp, Zap, Check, ChevronDown,
  Shield, AlertCircle, User, Phone, Star, Navigation
} from "lucide-react";

const CITIES = ["Mumbai","Pune","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Ahmedabad","Jaipur","Surat","Kochi","Chandigarh"];
const TERMINALS = {
  "Mumbai": ["Dadar Station","CST Station","Bandra Terminus","LTT Station"],
  "Pune": ["Shivajinagar Station","Pune Junction"],
  "Bengaluru": ["KSR (Majestic)","Yeshvanthpur","KEMPEGOWDA ISBT"],
  "Hyderabad": ["Secunderabad Junction","Kacheguda","Hyderabad Deccan"],
  "Delhi": ["New Delhi Station","H. Nizamuddin","ISBT Kashmere Gate"],
  "default": ["Main Railway Station","Central Bus Terminal"],
};
const getTerm = (city) => TERMINALS[city] || TERMINALS["default"];

const TRANSPORT_MODES = [
  { id:"train",  label:"Train",  icon: Train },
  { id:"bus",    label:"Bus",    icon: Bus },
  { id:"car",    label:"Car",    icon: Car },
  { id:"flight", label:"Flight", icon: Plane },
  { id:"bike",   label:"Bike",   icon: Bike },
];

const CARGO_FEED = [
  { id:"PKG-992", from:"Mumbai", to:"Pune", category:"Electronics", weight:1.5, value:12000, payout:180, window:"Today 7–11 AM", bedrock:"SAFE" },
  { id:"PKG-991", from:"Mumbai", to:"Pune", category:"Documents",   weight:0.4, value:1000,  payout:60,  window:"Today 12–4 PM", bedrock:"SAFE" },
  { id:"PKG-988", from:"Mumbai", to:"Pune", category:"Medicine",    weight:0.8, value:3500,  payout:95,  window:"Today 4–8 PM", bedrock:"SAFE" },
];

const CAT_COLORS = {
  Electronics: "bg-violet-50 text-violet-700 border-violet-200",
  Documents:   "bg-blue-50 text-blue-700 border-blue-200",
  Medicine:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Clothing:    "bg-pink-50 text-pink-700 border-pink-200",
  Food:        "bg-amber-50 text-amber-700 border-amber-200",
  Fragile:     "bg-red-50 text-red-700 border-red-200",
};

const ACCPETED_CATS = ["Documents","Clothing","Electronics","Medicine"];

export default function CarrierPortal() {
  const [screen, setScreen] = useState("post"); // post | feed | active
  const [trip, setTrip] = useState({
    fromCity: "Mumbai", fromTerminal: "Dadar Station",
    toCity: "Pune",   toTerminal: "Shivajinagar Station",
    date: "", time: "", mode: "train",
    pnr: "", capacityKg: 8, pricePerKg: 60,
    acceptedCats: ["Documents","Clothing","Electronics"],
  });
  const [acceptedPkg, setAcceptedPkg] = useState(null);
  const [phase, setPhase] = useState(1); // 1 pickup | 2 transit | 3 delivery
  const [pickupOtp, setPickupOtp] = useState("");
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const [pickupVerified, setPickupVerified] = useState(false);
  const [deliveryVerified, setDeliveryVerified] = useState(false);
  const [serialInput, setSerialInput] = useState("");
  const CORRECT_SERIAL = "5AC 123456";
  const PICKUP_OTP_CORRECT = "4829";
  const DELIVERY_OTP_CORRECT = "7104";

  const toggleCat = (cat) => setTrip(t => ({
    ...t, acceptedCats: t.acceptedCats.includes(cat)
      ? t.acceptedCats.filter(c => c !== cat)
      : [...t.acceptedCats, cat]
  }));

  const estimatedEarnings = Math.round(trip.capacityKg * trip.pricePerKg * 0.88);

  // ─── POST TRIP ─────────────────────────────────────────────────────────────
  if (screen === "post") return (
    <div className="animate-fadeIn space-y-8">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-hitchBlue to-blue-700 text-white px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Carrier Network</span>
          </div>
          <h1 className="font-display text-4xl mb-2">Monetize Your Journey</h1>
          <p className="text-blue-100 text-base">Earn by carrying parcels on your existing intercity trips.</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-8 py-5 text-center shrink-0">
          <p className="text-xs font-bold text-blue-100 uppercase mb-1">Est. Per Trip</p>
          <p className="text-4xl font-bold">&#8377;{estimatedEarnings}</p>
          <p className="text-blue-200 text-xs mt-1">{trip.capacityKg}kg @ &#8377;{trip.pricePerKg}/kg</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zincBorder shadow-sm p-7 space-y-6">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2"><Navigation className="w-4 h-4 text-hitchBlue" /> Trip Route</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">From City</label>
              <select value={trip.fromCity} onChange={e => setTrip({...trip, fromCity: e.target.value, fromTerminal: getTerm(e.target.value)[0]})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50 bg-zinc-50">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Departure Terminal</label>
              <select value={trip.fromTerminal} onChange={e => setTrip({...trip, fromTerminal: e.target.value})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50 bg-zinc-50">
                {getTerm(trip.fromCity).map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">To City</label>
              <select value={trip.toCity} onChange={e => setTrip({...trip, toCity: e.target.value, toTerminal: getTerm(e.target.value)[0]})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50 bg-zinc-50">
                {CITIES.filter(c => c !== trip.fromCity).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Arrival Terminal</label>
              <select value={trip.toTerminal} onChange={e => setTrip({...trip, toTerminal: e.target.value})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50 bg-zinc-50">
                {getTerm(trip.toCity).map(h => <option key={h}>{h}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Departure Date</label>
              <input type="date" value={trip.date} onChange={e => setTrip({...trip, date: e.target.value})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50 bg-zinc-50" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Departure Time</label>
              <input type="time" value={trip.time} onChange={e => setTrip({...trip, time: e.target.value})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50 bg-zinc-50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Mode of Travel</label>
            <div className="grid grid-cols-5 gap-2">
              {TRANSPORT_MODES.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setTrip({...trip, mode: id})}
                  className={"py-3 rounded-xl text-[10px] font-bold uppercase border transition-all flex flex-col items-center gap-1.5 " +
                    (trip.mode === id ? "bg-hitchBlue text-white border-hitchBlue shadow-sm" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100")}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Train Name / PNR / Bus Operator (optional)</label>
            <input type="text" placeholder="e.g. Vande Bharat 22220 or PNR 123456789" value={trip.pnr}
              onChange={e => setTrip({...trip, pnr: e.target.value})}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchBlue/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Available Weight: {trip.capacityKg}kg</label>
              <input type="range" min="1" max="25" step="0.5" value={trip.capacityKg}
                onChange={e => setTrip({...trip, capacityKg: parseFloat(e.target.value)})}
                className="w-full accent-hitchBlue mt-2" />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1"><span>1kg</span><span>25kg</span></div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Price Per kg (&#8377;)</label>
              <input type="number" value={trip.pricePerKg} min="20" max="500"
                onChange={e => setTrip({...trip, pricePerKg: parseInt(e.target.value)||0})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchBlue/50" />
              <p className="text-[10px] text-zinc-400 mt-1">Suggested: &#8377;60/kg for your route</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Accepted Package Categories</label>
            <div className="flex flex-wrap gap-2">
              {ACCPETED_CATS.map(cat => (
                <button key={cat} type="button" onClick={() => toggleCat(cat)}
                  className={"flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all " +
                    (trip.acceptedCats.includes(cat) ? "bg-hitchBlue text-white border-hitchBlue" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100")}>
                  {trip.acceptedCats.includes(cat) && <Check className="w-3 h-3" />}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setScreen("feed")}
            className="w-full py-3.5 bg-hitchBlue text-white font-bold rounded-xl hover:bg-hitchBlue-hover shadow-lg shadow-hitchBlue/25 transition-all flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Publish Trip &amp; Find Cargo
          </button>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm">Earnings Breakdown</h3>
            {[
              ["Available Capacity", `${trip.capacityKg} kg`],
              ["Rate Per kg", `&#8377;${trip.pricePerKg}`],
              ["Gross Per Trip", `&#8377;${trip.capacityKg * trip.pricePerKg}`],
              ["Platform Take (12%)", `-&#8377;${Math.round(trip.capacityKg * trip.pricePerKg * 0.12)}`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-zinc-500">{l}</span>
                <span className="font-semibold text-zinc-900" dangerouslySetInnerHTML={{__html: v}} />
              </div>
            ))}
            <div className="flex justify-between text-base font-bold border-t border-zinc-100 pt-3">
              <span>Your Payout</span>
              <span className="text-hitchBlue">&#8377;{estimatedEarnings}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-3">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500" /> Your Carrier Profile</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hitchBlue to-blue-700 flex items-center justify-center text-white font-bold text-lg">R</div>
              <div>
                <p className="font-bold text-zinc-900 text-sm">Rahul Verma</p>
                <div className="flex items-center gap-1.5 text-xs">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">4.9</span>
                  <span className="text-zinc-400">· 143 trips</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-800">Aadhaar Verified ✓</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                <p className="text-xl font-bold text-hitchBlue">&#8377;42,300</p>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase font-bold">Total Earned</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                <p className="text-xl font-bold text-hitchBlue">143</p>
                <p className="text-[10px] text-zinc-400 mt-0.5 uppercase font-bold">Deliveries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── CARGO FEED ────────────────────────────────────────────────────────────
  if (screen === "feed") return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen("post")} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
          <ArrowLeft className="w-4 h-4 text-zinc-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Cargo Matching Feed</h1>
          <p className="text-sm text-zinc-500">{trip.fromCity} → {trip.toCity} · {trip.capacityKg}kg available · Your trip</p>
        </div>
      </div>

      <div className="bg-hitchBlue/5 border border-hitchBlue/20 rounded-xl px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-hitchBlue">
          <CircleDot className="w-4 h-4 animate-pulse" />
          Trip Published — {CARGO_FEED.length} cargo requests match your corridor
        </div>
        <span className="text-xs text-zinc-400">Live · updates every 30s</span>
      </div>

      <div className="space-y-4">
        {CARGO_FEED.map(pkg => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-zincBorder shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-lg">{pkg.id}</span>
                  <span className={"text-xs font-semibold px-2 py-0.5 rounded-lg border " + (CAT_COLORS[pkg.category] || "bg-zinc-50 text-zinc-600 border-zinc-200")}>{pkg.category}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200">Bedrock ✓ SAFE</span>
                </div>
                <h4 className="font-bold text-zinc-900">{pkg.from} → {pkg.to}</h4>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span>Weight: <strong className="text-zinc-800">{pkg.weight} kg</strong></span>
                  <span>Value: <strong className="text-zinc-800">&#8377;{pkg.value.toLocaleString()}</strong></span>
                  <span>Pickup: <strong className="text-zinc-800">{pkg.window}</strong></span>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-3 sm:shrink-0">
                <div className="text-right">
                  <p className="text-xs text-zinc-400">Your Payout</p>
                  <p className="text-2xl font-bold text-hitchBlue">&#8377;{pkg.payout}</p>
                </div>
                <button onClick={() => { setAcceptedPkg(pkg); setScreen("active"); setPhase(1); }}
                  className="flex items-center gap-2 px-5 py-2 bg-hitchBlue text-white font-semibold rounded-xl hover:bg-hitchBlue-hover shadow-sm transition-all text-sm">
                  Accept Parcel <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── ACTIVE DELIVERY ───────────────────────────────────────────────────────
  if (screen === "active") {
    const pkg = acceptedPkg || CARGO_FEED[0];
    const phases = ["Pickup & Verify","In Transit","Delivery & Payout"];
    return (
      <div className="max-w-2xl mx-auto animate-fadeIn space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen("feed")} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Active Delivery</h1>
            <p className="text-sm text-zinc-500">{pkg.id} · {pkg.from} → {pkg.to}</p>
          </div>
        </div>

        {/* Phase Progress */}
        <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5">
          <div className="flex items-center justify-between">
            {phases.map((p, i) => {
              const idx = i + 1;
              const done = phase > idx;
              const active = phase === idx;
              return (
                <React.Fragment key={p}>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className={"w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all " +
                      (done ? "bg-emerald-500 text-white shadow" : active ? "bg-hitchBlue text-white ring-4 ring-hitchBlue/20 shadow-md" : "bg-zinc-100 text-zinc-400 border border-zinc-200")}>
                      {done ? <Check className="w-5 h-5" /> : idx}
                    </div>
                    <span className={"text-[10px] font-bold max-w-[72px] leading-tight text-center " + (active ? "text-zinc-900" : "text-zinc-400")}>{p}</span>
                  </div>
                  {i < 2 && <div className={"flex-1 h-0.5 mx-2 rounded " + (phase > idx ? "bg-emerald-400" : "bg-zinc-200")} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* PHASE 1: PICKUP */}
        {phase === 1 && (
          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-7 space-y-5 animate-fadeIn">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-hitchBlue" /> Pickup Phase — Meet the Sender</h2>
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-4 space-y-2">
              <p className="text-xs font-bold uppercase text-zinc-400">Pickup Location</p>
              <p className="font-semibold text-zinc-900">{trip.fromTerminal}</p>
              <p className="text-xs text-zinc-500">{pkg.window}</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Enter 4-Digit Pickup OTP (from sender)</label>
                <div className="flex gap-2">
                  <input type="text" maxLength={4} placeholder="4829" value={pickupOtp}
                    onChange={e => setPickupOtp(e.target.value.replace(/\D/g,""))}
                    className={"flex-1 px-4 py-3 border rounded-xl text-2xl font-bold font-mono tracking-widest text-center focus:outline-none focus:ring-2 " +
                      (pickupVerified ? "border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-400" : "border-zinc-200 focus:ring-hitchBlue/50")} />
                  <button onClick={() => {
                      if (pickupOtp === PICKUP_OTP_CORRECT) setPickupVerified(true);
                      else alert("Incorrect OTP — please ask sender for the correct code");
                    }}
                    className={"px-5 py-2 font-semibold rounded-xl text-sm transition-all " +
                      (pickupVerified ? "bg-emerald-500 text-white" : "bg-hitchBlue text-white hover:bg-hitchBlue-hover shadow-sm")}>
                    {pickupVerified ? "✓ Verified" : "Verify OTP"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Verify ₹10 Banknote Serial Number</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="e.g. 5AC 123456" value={serialInput}
                    onChange={e => setSerialInput(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchBlue/50" />
                  <button onClick={() => {
                      if (serialInput.trim() === CORRECT_SERIAL) alert("Serial verified! Package integrity confirmed.");
                      else alert("Serial mismatch — package may be tampered. Do not accept.");
                    }}
                    className="px-5 py-2 bg-zinc-800 text-white font-semibold rounded-xl text-sm hover:bg-zinc-900 transition-all">
                    Check Seal
                  </button>
                </div>
              </div>
            </div>
            <button disabled={!pickupVerified}
              onClick={() => setPhase(2)}
              className={"w-full py-3 font-bold rounded-xl transition-all text-sm " +
                (pickupVerified ? "bg-hitchBlue text-white hover:bg-hitchBlue-hover shadow-lg shadow-hitchBlue/25" : "bg-zinc-200 text-zinc-400 cursor-not-allowed")}>
              {pickupVerified ? "Package Picked Up — Mark In Transit →" : "Verify OTP to Continue"}
            </button>
          </div>
        )}

        {/* PHASE 2: IN TRANSIT */}
        {phase === 2 && (
          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-7 space-y-5 animate-fadeIn">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2"><CircleDot className="w-4 h-4 text-hitchBlue animate-pulse" /> In Transit</h2>
            <div className="space-y-3">
              {[
                { label: "Picked Up", detail: `${trip.fromTerminal}`, done: true },
                { label: "In Transit", detail: `Travelling via ${trip.mode === "train" ? "Train" : trip.mode === "bus" ? "Bus" : trip.mode}`, active: true },
                { label: "Arrived at Destination", detail: `${trip.toTerminal}`, done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                    (item.done ? "bg-emerald-500 text-white" : item.active ? "bg-hitchBlue text-white ring-4 ring-hitchBlue/20" : "bg-zinc-100 text-zinc-400 border border-zinc-200")}>
                    {item.done ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <div>
                    <p className={"text-sm font-semibold " + (item.active ? "text-zinc-900" : item.done ? "text-zinc-500 line-through" : "text-zinc-400")}>{item.label}</p>
                    <p className="text-xs text-zinc-400">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700 font-medium">Package is secured. Contact sender only through Hitch app for updates.</p>
            </div>
            <button onClick={() => setPhase(3)}
              className="w-full py-3 bg-hitchBlue text-white font-bold rounded-xl hover:bg-hitchBlue-hover shadow-lg shadow-hitchBlue/25 transition-all text-sm flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> Arrived at Destination →
            </button>
          </div>
        )}

        {/* PHASE 3: DELIVERY */}
        {phase === 3 && (
          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-7 space-y-5 animate-fadeIn">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2"><Shield className="w-4 h-4 text-hitchBlue" /> Delivery &amp; Payout</h2>
            {!deliveryVerified ? (
              <>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-bold uppercase text-zinc-400">Recipient</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900"><User className="w-4 h-4 text-zinc-400" /> Aarav Sharma</div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500"><Phone className="w-4 h-4 text-zinc-400" /> +91 98765 43210</div>
                  <p className="text-xs text-zinc-400 mt-1">Drop at: {trip.toTerminal}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Enter 4-Digit Delivery OTP (from recipient)</label>
                  <div className="flex gap-2">
                    <input type="text" maxLength={4} placeholder="7104" value={deliveryOtp}
                      onChange={e => setDeliveryOtp(e.target.value.replace(/\D/g,""))}
                      className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl text-2xl font-bold font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-hitchBlue/50" />
                    <button onClick={() => {
                        if (deliveryOtp === DELIVERY_OTP_CORRECT) setDeliveryVerified(true);
                        else alert("Incorrect Delivery OTP — ask recipient to check their confirmation SMS.");
                      }}
                      className="px-5 py-2 bg-hitchBlue text-white font-semibold rounded-xl text-sm hover:bg-hitchBlue-hover shadow-sm transition-all">
                      Confirm Delivery
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                  <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                  <h3 className="text-xl font-bold text-emerald-900">Delivery Complete!</h3>
                  <p className="text-sm text-emerald-700">Escrow payout released instantly to your wallet.</p>
                </div>
                <div className="bg-hitchBlue/5 border border-hitchBlue/20 rounded-2xl p-6 text-center space-y-1">
                  <p className="text-xs font-bold uppercase text-hitchBlue tracking-widest">Payout Released</p>
                  <p className="text-5xl font-bold text-zinc-900">&#8377;{pkg.payout}</p>
                  <p className="text-xs text-zinc-400 mt-2">Added to your Hitch Wallet · Available for withdrawal</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setScreen("feed"); setPhase(1); setPickupVerified(false); setDeliveryVerified(false); setPickupOtp(""); setDeliveryOtp(""); }}
                    className="py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-all">
                    Find More Cargo
                  </button>
                  <button onClick={() => setScreen("post")}
                    className="py-2.5 bg-hitchBlue text-white font-semibold rounded-xl text-sm hover:bg-hitchBlue-hover transition-all shadow-sm">
                    Post New Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
