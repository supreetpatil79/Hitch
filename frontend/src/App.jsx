import React, { useState } from "react";
import { Package, Truck, BarChart3, Globe, BadgeCheck, Sparkles } from "lucide-react";
import SenderPortal from "./components/SenderPortal";
import CarrierPortal from "./components/CarrierPortal";
import AdminPortal from "./components/AdminPortal";

const PORTALS = [
  { id: "sender",  label: "Sender Portal",  icon: Package,  accent: "bg-hitchOrange text-white",  tag: "hitch-orange" },
  { id: "carrier", label: "Carrier Portal",  icon: Truck,    accent: "bg-hitchBlue text-white",    tag: "hitch-blue" },
  { id: "admin",   label: "Admin Dashboard", icon: BarChart3, accent: "bg-zinc-900 text-white",    tag: "admin" },
];

export default function App() {
  const [portal, setPortal] = useState("sender");

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
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl tracking-tight text-zinc-900">Hitch</span>
              <span className="hidden sm:block text-xs font-bold px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full border border-zinc-200">
                Bharat Builds on AWS
              </span>
              <span className="hidden md:flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-hitchOrange/10 text-hitchOrange rounded-full border border-hitchOrange/20">
                <Globe className="w-3 h-3" /> 173 Cities
              </span>
            </div>
          </div>

          {/* Portal Switcher */}
          <nav className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 gap-0.5">
            {PORTALS.map(({ id, label, icon: Icon, accent }) => (
              <button key={id} onClick={() => setPortal(id)}
                className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all " +
                  (portal === id ? accent + " shadow-sm" : "text-zinc-500 hover:text-zinc-900 hover:bg-white/60")}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>

          {/* Right: AWS badge */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span>Bedrock AI</span>
            </div>
            <div className="w-px h-4 bg-zinc-200" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
              <span>Step Functions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Portal Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {portal === "sender"  && <SenderPortal />}
        {portal === "carrier" && <CarrierPortal />}
        {portal === "admin"   && <AdminPortal />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zincBorder py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <span>Hitch Technology Platform · Section 79 IT Act 2000 · 173 Cities · Peer-to-Peer Intercity Logistics</span>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["Bedrock","Step Functions","S3","DynamoDB","API Gateway","Lambda","Amplify","SAM"].map(s => (
              <span key={s} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-full border border-zinc-200 font-semibold text-[10px]">AWS {s}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
