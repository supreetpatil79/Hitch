import React, { useState, useEffect, useRef } from "react";
import {
  Package, ArrowRight, ArrowLeft, Search, Star, MapPin, Clock,
  IndianRupee, Upload, CheckCircle2, Train, Car, Bus, Plane, Bike,
  Navigation, Phone, QrCode, Download, Shield, Zap, AlertCircle,
  CircleDot, Check, User, BadgeCheck, Sparkles, ChevronRight,
  RotateCcw, RefreshCw, Eye, Navigation2, Truck, MessageSquare,
  Bot, Send, Printer, FileText, X, AlertTriangle, ShieldCheck,
  Tag, Sliders, Image as ImageIcon
} from "lucide-react";

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
  { n:"01", title:"Post your package",       icon: Package,       desc:"Enter pickup & drop cities, parcel weight, and recipient details. Under 90 seconds." },
  { n:"02", title:"Instant carrier match",   icon: Truck,         desc:"Our engine matches you with a verified traveler already headed to your destination." },
  { n:"03", title:"OTP-secured handoff",     icon: Shield,        desc:"Carrier receives the parcel only after verifying your 6-digit Pickup OTP. Zero trust." },
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
    <div className="border-t border-b border-zinc-100 py-3 overflow-hidden relative">
      <div className="flex items-center gap-2 mb-2 px-1">
        <CircleDot className="w-3.5 h-3.5 text-hitchOrange animate-pulse shrink-0" />
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Delivery Feed</span>
        <span className="ml-auto text-xs text-hitchOrange font-semibold">All corridors →</span>
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
              <span className="text-xs text-zinc-600">{item}</span>
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
        {/* Modal Header */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-hitchOrange" />
            <span className="font-bold text-base">Hitch Official Regulatory Package Label</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Area */}
        <div id="printable-label" className="p-8 space-y-6 text-zinc-900 bg-[#FAFAF8]">
          <div className="border-4 border-black p-6 bg-white space-y-5 rounded-lg shadow-xs">
            {/* Header / Barcode */}
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

            {/* Consignor & Consignee Details */}
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

            {/* Package Specifications & Tamper Proof Badges */}
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

            {/* Bedrock AI Visual Inspection Verification Stamp */}
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

            {/* Legal & Regulatory Declarations */}
            <div className="text-[9px] text-zinc-500 leading-tight space-y-1 border-t border-zinc-200 pt-3">
              <p className="font-bold text-zinc-700">REGULATORY COMPLIANCE DECLARATION:</p>
              <p>
                1. This peer-to-peer package consignment is carried under <strong>Section 79 of the Information Technology Act 2000</strong> &amp; Intermediary Guidelines.
              </p>
              <p>
                2. Senders certify zero hazardous, inflammable, or restricted items under Indian Railways Act 1989 / Carriage by Road Act 2007.
              </p>
              <p>
                3. Physical custody changes strictly on <strong>OTP Handshake &amp; Physical Banknote Seal Code Verification</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
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

// Bedrock AI Packaging Advisor Chatbot
function BedrockPackagingAdvisor({ form, setForm }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hi! I'm your Amazon Bedrock Packaging & Anti-Tamper Advisor (Claude 3.5 Sonnet). I'll guide you on how to pack your parcel so no one can tamper with it unnoticed, and analyze your package photo for vulnerabilities.",
      time: "Just now",
      suggestions: [
        "🛡️ How do I tamper-proof an electronics parcel?",
        "💰 How does the ₹10 Banknote Seal work?",
        "📸 Analyze my package photo for vulnerabilities"
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
        botResponse = "📦 **Bedrock Tamper-Proofing Checklist for Electronics:**\n\n1. **Inner Layer:** Wrap device in anti-static bubble wrap (2 layers minimum).\n2. **Double-Box Strategy:** Place in inner box, then outer corrugated carton with 1-inch void fill.\n3. **H-Tape Sealing:** Apply reinforced cross-filament tape over all box seams (forming an 'H' on top & bottom).\n4. **Sign the Seams:** Sign across the tape seam with a permanent marker. Any slit or re-taping will visibly break the signature.\n5. **Insert ₹10 Banknote Seal:** Place a ₹10 note inside and record its serial number!";
        suggestions = ["How does the ₹10 Banknote Seal work?", "Upload photo for Bedrock visual inspection"];
      } else if (lower.includes("banknote") || lower.includes("seal") || lower.includes("serial")) {
        botResponse = "🛡️ **The RBI ₹10 Banknote Seal Protocol:**\n\n- Every Indian banknote has a **unique alphanumeric serial number** (e.g. `5AC 123456`).\n- Slip a ₹10 note inside the package before taping.\n- Log the serial number into Hitch.\n- At drop-off, the recipient checks that the note inside matches the recorded serial code. Because serial numbers cannot be forged or duplicated, any substitution of the package contents is instantly exposed!";
        suggestions = ["Analyze my package photo", "How to pack fragile items?"];
      } else if (lower.includes("photo") || lower.includes("analyze") || lower.includes("inspect")) {
        botResponse = "📸 Please upload a clear photo of your packed parcel using the attachment button below. I'll inspect the seams, tape integrity, opacity, and assign a Tamper Resistance Score (0–100)!";
        suggestions = ["Upload Photo Now", "How to pack fragile items?"];
      } else {
        botResponse = "💡 **Claude 3.5 Sonnet Recommendation:** Ensure all package joints are sealed with opaque tape, declared contents match your booking, and your recipient has their phone ready for the 4-digit Delivery OTP.";
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
    }, 1200);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: `📸 Uploaded package image: ${file.name}`,
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
          text: `🔍 **Bedrock Multimodal Visual Analysis Complete!**\n\n- **Tamper Resistance Score:** 96/100 (HIGH SECURITY)\n- **Safety Status:** VERIFIED SAFE ✓\n- **Packaging Assessment:** Excellent cross-seam adhesion. Minimal risk of undetected opening in transit. Your compliance label will be unlocked upon checkout!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: ["How does the ₹10 Banknote Seal work?", "How to safely hand off to carrier?"]
        }
      ]);
    }, 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden flex flex-col h-[520px]">
      {/* Advisor Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-zinc-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-hitchOrange/20 border border-hitchOrange/40 flex items-center justify-center text-hitchOrange">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold">Bedrock Packaging &amp; Tamper Advisor</h3>
              <span className="text-[9px] font-mono bg-violet-900/60 text-violet-200 border border-violet-700 px-1.5 py-0.5 rounded">Claude 3.5 Sonnet</span>
            </div>
            <p className="text-[10px] text-zinc-400">Interactive anti-tamper packing guide &amp; photo inspection</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/50 text-xs">
        {messages.map(m => (
          <div key={m.id} className={"flex flex-col " + (m.sender === "user" ? "items-end" : "items-start")}>
            <div className={"max-w-[85%] rounded-2xl p-3.5 space-y-2 " +
              (m.sender === "user"
                ? "bg-hitchOrange text-white rounded-br-xs shadow-sm"
                : "bg-white text-zinc-800 border border-zinc-200 rounded-bl-xs shadow-xs")}>
              <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
              <span className={"text-[9px] block text-right " + (m.sender === "user" ? "text-orange-100" : "text-zinc-400")}>{m.time}</span>
            </div>

            {/* Suggestions buttons */}
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

      {/* Chat Input & Photo Trigger */}
      <div className="p-3 bg-white border-t border-zinc-200">
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
  );
}

// Request snapshot sidebar
function RequestSnapshot({ step, form, onOpenAdvisor }) {
  const isComplete = form.category && form.weightKg > 0 && form.fromCity && form.toCity && form.recipientName;
  return (
    <div className="space-y-4">
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
          <li className="flex items-start gap-2"><span className="text-hitchOrange mt-0.5 shrink-0">·</span> Only selected city suggestions are used for route matching, which keeps downstream pricing and carrier ranking reliable.</li>
          <li className="flex items-start gap-2"><span className="text-hitchOrange mt-0.5 shrink-0">·</span> Recipient contact and pickup timing stay in the same request payload, so existing OTP, payment, and match flows continue unchanged.</li>
          <li className="flex items-start gap-2"><span className="text-hitchOrange mt-0.5 shrink-0">·</span> Lane intelligence uses the live trip feed you already have. If pricing or supply cannot be loaded, submission still works.</li>
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
  const [screen, setScreen] = useState("home"); // home | create | payment
  const [wizardStep, setWizardStep] = useState(1);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [showAdvisorInWizard, setShowAdvisorInWizard] = useState(false);
  const [createdTrackingId, setCreatedTrackingId] = useState("HTX-4821");

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

    if (onAddShipment) {
      onAddShipment({
        id: newId,
        from: form.fromCity || "Bengaluru",
        to: form.toCity || "Mumbai",
        category: form.category || "Electronics",
        weight: form.weightKg || 2.0,
        declaredValue: form.declaredValue || "12000",
        payout: Math.round((form.weightKg || 2) * 75) || 180,
        status: "MATCHED",
        pickupOtp: "4829",
        deliveryOtp: "7104",
        banknoteSerial: form.banknoteSerial || "5AC 123456",
        sender: "You (Verified)",
        recipient: form.recipientName || "Aarav Sharma",
        recipientPhone: form.recipientPhone || "+91 98765 43210",
        eta: "Today 6:30 PM",
        carrier: "Rahul V."
      });
    }
  };

  // ─── HOME ───────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div className="space-y-0 animate-fadeIn">
      <RegulatoryLabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} form={form} trackingId={createdTrackingId} />

      {/* Hero split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4 pb-12">
        {/* Left: Hero copy with crisp Big-Tech 3-word subtitle */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 self-start">
            <span className="w-2 h-2 rounded-full bg-hitchOrange" />
            <span className="text-xs font-semibold text-zinc-600">Same-day intercity delivery — 173 cities</span>
          </div>

          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-zinc-900 leading-tight">Your package travels</h1>
            <h1 className="font-display text-5xl lg:text-6xl italic text-hitchOrange leading-tight">with people.</h1>
          </div>

          {/* Crisp 3-4 word subtitle replacing verbose paragraph */}
          <p className="text-zinc-500 text-lg font-medium tracking-tight">
            Same-day intercity crowd-shipping.
          </p>

          <div className="flex items-center gap-3">
            <button onClick={() => { setScreen("create"); setWizardStep(1); }}
              className="flex items-center gap-2 px-6 py-3 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-md shadow-hitchOrange/20 transition-all text-sm">
              Send a package <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => onSelectPortal && onSelectPortal("carrier")}
              className="px-6 py-3 border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all text-sm">
              Browse carriers
            </button>
          </div>

          {/* Social proof */}
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
                <div key={i} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 hover:shadow-md transition-all">
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
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[["173","Cities"],["4.5h","Avg transit"],["₹180","Avg costing"]].map(([v, l]) => (
              <div key={l} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 text-center">
                <p className="text-2xl font-bold text-zinc-900">{v}</p>
                <p className="text-[10px] text-zinc-400 uppercase font-bold mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live delivery feed ticker */}
      <LiveTicker />

      {/* Real-time Shipments Carousel synced across portals */}
      <div className="pt-10">
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
                <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full border " + (STATUS_STYLE[s.status] || "bg-zinc-100 text-zinc-600")}>
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

      {/* Bedrock AI Packaging Advisor Section */}
      <div className="pt-12 pb-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-hitchOrange" />
              <span className="text-xs font-bold uppercase tracking-widest text-hitchOrange">AI Security Assistant</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mt-1">Amazon Bedrock Packaging &amp; Tamper Advisor</h2>
            <p className="text-xs text-zinc-500 mt-1">Get customized anti-tamper packing instructions and upload photos for Claude 3.5 Sonnet analysis.</p>
          </div>
        </div>

        <BedrockPackagingAdvisor form={form} setForm={setForm} />
      </div>

      {/* How it works */}
      <div className="pt-14 pb-6">
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
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-zinc-500" />
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
    </div>
  );

  // ─── CREATE WIZARD ───────────────────────────────────────────────────────────
  if (screen === "create") return (
    <div className="animate-fadeIn">
      <RegulatoryLabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} form={form} trackingId={createdTrackingId} />

      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Sender Workflow</p>
          <h1 className="text-3xl font-bold text-zinc-900">Create a secure delivery request</h1>
          <p className="text-zinc-500 text-sm mt-2 max-w-xl">
            Set the parcel details, lock in the pickup window, and publish to verified travelers without changing your existing delivery flow.
          </p>
        </div>
        <button onClick={() => setShowAdvisorInWizard(!showAdvisorInWizard)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 hover:border-hitchOrange rounded-xl text-xs font-bold text-zinc-800 shadow-xs transition-all">
          <Sparkles className="w-4 h-4 text-hitchOrange" />
          {showAdvisorInWizard ? "Hide Packaging Advisor" : "✨ Bedrock Packaging Advisor"}
        </button>
      </div>

      {/* Collapsible Advisor in Wizard */}
      {showAdvisorInWizard && (
        <div className="mb-8 animate-fadeIn">
          <BedrockPackagingAdvisor form={form} setForm={setForm} />
        </div>
      )}

      {/* Trust badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {TRUST_BADGES.map(b => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-zinc-500" />
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
        {/* Main form */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-zincBorder shadow-sm p-7 space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">Dispatch Request</p>
              <h2 className="text-xl font-bold text-zinc-900">
                {wizardStep === 1 ? "Package details" : wizardStep === 2 ? "Route and recipient" : "Review and submit"}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {wizardStep === 1 ? "Describe the parcel, weight, value, and handling expectations."
                 : wizardStep === 2 ? "Confirm the cities, delivery contact, and pickup time window."
                 : "Check live lane demand and publish the request to verified carriers."}
              </p>
            </div>

            <StepCards step={wizardStep} />

            {/* ─ STEP 1 ─ */}
            {wizardStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Package Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                      className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40 bg-white">
                      {["Electronics","Documents","Clothing","Medicine","Food","Fragile"].map(c => <option key={c}>{c}</option>)}
                    </select>
                    <p className="text-[10px] text-zinc-400 mt-1">Used to filter carrier matches and shape pricing guidance.</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-bold uppercase text-zinc-500">Package Weight</label>
                      <span className="text-[10px] font-bold text-red-500">REQUIRED</span>
                    </div>
                    <div className="relative">
                      <input type="number" step="0.5" min="0" value={form.weightKg || ""}
                        onChange={e => setWeight(e.target.value)}
                        className={"w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 pr-10 " +
                          (weightError ? "border-red-300 focus:ring-red-300/40" : "border-zinc-200 focus:ring-hitchOrange/40")}
                        placeholder="0" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">KG</span>
                    </div>
                    {weightError
                      ? <p className="text-[10px] text-red-500 mt-1 font-medium">{weightError}</p>
                      : <p className="text-[10px] text-zinc-400 mt-1">Only enter the parcel weight, not outer packaging or tote.</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Declared Value</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">Rs.</span>
                      <input type="number" value={form.declaredValue} onChange={e => setForm({...form, declaredValue: e.target.value})}
                        className="w-full pl-10 pr-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40"
                        placeholder="" />
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">Optional, but useful for support and payout review.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Photo URL / Reference</label>
                    <input type="url" value={form.photoUrl} onChange={e => setForm({...form, photoUrl: e.target.value})}
                      className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40"
                      placeholder="https://..." />
                    <p className="text-[10px] text-zinc-400 mt-1">Optional reference photo for Bedrock safety and packaging check.</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase text-zinc-500">Package Description</label>
                    <span className="text-[10px] font-bold text-red-500">Required</span>
                  </div>
                  <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40 resize-none" />
                  <p className="text-[10px] text-zinc-400 mt-1">Mention what it is and anything the carrier should know before pickup.</p>
                </div>

                <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-zinc-50/50">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-zinc-900">Special Handling</p>
                      {form.fragile && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full">
                          ⚠ Fragile Item
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">Flag delicate or high-touch parcels (glass, electronics, cake) so carriers handle with extra care.</p>
                  </div>
                  <button type="button" onClick={() => setForm(f => ({...f, fragile: !f.fragile}))}
                    className={"w-11 h-6 rounded-full transition-all relative shrink-0 ml-4 " + (form.fragile ? "bg-hitchOrange" : "bg-zinc-300")}>
                    <div className={"absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all " + (form.fragile ? "left-5" : "left-0.5")} />
                  </button>
                </div>
              </div>
            )}

            {/* ─ STEP 2 ─ */}
            {wizardStep === 2 && (
              <div className="space-y-7 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Pickup and destination</h3>
                  <p className="text-xs text-zinc-500 mb-4">Choose both cities from the search list so matching stays geographically accurate.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Pickup City</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">CITY</span>
                        <input type="text" list="from-cities" value={form.fromCity}
                          onChange={e => setForm({...form, fromCity: e.target.value})}
                          className="w-full pl-16 pr-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40"
                          placeholder="Search origin city" />
                        <datalist id="from-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">Search and select the exact city or route point.</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Destination City</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">CITY</span>
                        <input type="text" list="to-cities" value={form.toCity}
                          onChange={e => setForm({...form, toCity: e.target.value})}
                          className="w-full pl-16 pr-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40"
                          placeholder="Search destination city" />
                        <datalist id="to-cities">{CITIES.map(c => <option key={c} value={c} />)}</datalist>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">Select the delivery city from verified route suggestions.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Recipient details</h3>
                  <p className="text-xs text-zinc-500 mb-4">These details support delivery coordination, OTP handoff, and support follow-up.</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Recipient Name</label>
                      <input type="text" value={form.recipientName} onChange={e => setForm({...form, recipientName: e.target.value})}
                        className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
                      <p className="text-[10px] text-zinc-400 mt-1">Shown to the carrier during secure handoff.</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Recipient Phone</label>
                      <input type="tel" value={form.recipientPhone} onChange={e => setForm({...form, recipientPhone: e.target.value})}
                        className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
                      <p className="text-[10px] text-zinc-400 mt-1">Used for pickup or delivery coordination.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-zinc-500 mb-1.5">Recipient Address</label>
                    <textarea rows={3} value={form.recipientAddress} onChange={e => setForm({...form, recipientAddress: e.target.value})}
                      className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40 resize-none" />
                    <p className="text-[10px] text-zinc-400 mt-1">Include building name, area, landmark, or gate instructions.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 mb-1">Preferred pickup window</h3>
                  <p className="text-xs text-zinc-500 mb-4">Give carriers a realistic window so they can confirm availability with confidence.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold uppercase text-zinc-500">Earliest Pickup</label>
                        <span className="text-[10px] text-zinc-400">LOCAL TIME</span>
                      </div>
                      <input type="datetime-local" value={form.pickupEarliest} onChange={e => setForm({...form, pickupEarliest: e.target.value})}
                        className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
                      <p className="text-[10px] text-zinc-400 mt-1">Use the first acceptable handoff time.</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-bold uppercase text-zinc-500">Latest Pickup</label>
                        <span className="text-[10px] text-zinc-400">LOCAL TIME</span>
                      </div>
                      <input type="datetime-local" value={form.pickupLatest} onChange={e => setForm({...form, pickupLatest: e.target.value})}
                        className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-hitchOrange/40" />
                        <p className="text-[10px] text-zinc-400 mt-1">Must be later than the earliest pickup time.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─ STEP 3 ─ */}
            {wizardStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Route</p>
                    <div className="flex items-center gap-1.5 mt-2 mb-0.5">
                      <Navigation2 className="w-5 h-5 text-zinc-400 shrink-0" />
                    </div>
                    <p className="text-lg font-bold text-zinc-900 leading-tight">{form.fromCity || "—"} → {form.toCity || "—"}</p>
                    <p className="text-xs text-zinc-400 mt-1">Selected pickup and destination cities.</p>
                  </div>
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Live Carriers</p>
                    <div className="flex items-center gap-1.5 mt-2 mb-0.5">
                      <Truck className="w-5 h-5 text-zinc-400 shrink-0" />
                    </div>
                    <p className="text-lg font-bold text-zinc-900">{laneLoaded ? "3" : "0"}</p>
                    <p className="text-xs text-zinc-400 mt-1">Verified carriers matching this lane right now.</p>
                  </div>
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                    <p className="text-[10px] font-bold uppercase text-zinc-400 mb-1">Indicative Quote</p>
                    <div className="flex items-center gap-1.5 mt-2 mb-0.5">
                      <IndianRupee className="w-5 h-5 text-zinc-400 shrink-0" />
                    </div>
                    <p className="text-lg font-bold text-zinc-900">{laneLoaded && form.weightKg > 0 ? `₹${Math.round(form.weightKg * 85 + 17)}` : "Pending"}</p>
                    <p className="text-xs text-zinc-400 mt-1">A live estimate based on current matching routes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Lane intelligence */}
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-hitchOrange" />
                      <p className="text-sm font-bold text-zinc-900">Live lane intelligence</p>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">Carrier availability refreshes from the existing trip feed without changing your request payload.</p>
                    {!laneLoaded ? (
                      <div className="text-center py-6 space-y-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-sm font-bold text-zinc-800">Unable to load live route intelligence</p>
                        <p className="text-xs text-zinc-500">You can still submit the request. Retry if you want a fresher view of carrier supply first.</p>
                        <button className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all">
                          Retry lookup
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-bold text-emerald-800">Lane data loaded</p>
                        <p className="text-xs text-emerald-600 mt-1">3 active carriers on this corridor</p>
                      </div>
                    )}
                  </div>

                  {/* Submission review */}
                  <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
                    <p className="text-sm font-bold text-zinc-900 mb-1">Submission review</p>
                    <p className="text-xs text-zinc-500 mb-4">A quick final check before the request goes live to matching carriers.</p>
                    <div className="space-y-2">
                      <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-3 space-y-0.5">
                        <p className="text-xs font-bold text-zinc-700">Parcel</p>
                        <p className="text-xs text-zinc-600">{form.description || "—"} · {form.category?.toLowerCase()} · {form.weightKg} kg</p>
                        {form.declaredValue && <p className="text-xs text-zinc-500">Declared value: Rs. {form.declaredValue}</p>}
                        {form.fragile && <p className="text-xs text-zinc-500">Handling: Fragile handling requested</p>}
                      </div>
                      <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-3 space-y-0.5">
                        <p className="text-xs font-bold text-zinc-700">Recipient</p>
                        <p className="text-xs text-zinc-600">{form.recipientName || "—"}</p>
                        <p className="text-xs text-zinc-500">{form.recipientPhone || "—"}</p>
                        <p className="text-xs text-zinc-500">{form.recipientAddress || "—"}</p>
                      </div>
                      {(form.pickupEarliest || form.pickupLatest) && (
                        <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-3 space-y-0.5">
                          <p className="text-xs font-bold text-zinc-700">Pickup window</p>
                          {form.pickupEarliest && <p className="text-xs text-zinc-500">Earliest: {form.pickupEarliest.replace("T", ", ")}</p>}
                          {form.pickupLatest && <p className="text-xs text-zinc-500">Latest: {form.pickupLatest.replace("T", ", ")}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              {wizardStep > 1
                ? <button onClick={() => setWizardStep(s => s - 1)} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-all">Back</button>
                : <button onClick={() => setScreen("home")} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-all">← Home</button>
              }
              {wizardStep < 3
                ? <button onClick={() => setWizardStep(s => s + 1)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 shadow-sm transition-all text-sm">
                    Continue
                  </button>
                : <button onClick={() => setScreen("payment")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-hitchOrange text-white font-semibold rounded-xl hover:bg-hitchOrange-hover shadow-md shadow-hitchOrange/20 transition-all text-sm">
                    Submit Request <ArrowRight className="w-4 h-4" />
                  </button>
              }
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            <RequestSnapshot step={wizardStep} form={form}
              onOpenAdvisor={() => setShowAdvisorInWizard(true)} />
          </div>
        </div>
      </div>
    </div>
  );

  // ─── PAYMENT / SUCCESS ────────────────────────────────────────────────────
  if (screen === "payment") return (
    <div className="max-w-lg mx-auto animate-fadeIn space-y-6">
      <RegulatoryLabelModal isOpen={isLabelModalOpen} onClose={() => setIsLabelModalOpen(false)} form={form} trackingId={createdTrackingId} />

      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => { setScreen("create"); setWizardStep(3); }} className="p-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all">
          <ArrowLeft className="w-4 h-4 text-zinc-500" />
        </button>
        <div>
          <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Sender Workflow</p>
          <h1 className="text-2xl font-bold text-zinc-900">Payment &amp; Confirmation</h1>
        </div>
      </div>

      {!payDone ? (
        <div className="bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100">
            <p className="text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Secure Escrow Payment</p>
            <p className="text-2xl font-bold text-zinc-900">₹{Math.round((form.weightKg || 2) * 85 + 17)}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{form.fromCity || "Origin"} → {form.toCity || "Destination"} · {form.weightKg || 2}kg</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Carrier payout</span><span className="font-semibold">₹{Math.round((form.weightKg || 2) * 75)}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Platform fee (14.75%)</span><span className="font-semibold">₹{Math.round((form.weightKg || 2) * 11)}</span></div>
              <div className="flex justify-between font-bold border-t border-zinc-100 pt-2">
                <span>Escrow total</span><span className="text-hitchOrange">₹{Math.round((form.weightKg || 2) * 85 + 17)}</span>
              </div>
            </div>
            <button onClick={handleDummyPayment}
              className="w-full py-3.5 bg-hitchOrange text-white font-bold rounded-xl hover:bg-hitchOrange-hover shadow-lg shadow-hitchOrange/20 transition-all text-sm">
              Pay &amp; Lock Escrow via Razorpay (1-Click Test)
            </button>
            <p className="text-center text-xs text-zinc-400">Instant test checkout · Escrow auto-locks &amp; notifies carrier</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-emerald-900">Payment Confirmed &amp; Escrow Locked!</h2>
            <p className="text-sm text-emerald-700">Shipment <strong>{createdTrackingId}</strong> is now live on the Carrier matching feed.</p>
          </div>

          <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Hitch Shipment</p>
                <p className="font-display text-3xl text-zinc-900 mt-0.5">{createdTrackingId}</p>
              </div>
              <div className="w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                ["From", form.fromCity || "Bengaluru"], ["To", form.toCity || "Mumbai"],
                ["Category", form.category], ["Weight", `${form.weightKg || 2} kg`],
                ["Recipient", form.recipientName || "Aarav Sharma"], ["Fragile", form.fragile ? "Yes" : "No"],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-zinc-400 uppercase font-bold text-[10px]">{l}</p>
                  <p className="text-zinc-900 font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            <div className="bg-hitchOrange/10 border border-hitchOrange/30 rounded-xl p-5 text-center">
              <p className="text-[10px] font-bold uppercase text-hitchOrange tracking-widest mb-2">4-Digit Pickup OTP</p>
              <p className="text-5xl font-bold text-zinc-900 tracking-widest font-mono">{pickupOtp}</p>
              <p className="text-[10px] text-zinc-500 mt-2">Give this code to the traveler at origin pickup.</p>
            </div>

            {/* Regulatory Compliance Label Button appears here after payment */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setIsLabelModalOpen(true)}
                className="flex items-center justify-center gap-2 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 shadow-sm transition-all">
                <Printer className="w-4 h-4 text-hitchOrange" /> Print Compliance Label
              </button>
              <button onClick={() => onSelectPortal && onSelectPortal("carrier")}
                className="flex items-center justify-center gap-2 py-2.5 bg-hitchBlue text-white rounded-xl text-xs font-semibold hover:bg-hitchBlue-hover transition-all">
                <Truck className="w-4 h-4" /> Open Carrier Portal →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return null;
}
