import React, { useState } from "react";
import {
  Wallet, ArrowUpRight, ArrowDownRight, IndianRupee, Clock,
  CheckCircle2, ShieldCheck, Sparkles, Building2, Zap, ArrowRight,
  TrendingUp, Download, RefreshCw, Smartphone, QrCode, X, Check,
  AlertCircle, ChevronRight, Layers, CreditCard
} from "lucide-react";

export default function EarningsPortal({ carrierWallet, onWithdraw, onSelectPortal }) {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("amazonpay");
  const [withdrawStatus, setWithdrawStatus] = useState("idle"); // idle | processing | success
  const [withdrawLogs, setWithdrawLogs] = useState([]);

  const balance = carrierWallet?.availableBalance ?? 3450;
  const escrow = carrierWallet?.escrowPending ?? 260;
  const lifetime = carrierWallet?.lifetimeEarned ?? 42300;
  const transactions = carrierWallet?.transactions ?? [];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount) || balance;
    if (amt <= 0 || amt > balance) {
      alert("Invalid withdrawal amount! Maximum available: ₹" + balance);
      return;
    }

    setWithdrawStatus("processing");
    setWithdrawLogs(["Initializing instant settlement request..."]);

    setTimeout(() => {
      setWithdrawLogs(prev => [...prev, `Connecting to ${withdrawMethod === "amazonpay" ? "Amazon Pay Wallet Payout API" : "NPCI UPI Instant IMPS Network"}...`]);
    }, 600);

    setTimeout(() => {
      setWithdrawLogs(prev => [...prev, `Authorization: 200 OK (UTR: AMZN-IMPS-${Math.floor(10000000 + Math.random() * 90000000)})`]);
    }, 1200);

    setTimeout(() => {
      setWithdrawLogs(prev => [...prev, "Payout Dispatched: Wallet updated in DynamoDB ✓"]);
      if (onWithdraw) onWithdraw(amt, withdrawMethod);
      setWithdrawStatus("success");
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Instant Escrow Payout Engine</span>
          </div>
          <h1 className="font-display text-4xl text-zinc-900">Carrier Wallet &amp; Earnings</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time escrow releases, wallet payouts, and instant UPI/Amazon Pay settlements.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => { setWithdrawAmount(balance.toString()); setIsWithdrawModalOpen(true); setWithdrawStatus("idle"); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-sm transition-all">
            <Zap className="w-4 h-4" /> Instant Withdraw
          </button>
          <button onClick={() => onSelectPortal && onSelectPortal("carrier")}
            className="px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 text-sm transition-all">
            Find More Cargo →
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Available to Withdraw</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900">₹{balance.toLocaleString()}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready for instant payout
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Escrow In-Transit</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-hitchBlue flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-hitchBlue">₹{escrow.toLocaleString()}</p>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Locks until delivery OTP handshake</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Lifetime Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900">₹{lifetime.toLocaleString()}</p>
            <p className="text-xs text-purple-600 font-semibold mt-0.5">+18% vs last month</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Completed Deliveries</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-zinc-900">144</p>
            <p className="text-xs text-amber-600 font-semibold mt-0.5">100% OTP Verified Handshakes</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Corridor Monetization & Real-Time Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Mode & Route Breakdown */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-hitchBlue" /> Monetization by Travel Mode
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>🚆 Electrified Rail (Vande Bharat)</span>
                  <span className="text-hitchBlue">62% (₹26,200)</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-hitchBlue rounded-full" style={{ width: "62%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>🚗 Expressway Carpool</span>
                  <span className="text-amber-600">26% (₹11,000)</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "26%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>✈️ Domestic Air Transit</span>
                  <span className="text-purple-600">12% (₹5,100)</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: "12%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#FF9900] text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Amazon Pay Linked Account
            </div>
            <p className="text-sm font-bold">Instant Payout Settlements</p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every OTP delivery handshake automatically triggers AWS Step Functions callback, crediting your Amazon Pay Wallet balance in under 50 milliseconds.
            </p>
            <div className="pt-2 border-t border-zinc-700 flex justify-between items-center text-xs">
              <span className="text-zinc-400">KYC Status:</span>
              <span className="text-emerald-400 font-bold">Verified Aadhaar ✓</span>
            </div>
          </div>
        </div>

        {/* Right: Live Transaction Ledger */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Real-Time Payout &amp; Escrow Ledger</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Live transactional records synced with delivery state machines</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                Instant Payouts · Zero Settlement Fees
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Sync
              </span>
            </div>
          </div>

          <div className="divide-y divide-zinc-100">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-zinc-400 text-xs">
                No recent transactions. Complete a delivery handshake to see real-time payouts reflect here!
              </div>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="p-5 hover:bg-zinc-50/70 transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={"w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 " +
                      (tx.type === "WITHDRAWAL" ? "bg-zinc-100 text-zinc-800" : "bg-emerald-50 text-emerald-600 border border-emerald-200")}>
                      {tx.type === "WITHDRAWAL" ? <ArrowUpRight className="w-5 h-5 text-zinc-600" /> : <ArrowDownRight className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 text-sm">{tx.description || tx.type}</span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">{tx.id}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{tx.route ? `${tx.route} · ` : ""}{tx.time || "Today"}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={"text-base font-bold " + (tx.type === "WITHDRAWAL" ? "text-zinc-900" : "text-emerald-600")}>
                      {tx.type === "WITHDRAWAL" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {tx.status || "SETTLED"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-zinc-200 overflow-hidden">
            <div className="bg-zinc-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-base">Instant Wallet Payout</span>
              </div>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="p-1 rounded-full text-zinc-400 hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {withdrawStatus === "idle" && (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-1.5">Withdrawal Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">₹</span>
                      <input type="number" min="10" max={balance} value={withdrawAmount}
                        onChange={e => setWithdrawAmount(e.target.value)}
                        className="w-full pl-8 pr-3 py-3 border border-zinc-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        placeholder="Enter amount" required />
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">Available balance: ₹{balance.toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Payout Destination</label>
                    <div className="space-y-2">
                      {[
                        { id: "amazonpay", name: "Amazon Pay Wallet", desc: "Instant 0% fee deposit", badge: "Recommended" },
                        { id: "upi", name: "UPI Direct Transfer", desc: "carrier@okhitch", badge: "Instant" },
                        { id: "bank", name: "IMPS Bank Transfer", desc: "HDFC Bank A/C •••• 9812", badge: "2 min" },
                      ].map(m => (
                        <div key={m.id} onClick={() => setWithdrawMethod(m.id)}
                          className={"p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between " +
                            (withdrawMethod === m.id ? "border-emerald-500 bg-emerald-50/50 shadow-xs" : "border-zinc-200 hover:bg-zinc-50")}>
                          <div className="flex items-center gap-2.5">
                            <div className={"w-4 h-4 rounded-full border flex items-center justify-center " +
                              (withdrawMethod === m.id ? "border-emerald-500 bg-emerald-500" : "border-zinc-300")}>
                              {withdrawMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-zinc-900">{m.name}</p>
                              <p className="text-[10px] text-zinc-500">{m.desc}</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {m.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2">
                    <span>Withdraw ₹{withdrawAmount || balance} Instantly</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {withdrawStatus === "processing" && (
                <div className="py-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                  <div>
                    <p className="text-base font-bold text-zinc-900">Processing Instant Withdrawal</p>
                    <p className="text-xs text-zinc-500 mt-1">Routing funds to {withdrawMethod.toUpperCase()} payout gateway...</p>
                  </div>
                  <div className="bg-zinc-900 text-emerald-400 font-mono text-[10px] p-3.5 rounded-xl text-left space-y-1.5">
                    {withdrawLogs.map((l, i) => <p key={i}>❯ {l}</p>)}
                  </div>
                </div>
              )}

              {withdrawStatus === "success" && (
                <div className="py-6 space-y-4 text-center animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900">Withdrawal Successful!</h3>
                    <p className="text-xs text-zinc-500 mt-1">₹{withdrawAmount} has been credited to your {withdrawMethod.toUpperCase()}.</p>
                  </div>
                  <button onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 transition-all">
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
