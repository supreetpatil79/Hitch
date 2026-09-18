import React, { useState } from "react";
import { Package, Truck, BarChart3, Globe, BadgeCheck, Sparkles, Wallet } from "lucide-react";
import SenderPortal from "./components/SenderPortal";
import CarrierPortal from "./components/CarrierPortal";
import EarningsPortal from "./components/EarningsPortal";
import AdminPortal from "./components/AdminPortal";

const PORTALS = [
  { id: "sender",   label: "Sender Portal",    icon: Package,   accent: "bg-hitchOrange text-white", tag: "hitch-orange" },
  { id: "carrier",  label: "Carrier Portal",   icon: Truck,     accent: "bg-hitchBlue text-white",   tag: "hitch-blue" },
  { id: "earnings", label: "Carrier Wallet",   icon: Wallet,    accent: "bg-emerald-600 text-white", tag: "earnings" },
  { id: "admin",    label: "Admin Dashboard",  icon: BarChart3, accent: "bg-zinc-900 text-white",   tag: "admin" },
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
    recipient: "Aarav Sharma",
    recipientPhone: "+91 98765 43210",
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
    recipientPhone: "+91 91234 56789",
    eta: "Today 4:00 PM",
    carrier: "Priya S."
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
    recipientPhone: "+91 98111 22334",
    eta: "Delivered",
    carrier: "Amit K."
  }
];

export default function App() {
  const [portal, setPortal] = useState("sender");
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [activeShipmentId, setActiveShipmentId] = useState("HTX-4821");

  // Carrier Wallet State (synced with OTP handshakes in real time)
  const [carrierWallet, setCarrierWallet] = useState({
    availableBalance: 4200,
    escrowPending: 260,
    lifetimeEarned: 42300,
    transactions: [
      { id: "TXN-8842", type: "ESCROW_PAYOUT", description: "Delivered: Mumbai → Pune", route: "Mumbai → Pune", amount: 350, time: "Today 4:15 PM", status: "SETTLED" },
      { id: "TXN-8840", type: "WITHDRAWAL", description: "Instant Withdrawal to Amazon Pay", route: "Amazon Pay Wallet", amount: 1500, time: "Yesterday", status: "COMPLETED" },
      { id: "TXN-8835", type: "ESCROW_PAYOUT", description: "Delivered: Delhi → Chandigarh", route: "Delhi → Chandigarh", amount: 620, time: "Sep 15", status: "SETTLED" },
    ]
  });

  // Add new shipment from Sender Portal
  const handleAddShipment = (newPkg) => {
    setShipments(prev => [newPkg, ...prev]);
    setActiveShipmentId(newPkg.id);

    // Increase escrow pending on new booking
    setCarrierWallet(prev => ({
      ...prev,
      escrowPending: prev.escrowPending + (newPkg.payout || 180)
    }));
  };

  // Update shipment status (e.g. MATCHED -> IN_TRANSIT -> DELIVERED)
  const handleUpdateStatus = (id, newStatus) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: newStatus };
      }
      return s;
    }));

    // If delivered, automatically credit the carrier wallet in real time!
    if (newStatus === "DELIVERED") {
      const targetPkg = shipments.find(s => s.id === id) || { payout: 180, from: "Origin", to: "Destination" };
      const payoutAmount = targetPkg.payout || 180;

      setCarrierWallet(prev => ({
        ...prev,
        availableBalance: prev.availableBalance + payoutAmount,
        lifetimeEarned: prev.lifetimeEarned + payoutAmount,
        escrowPending: Math.max(0, prev.escrowPending - payoutAmount),
        transactions: [
          {
            id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
            type: "ESCROW_PAYOUT",
            description: `Delivered: ${targetPkg.from} → ${targetPkg.to}`,
            route: `${targetPkg.from} → ${targetPkg.to}`,
            amount: payoutAmount,
            time: "Just now",
            status: "SETTLED"
          },
          ...prev.transactions
        ]
      }));
    }
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
      {/* Global Top Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zincBorder shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-hitchOrange to-hitchBlue flex items-center justify-center text-white font-bold text-xl shadow-md">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl tracking-tight text-zinc-900 leading-none">Hitch</span>
                <span className="hidden sm:block text-xs font-bold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full border border-zinc-200">
                  Bharat Builds on AWS
                </span>
                <span className="hidden md:flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-hitchOrange/10 text-hitchOrange rounded-full border border-hitchOrange/20">
                  <Globe className="w-3 h-3" /> 173 Cities
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wide text-zinc-500 mt-0.5">
                Rail · Road · Runway · Delivered.
              </p>
            </div>
          </div>

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

          {/* Right: Carrier Wallet Balance Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => setPortal("earnings")}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 transition-all shadow-xs">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>₹{carrierWallet.availableBalance.toLocaleString()}</span>
            </button>
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-zinc-500 border-l border-zinc-200 pl-3">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" />
              <span>Bedrock AI</span>
            </div>
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

      {/* Footer */}
      <footer className="bg-white border-t border-zincBorder py-5 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <span>Hitch Technology Platform · Section 79 IT Act 2000 · 173 Cities · Peer-to-Peer Intercity Logistics</span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Bedrock","Step Functions","S3","DynamoDB","API Gateway","Lambda","Amplify","SAM","Amazon Pay"].map(s => (
              <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200 font-semibold text-[10px]">AWS {s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
