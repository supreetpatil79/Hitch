import React from "react";
import { Train, Car, Bus, Plane, Bike, Landmark, Sparkles, Navigation } from "lucide-react";

export default function RoutePreviewIllustration({ mode = "train", origin = "Bengaluru", destination = "Mumbai", transportName, carrierName }) {
  const org = origin || "Bengaluru";
  const dst = destination || "Mumbai";

  if (mode === "train") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-4 shadow-sm relative overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ELECTRIFIED RAIL
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              130 km/h Track Speed
            </span>
          </div>
        </div>

        <div className="relative h-44 bg-zinc-50/70 rounded-2xl border border-zinc-100 p-3.5 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start z-10 px-4">
            <div className="flex flex-col items-center">
              <div className="w-9 h-8 bg-zinc-200/90 rounded-lg flex items-center justify-center text-zinc-600 shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Vidhana Soudha</span>
            </div>

            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-zinc-800">1,082 km</span>
              <span className="text-[10px] text-zinc-500">· ~16.6h · {transportName || "Vande Bharat"}</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-9 h-8 bg-zinc-200/90 rounded-lg flex items-center justify-center text-zinc-600 shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Gateway of India</span>
            </div>
          </div>

          {/* Animated SVG Track with Gliding Vande Bharat Train */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 160" fill="none">
              <path d="M 50 130 Q 250 30 450 130" stroke="#CBD5E1" strokeWidth="12" strokeLinecap="round" />
              <path d="M 50 130 Q 250 30 450 130" stroke="#475569" strokeWidth="4" strokeDasharray="6 8" />
              {/* Animated Train Group with CSS smooth pulse */}
              <g className="animate-pulse" transform="translate(225, 46) rotate(4)">
                <rect x="0" y="0" width="60" height="15" rx="4" fill="#0284C7" />
                <rect x="46" y="2" width="11" height="11" rx="2" fill="#38BDF8" />
                <circle cx="12" cy="7.5" r="2.5" fill="#FFFFFF" />
                <circle cx="26" cy="7.5" r="2.5" fill="#FFFFFF" />
                <circle cx="40" cy="7.5" r="2.5" fill="#FFFFFF" />
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-end z-10 px-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-2.5 py-1 shadow-2xs">
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

            <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-[8px] font-bold text-blue-700 uppercase">Central Terminal</p>
                <p className="text-[10px] font-bold text-zinc-900">{dst}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1">
            <Navigation className="w-3 h-3 text-zinc-400" /> Dedicated electrified railway corridor with zero traffic
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "bus") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-4 shadow-sm relative overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              INTERCITY TRUNK
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              80 km/h Highway Cruiser
            </span>
          </div>
        </div>

        <div className="relative h-44 bg-zinc-50/70 rounded-2xl border border-zinc-100 p-3.5 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start z-10 px-4">
            <div className="flex flex-col items-center">
              <div className="w-9 h-8 bg-zinc-200/90 rounded-lg flex items-center justify-center text-zinc-600 shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Vidhana Soudha</span>
            </div>
            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-zinc-800">1,082 km</span>
              <span className="text-[10px] text-zinc-500">· ~16.6h · Intercity Bus</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-9 h-8 bg-zinc-200/90 rounded-lg flex items-center justify-center text-zinc-600 shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Gateway of India</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 160" fill="none">
              <path d="M 50 130 Q 250 30 450 130" stroke="#334155" strokeWidth="18" strokeLinecap="round" />
              <path d="M 50 130 Q 250 30 450 130" stroke="#FDE047" strokeWidth="2" strokeDasharray="10 10" />
              <g className="animate-pulse" transform="translate(315, 66) rotate(14)">
                <rect x="0" y="0" width="34" height="15" rx="3" fill="#D97706" />
                <rect x="2" y="2" width="26" height="11" rx="1" fill="#FEF3C7" />
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-end z-10 px-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1 shadow-2xs">
              <p className="text-[8px] font-bold text-amber-700 uppercase">Bus Terminal</p>
              <p className="text-[10px] font-bold text-zinc-900">{org}</p>
            </div>
            <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
              ☕ 24×7 Highway Dhaba
            </span>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 shadow-2xs">
              <p className="text-[8px] font-bold text-blue-700 uppercase">City Hub</p>
              <p className="text-[10px] font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span>Reliable trunk route connection across state highways</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "flight") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-4 shadow-sm relative overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              SKYWAY FLIGHT
            </span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              840 km/h Airspeed
            </span>
          </div>
        </div>

        <div className="relative h-44 bg-zinc-50/70 rounded-2xl border border-zinc-100 p-3.5 flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start z-10 px-4">
            <div className="flex flex-col items-center">
              <div className="w-9 h-8 bg-zinc-200/90 rounded-lg flex items-center justify-center text-zinc-600 shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Vidhana Soudha</span>
            </div>
            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold text-zinc-800">1,082 km</span>
              <span className="text-[10px] text-zinc-500">· ~1.6h · Direct Airway</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-9 h-8 bg-zinc-200/90 rounded-lg flex items-center justify-center text-zinc-600 shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-bold text-zinc-500 mt-1 bg-white px-1.5 py-0.5 rounded shadow-xs">Gateway of India</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 500 160" fill="none">
              <path d="M 60 120 Q 250 20 440 120" stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 6" />
              <g className="animate-pulse" transform="translate(335, 50) rotate(18)">
                <path d="M 0 0 L 20 7 L 7 9 L 9 18 L 4 18 L 3 11 L -2 10 Z" fill="#0284C7" />
              </g>
            </svg>
          </div>

          <div className="flex justify-between items-end z-10 px-3">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 shadow-2xs">
              <p className="text-[8px] font-bold text-blue-700 uppercase">Origin Airport</p>
              <p className="text-[10px] font-bold text-zinc-900">{org}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] font-mono font-bold bg-zinc-900 text-cyan-400 px-2 py-0.5 rounded">
                AIRWAY W20 · FL340
              </span>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-2.5 py-1 shadow-2xs">
              <p className="text-[8px] font-bold text-blue-700 uppercase">Dest Airport</p>
              <p className="text-[10px] font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
          <span>High-altitude airway with non-stop aerial transit</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-semibold">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for Car / Bike
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-4 shadow-sm relative overflow-hidden animate-fadeIn">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shadow-xs">
            {mode === "bike" ? <Bike className="w-4 h-4" /> : <Car className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-xs font-bold text-zinc-900">{org} → {dst}</span>
            {carrierName && <p className="text-[10px] text-zinc-400">Carrier: {carrierName}</p>}
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-200 uppercase">
          {mode === "bike" ? "Last-Mile Express" : "Private Expressway"}
        </span>
      </div>
      <div className="h-36 bg-zinc-50/70 rounded-2xl border border-zinc-100 flex items-center justify-center">
        <p className="text-xs text-zinc-600 font-medium">Corridor active: {org} to {dst} via National Expressway ({transportName || "Carpool"})</p>
      </div>
    </div>
  );
}
