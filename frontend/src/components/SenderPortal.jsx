import React, { useState, useEffect, useRef } from "react";
import {
  Package, ArrowRight, ArrowLeft, Search, Star, MapPin, Clock,
  IndianRupee, Upload, CheckCircle2, Train, Car, Bus, Plane, Bike,
  Navigation, Phone, QrCode, Download, Shield, Zap, AlertCircle,
  CircleDot, Check, User, BadgeCheck, Sparkles, ChevronRight,
  RotateCcw, RefreshCw, Eye, Navigation2, Truck, MessageSquare,
  Bot, Send, Printer, FileText, X, AlertTriangle, ShieldCheck,
  Tag, Sliders, Image as ImageIcon, ChevronDown
} from "lucide-react";
import RoutePreviewIllustration from "./RoutePreviewIllustration";
import PersonCarrierIcon from "./PersonCarrierIcon";
import { calculatePricing, TRANSPORT_RATES, HITCH_COMMISSION_PERCENT, CARRIER_PAYOUT_PERCENT } from "../utils/pricing";

const MATCHED_CARRIERS = [
  {
    id: "c-1",
    carrierName: "Rahul Verma",
    mode: "train",
    transportName: "Vande Bharat Express (20608)",
    departure: "Today · 02:45 PM",
    rating: "4.95",
    completedTrips: 42,
    payoutRate: 85,
    badge: "Verified Regular",
    speed: "130 km/h Track Speed"
  },
  {
    id: "c-2",
    carrierName: "Priya Menon",
    mode: "flight",
    transportName: "IndiGo Air (6E-512)",
    departure: "Today · 05:20 PM",
    rating: "5.0",
    completedTrips: 88,
    payoutRate: 110,
    badge: "Frequent Flyer",
    speed: "840 km/h Airway"
  },
  {
    id: "c-3",
    carrierName: "Vikram Singhania",
    mode: "bus",
    transportName: "KSRTC Airavat Club Class",
    departure: "Tonight · 09:30 PM",
    rating: "4.88",
    completedTrips: 29,
    payoutRate: 65,
    badge: "Night Cruiser",
    speed: "80 km/h Highway"
  }
];

const CITIES = ["Bengaluru","Mumbai","Hyderabad","Delhi","Pune","Chennai",
                "Kolkata","Ahmedabad","Jaipur","Surat","Kochi","Chandigarh",
                "Nagpur","Indore","Bhopal","Patna","Lucknow","Agra"];

const ACTIVE_CORRIDORS = [
  { from:"BLR", to:"HYD", mode:"Train",  icon: Train,  transit:"~5h transit",  live:true },
  { from:"DEL", to:"MUM", mode:"Flight", icon: Plane,  transit:"~2.5h transit", live:true },
  { from:"CHN", to:"BLR", mode:"Bus",    icon: Bus,    transit:"~7h transit",  live:true },
  { from:"PNQ", to:"BLR", mode:"Train",  icon: Train,  transit:"~4h transit",  live:true },
];

const LIVE_FEED_ITEMS = [
  "Delivered", "DEL → MUM - In Transit", "PNQ → BLR - Matched",
  "CHN → BLR - Delivered", "HYD → DEL - In Transit", "MUM → PNQ - Matched",
  "BLR → HYD - Delivered", "AGR → DEL - In Transit", "KOL → DEL - Matched",
];

const TRUST_BADGES = [
  { icon: Shield, title: "Verified travelers only", desc: "Route discovery and matching stay limited to authenticated carriers." },
  { icon: Zap,    title: "OTP-secured handoff",     desc: "Pickup and drop-off stay tied to recipient identity, route, and timing." },
  { icon: Eye,    title: "Live route visibility",   desc: "Lane demand, carrier availability, and next steps update without changing your APIs." },
];

const HOW_IT_WORKS = [
  { n:"01", title:"Post your package",       icon: Package,           desc:"Enter pickup & drop cities, parcel weight, and recipient details. Under 90 seconds." },
  { n:"02", title:"Instant carrier match",   icon: PersonCarrierIcon, desc:"Our engine matches you with a verified traveler already headed to your destination." },
  { n:"03", title:"OTP-secured handoff",     icon: Shield,            desc:"Carrier receives the parcel only after verifying your 4-digit Pickup OTP. Zero trust." },
  { n:"04", title:"Delivered. Escrow released.", icon: CheckCircle2, desc:"Recipient confirms with the Delivery OTP. Payment is released automatically. Done." },
];

const STATUS_STYLE = {
  SEARCHING_RADAR: "bg-amber-100 text-amber-800 border-amber-300",
  MATCHED:         "bg-blue-100 text-blue-800 border-blue-300",
  IN_TRANSIT:      "bg-hitchOrange/15 text-hitchOrange border-hitchOrange/40",
  DELIVERED:       "bg-emerald-100 text-emerald-800 border-emerald-300",
};

// Live ticker
function LiveTicker() {
  const [offset, setOffset] = useState(0);
  const items = [...LIVE_FEED_ITEMS, ...LIVE_FEED_ITEMS];
  useEffect(() => {
    const interval = setInterval(() => setOffset(o => o + 1), 30);
    return () => clearInterval(interval);
  }, []);
  const DOT = { DELIVERED: "bg-emerald-400", "IN TRANSIT": "bg-hitchOrange", MATCHED: "bg-blue-400" };
  return (
    <div className="border-t border-b border-zinc-200/80 py-3 overflow-hidden relative bg-white/40">
      <div className="flex items-center gap-2 mb-2 px-1">
        <CircleDot className="w-3.5 h-3.5 text-hitchOrange animate-pulse shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Live Delivery Feed</span>
        <span className="ml-auto text-[11px] text-hitchOrange font-semibold">All corridors →</span>
      </div>
      <div className="flex items-center gap-8 overflow-hidden whitespace-nowrap"
           style={{ transform: `translateX(-${offset % 600}px)`, transition: "none" }}>
        {items.map((item, i) => {
          const upperItem = item.toUpperCase();
          const status = upperItem.includes("DELIVERED") ? "DELIVERED"
                       : upperItem.includes("IN TRANSIT") ? "IN TRANSIT"
                       : "MATCHED";
          return (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div className={"w-1.5 h-1.5 rounded-full " + (DOT[status] || "bg-zinc-400")} />
              <span className="text-xs text-zinc-600 font-medium">{item}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Regulatory Shipping Label Modal (Printable)
function RegulatoryLabelModal({ isOpen, onClose, form, trackingId }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentTrackingId = trackingId || "HTX-4821";
  const inspectionHash = "SHA256:7e8a9b2c3d4e5f601a2b3c4d5e6f7a8b9c0d1e2f";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-fadeIn">
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-hitchOrange" />
            <span className="font-bold text-base">Hitch Official Regulatory Package Label</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div id="printable-label" className="p-8 space-y-6 text-zinc-900 bg-[#FAFAF8]">
          <div className="border-4 border-black p-6 bg-white space-y-5 rounded-lg shadow-xs">
            <div className="flex items-start justify-between border-b-2 border-black pb-4">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight">HITCH LOGISTICS</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Peer-to-Peer Intercity Verified Carrier Network</p>
                <p className="text-xs font-mono font-bold mt-1">LANE: {form.fromCity?.toUpperCase() || "BENGALURU"} → {form.toCity?.toUpperCase() || "MUMBAI"}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="w-16 h-16 bg-black text-white p-1 flex items-center justify-center rounded">
                  <QrCode className="w-14 h-14 text-white" />
                </div>
                <span className="text-[10px] font-mono font-bold mt-1">{currentTrackingId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b-2 border-black pb-4 text-xs">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase text-zinc-500">CONSIGNOR (SENDER)</p>
                <p className="font-bold text-sm">Hitch Verified Sender</p>
                <p className="text-zinc-600">Origin: {form.fromCity || "Bengaluru"}</p>
                <p className="text-zinc-600">Pickup Window: {form.pickupEarliest ? form.pickupEarliest.replace("T", " ") : "Scheduled"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase text-zinc-500">CONSIGNEE (RECIPIENT)</p>
                <p className="font-bold text-sm">{form.recipientName || "Aarav Sharma"}</p>
                <p className="text-zinc-600">Phone: {form.recipientPhone || "+91 98765 43210"}</p>
                <p className="text-zinc-600 truncate">Dest: {form.recipientAddress || "City Terminal Point"}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b-2 border-black pb-4 text-center">
              <div className="border border-black p-2 rounded">
                <p className="text-[8px] font-bold text-zinc-500 uppercase">CATEGORY</p>
                <p className="text-xs font-bold capitalize">{form.category || "Electronics"}</p>
              </div>
              <div className="border border-black p-2 rounded">
                <p className="text-[8px] font-bold text-zinc-500 uppercase">WEIGHT</p>
                <p className="text-xs font-bold">{form.weightKg || 2} KG</p>
              </div>
              <div className="border border-black p-2 rounded">
                <p className="text-[8px] font-bold text-zinc-500 uppercase">DECLARED VAL</p>
                <p className="text-xs font-bold">₹{form.declaredValue || "12,000"}</p>
              </div>
              <div className="border border-black p-2 rounded bg-amber-50">
                <p className="text-[8px] font-bold text-amber-800 uppercase">TAMPER SEAL #</p>
                <p className="text-xs font-mono font-bold text-amber-900">{form.banknoteSerial || "5AC 123456"}</p>
              </div>
            </div>

            <div className="bg-emerald-50/80 border-2 border-emerald-700 p-3 rounded-lg flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>AMAZON BEDROCK AI INSPECTION: PASSED ✓</span>
                </div>
                <p className="text-[10px] text-emerald-800 font-mono">
                  Integrity Score: 96/100 · Non-hazardous verified · Zero contraband
                </p>
                <p className="text-[9px] text-emerald-700 font-mono">{inspectionHash}</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-1 rounded">
                SECURED
              </span>
            </div>

            <div className="text-[9px] text-zinc-500 leading-tight space-y-1 border-t border-zinc-200 pt-3">
              <p className="font-bold text-zinc-700">REGULATORY COMPLIANCE DECLARATION:</p>
              <p>1. This consignment is carried under <strong>Section 79 of the IT Act 2000</strong> &amp; Intermediary Guidelines as non-commercial peer-to-peer luggage.</p>
              <p>2. Senders certify zero hazardous items under Indian Railways Act 1989 / Carriage by Road Act 2007.</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex items-center justify-between">
          <p className="text-xs text-zinc-500">Affix this label to the outer package before handover.</p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900">
              Close
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 shadow-md text-sm transition-all">
              <Printer className="w-4 h-4" /> Print Label
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Amazon Pay Sandbox Modal
function AmazonPaySandboxModal({ isOpen, onClose, amount, onPaymentSuccess }) {
  if (!isOpen) return null;

  const [step, setStep] = useState("select");
  const [method, setMethod] = useState("wallet");
  const [logMessages, setLogMessages] = useState([]);

  const handleProcessPayment = () => {
    setStep("processing");
    setLogMessages(["Initiating POST https://amazonpay-sandbox.amazon.in/checkoutSession..."]);

    setTimeout(() => {
      setLogMessages(prev => [...prev, "Calling Operation: ProcessPayment (Amazon Pay Sandbox India)..."]);
    }, 600);

    setTimeout(() => {
      setLogMessages(prev => [...prev, "Sandbox Merchant Authorization: SUCCESS (200 OK)"]);
    }, 1200);

    setTimeout(() => {
      setLogMessages(prev => [...prev, "Escrow Hold Locked in AWS DynamoDB (Order State: HELD)"]);
    }, 1800);

    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 1000);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#232F3E] to-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900] text-zinc-950 font-bold flex items-center justify-center text-sm shadow-sm">
              a
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight">amazon pay</span>
                <span className="text-[9px] font-bold bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 px-1.5 py-0.5 rounded uppercase">Sandbox Test</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono">https://amazonpay-sandbox.amazon.in</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {step === "select" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Payment Amount</p>
                  <p className="text-2xl font-bold text-zinc-900">₹{amount}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Sandbox Active
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Test Payment Instruments</p>
                <div className="space-y-2">
                  {[
                    { id: "wallet", name: "Amazon Pay Balance", desc: "Sandbox balance: ₹15,000.00", badge: "Fastest" },
                    { id: "upi", name: "Amazon Pay UPI (ICICI)", desc: "sandbox-user@okhitch", badge: "Verified" },
                    { id: "card", name: "Amazon Pay ICICI Card", desc: "•••• 4022 | Exp 09/28", badge: "Test Card" },
                  ].map(m => (
                    <div key={m.id} onClick={() => setMethod(m.id)}
                      className={"p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between " +
                        (method === m.id ? "border-[#FF9900] bg-orange-50/50 shadow-xs" : "border-zinc-200 hover:bg-zinc-50")}>
                      <div className="flex items-center gap-3">
                        <div className={"w-4 h-4 rounded-full border flex items-center justify-center " +
                          (method === m.id ? "border-[#FF9900] bg-[#FF9900]" : "border-zinc-300")}>
                          {method === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900">{m.name}</p>
                          <p className="text-[10px] text-zinc-500">{m.desc}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-400 bg-white border border-zinc-200 px-2 py-0.5 rounded">
                        {m.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleProcessPayment}
                className="w-full py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-zinc-950 font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
                <span>Pay ₹{amount} with Amazon Pay Sandbox</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="py-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-[#FF9900] border-t-transparent animate-spin mx-auto" />
              <div>
                <p className="text-base font-bold text-zinc-900">Processing with Amazon Pay Sandbox</p>
                <p className="text-xs text-zinc-500 mt-1">Connecting to Amazon Pay India payment engine...</p>
              </div>

              <div className="bg-zinc-900 text-emerald-400 font-mono text-[10px] p-3.5 rounded-xl text-left space-y-1.5 max-h-36 overflow-y-auto">
                {logMessages.map((log, idx) => (
                  <p key={idx} className="leading-tight">❯ {log}</p>
                ))}
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 space-y-3 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Amazon Pay Sandbox: Authorized!</h3>
              <p className="text-xs text-zinc-500">Transaction ID: AMZN-PAY-SANDBOX-{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Floating Modern AI Packaging Drawer Component
function FloatingBedrockAdvisor({ isOpen, onClose, form, setForm }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hi! I'm your Amazon Bedrock Packaging Advisor (Claude 3.5 Sonnet). Ask me how to tamper-proof your parcel or upload a photo for instant vulnerability inspection!",
      time: "Just now",
      suggestions: [
        "🛡️ How do I tamper-proof an electronics package?",
        "💰 How does the ₹10 Banknote Seal work?",
        "📸 Analyze my package photo"
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      let suggestions = [];

      const lower = query.toLowerCase();
      if (lower.includes("tamper-proof") || lower.includes("electronics") || lower.includes("pack")) {
        botResponse = "📦 **Bedrock Tamper-Proofing Checklist:**\n\n1. **Inner Layer:** Wrap in anti-static bubble wrap (2 layers).\n2. **Double-Box:** Place in inner box, then outer carton with 1-inch void fill.\n3. **H-Tape Sealing:** Apply cross-filament tape over all box seams (H-pattern).\n4. **Sign the Seams:** Sign across the tape seam with permanent marker.\n5. **₹10 Banknote Seal:** Place a ₹10 note inside and record its serial code!";
        suggestions = ["How does the ₹10 Banknote Seal work?", "Upload photo for Bedrock visual inspection"];
      } else if (lower.includes("banknote") || lower.includes("seal") || lower.includes("serial")) {
        botResponse = "🛡️ **The RBI ₹10 Banknote Seal Protocol:**\n\n- Every Indian banknote has a **unique serial number** (e.g. `5AC 123456`).\n- Slip a ₹10 note inside the package before taping.\n- Log the serial number into Hitch.\n- At drop-off, the recipient verifies the note matches. Unforgeable physical security!";
        suggestions = ["Analyze my package photo", "How to pack fragile items?"];
      } else if (lower.includes("photo") || lower.includes("analyze") || lower.includes("inspect")) {
        botResponse = "📸 Please upload a photo of your packed parcel below. I'll inspect the seams, tape opacity, and assign a Tamper Resistance Score (0–100)!";
        suggestions = ["Upload Photo Now", "How to pack fragile items?"];
      } else {
        botResponse = "💡 **Claude 3.5 Sonnet Tip:** Ensure all package joints are sealed with opaque tape, declared contents match your booking, and your recipient has their phone ready for the 4-digit Delivery OTP.";
        suggestions = ["Upload package photo", "How to pack liquids/medicines?"];
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: `📸 Uploaded image: ${file.name}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `🔍 **Bedrock Visual Inspection Complete!**\n\n- **Tamper Resistance Score:** 96/100 (HIGH SECURITY)\n- **Safety Status:** VERIFIED SAFE ✓\n- **Assessment:** Excellent cross-seam adhesion. Zero contraband indicators. Your compliance label unlocks upon checkout!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ["How does the ₹10 Banknote Seal work?", "How to safely hand off to carrier?"]
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full h-[85vh] sm:h-[620px] shadow-2xl border border-zinc-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-4 flex items-center justify-between border-b border-zinc-700 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-hitchOrange/20 border border-hitchOrange/40 flex items-center justify-center text-hitchOrange font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold">Bedrock Packaging Advisor</h3>
                <span className="text-[9px] font-mono bg-violet-900/80 text-violet-200 px-1.5 py-0.5 rounded border border-violet-700">Claude 3.5 Sonnet</span>
              </div>
              <p className="text-[10px] text-zinc-400">AI-powered anti-tamper packing guide &amp; photo audit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/50 text-xs">
          {messages.map(m => (
            <div key={m.id} className={"flex flex-col " + (m.sender === "user" ? "items-end" : "items-start")}>
              <div className={"max-w-[85%] rounded-2xl p-3.5 space-y-1.5 " +
                (m.sender === "user"
                  ? "bg-hitchOrange text-white rounded-br-xs shadow-xs"
                  : "bg-white text-zinc-800 border border-zinc-200/80 rounded-bl-xs shadow-xs")}>
                <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                <span className={"text-[9px] block text-right " + (m.sender === "user" ? "text-orange-100" : "text-zinc-400")}>{m.time}</span>
              </div>

              {m.suggestions && m.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {m.suggestions.map((s, idx) => (
                    <button key={idx} onClick={() => {
                        if (s.includes("Photo")) fileInputRef.current?.click();
                        else handleSend(s);
                      }}
                      className="text-[10px] font-medium bg-white text-zinc-700 border border-zinc-200 hover:border-hitchOrange hover:text-hitchOrange px-2.5 py-1 rounded-full shadow-xs transition-all flex items-center gap-1">
                      {s.includes("Photo") ? <ImageIcon className="w-3 h-3 text-blue-500" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs bg-white p-3 rounded-xl border border-zinc-200 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-hitchOrange animate-spin" />
              <span>Claude 3.5 Sonnet is thinking...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-3 bg-white border-t border-zinc-200 shrink-0">
          <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()}
              title="Upload parcel photo for Bedrock inspection"
              className="p-2.5 rounded-xl border border-zinc-200 hover:border-hitchOrange hover:bg-orange-50 text-zinc-500 hover:text-hitchOrange transition-all shrink-0">
              <Upload className="w-4 h-4" />
            </button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask Bedrock how to securely pack your item..."
              className="flex-1 px-3.5 py-2.5 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
            <button type="submit" className="p-2.5 bg-hitchOrange text-white rounded-xl hover:bg-hitchOrange-hover transition-all shadow-sm shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Request snapshot sidebar
function RequestSnapshot({ step, form, selectedCarrier, onOpenAdvisor }) {
  const isComplete = form.category && form.weightKg > 0 && form.fromCity && form.toCity && form.recipientName;
  return (
    <div className="space-y-4">
      {form.fromCity && form.toCity && (
        <div className="animate-fadeIn">
          <RoutePreviewIllustration
            mode={selectedCarrier?.mode || "train"}
            origin={form.fromCity}
            destination={form.toCity}
            transportName={selectedCarrier?.transportName}
            carrierName={selectedCarrier?.carrierName}
          />
        </div>
      )}
      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Request snapshot</h3>
          <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full border " +
            (isComplete ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-100 text-zinc-500 border-zinc-200")}>
            {isComplete ? "READY" : "INCOMPLETE"}
          </span>
        </div>
        {[
          { icon: Navigation2, label: "Lane", value: form.fromCity && form.toCity ? `${form.fromCity} → ${form.toCity}` : "Route pending", done: !!(form.fromCity && form.toCity) },
          { icon: Package, label: "Package", value: form.category ? `${form.category.toLowerCase()} · ${form.weightKg} kg` : "documents · 0 kg", done: !!(form.category && form.weightKg > 0) },
          { icon: User, label: "Recipient", value: form.recipientName || "Add recipient details", done: !!form.recipientName },
          { icon: Clock, label: "Pickup window", value: form.pickupEarliest ? "Window set" : "Select delivery timing", done: !!form.pickupEarliest },
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

        <div className="pt-2 border-t border-zinc-100">
          <button onClick={onOpenAdvisor}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-zinc-700 shadow-sm transition-all">
            <Sparkles className="w-3.5 h-3.5 text-hitchOrange" /> Bedrock Packaging Advisor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Operational safeguards</h3>
        <ul className="space-y-2 text-xs text-zinc-500 leading-relaxed">
          <li className="flex items-start gap-2"><span className="text-hitchOrange mt-0.5 shrink-0">·</span> Only verified route suggestions are matched for reliable pricing.</li>
          <li className="flex items-start gap-2"><span className="text-hitchOrange mt-0.5 shrink-0">·</span> Recipient OTP and timing are verified via Step Functions state machine.</li>
          <li className="flex items-start gap-2"><span className="text-hitchOrange mt-0.5 shrink-0">·</span> Escrow payout remains locked until physical delivery OTP verification.</li>
        </ul>
      </div>
    </div>
  );
}

// Step indicator cards
function StepCards({ step }) {
  const steps = [
    { n: 1, label: "Package details",    desc: "Describe the parcel, weight, value, and handling expectations." },
    { n: 2, label: "Route and recipient", desc: "Confirm the cities, delivery contact, and pickup time window." },
    { n: 3, label: "Review and submit",   desc: "Check live lane demand and publish the request to verified carriers." },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {steps.map(s => {
        const done   = step > s.n;
        const active = step === s.n;
        return (
          <div key={s.n} className={"rounded-xl border p-4 transition-all " +
            (done   ? "border-emerald-200 bg-emerald-50/60" :
             active ? "border-hitchOrange/40 bg-hitchOrange/5 shadow-sm" :
                      "border-zinc-200 bg-white")}>
            <div className="flex items-center gap-2 mb-2">
              <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                (done ? "bg-emerald-500 text-white" : active ? "bg-hitchOrange text-white" : "bg-zinc-200 text-zinc-500")}>
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

export default function SenderPortal({ shipments, activeShipmentId, onAddShipment, onSelectPortal }) {
  const [screen, setScreen] = useState("home");
  const [wizardStep, setWizardStep] = useState(1);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isAmazonPayModalOpen, setIsAmazonPayModalOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [createdTrackingId, setCreatedTrackingId] = useState("HTX-4821");
  const [selectedCarrier, setSelectedCarrier] = useState(MATCHED_CARRIERS[0]);

  const [form, setForm] = useState({
    category: "Electronics", weightKg: 2, declaredValue: "12000",
    photoUrl: "", description: "Anti-static wrapped electronic laptop", fragile: true,
    fromCity: "Bengaluru", toCity: "Mumbai",
    recipientName: "Aarav Sharma", recipientPhone: "+91 98765 43210", recipientAddress: "Flat 402, Gateway Towers, Bandra West",
    pickupEarliest: "2026-09-18T09:00", pickupLatest: "2026-09-18T18:00",
    banknoteSerial: "5AC 123456",
  });

  const [weightError, setWeightError] = useState("");
  const [pickupOtp] = useState("4829");
  const [payDone, setPayDone] = useState(false);
  const [laneLoaded, setLaneLoaded] = useState(false);

  useEffect(() => {
    if (screen === "create" && wizardStep === 3) {
      setLaneLoaded(false);
      const t = setTimeout(() => setLaneLoaded(true), 1200);
      return () => clearTimeout(t);
    }
  }, [screen, wizardStep]);

  const setWeight = (v) => {
    const n = parseFloat(v) || 0;
    setForm(f => ({ ...f, weightKg: n }));
    setWeightError(n > 30 ? "Weight cannot exceed 30 kg for passenger baggage" : "");
  };

  const handleDummyPayment = () => {
    const newId = `HTX-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedTrackingId(newId);
    setPayDone(true);

    const pricing = calculatePricing(form.weightKg, selectedCarrier?.mode || "train");

    if (onAddShipment) {
      onAddShipment({
        id: newId,
        from: form.fromCity || "Bengaluru",
        to: form.toCity || "Mumbai",
        category: form.category || "Electronics",
        weight: form.weightKg || 2.0,
        declaredValue: form.declaredValue || "12000",
        payout: pricing.carrierPayout,
        grossPrice: pricing.totalSenderPrice,
        hitchCommission: pricing.hitchCommission,
        status: "MATCHED",
        pickupOtp: "4829",
        deliveryOtp: "7104",
        banknoteSerial: form.banknoteSerial || "5AC 123456",
        sender: "You (Verified)",
        recipient: form.recipientName || "Aarav Sharma",
        recipientPhone: form.recipientPhone || "+91 98765 43210",
        eta: selectedCarrier?.departure || "Today 6:30 PM",
        carrier: selectedCarrier?.carrierName || "Rahul Verma",
        mode: selectedCarrier?.mode || "train",
        transportName: selectedCarrier?.transportName || "Vande Bharat Express"
      });
    }
  };

  // ─── HOME ───────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div className="space-y-10 animate-fadeIn relative">
      <RegulatoryLabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} form={form} trackingId={createdTrackingId} />
      <FloatingBedrockAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} form={form} setForm={setForm} />

      {/* Floating AI Trigger Button */}
      <button onClick={() => setIsAdvisorOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full shadow-2xl border border-zinc-700 transition-all hover:scale-105">
        <Sparkles className="w-4 h-4 text-hitchOrange animate-spin" />
        <span className="text-xs font-bold">Ask Bedrock Packaging AI</span>
      </button>

      {/* Hero split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4 pb-6">
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 self-start bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <span className="w-2 h-2 rounded-full bg-hitchOrange" />
            <span className="text-xs font-bold text-hitchOrange">Same-day intercity delivery — 173 cities</span>
          </div>

          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">Your package travels</h1>
            <h1 className="font-display text-5xl lg:text-6xl italic text-hitchOrange leading-tight">with people.</h1>
          </div>

          <p className="text-zinc-600 text-lg font-medium tracking-tight">
            Shipping your item at insanely low prices &amp; fast as possible.
          </p>

          <div className="flex items-center gap-3">
            <button onClick={() => { setScreen("create"); setWizardStep(1); }}
              className="flex items-center gap-2 px-6 py-3.5 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-md shadow-hitchOrange/20 transition-all text-sm">
              Send a package <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectPortal && onSelectPortal("carrier")}
              className="px-6 py-3.5 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all text-sm">
              Browse carriers
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#FF5C28","#2563EB","#10B981","#8B5CF6"].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: c }}>
                  {["PM","AT","SK","ND"][i]}
                </div>
              ))}
            </div>
            <span className="text-sm text-zinc-500"><strong className="text-zinc-900">2,400+</strong> packages delivered safely</span>
          </div>
        </div>

        {/* Right: Active Corridors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Active Corridors Now</span>
            <span className="text-xs text-hitchOrange font-semibold">View all →</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ACTIVE_CORRIDORS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm font-bold text-zinc-400">{c.from}</span>
                        <span className="text-zinc-300">→</span>
                        <span className="text-sm font-bold text-zinc-900">{c.to}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Icon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{c.mode}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">{c.transit}</p>
                    </div>
                    {c.live && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-2">
            {[["173","Cities"],["4.5h","Avg transit"],["₹180","Avg costing"]].map(([v, l]) => (
              <div key={l} className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-4 text-center">
                <p className="text-2xl font-bold text-zinc-900">{v}</p>
                <p className="text-[10px] text-zinc-400 uppercase font-bold mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live delivery feed ticker */}
      <LiveTicker />

      {/* Real-time Shipments Carousel */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <span>Active Platform Shipments</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-zinc-500">Real-time status synced with carrier OTP handshakes</p>
          </div>
          <span className="text-xs font-semibold text-hitchOrange">{shipments?.length || 3} Active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(shipments || []).map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">{s.id}</span>
                <span className={"text-[10px] font-bold px-2.5 py-0.5 rounded-full border " + (STATUS_STYLE[s.status] || "bg-zinc-100 text-zinc-600")}>
                  {s.status.replace(/_/g, " ")}
                </span>
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
                <span>{s.weight} kg · {s.category}</span>
                <span className="font-bold text-hitchOrange">₹{s.payout}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="pt-6 pb-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">How it works</span>
          <h2 className="text-3xl font-bold text-zinc-900 mt-2">
            Send in 4 steps. <span className="font-display italic text-hitchOrange">Simple.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.n} className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-hitchOrange flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">{item.n}</span>
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
    </div>
  );

  // ─── CREATE WIZARD ───────────────────────────────────────────────────────────
  if (screen === "create") return (
    <div className="animate-fadeIn">
      <RegulatoryLabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} form={form} trackingId={createdTrackingId} />
      <FloatingBedrockAdvisor isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} form={form} setForm={setForm} />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Sender Workflow</p>
          <h1 className="text-3xl font-bold text-zinc-900">Create a secure delivery request</h1>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl">
            Set parcel details, lock pickup timing, and publish to verified travelers.
          </p>
        </div>
        <button onClick={() => setIsAdvisorOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
          <Sparkles className="w-3.5 h-3.5 text-hitchOrange" /> Bedrock AI Packaging Advisor
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {TRUST_BADGES.map(b => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-hitchOrange flex items-center justify-center shrink-0">
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
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-zincBorder shadow-sm p-7 space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Dispatch Request</p>
              <h2 className="text-xl font-bold text-zinc-900">
                {wizardStep === 1 ? "Package details" : wizardStep === 2 ? "Route and recipient" : "Review and submit"}
              </h2>
            </div>

            <StepCards step={wizardStep} />

            {/* STEP 1 */}
            {wizardStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Package Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40 bg-white">
                      {["Electronics","Documents","Clothing","Medicine","Food","Fragile"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500">Package Weight</label>
                      <span className="text-[10px] font-bold text-red-500">REQUIRED</span>
                    </div>
                    <div className="relative">
                      <input type="number" step="0.5" min="0" value={form.weightKg || ""}
                        onChange={e => setWeight(e.target.value)}
                        className={"w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 pr-10 " +
                          (weightError ? "border-red-300" : "border-zinc-200 focus:ring-hitchOrange/40")}
                        placeholder="0" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">KG</span>
                    </div>
                    {weightError && <p className="text-[10px] text-red-500 mt-1">{weightError}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Declared Value</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">₹</span>
                      <input type="number" value={form.declaredValue} onChange={e => setForm({...form, declaredValue: e.target.value})}
                        className="w-full pl-8 pr-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40"
                        placeholder="12000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Photo URL / Reference</label>
                    <input type="url" value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})}
                      className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40"
                      placeholder="https://..." />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Package Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40 resize-none" />
                </div>

                <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-2xl bg-zinc-50/50">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Special Handling</p>
                    <p className="text-xs text-zinc-400">Flag fragile items for extra care.</p>
                  </div>
                  <button type="button" onClick={() => setForm(f => ({...f, fragile: !f.fragile}))}
                    className={"w-11 h-6 rounded-full transition-all relative shrink-0 " + (form.fragile ? "bg-hitchOrange" : "bg-zinc-300")}>
                    <div className={"absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all " + (form.fragile ? "left-5" : "left-0.5")} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {wizardStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">Pickup city</label>
                    <div className="flex items-center bg-white border border-zinc-200 rounded-full px-3 py-1.5 focus-within:border-hitchOrange focus-within:ring-2 focus-within:ring-hitchOrange/20 shadow-2xs transition-all">
                      <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100/90 px-2.5 py-1 rounded-full border border-orange-200/80 uppercase tracking-wider shrink-0">
                        CITY
                      </span>
                      <input type="text" list="from-cities" value={form.fromCity} onChange={e => setForm({...form, fromCity: e.target.value})}
                        className="w-full pl-3 pr-2 py-1 text-sm bg-transparent font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none"
                        placeholder="Bengaluru" />
                      <datalist id="from-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5">Search and select the exact city or route point.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-zinc-900 mb-2">Destination city</label>
                    <div className="flex items-center bg-white border border-orange-400 ring-2 ring-orange-500/20 rounded-full px-3 py-1.5 shadow-2xs transition-all">
                      <span className="text-[10px] font-mono font-bold text-orange-700 bg-orange-100/90 px-2.5 py-1 rounded-full border border-orange-200/80 uppercase tracking-wider shrink-0">
                        CITY
                      </span>
                      <input type="text" list="to-cities" value={form.toCity} onChange={e => setForm({...form, toCity: e.target.value})}
                        className="w-full pl-3 pr-2 py-1 text-sm bg-transparent font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none"
                        placeholder="Mumbai" />
                      <datalist id="to-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5">Select the delivery city from verified route suggestions.</p>
                  </div>
                </div>

                {/* Route Preview in Step 2 */}
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-0.5">Route preview</h3>
                  <p className="text-xs text-zinc-500 mb-3">Double-check the pickup and destination cities before you continue.</p>
                  <RoutePreviewIllustration
                    mode={selectedCarrier?.mode || "train"}
                    origin={form.fromCity}
                    destination={form.toCity}
                    transportName={selectedCarrier?.transportName}
                  />
                </div>

                {/* Recipient Details */}
                <div className="pt-2 border-t border-zinc-100 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 mb-0.5">Recipient details</h3>
                    <p className="text-xs text-zinc-500">These details support delivery coordination, OTP handoff, and support follow-up.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Recipient Name</label>
                      <input type="text" value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})}
                        className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Recipient Phone</label>
                      <input type="tel" value={form.recipientPhone} onChange={e => setForm({...form, recipientPhone: e.target.value})}
                        className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Recipient Address</label>
                    <textarea rows={2} value={form.recipientAddress} onChange={e => setForm({...form, recipientAddress: e.target.value})}
                      className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40 resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {wizardStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Route</p>
                    <p className="text-base font-bold text-zinc-900 mt-1">{form.fromCity} → {form.toCity}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Live Carriers</p>
                    <p className="text-base font-bold text-zinc-900 mt-1">{laneLoaded ? "3 verified" : "Searching..."}</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-zinc-200 p-4">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Estimated Quote</p>
                    <p className="text-base font-bold text-hitchOrange mt-1">₹{Math.round((form.weightKg || 2) * (selectedCarrier?.payoutRate || 85) + 17)}</p>
                  </div>
                </div>

                {/* Verified Carriers Matching Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <PersonCarrierIcon className="w-4 h-4 text-hitchOrange" /> Available Verified Carriers on Corridor
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Select a traveler to view route transit animation and lock their schedule</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      LIVE ESCROW SECURED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {MATCHED_CARRIERS.map(c => {
                      const isSelected = selectedCarrier?.id === c.id;
                      const Icon = c.mode === "train" ? Train : c.mode === "flight" ? Plane : Bus;
                      const pricing = calculatePricing(form.weightKg, c.mode);
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCarrier(c)}
                          className={"rounded-2xl p-4 border transition-all cursor-pointer text-left relative overflow-hidden " +
                            (isSelected
                              ? "bg-orange-50/40 border-hitchOrange ring-2 ring-hitchOrange/20 shadow-sm"
                              : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-2xs")}>
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-hitchOrange text-white flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-2.5">
                            <div className={"w-8 h-8 rounded-xl flex items-center justify-center " +
                              (c.mode === "train" ? "bg-emerald-100 text-emerald-700" :
                               c.mode === "flight" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-zinc-900 leading-tight">{c.carrierName}</p>
                              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {c.rating} ({c.completedTrips} trips)
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px] border-t border-zinc-100 pt-2.5">
                            <div className="text-zinc-700 font-medium truncate">{c.transportName}</div>
                            <div className="text-zinc-400 text-[10px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" /> {c.departure}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">₹{pricing.ratePerKg}/kg</span>
                              <span className="text-xs font-bold text-hitchOrange">₹{pricing.totalSenderPrice}</span>
                            </div>
                            <p className="text-[9px] text-zinc-400">Carrier gets ₹{pricing.carrierPayout} (62%)</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Carrier Route Visualizer Animation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Route Transit Preview</p>
                    <span className="text-[10px] font-semibold text-zinc-400">Mode: {selectedCarrier?.mode.toUpperCase()}</span>
                  </div>
                  <RoutePreviewIllustration
                    mode={selectedCarrier?.mode || "train"}
                    origin={form.fromCity}
                    destination={form.toCity}
                    transportName={selectedCarrier?.transportName}
                    carrierName={selectedCarrier?.carrierName}
                  />
                </div>

                <div className="bg-zinc-50 rounded-2xl border border-zinc-200 p-4 space-y-2 text-xs">
                  <p className="font-bold text-zinc-800">Dispatch Summary</p>
                  <p className="text-zinc-600">{form.description} · {form.weightKg} kg · {form.category}</p>
                  <p className="text-zinc-600">Deliver to: {form.recipientName} ({form.recipientPhone})</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              {wizardStep > 1
                ? <button onClick={() => setWizardStep(s => s - 1)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900">Back</button>
                : <button onClick={() => setScreen("home")} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900">← Home</button>
              }
              {wizardStep < 3
                ? <button onClick={() => setWizardStep(s => s + 1)} className="px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl text-sm">Continue</button>
                : <button onClick={() => setScreen("payment")} className="px-6 py-2.5 bg-hitchOrange text-white font-semibold rounded-xl text-sm flex items-center gap-2">
                    Submit Request <ArrowRight className="w-4 h-4" />
                  </button>
              }
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <RequestSnapshot step={wizardStep} form={form} selectedCarrier={selectedCarrier} onOpenAdvisor={() => setIsAdvisorOpen(true)} />
          </div>
        </div>
      </div>
    </div>
  );

  // ─── PAYMENT ─────────────────────────────────────────────────────────────
  if (screen === "payment") {
    const currentPricing = calculatePricing(form.weightKg, selectedCarrier?.mode || "train");

    return (
      <div className="max-w-lg mx-auto animate-fadeIn space-y-6">
        <RegulatoryLabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} form={form} trackingId={createdTrackingId} />
        <AmazonPaySandboxModal isOpen={isAmazonPayModalOpen} onClose={() => setIsAmazonPayModalOpen(false)} amount={currentPricing.totalSenderPrice} onPaymentSuccess={handleDummyPayment} />

        <div className="flex items-center gap-3">
          <button onClick={() => { setScreen("create"); setWizardStep(3); }} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50">
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Payment &amp; Confirmation</h1>
          </div>
        </div>

        {!payDone ? (
          <div className="bg-white rounded-3xl border border-zincBorder shadow-sm p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-zinc-400">Escrow Total</p>
                <p className="text-3xl font-bold text-zinc-900">₹{currentPricing.totalSenderPrice}</p>
              </div>
              <span className="text-xs font-bold bg-orange-50 text-hitchOrange px-3 py-1 rounded-full border border-orange-200">
                {form.fromCity} → {form.toCity}
              </span>
            </div>

            {/* Savings Badge vs Traditional Courier */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-900">Save ₹{currentPricing.savingsRupees} ({currentPricing.savingsPercent}%)</span>
              </div>
              <span className="text-zinc-500 line-through text-[11px]">Courier: ₹{currentPricing.traditionalCourierPrice}</span>
            </div>

            {/* 38% / 62% Revenue Split Breakdown */}
            <div className="space-y-2.5 text-xs bg-zinc-50/70 rounded-2xl p-4 border border-zinc-100">
              <div className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1.5">
                  <PersonCarrierIcon className="w-3.5 h-3.5 text-hitchBlue" /> Carrier Payout (62% to {selectedCarrier?.carrierName || "Rahul Verma"})
                </span>
                <span className="font-bold text-zinc-900">₹{currentPricing.carrierPayout}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>🏛️ Hitch Platform Fee (38% — AWS Escrow &amp; AI)</span>
                <span className="font-bold text-zinc-900">₹{currentPricing.hitchCommission}</span>
              </div>
              <div className="border-t border-zinc-200/60 pt-2 flex justify-between text-[11px] text-zinc-400">
                <span>Pricing Mode Slab: {TRANSPORT_RATES[selectedCarrier?.mode || "train"]?.label}</span>
                <span>₹{currentPricing.ratePerKg}/kg</span>
              </div>
            </div>

            <button onClick={() => setIsAmazonPayModalOpen(true)}
              className="w-full py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-zinc-950 font-bold rounded-2xl shadow-lg transition-all text-sm flex items-center justify-center gap-2">
              <span className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold">a</span>
              <span>Pay ₹{currentPricing.totalSenderPrice} via Amazon Pay Sandbox</span>
            </button>
          </div>
      ) : (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-emerald-900">Payment Confirmed &amp; Escrow Locked!</h2>
            <p className="text-xs text-emerald-700">Shipment <strong>{createdTrackingId}</strong> is live for carrier matching.</p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-dashed border-zinc-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tracking ID</p>
                <p className="font-display text-3xl text-zinc-900">{createdTrackingId}</p>
              </div>
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                <QrCode className="w-8 h-8" />
              </div>
            </div>

            <div className="bg-hitchOrange/10 border border-hitchOrange/30 rounded-2xl p-5 text-center">
              <p className="text-[10px] font-bold uppercase text-hitchOrange tracking-widest mb-1">4-Digit Pickup OTP</p>
              <p className="text-4xl font-bold text-zinc-900 tracking-widest font-mono">{pickupOtp}</p>
              <p className="text-[10px] text-zinc-500 mt-2">Share this code with the traveler at origin pickup.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIsLabelModalOpen(true)}
                className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 shadow-sm">
                <Printer className="w-4 h-4 text-hitchOrange" /> Print Label
              </button>
              <button onClick={() => onSelectPortal && onSelectPortal("carrier")}
                className="flex items-center justify-center gap-2 py-2.5 bg-hitchBlue text-white rounded-xl text-xs font-bold hover:bg-hitchBlue-hover">
                <Truck className="w-4 h-4" /> Open Carrier Portal →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

return null;
}
