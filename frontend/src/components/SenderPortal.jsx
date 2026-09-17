import React, { useState } from "react";
import {
  Package, ArrowRight, ArrowLeft, ChevronRight, Search, Star,
  MapPin, Clock, IndianRupee, Upload, CheckCircle2, Train, Car,
  Bus, Plane, Bike, Navigation, Calendar, Sliders, Phone,
  QrCode, Download, Shield, Zap, AlertCircle, CircleDot,
  X, Check, ChevronDown, User, BadgeCheck
} from "lucide-react";

const CITIES = ["Mumbai", "Pune", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
                "Kolkata", "Ahmedabad", "Jaipur", "Surat", "Kochi", "Chandigarh"];
const HUBS = {
  "Mumbai": ["Dadar Station", "CST Station", "Bandra Terminus", "LTT Station"],
  "Pune": ["Shivajinagar Station", "Pune Junction", "Khadki Station"],
  "Bengaluru": ["KSR (Majestic) Station", "Yeshvanthpur Station", "KEMPEGOWDA ISBT"],
  "Hyderabad": ["Secunderabad Junction", "Kacheguda Station", "Hyderabad Deccan"],
  "Delhi": ["New Delhi Station", "Hazrat Nizamuddin", "ISBT Kashmere Gate"],
  "Chennai": ["Chennai Central", "Tambaram Station", "CMBT Bus Stand"],
  "default": ["Main Railway Station", "Central Bus Terminal", "City Hub"],
};
const getHub = (city) => HUBS[city] || HUBS["default"];

const CATEGORIES = ["Documents", "Clothing", "Electronics", "Food", "Fragile", "Medicine"];
const CAT_COLORS = {
  Documents: "bg-blue-50 text-blue-700 border-blue-200",
  Clothing:  "bg-pink-50 text-pink-700 border-pink-200",
  Electronics: "bg-violet-50 text-violet-700 border-violet-200",
  Food:      "bg-amber-50 text-amber-700 border-amber-200",
  Fragile:   "bg-red-50 text-red-700 border-red-200",
  Medicine:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const MOCK_SHIPMENTS = [
  { id: "HTX-4821", from: "Mumbai", to: "Pune", status: "IN_TRANSIT", carrier: "Rahul V.", weight: 1.5, eta: "Today 6:30 PM" },
  { id: "HTX-4755", from: "Bengaluru", to: "Hyderabad", status: "MATCHED", carrier: "Priya S.", weight: 0.8, eta: "Today 4:00 PM" },
  { id: "HTX-4710", from: "Delhi", to: "Chandigarh", status: "DELIVERED", carrier: "Amit K.", weight: 2.1, eta: "Delivered" },
  { id: "HTX-4690", from: "Mumbai", to: "Surat", status: "SEARCHING_RADAR", carrier: null, weight: 0.5, eta: "Searching..." },
];
const STATUS_STYLE = {
  SEARCHING_RADAR: "bg-amber-100 text-amber-800 border-amber-300",
  MATCHED:         "bg-blue-100 text-blue-800 border-blue-300",
  IN_TRANSIT:      "bg-hitchOrange/15 text-hitchOrange border-hitchOrange/40",
  DELIVERED:       "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const MOCK_CARRIERS = [
  { id: 1, name: "Rahul Verma", rating: 4.9, trips: 143, mode: "Vande Bharat Express", modeIcon: Train,
    depart: "08:00 AM", arrive: "11:05 AM", duration: "3h 5m", carrierFee: 120, platformFee: 17.70 },
  { id: 2, name: "Priya Sharma", rating: 4.8, trips: 97, mode: "AC Sleeper Bus (SRS)",  modeIcon: Bus,
    depart: "09:30 AM", arrive: "01:20 PM", duration: "3h 50m", carrierFee: 80, platformFee: 11.80 },
  { id: 3, name: "Arun Nair",   rating: 4.7, trips: 62, mode: "Private Car (Swift DZ)", modeIcon: Car,
    depart: "11:00 AM", arrive: "01:45 PM", duration: "2h 45m", carrierFee: 150, platformFee: 22.13 },
];

const StatusPill = ({ status }) => (
  <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full border " + (STATUS_STYLE[status] || "bg-zinc-100 text-zinc-600")}>
    {status.replace(/_/g, " ")}
  </span>
);

function StepIndicator({ step }) {
  const steps = ["Route", "Parcel", "Verify"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all " +
                (done ? "bg-emerald-500 text-white" : active ? "bg-hitchOrange text-white ring-4 ring-hitchOrange/20" : "bg-zinc-100 text-zinc-400 border border-zinc-200")}>
                {done ? <Check className="w-4 h-4" /> : idx}
              </div>
              <span className={"text-sm font-medium " + (active ? "text-zinc-900" : "text-zinc-400")}>{s}</span>
            </div>
            {i < 2 && <div className={"flex-1 h-0.5 rounded " + (step > idx ? "bg-emerald-400" : "bg-zinc-200")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function RadarDisplay({ from, to }) {
  const [foundIdx, setFoundIdx] = useState(null);
  React.useEffect(() => {
    const t = setTimeout(() => setFoundIdx(0), 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <p className="text-sm text-zinc-500 font-medium">Scanning corridor <strong className="text-zinc-900">{from} → {to}</strong> for verified carriers...</p>
      <div className="relative w-72 h-72 flex items-center justify-center">
        {[1,2,3,4].map(r => (
          <div key={r} className={"absolute inset-0 rounded-full border-2 border-hitchOrange/50 animate-radar-" + r} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full animate-sweep origin-center">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-hitchOrange/80 to-transparent origin-left -translate-y-1/2" />
          </div>
        </div>
        <div className="relative z-10 bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg border-2 border-hitchOrange/30">
          <Navigation className="w-6 h-6 text-hitchOrange" />
          <span className="text-[9px] font-bold text-zinc-500 mt-0.5">RADAR</span>
        </div>
        {foundIdx !== null && (
          <>
            <div className="absolute top-6 right-10 w-3 h-3 bg-hitchOrange rounded-full shadow-lg animate-pulse" />
            <div className="absolute bottom-12 left-8 w-2.5 h-2.5 bg-hitchOrange/70 rounded-full shadow animate-pulse" style={{animationDelay:'0.3s'}} />
            <div className="absolute top-1/2 right-4 w-2 h-2 bg-hitchOrange/50 rounded-full animate-pulse" style={{animationDelay:'0.6s'}} />
          </>
        )}
      </div>
      {foundIdx !== null
        ? <p className="text-sm font-semibold text-emerald-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {MOCK_CARRIERS.length} verified carriers found!</p>
        : <p className="text-xs text-zinc-400 animate-pulse-dot">Searching active corridors...</p>}
    </div>
  );
}

export default function SenderPortal() {
  const [screen, setScreen] = useState("home"); // home | create | radar | payment
  const [wizardStep, setWizardStep] = useState(1);

  // Quick action form
  const [qa, setQa] = useState({ from: "Mumbai", to: "Pune", date: "today", weight: 2 });

  // Wizard form
  const [form, setForm] = useState({
    fromCity: "Mumbai", fromHub: "Dadar Station",
    toCity: "Pune", toHub: "Shivajinagar Station",
    category: "Electronics", weightKg: 1.5,
    dimL: 30, dimW: 20, dimH: 10,
    declaredValue: 12000, fragile: false, photoFile: null,
    banknoteSerial: "", pickupTime: "morning",
  });
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [pickupOtp] = useState("4829");
  const [payDone, setPayDone] = useState(false);

  const toggleCat = (cat) => setForm(f => ({ ...f, category: cat }));

  // ─── HOME ───────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div className="space-y-10 animate-fadeIn">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-10 py-14 text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-hitchOrange/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-hitchOrange animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-hitchOrange">Hitch Logistics Network</span>
          </div>
          <h1 className="font-display text-5xl leading-tight mb-4">
            Same-Day Intercity Courier<br />via Verified Travelers.
          </h1>
          <p className="text-zinc-300 text-lg mb-8">
            Your parcel rides with real commuters — secured by AWS escrow, Bedrock AI inspection, and dual OTP handshakes.
          </p>
          <div className="flex items-center gap-4">
            <button onClick={() => setScreen("create")}
              className="flex items-center gap-2 px-8 py-3.5 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover transition-all shadow-lg shadow-hitchOrange/30 text-sm">
              Send a Parcel <ArrowRight className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>173 cities · 12,000+ verified carriers</span>
            </div>
          </div>
        </div>
        {/* decorative */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Package className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Quick Parcel Search</h3>
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">From City</label>
            <select value={qa.from} onChange={e => setQa({...qa, from: e.target.value})}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-hitchOrange/50">
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end justify-center pb-1">
            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zincBorder flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">To City</label>
            <select value={qa.to} onChange={e => setQa({...qa, to: e.target.value})}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-hitchOrange/50">
              {CITIES.filter(c => c !== qa.from).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Date</label>
            <select value={qa.date} onChange={e => setQa({...qa, date: e.target.value})}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm font-medium bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-hitchOrange/50">
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">Weight: {qa.weight}kg</label>
            <input type="range" min="0.5" max="10" step="0.5" value={qa.weight}
              onChange={e => setQa({...qa, weight: parseFloat(e.target.value)})}
              className="w-full accent-hitchOrange mt-2" />
          </div>
          <button onClick={() => { setForm(f => ({...f, fromCity: qa.from, toCity: qa.to, weightKg: qa.weight})); setScreen("radar"); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-md transition-all text-sm self-end">
            <Search className="w-4 h-4" /> Find Carriers
          </button>
        </div>
      </div>

      {/* Active Shipments Carousel */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-zinc-900">Active Shipments</h3>
          <span className="text-xs font-semibold text-hitchOrange">View All →</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_SHIPMENTS.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">{s.id}</span>
                <StatusPill status={s.status} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-900">
                  <MapPin className="w-3.5 h-3.5 text-hitchOrange shrink-0" /> {s.from}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-zinc-500 ml-5">
                  <ArrowRight className="w-3 h-3" /> {s.to}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-3">
                <span>{s.weight}kg</span>
                {s.carrier && <span className="font-medium text-zinc-700">via {s.carrier}</span>}
                <span className="text-hitchOrange font-medium">{s.eta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-8">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">How Hitch Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { n: 1, title: "Create Request", desc: "Describe your parcel, snap a photo for Bedrock AI inspection.", icon: Package },
            { n: 2, title: "Radar Match",    desc: "Our algorithm matches you with verified commuters on your corridor.", icon: Search },
            { n: 3, title: "Secure Pickup",  desc: "Exchange 4-digit OTP + ₹10 banknote seal code at the station.", icon: Shield },
            { n: 4, title: "Delivery Done",  desc: "Recipient confirms with OTP. Escrow auto-releases to carrier.", icon: CheckCircle2 },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.n} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-hitchOrange/10 flex items-center justify-center text-hitchOrange">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── CREATE WIZARD ───────────────────────────────────────────────────────────
  if (screen === "create") return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setScreen("home")} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
          <ArrowLeft className="w-4 h-4 text-zinc-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Create Delivery Request</h1>
          <p className="text-sm text-zinc-500">Fill in parcel details to find matched carriers</p>
        </div>
      </div>

      <StepIndicator step={wizardStep} />

      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-8 space-y-6">

        {/* STEP 1 */}
        {wizardStep === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2"><Navigation className="w-4 h-4 text-hitchOrange" /> Origin &amp; Destination</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">From City</label>
                  <select value={form.fromCity} onChange={e => setForm({...form, fromCity: e.target.value, fromHub: getHub(e.target.value)[0]})}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50 bg-zinc-50">
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Pickup Hub / Station</label>
                  <select value={form.fromHub} onChange={e => setForm({...form, fromHub: e.target.value})}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50 bg-zinc-50">
                    {getHub(form.fromCity).map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">To City</label>
                  <select value={form.toCity} onChange={e => setForm({...form, toCity: e.target.value, toHub: getHub(e.target.value)[0]})}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50 bg-zinc-50">
                    {CITIES.filter(c => c !== form.fromCity).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Dropoff Hub / Station</label>
                  <select value={form.toHub} onChange={e => setForm({...form, toHub: e.target.value})}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50 bg-zinc-50">
                    {getHub(form.toCity).map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-hitchOrange/5 border border-hitchOrange/20 rounded-xl p-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-hitchOrange shrink-0" />
              <div>
                <p className="text-sm font-semibold text-zinc-900">{form.fromCity} ({form.fromHub}) → {form.toCity} ({form.toHub})</p>
                <p className="text-xs text-zinc-500 mt-0.5">Carrier will collect at origin hub and drop at destination hub</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {wizardStep === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2"><Package className="w-4 h-4 text-hitchOrange" /> Parcel Specification</h2>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => toggleCat(cat)}
                    className={"px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all " +
                      (form.category === cat ? "bg-hitchOrange text-white border-hitchOrange shadow-sm" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100")}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Weight (kg)</label>
                <input type="number" step="0.5" min="0.5" max="10" value={form.weightKg}
                  onChange={e => setForm({...form, weightKg: parseFloat(e.target.value)||0})}
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Declared Value (₹)</label>
                <input type="number" value={form.declaredValue}
                  onChange={e => setForm({...form, declaredValue: parseInt(e.target.value)||0})}
                  className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[["Length","dimL"],["Width","dimW"],["Height","dimH"]].map(([l,k]) => (
                <div key={k}>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">{l} (cm)</label>
                  <input type="number" value={form[k]} onChange={e => setForm({...form, [k]: parseInt(e.target.value)||0})}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/50" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <p className="text-sm font-semibold text-zinc-900">Fragile Item</p>
                <p className="text-xs text-zinc-500">Extra care handling required</p>
              </div>
              <button type="button" onClick={() => setForm(f => ({...f, fragile: !f.fragile}))}
                className={"w-11 h-6 rounded-full transition-all relative " + (form.fragile ? "bg-hitchOrange" : "bg-zinc-300")}>
                <div className={"absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all " + (form.fragile ? "left-5" : "left-0.5")} />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Package Photo (Bedrock AI will inspect)</label>
              <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center hover:border-hitchOrange transition-colors bg-zinc-50 cursor-pointer">
                <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">Drop image or click to upload (JPEG/PNG, max 5MB)</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {wizardStep === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <h2 className="font-semibold text-zinc-900 flex items-center gap-2"><Shield className="w-4 h-4 text-hitchOrange" /> Verification &amp; Security Seal</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">Physical Tamper Seal Required</p>
                <p className="text-xs text-amber-700 mt-0.5">Record the serial number of a ₹10 banknote placed inside the package. The carrier will verify this code at pickup to confirm package integrity.</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">₹10 Banknote Serial Number</label>
              <input type="text" placeholder="e.g. 5AC 123456" value={form.banknoteSerial}
                onChange={e => setForm({...form, banknoteSerial: e.target.value})}
                className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-hitchOrange/50" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-2">Preferred Pickup Time Window</label>
              <div className="grid grid-cols-3 gap-2">
                {[["morning","Morning 7–11AM"],["afternoon","Afternoon 12–4PM"],["evening","Evening 5–9PM"]].map(([v,l]) => (
                  <button key={v} type="button" onClick={() => setForm(f => ({...f, pickupTime: v}))}
                    className={"py-2.5 text-xs font-semibold rounded-xl border transition-all text-center " +
                      (form.pickupTime === v ? "bg-hitchOrange text-white border-hitchOrange" : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100")}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {/* Summary */}
            <div className="bg-zinc-50 rounded-xl border border-zinc-200 divide-y divide-zinc-100">
              {[
                ["Route", `${form.fromCity} → ${form.toCity}`],
                ["Pickup Hub", form.fromHub],
                ["Category", form.category],
                ["Weight", `${form.weightKg} kg`],
                ["Declared Value", `₹${form.declaredValue.toLocaleString()}`],
                ["Fragile", form.fragile ? "Yes" : "No"],
              ].map(([l,v]) => (
                <div key={l} className="flex justify-between px-4 py-2.5 text-sm">
                  <span className="text-zinc-500">{l}</span>
                  <span className="font-semibold text-zinc-900">{v}</span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 bg-hitchOrange/5 rounded-b-xl">
                <span className="text-sm font-bold text-zinc-900">Estimated Instant Price</span>
                <span className="text-lg font-bold text-hitchOrange">₹{(form.weightKg * 85 + 17).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          {wizardStep > 1
            ? <button onClick={() => setWizardStep(s => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-all">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            : <button onClick={() => setScreen("home")} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-all">
                <ArrowLeft className="w-4 h-4" /> Cancel
              </button>
          }
          {wizardStep < 3
            ? <button onClick={() => setWizardStep(s => s + 1)} className="flex items-center gap-2 px-6 py-2.5 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-sm transition-all text-sm">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            : <button onClick={() => setScreen("radar")} className="flex items-center gap-2 px-6 py-2.5 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-sm transition-all text-sm">
                Find Carriers <Search className="w-4 h-4" />
              </button>
          }
        </div>
      </div>
    </div>
  );

  // ─── RADAR ───────────────────────────────────────────────────────────────────
  if (screen === "radar") return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center gap-3">
        <button onClick={() => { setScreen("create"); setWizardStep(3); }} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
          <ArrowLeft className="w-4 h-4 text-zinc-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Route Radar</h1>
          <p className="text-sm text-zinc-500">{form.fromCity} → {form.toCity} · {form.weightKg}kg · {form.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zincBorder shadow-sm p-6">
          <RadarDisplay from={form.fromCity} to={form.toCity} />
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-zinc-900">Matched Carriers</h3>
            <span className="text-xs text-zinc-400">Sorted by rating</span>
          </div>
          {MOCK_CARRIERS.map(carrier => {
            const ModeIcon = carrier.modeIcon;
            const total = (carrier.carrierFee + carrier.platformFee).toFixed(2);
            return (
              <div key={carrier.id}
                className={"bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all cursor-pointer " +
                  (selectedCarrier?.id === carrier.id ? "border-hitchOrange ring-2 ring-hitchOrange/20" : "border-zincBorder")}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-white font-bold text-sm">
                        {carrier.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900 text-sm">{carrier.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold text-zinc-600">{carrier.rating}</span>
                          <span className="text-xs text-zinc-400">· {carrier.trips} trips</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                      <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 rounded-lg border border-zinc-200">
                        <ModeIcon className="w-3 h-3" />
                        <span className="font-medium">{carrier.mode}</span>
                      </div>
                      <span className="font-medium">{carrier.depart}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-300" />
                      <span className="font-medium">{carrier.arrive}</span>
                      <span className="text-zinc-400">({carrier.duration})</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Carrier: <strong className="text-zinc-800">₹{carrier.carrierFee}</strong></span>
                      <span>+</span>
                      <span>Platform: <strong className="text-zinc-800">₹{carrier.platformFee}</strong></span>
                      <span>=</span>
                      <span className="font-bold text-hitchOrange text-sm">Total ₹{total}</span>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedCarrier(carrier); setScreen("payment"); }}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-sm transition-all text-xs">
                    Accept &amp; Pay <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ─── PAYMENT ─────────────────────────────────────────────────────────────────
  if (screen === "payment") {
    const carrier = selectedCarrier || MOCK_CARRIERS[0];
    const total = (carrier.carrierFee + carrier.platformFee).toFixed(2);
    return (
      <div className="max-w-lg mx-auto animate-fadeIn space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => setScreen("radar")} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <h1 className="text-2xl font-bold text-zinc-900">Payment &amp; Receipt</h1>
        </div>

        {!payDone ? (
          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 px-6 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Secure Checkout</p>
              <p className="text-xl font-bold">₹{total} via Razorpay</p>
              <p className="text-xs text-zinc-400 mt-1">{form.fromCity} → {form.toCity} · {form.weightKg}kg</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {[["Carrier Payout", `₹${carrier.carrierFee}.00`],["Platform Fee (14.75%)",`₹${carrier.platformFee}`]].map(([l,v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-zinc-500">{l}</span>
                    <span className="font-semibold text-zinc-900">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold border-t border-zinc-100 pt-3">
                  <span>Total (Escrow)</span>
                  <span className="text-hitchOrange">₹{total}</span>
                </div>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4 space-y-2 border border-zinc-200">
                <p className="text-xs font-bold uppercase text-zinc-400">Carrier Details</p>
                <p className="text-sm font-semibold text-zinc-900">{carrier.name}</p>
                <p className="text-xs text-zinc-500 flex items-center gap-1"><Train className="w-3 h-3" /> {carrier.mode} · {carrier.depart}</p>
              </div>
              <button onClick={() => setPayDone(true)}
                className="w-full py-3.5 bg-hitchOrange text-white font-bold rounded-xl hover:bg-hitchOrange-hover shadow-lg shadow-hitchOrange/25 transition-all flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" /> Pay ₹{total} — Lock Escrow
              </button>
              <p className="text-center text-xs text-zinc-400">256-bit SSL · UPI · Cards · Net Banking via Razorpay</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fadeIn">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h2 className="text-xl font-bold text-emerald-900">Payment Confirmed!</h2>
              <p className="text-sm text-emerald-700">Escrow locked. Your carrier has been notified.</p>
            </div>
            {/* Shipment Document */}
            <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Hitch Shipment Document</p>
                  <p className="font-display text-2xl text-zinc-900 mt-1">HTX-4821</p>
                </div>
                <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[["From",`${form.fromCity} · ${form.fromHub}`],["To",`${form.toCity} · ${form.toHub}`],
                  ["Category",form.category],["Weight",`${form.weightKg} kg`],
                  ["Carrier",carrier.name],["Travel Mode",carrier.mode]].map(([l,v]) => (
                  <div key={l}>
                    <p className="text-zinc-400 uppercase font-bold">{l}</p>
                    <p className="text-zinc-900 font-semibold mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-hitchOrange/10 border border-hitchOrange/30 rounded-xl p-4 text-center">
                <p className="text-xs font-bold uppercase text-hitchOrange tracking-wider mb-1">4-Digit Pickup OTP</p>
                <p className="text-4xl font-bold text-zinc-900 tracking-widest font-mono">{pickupOtp}</p>
                <p className="text-xs text-zinc-500 mt-1">Share this code with <strong>{carrier.name}</strong> at pickup. Do not share otherwise.</p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-all">
                <Download className="w-4 h-4" /> Download Shipment PDF
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
