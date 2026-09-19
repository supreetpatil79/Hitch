import React, { useState } from "react";
import { Package, Truck, BarChart3, Globe, BadgeCheck, Sparkles, Wallet, MessageSquare } from "lucide-react";
import SenderPortal from "./components/SenderPortal";
import CarrierPortal from "./components/CarrierPortal";
import EarningsPortal from "./components/EarningsPortal";
import AdminPortal from "./components/AdminPortal";
import PersonCarrierIcon from "./components/PersonCarrierIcon";
import AskHitchAIModal from "./components/AskHitchAIModal";

const PORTALS = [
  { id: "sender",   label: "Sender Portal",    icon: Package,           accent: "bg-hitchOrange text-white", tag: "hitch-orange" },
  { id: "carrier",  label: "Carrier Portal",   icon: PersonCarrierIcon, accent: "bg-hitchBlue text-white",   tag: "hitch-blue" },
  { id: "earnings", label: "Carrier Wallet",   icon: Wallet,            accent: "bg-emerald-600 text-white", tag: "earnings" },
  { id: "admin",    label: "Admin Dashboard",  icon: BarChart3,         accent: "bg-zinc-900 text-white",   tag: "admin" },
];

const INITIAL_SHIPMENTS = [
  {
    id: "HTX-4821",
    from: "Bengaluru",
    to: "Mumbai",
    category: "Electronics",
    weight: 2.0,
    declaredValue: "12000",
    payout: 180,
    status: "MATCHED",
    pickupOtp: "4829",
    deliveryOtp: "7104",
    banknoteSerial: "5AC 123456",
    sender: "Supreet P.",
    recipient: "Aarav S.",
    recipientPhone: "+91 98*** **210",
    eta: "Today 6:30 PM",
    carrier: "Rahul V."
  },
  {
    id: "HTX-4755",
    from: "Bengaluru",
    to: "Hyderabad",
    category: "Documents",
    weight: 0.8,
    declaredValue: "2500",
    payout: 80,
    status: "MATCHED",
    pickupOtp: "3319",
    deliveryOtp: "8821",
    banknoteSerial: "7LK 901234",
    sender: "Meera J.",
    recipient: "Priya S.",
    recipientPhone: "+91 91*** **789",
    eta: "Today 4:00 PM",
    carrier: "Suresh K."
  },
  {
    id: "HTX-4710",
    from: "Delhi",
    to: "Chandigarh",
    category: "Medicine",
    weight: 1.2,
    declaredValue: "4500",
    payout: 120,
    status: "DELIVERED",
    pickupOtp: "1102",
    deliveryOtp: "9940",
    banknoteSerial: "2XY 445566",
    sender: "Amit K.",
    recipient: "Vikram R.",
    recipientPhone: "+91 98*** **334",
    eta: "Delivered",
    carrier: "Amit K."
  }
];

export default function App() {
  const [portal, setPortal] = useState("sender");
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [activeShipmentId, setActiveShipmentId] = useState(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Carrier Wallet State (synced with OTP handshakes in real time)
  const [carrierWallet, setCarrierWallet] = useState({
    availableBalance: 840,
    totalEarned: 3250,
    pendingEscrow: 480,
    completedDeliveries: 14,
    rating: 4.96,
    trustTier: "Top Rated Commuter",
    transactions: [
      { id: "TXN-8821", type: "PAYOUT_RELEASED", description: "Vande Bharat Leg (BLR -> CHN)", route: "TRAIN #20608", amount: 180, time: "2 hours ago", status: "COMPLETED" },
      { id: "TXN-8740", type: "PAYOUT_RELEASED", description: "Expressway Trunk (PNQ -> BOM)", route: "CAR #MH12-582", amount: 340, time: "Yesterday", status: "COMPLETED" },
      { id: "TXN-8602", type: "WITHDRAWAL", description: "Instant UPI Transfer to @okhdfcbank", route: "UPI INSTANT", amount: -1200, time: "3 days ago", status: "COMPLETED" }
    ]
  });

  // Add new shipment from Sender Portal
  const handleAddShipment = (newShipment) => {
    setShipments(prev => [newShipment, ...prev]);
    setActiveShipmentId(newShipment.id);
  };

  // Update shipment status (e.g. MATCHED -> IN_TRANSIT -> DELIVERED)
  const handleUpdateStatus = (shipmentId, newStatus) => {
    setShipments(prev => prev.map(s => {
      if (s.id === shipmentId) {
        if (newStatus === "DELIVERED" && s.status !== "DELIVERED") {
          const payoutAmount = s.payout || 180;
          setCarrierWallet(w => ({
            ...w,
            availableBalance: w.availableBalance + payoutAmount,
            totalEarned: w.totalEarned + payoutAmount,
            completedDeliveries: w.completedDeliveries + 1,
            transactions: [
              {
                id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
                type: "PAYOUT_RELEASED",
                description: `Delivered ${s.category} (${s.from} -> ${s.to})`,
                route: `${s.mode?.toUpperCase() || "TRAIN"} CARRIER`,
                amount: payoutAmount,
                time: "Just now",
                status: "COMPLETED"
              },
              ...w.transactions
            ]
          }));
        }
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  // Handle Instant Withdrawal
  const handleWithdraw = (amount, method) => {
    setCarrierWallet(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
      transactions: [
        {
          id: `TXN-WTH-${Math.floor(1000 + Math.random() * 9000)}`,
          type: "WITHDRAWAL",
          description: `Instant Withdrawal to ${method === "amazonpay" ? "Amazon Pay Wallet" : "UPI Instant"}`,
          route: method.toUpperCase(),
          amount: amount,
          time: "Just now",
          status: "COMPLETED"
        },
        ...prev.transactions
      ]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Ask Hitch AI Modal */}
      <AskHitchAIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

      {/* Global Top Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zincBorder shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand - Clickable to return to Homepage */}
          <button
            onClick={() => setPortal("sender")}
            title="Go to Hitch Homepage"
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer">

            {/* Concept mark: H pillars + motion arrow = "two parties, one route" */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-[1.06] transition-transform duration-200 flex-shrink-0">
              {/* Left stem — thick, rounded caps */}
              <rect x="3" y="3" width="6" height="34" rx="3" fill="#F97316"/>
              {/* Right stem */}
              <rect x="31" y="3" width="6" height="34" rx="3" fill="#F97316"/>
              {/* Motion arrow crossbar: chevron pointing right — package in transit */}
              <path d="M9 13 L29 20 L9 27" stroke="#F97316" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Wordmark: HITCH all-caps, tight tracking, one weight */}
            <span
              className="font-display text-[20px] font-bold tracking-[0.14em] text-zinc-900 leading-none group-hover:text-hitchOrange transition-colors duration-200 uppercase">
              Hitch
            </span>
          </button>

          {/* Desktop Portal Switcher */}
          <nav className="hidden md:flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 gap-0.5">
            {PORTALS.map(({ id, label, icon: Icon, accent }) => (
              <button key={id} onClick={() => setPortal(id)}
                className={"flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all " +
                  (portal === id ? accent + " shadow-sm" : "text-zinc-500 hover:text-zinc-900 hover:bg-white/60")}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Ask Hitch AI + Carrier Wallet */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ask Hitch AI Button */}
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Ask Hitch AI</span>
            </button>

            {/* Carrier Wallet Indicator */}
            <button
              onClick={() => setPortal("earnings")}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 transition-all shadow-2xs">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{carrierWallet.availableBalance.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Portal Content with Shared Real-Time State */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 md:pb-8">
        {portal === "sender"  && (
          <SenderPortal
            shipments={shipments}
            activeShipmentId={activeShipmentId}
            onAddShipment={handleAddShipment}
            onSelectPortal={setPortal}
          />
        )}
        {portal === "carrier" && (
          <CarrierPortal
            shipments={shipments}
            activeShipmentId={activeShipmentId}
            onUpdateStatus={handleUpdateStatus}
            onSelectPortal={setPortal}
            carrierWallet={carrierWallet}
          />
        )}
        {portal === "earnings" && (
          <EarningsPortal
            carrierWallet={carrierWallet}
            onWithdraw={handleWithdraw}
            onSelectPortal={setPortal}
          />
        )}
        {portal === "admin"   && (
          <AdminPortal
            shipments={shipments}
          />
        )}
      </main>

      {/* Mobile Native-Style Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-zinc-200 py-2 px-3 flex items-center justify-around shadow-2xl safe-area-inset-bottom">
        {PORTALS.map(({ id, label, icon: Icon, accent }) => {
          const isActive = portal === id;
          return (
            <button
              key={id}
              onClick={() => setPortal(id)}
              className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all relative">
              <div className={"w-8 h-8 rounded-xl flex items-center justify-center transition-all " +
                (isActive ? accent + " shadow-sm scale-105" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200")}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={"text-[10px] tracking-tight " + (isActive ? "font-bold text-zinc-900" : "font-medium text-zinc-400")}>
                {id === "sender" ? "Sender" : id === "carrier" ? "Carrier" : id === "earnings" ? "Wallet" : "Admin"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Minimalist Footer */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-zinc-200/60 py-6 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-bold text-zinc-700 tracking-tight">Hitch Logistics</span>
            <span className="hidden sm:inline-block text-zinc-300">·</span>
            <span>Section 79 IT Act 2000 Compliant</span>
            <span className="hidden sm:inline-block text-zinc-300">·</span>
            <span>173 Connected Cities</span>
          </div>
          <div className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase flex items-center gap-2 flex-wrap justify-center">
            <span>AWS Bedrock</span>
            <span className="text-zinc-300">·</span>
            <span>Step Functions</span>
            <span className="text-zinc-300">·</span>
            <span>DynamoDB</span>
            <span className="text-zinc-300">·</span>
            <span>Lambda</span>
            <span className="text-zinc-300">·</span>
            <span>Amplify</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
