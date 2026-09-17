import React, { useState } from "react";
import {
  TrendingUp, Activity, Server, Database, Shield, AlertCircle,
  RefreshCw, CheckCircle2, Clock, IndianRupee, BarChart3,
  AlertTriangle, CircleDot, ChevronRight, X, Check, Zap,
  ArrowUpRight, ArrowDownRight, GitBranch, Eye
} from "lucide-react";

const METRIC_CARDS = [
  { label: "Total GMV (₹)", value: "₹18,42,900", delta: "+12.4%", up: true, sub: "Last 30 days", color: "text-hitchEmerald", bg: "bg-hitchEmerald/10", icon: IndianRupee },
  { label: "Active Match Rate", value: "94.7%", delta: "+2.1%", up: true, sub: "vs last week", color: "text-hitchBlue", bg: "bg-hitchBlue/10", icon: Activity },
  { label: "Outbox Relay Latency", value: "84 ms", delta: "-11ms", up: true, sub: "p95 avg", color: "text-violet-600", bg: "bg-violet-50", icon: Zap },
  { label: "Security Audit Status", value: "PASS", delta: "0 alerts", up: true, sub: "Last scan: 2h ago", color: "text-emerald-600", bg: "bg-emerald-50", icon: Shield },
];

const CORRIDORS = [
  { route: "BLR ↔ HYD", demand: 87, supply: 64, gmv: 3120, active: 14 },
  { route: "DEL ↔ CHD", demand: 72, supply: 71, gmv: 2480, active: 9 },
  { route: "MUM ↔ PNE", demand: 91, supply: 88, gmv: 4210, active: 22 },
  { route: "MUM ↔ DEL", demand: 65, supply: 38, gmv: 5100, active: 7 },
  { route: "CHN ↔ BLR", demand: 58, supply: 52, gmv: 1840, active: 11 },
  { route: "KOL ↔ DEL", demand: 44, supply: 31, gmv: 1620, active: 5 },
];

const OUTBOX_EVENTS = [
  { id: "EVT-0091", type: "DELIVERY_COMPLETED",   status: "PUBLISHED", latency: 42, tries: 1, ts: "17:28:01" },
  { id: "EVT-0090", type: "ESCROW_RELEASED",      status: "PUBLISHED", latency: 67, tries: 1, ts: "17:27:44" },
  { id: "EVT-0089", type: "PICKUP_OTP_VERIFIED",  status: "PUBLISHED", latency: 38, tries: 1, ts: "17:26:12" },
  { id: "EVT-0088", type: "CARRIER_ACCEPTED",     status: "RETRY",     latency: 890, tries: 3, ts: "17:24:50" },
  { id: "EVT-0087", type: "PARCEL_MATCHED",       status: "PUBLISHED", latency: 55, tries: 1, ts: "17:23:01" },
  { id: "EVT-0086", type: "BEDROCK_INSPECTION",   status: "DLQ",       latency: 5200, tries: 5, ts: "17:20:08" },
];

const DISPUTES = [
  { id: "DSP-441", parcel: "HTX-4700", type: "Missing Item", status: "OPEN",     sender: "Meera J.", amount: 8500 },
  { id: "DSP-438", parcel: "HTX-4681", type: "Damaged Goods", status: "REVIEW",  sender: "Sameer R.", amount: 3200 },
  { id: "DSP-435", parcel: "HTX-4650", type: "Late Delivery",  status: "RESOLVED", sender: "Pooja S.", amount: 400 },
];

const STATUS_STYLE_EV = {
  PUBLISHED: "bg-emerald-100 text-emerald-800",
  RETRY:     "bg-amber-100 text-amber-800",
  DLQ:       "bg-red-100 text-red-800",
};
const STATUS_STYLE_DS = {
  OPEN:     "bg-red-100 text-red-800",
  REVIEW:   "bg-amber-100 text-amber-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
};

function MiniBar({ value, max = 100, colorClass }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div className={"h-full rounded-full " + colorClass} style={{ width: `${Math.round((value / max) * 100)}%` }} />
      </div>
      <span className="text-xs font-bold text-zinc-700 w-8 text-right">{value}%</span>
    </div>
  );
}

export default function AdminPortal() {
  const [refetching, setRefetching] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);

  const doRefetch = () => {
    setRefetching(true);
    setTimeout(() => setRefetching(false), 1400);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-hitchEmerald animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-hitchEmerald">All Systems Nominal</span>
          </div>
          <h1 className="font-display text-4xl text-zinc-900">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time platform health, corridor metrics, and dispute resolution.</p>
        </div>
        <button onClick={doRefetch}
          className={"flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all " +
            (refetching ? "border-zinc-200 bg-zinc-50 text-zinc-400" : "border-zinc-200 hover:bg-zinc-50 text-zinc-600")}>
          <RefreshCw className={"w-4 h-4 " + (refetching ? "animate-spin" : "")} />
          {refetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-zincBorder shadow-sm p-5 space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className={"w-9 h-9 rounded-xl flex items-center justify-center " + m.bg}>
                  <Icon className={"w-5 h-5 " + m.color} />
                </div>
                <div className={"flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full " +
                  (m.up ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
                  {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {m.delta}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-zinc-900">{m.value}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{m.label}</p>
                <p className="text-[10px] text-zinc-400 mt-1">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Corridor Heatmap */}
      <div className="bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-hitchEmerald" /> Corridor Liquidity Heatmap</h2>
          <span className="text-xs text-zinc-400">Top 6 active corridors</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                {["Corridor","Demand","Supply","GMV (₹)","Active Trips","Liquidity"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold uppercase text-zinc-400 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CORRIDORS.map((c, i) => {
                const liq = Math.round((c.supply / c.demand) * 100);
                const liqColor = liq >= 80 ? "bg-emerald-400" : liq >= 60 ? "bg-amber-400" : "bg-red-400";
                return (
                  <tr key={c.route} className={"border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors " + (i % 2 === 0 ? "" : "bg-zinc-50/30")}>
                    <td className="px-5 py-3.5 font-bold text-zinc-900">{c.route}</td>
                    <td className="px-5 py-3.5"><MiniBar value={c.demand} colorClass="bg-hitchOrange/60" /></td>
                    <td className="px-5 py-3.5"><MiniBar value={c.supply} colorClass="bg-hitchBlue/60" /></td>
                    <td className="px-5 py-3.5 font-semibold text-zinc-700">₹{c.gmv.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 font-bold text-xs rounded-full border border-zinc-200">{c.active}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className={"w-2 h-2 rounded-full " + liqColor} />
                        <span className={"text-xs font-bold " + (liq >= 80 ? "text-emerald-700" : liq >= 60 ? "text-amber-700" : "text-red-700")}>{liq}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid: Outbox + Disputes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Outbox Health */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-violet-600" /> Transactional Outbox Monitor
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <CircleDot className="w-3 h-3 animate-pulse" /> Live
              </span>
            </div>
          </div>
          <div className="px-6 py-3 border-b border-zinc-50 bg-zinc-50/50 flex items-center gap-6 text-xs font-bold text-zinc-500">
            <span>Queue: <strong className="text-zinc-900">847</strong> pending</span>
            <span>Retries: <strong className="text-amber-700">3</strong></span>
            <span>DLQ: <strong className="text-red-700">1</strong></span>
            <span>Processed today: <strong className="text-zinc-900">12,441</strong></span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-100">
                  {["Event ID","Type","Status","Latency","Tries","Time"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-bold uppercase text-zinc-400 tracking-wider text-[10px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OUTBOX_EVENTS.map(ev => (
                  <tr key={ev.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-zinc-500">{ev.id}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-800">{ev.type}</td>
                    <td className="px-4 py-3">
                      <span className={"px-2 py-0.5 rounded-full text-[10px] font-bold " + (STATUS_STYLE_EV[ev.status] || "bg-zinc-100 text-zinc-600")}>{ev.status}</span>
                    </td>
                    <td className={"px-4 py-3 font-mono font-bold " + (ev.latency > 500 ? "text-red-600" : ev.latency > 100 ? "text-amber-600" : "text-emerald-600")}>
                      {ev.latency}ms
                    </td>
                    <td className="px-4 py-3 font-bold text-zinc-700">{ev.tries}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">{ev.ts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zincBorder shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Dispute Console
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">{DISPUTES.filter(d => d.status !== "RESOLVED").length} Active</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {DISPUTES.map(d => (
              <div key={d.id} className="px-6 py-4 hover:bg-zinc-50 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400">{d.id}</span>
                      <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (STATUS_STYLE_DS[d.status] || "bg-zinc-100 text-zinc-600")}>{d.status}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900">{d.type}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{d.parcel}</span>
                      <span>·</span>
                      <span>{d.sender}</span>
                      <span>·</span>
                      <span className="font-semibold text-zinc-700">₹{d.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {d.status !== "RESOLVED" && (
                      <button onClick={() => setSelectedDispute(d.id === selectedDispute ? null : d.id)}
                        className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-hitchBlue/10 text-hitchBlue hover:bg-hitchBlue/20 transition-all">
                        {selectedDispute === d.id ? "Close" : "Review"}
                      </button>
                    )}
                  </div>
                </div>
                {selectedDispute === d.id && (
                  <div className="mt-3 pt-3 border-t border-zinc-100 space-y-2 animate-fadeIn">
                    <p className="text-xs text-zinc-500 font-medium">Dispute actions:</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all">
                        ✓ Approve Refund ₹{d.amount.toLocaleString()}
                      </button>
                      <button className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-all">
                        ✗ Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
