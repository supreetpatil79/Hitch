import React from "react";
import { Train, Car, Bus, Plane, Bike, Sparkles, Navigation } from "lucide-react";

// Distance and duration calculation helper
function getRouteMetrics(origin, destination, mode) {
  const org = (origin || "Bengaluru").trim();
  const dst = (destination || "Mumbai").trim();

  // Special case for Bengaluru -> Mysuru
  if ((org.toLowerCase().includes("bengaluru") || org.toLowerCase().includes("bangalore")) &&
      (dst.toLowerCase().includes("mysuru") || dst.toLowerCase().includes("mysore"))) {
    if (mode === "flight") return { distance: "164 km", time: "~2.5h", service: "Direct" };
    if (mode === "bus") return { distance: "164 km", time: "~2.5h", service: "Intercity" };
    if (mode === "car") return { distance: "164 km", time: "~2.5h", service: "National" };
    if (mode === "bike") return { distance: "164 km", time: "~3.2h", service: "Express" };
    return { distance: "164 km", time: "~2.5h", service: "Vande" };
  }

  // Default / other routes (e.g. BLR -> MUM)
  if (mode === "flight") return { distance: "1,082 km", time: "~1.6h", service: "Direct" };
  if (mode === "bus") return { distance: "1,082 km", time: "~16.6h", service: "Intercity" };
  if (mode === "car") return { distance: "1,082 km", time: "~14.2h", service: "National" };
  if (mode === "bike") return { distance: "1,082 km", time: "~20.5h", service: "Express" };
  return { distance: "1,082 km", time: "~16.6h", service: "Vande" };
}

export default function RoutePreviewIllustration({
  mode = "train",
  origin = "Bengaluru",
  destination = "Mumbai",
  transportName,
  carrierName
}) {
  const org = origin || "Bengaluru";
  const dst = destination || "Mumbai";
  const metrics = getRouteMetrics(org, dst, mode);

  const isMysuru = dst.toLowerCase().includes("mysuru") || dst.toLowerCase().includes("mysore");
  const isMumbai = dst.toLowerCase().includes("mumbai") || dst.toLowerCase().includes("bombay");
  const rightLandmarkLabel = isMysuru ? "Mysuru Hub" : isMumbai ? "Gateway of India" : `${dst} Hub`;

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. TRAIN MODE (Electrified Railway Track with Vande Bharat Train & Signals)
  // ─────────────────────────────────────────────────────────────────────────────
  if (mode === "train") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-3 shadow-xs relative overflow-hidden animate-fadeIn">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Verified Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ELECTRIFIED RAIL
            </span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200/60">
              130 km/h Track Speed
            </span>
          </div>
        </div>

        {/* SVG Canvas with Dot Grid */}
        <div className="relative h-60 w-full bg-[#FCFCFD] rounded-2xl border border-zinc-100/90 overflow-hidden select-none">
          {/* Dot Grid Background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Left Landmark: Vidhana Soudha */}
          <div className="absolute top-4 left-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <path d="M 32 4 L 8 16 L 56 16 Z" fill="#64748B" />
              <rect x="12" y="16" width="40" height="4" fill="#475569" />
              <rect x="14" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="23" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="36" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="45" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="8" y="38" width="48" height="6" rx="1" fill="#475569" />
              {/* Dome */}
              <path d="M 28 8 A 4 4 0 0 1 36 8 Z" fill="#CBD5E1" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              Vidhana Soudha
            </span>
          </div>

          {/* Center Floating Distance Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-zinc-900">{metrics.distance}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-600">{metrics.time}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs font-medium text-zinc-600">{transportName || metrics.service}</span>
            </div>
          </div>

          {/* Right Landmark */}
          <div className="absolute top-4 right-10 flex flex-col items-center z-10">
            {isMumbai ? (
              <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
                <path d="M 12 10 L 52 10 L 52 42 L 44 42 L 44 26 C 44 20 20 20 20 26 L 20 42 L 12 42 Z" fill="#64748B" />
                <rect x="8" y="6" width="48" height="4" rx="1" fill="#475569" />
                <rect x="14" y="2" width="6" height="4" rx="1" fill="#94A3B8" />
                <rect x="44" y="2" width="6" height="4" rx="1" fill="#94A3B8" />
              </svg>
            ) : (
              <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
                <rect x="14" y="16" width="10" height="24" rx="1" fill="#64748B" />
                <rect x="27" y="10" width="10" height="30" rx="1" fill="#475569" />
                <rect x="40" y="18" width="10" height="22" rx="1" fill="#94A3B8" />
              </svg>
            )}
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              {rightLandmarkLabel}
            </span>
          </div>

          {/* Railway Tracks & Moving Vande Bharat Train SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 760 240" fill="none">
              {/* Main Curve Arch Rails */}
              <path d="M 110 200 Q 380 45 650 200" stroke="#94A3B8" strokeWidth="14" strokeLinecap="round" />
              <path d="M 110 200 Q 380 45 650 200" stroke="#F8FAFC" strokeWidth="8" strokeLinecap="round" />

              {/* Railway Ties / Sleepers (Spaced along the arch) */}
              <path d="M 110 200 Q 380 45 650 200" stroke="#334155" strokeWidth="16" strokeDasharray="4 16" />

              {/* Steel Inner Rails */}
              <path d="M 110 197 Q 380 42 650 197" stroke="#475569" strokeWidth="2.5" />
              <path d="M 110 203 Q 380 48 650 203" stroke="#475569" strokeWidth="2.5" />

              {/* Signal Left (near origin) */}
              <g transform="translate(255, 95)">
                <line x1="10" y1="20" x2="10" y2="45" stroke="#334155" strokeWidth="3" />
                <rect x="4" y="0" width="12" height="22" rx="6" fill="#0F172A" />
                <circle cx="10" cy="6" r="3.5" fill="#22C55E" className="animate-pulse" />
                <circle cx="10" cy="15" r="3" fill="#334155" />
                <rect x="0" y="24" width="20" height="7" rx="2" fill="#E2E8F0" />
                <text x="10" y="29.5" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#334155">S-14</text>
              </g>

              {/* Signal Right (near dest) */}
              <g transform="translate(525, 95)">
                <line x1="10" y1="20" x2="10" y2="45" stroke="#334155" strokeWidth="3" />
                <rect x="4" y="0" width="12" height="22" rx="6" fill="#0F172A" />
                <circle cx="10" cy="6" r="3.5" fill="#22C55E" className="animate-pulse" />
                <circle cx="10" cy="15" r="3" fill="#334155" />
              </g>

              {/* Vande Bharat Train Group with Gliding / Pulsing animation */}
              <g className="animate-pulse" transform="translate(320, 68) rotate(3)">
                {/* Yellow Headlight Beam Cone */}
                <polygon points="120,4 165,-10 165,22 120,10" fill="#FEF08A" opacity="0.6" />

                {/* Coach 1 (Rear) */}
                <rect x="0" y="0" width="34" height="13" rx="2.5" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="2" y="3" width="30" height="4" rx="1" fill="#0369A1" />
                <circle cx="8" cy="13" r="2.5" fill="#334155" />
                <circle cx="26" cy="13" r="2.5" fill="#334155" />

                {/* Coupler */}
                <line x1="34" y1="7" x2="38" y2="7" stroke="#334155" strokeWidth="2.5" />

                {/* Coach 2 (Middle) */}
                <rect x="38" y="0" width="36" height="13" rx="2.5" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" />
                <rect x="40" y="3" width="32" height="4" rx="1" fill="#0369A1" />
                <circle cx="46" cy="13" r="2.5" fill="#334155" />
                <circle cx="66" cy="13" r="2.5" fill="#334155" />

                {/* Coupler */}
                <line x1="74" y1="7" x2="78" y2="7" stroke="#334155" strokeWidth="2.5" />

                {/* Coach 3 / Engine (Front Aerodynamic Nose) */}
                <path d="M 78 0 L 110 0 Q 124 5 124 13 L 78 13 Z" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1.5" />
                <path d="M 80 3 L 108 3 Q 118 6 118 7 L 80 7 Z" fill="#0369A1" />
                {/* Front Windshield */}
                <path d="M 108 1 L 118 4 L 118 7 L 108 7 Z" fill="#0284C7" />
                <circle cx="86" cy="13" r="2.5" fill="#334155" />
                <circle cx="106" cy="13" r="2.5" fill="#334155" />
              </g>
            </svg>
          </div>

          {/* Milestone Badges along track */}
          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <span className="text-[9px] font-mono font-bold bg-[#FACC15] text-zinc-950 px-2.5 py-0.5 rounded border border-amber-400 shadow-2xs">
              KM 342/12
            </span>
            <span className="text-[9px] font-bold bg-[#DCFCE7] text-[#166534] px-2.5 py-0.5 rounded border border-[#86EFAC] shadow-2xs">
              ⚡ 25kV AC ELECTRIFIED
            </span>
          </div>

          {/* Bottom Left Origin Pill */}
          <div className="absolute bottom-2 left-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="bg-[#ECFDF5] border border-emerald-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-emerald-800 tracking-wider uppercase">Rail Junction</p>
              <p className="text-xs font-bold text-zinc-900">{org}</p>
            </div>
          </div>

          {/* Bottom Right Dest Pill */}
          <div className="absolute bottom-2 right-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-xs mb-1">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-blue-800 tracking-wider uppercase">Central Terminal</p>
              <p className="text-xs font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium text-zinc-600">
            <span className="text-zinc-400">⇄</span> Dedicated electrified railway corridor with zero traffic
          </span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold flex items-center gap-1">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. BUS MODE (Highway Trunk with Scania/Volvo Bus, Trees & 24x7 Dhaba)
  // ─────────────────────────────────────────────────────────────────────────────
  if (mode === "bus") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-3 shadow-xs relative overflow-hidden animate-fadeIn">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Verified Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              INTERCITY TRUNK
            </span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200/60">
              80 km/h Highway Cruiser
            </span>
          </div>
        </div>

        {/* SVG Canvas with Dot Grid & Trees */}
        <div className="relative h-60 w-full bg-[#FCFCFD] rounded-2xl border border-zinc-100/90 overflow-hidden select-none">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Left Landmark */}
          <div className="absolute top-4 left-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <path d="M 32 4 L 8 16 L 56 16 Z" fill="#64748B" />
              <rect x="12" y="16" width="40" height="4" fill="#475569" />
              <rect x="14" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="23" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="36" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="45" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="8" y="38" width="48" height="6" rx="1" fill="#475569" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              Vidhana Soudha
            </span>
          </div>

          {/* Center Floating Distance Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-zinc-900">{metrics.distance}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-600">{metrics.time}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs font-medium text-zinc-600">{transportName || metrics.service}</span>
            </div>
          </div>

          {/* Right Landmark */}
          <div className="absolute top-4 right-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <rect x="14" y="16" width="10" height="24" rx="1" fill="#64748B" />
              <rect x="27" y="10" width="10" height="30" rx="1" fill="#475569" />
              <rect x="40" y="18" width="10" height="22" rx="1" fill="#94A3B8" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              {rightLandmarkLabel}
            </span>
          </div>

          {/* Highway Asphalt & Moving Bus SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 760 240" fill="none">
              {/* Green Pine Trees along the route */}
              <g transform="translate(190, 85)">
                <polygon points="10,0 2,16 18,16" fill="#10B981" />
                <rect x="9" y="16" width="2" height="4" fill="#78350F" />
              </g>
              <g transform="translate(520, 85)">
                <polygon points="10,0 2,16 18,16" fill="#10B981" />
                <rect x="9" y="16" width="2" height="4" fill="#78350F" />
              </g>

              {/* Asphalt Road Curve */}
              <path d="M 110 200 Q 380 45 650 200" stroke="#1E293B" strokeWidth="26" strokeLinecap="round" />
              {/* White Shoulder Stripes */}
              <path d="M 110 188 Q 380 33 650 188" stroke="#F8FAFC" strokeWidth="1.5" />
              <path d="M 110 212 Q 380 57 650 212" stroke="#F8FAFC" strokeWidth="1.5" />
              {/* Yellow Dashed Center Divider */}
              <path d="M 110 200 Q 380 45 650 200" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="10 10" />

              {/* Intercity Bus with headlights */}
              <g className="animate-pulse" transform="translate(435, 96) rotate(14)">
                {/* Yellow Headlight Beam */}
                <polygon points="45,3 85,-6 85,18 45,9" fill="#FEF08A" opacity="0.6" />

                <rect x="0" y="0" width="46" height="15" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
                {/* Windows */}
                <rect x="3" y="2" width="38" height="6" rx="1" fill="#FEF3C7" />
                <rect x="30" y="2" width="12" height="6" rx="1" fill="#FDE68A" />
                {/* Wheels */}
                <circle cx="9" cy="15" r="3" fill="#0F172A" />
                <circle cx="36" cy="15" r="3" fill="#0F172A" />
              </g>
            </svg>
          </div>

          {/* Milestone: 24x7 Highway Dhaba */}
          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 z-10">
            <span className="text-[9px] font-bold bg-[#FEF3C7] text-[#92400E] px-3 py-0.5 rounded-full border border-amber-300 shadow-2xs flex items-center gap-1">
              ☕ 24×7 Highway Dhaba
            </span>
          </div>

          {/* Bottom Left Origin Pill */}
          <div className="absolute bottom-2 left-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-xs mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            </div>
            <div className="bg-[#FFFBEB] border border-amber-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-amber-800 tracking-wider uppercase">Bus Terminal</p>
              <p className="text-xs font-bold text-zinc-900">{org}</p>
            </div>
          </div>

          {/* Bottom Right Dest Pill */}
          <div className="absolute bottom-2 right-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-xs mb-1">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-blue-800 tracking-wider uppercase">City Hub</p>
              <p className="text-xs font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium text-zinc-600">
            <span className="text-zinc-400">⇄</span> Reliable trunk route connection across state highways
          </span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold flex items-center gap-1">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. CAR MODE (Scenic Expressway with FASTag Toll & NH-44 Badges)
  // ─────────────────────────────────────────────────────────────────────────────
  if (mode === "car") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-3 shadow-xs relative overflow-hidden animate-fadeIn">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shadow-2xs">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Verified Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200">
              SCENIC EXPRESSWAY
            </span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200/60">
              110 km/h Express Drive
            </span>
          </div>
        </div>

        {/* SVG Canvas with Trees & Car */}
        <div className="relative h-60 w-full bg-[#FCFCFD] rounded-2xl border border-zinc-100/90 overflow-hidden select-none">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Left Landmark */}
          <div className="absolute top-4 left-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <path d="M 32 4 L 8 16 L 56 16 Z" fill="#64748B" />
              <rect x="12" y="16" width="40" height="4" fill="#475569" />
              <rect x="14" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="23" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="36" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="45" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="8" y="38" width="48" height="6" rx="1" fill="#475569" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              Vidhana Soudha
            </span>
          </div>

          {/* Center Floating Distance Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-zinc-900">{metrics.distance}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-600">{metrics.time}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs font-medium text-zinc-600">{transportName || metrics.service}</span>
            </div>
          </div>

          {/* Right Landmark */}
          <div className="absolute top-4 right-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <rect x="14" y="16" width="10" height="24" rx="1" fill="#64748B" />
              <rect x="27" y="10" width="10" height="30" rx="1" fill="#475569" />
              <rect x="40" y="18" width="10" height="22" rx="1" fill="#94A3B8" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              {rightLandmarkLabel}
            </span>
          </div>

          {/* Expressway & Blue Car SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 760 240" fill="none">
              {/* Trees along expressway */}
              <g transform="translate(190, 75)">
                <polygon points="10,0 2,16 18,16" fill="#10B981" />
                <rect x="9" y="16" width="2" height="4" fill="#78350F" />
              </g>
              <g transform="translate(210, 70)">
                <circle cx="8" cy="8" r="8" fill="#059669" />
                <rect x="7" y="14" width="2" height="6" fill="#78350F" />
              </g>
              <g transform="translate(560, 75)">
                <circle cx="8" cy="8" r="8" fill="#059669" />
                <rect x="7" y="14" width="2" height="6" fill="#78350F" />
              </g>
              <g transform="translate(585, 70)">
                <polygon points="10,0 2,16 18,16" fill="#10B981" />
                <rect x="9" y="16" width="2" height="4" fill="#78350F" />
              </g>

              {/* Asphalt Expressway Curve */}
              <path d="M 110 200 Q 380 45 650 200" stroke="#1E293B" strokeWidth="26" strokeLinecap="round" />
              <path d="M 110 188 Q 380 33 650 188" stroke="#F8FAFC" strokeWidth="1.5" />
              <path d="M 110 212 Q 380 57 650 212" stroke="#F8FAFC" strokeWidth="1.5" />
              <path d="M 110 200 Q 380 45 650 200" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="10 10" />

              {/* Blue Sedan with Headlights */}
              <g className="animate-pulse" transform="translate(330, 78) rotate(3)">
                {/* Headlight beam */}
                <polygon points="44,3 85,-6 85,18 44,9" fill="#FEF08A" opacity="0.6" />

                <path d="M 4 10 L 10 3 L 30 3 L 42 7 L 44 12 L 0 12 Z" fill="#2563EB" />
                <rect x="12" y="4" width="16" height="4" rx="1" fill="#93C5FD" />
                {/* Wheels */}
                <circle cx="10" cy="13" r="3" fill="#0F172A" />
                <circle cx="34" cy="13" r="3" fill="#0F172A" />
              </g>
            </svg>
          </div>

          {/* Milestones: FASTag Toll & NH-44 Expressway */}
          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
            <span className="text-[9px] font-bold bg-[#DCFCE7] text-[#166534] px-2.5 py-0.5 rounded border border-[#86EFAC] shadow-2xs">
              FASTag TOLL CLEAR
            </span>
            <span className="text-[9px] font-mono font-bold bg-[#FACC15] text-zinc-950 px-2.5 py-0.5 rounded border border-amber-400 shadow-2xs">
              NH-44 EXPRESSWAY
            </span>
          </div>

          {/* Bottom Left Origin Pill */}
          <div className="absolute bottom-2 left-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center text-violet-700 shadow-xs mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
            </div>
            <div className="bg-[#F5F3FF] border border-violet-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-violet-800 tracking-wider uppercase">Pickup Hub</p>
              <p className="text-xs font-bold text-zinc-900">{org}</p>
            </div>
          </div>

          {/* Bottom Right Dest Pill */}
          <div className="absolute bottom-2 right-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-xs mb-1">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-blue-800 tracking-wider uppercase">Doorstep Drop</p>
              <p className="text-xs font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium text-zinc-600">
            <span className="text-zinc-400">⇄</span> Lush roadside drive with non-stop highway transit
          </span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold flex items-center gap-1">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. FLIGHT MODE (Skyway Airway with Runways 09L/27R, ATC Tower & Radar PSR)
  // ─────────────────────────────────────────────────────────────────────────────
  if (mode === "flight") {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-3 shadow-xs relative overflow-hidden animate-fadeIn">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs">
              <Plane className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-900">{org} → {dst}</span>
              {carrierName && <p className="text-[10px] text-zinc-400">Verified Carrier: {carrierName}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              SKYWAY FLIGHT
            </span>
            <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200/60">
              840 km/h Airspeed
            </span>
          </div>
        </div>

        {/* SVG Canvas with Runways & Aircraft */}
        <div className="relative h-60 w-full bg-[#FCFCFD] rounded-2xl border border-zinc-100/90 overflow-hidden select-none">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Left Landmark */}
          <div className="absolute top-4 left-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <path d="M 32 4 L 8 16 L 56 16 Z" fill="#64748B" />
              <rect x="12" y="16" width="40" height="4" fill="#475569" />
              <rect x="14" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="23" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="36" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="45" y="20" width="5" height="18" rx="1" fill="#94A3B8" />
              <rect x="8" y="38" width="48" height="6" rx="1" fill="#475569" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              Vidhana Soudha
            </span>
          </div>

          {/* Center Floating Distance Pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-zinc-900">{metrics.distance}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs text-zinc-600">{metrics.time}</span>
              <span className="text-xs text-zinc-400">·</span>
              <span className="text-xs font-medium text-zinc-600">{transportName || metrics.service}</span>
            </div>
          </div>

          {/* Right Landmark */}
          <div className="absolute top-4 right-10 flex flex-col items-center z-10">
            <svg className="w-12 h-10 text-slate-700" viewBox="0 0 64 48" fill="currentColor">
              <rect x="14" y="16" width="10" height="24" rx="1" fill="#64748B" />
              <rect x="27" y="10" width="10" height="30" rx="1" fill="#475569" />
              <rect x="40" y="18" width="10" height="22" rx="1" fill="#94A3B8" />
            </svg>
            <span className="text-[9px] font-bold text-zinc-600 mt-1 bg-white/95 px-2.5 py-0.5 rounded-full border border-zinc-200 shadow-2xs">
              {rightLandmarkLabel}
            </span>
          </div>

          {/* Skyway Trajectory & Airplane SVG */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 760 240" fill="none">
              {/* ATC Tower (Left side) */}
              <g transform="translate(205, 55)">
                <line x1="12" y1="20" x2="12" y2="40" stroke="#0F172A" strokeWidth="2.5" />
                <path d="M 4 10 L 20 10 L 16 20 L 8 20 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
                <rect x="0" y="42" width="24" height="6" rx="2" fill="#0F172A" />
                <text x="12" y="46.5" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#38BDF8">ATC TWR</text>
              </g>

              {/* Radar PSR Tower (Right side) */}
              <g transform="translate(525, 55)">
                <path d="M 6 36 L 14 14 L 22 36" stroke="#475569" strokeWidth="2" fill="none" />
                <line x1="10" y1="24" x2="18" y2="24" stroke="#475569" strokeWidth="1.5" />
                <circle cx="14" cy="10" r="5" stroke="#0284C7" strokeWidth="1.5" fill="#E0F2FE" />
                <rect x="4" y="38" width="20" height="6" rx="2" fill="#0F172A" />
                <text x="14" y="42.5" textAnchor="middle" fontSize="4" fontWeight="bold" fill="#38BDF8">RADAR PSR</text>
              </g>

              {/* Flight Skyway Dashed Arc */}
              <path d="M 150 160 Q 380 40 610 160" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="8 8" />

              {/* Left Origin Runway 09L */}
              <g transform="translate(85, 140)">
                <rect x="0" y="0" width="120" height="18" rx="3" fill="#1E293B" />
                <line x1="10" y1="9" x2="110" y2="9" stroke="#F8FAFC" strokeWidth="2" strokeDasharray="10 8" />
                <text x="12" y="12" fontSize="7" fontWeight="bold" fill="#E2E8F0">09L</text>
                {/* Green Threshold lights */}
                <circle cx="45" cy="9" r="2" fill="#22C55E" />
                <circle cx="55" cy="9" r="2" fill="#22C55E" />
                <circle cx="65" cy="9" r="2" fill="#22C55E" />
                {/* Badges */}
                <rect x="40" y="20" width="36" height="7" rx="2" fill="#0F172A" />
                <text x="58" y="25" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#38BDF8">RWY 09L</text>
                <rect x="80" y="20" width="34" height="7" rx="2" fill="#0F172A" />
                <text x="97" y="25" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#FACC15">PAPI 3.0°</text>
              </g>

              {/* Right Destination Runway 27R */}
              <g transform="translate(555, 140)">
                <rect x="0" y="0" width="120" height="18" rx="3" fill="#1E293B" />
                <line x1="10" y1="9" x2="110" y2="9" stroke="#F8FAFC" strokeWidth="2" strokeDasharray="10 8" />
                <text x="100" y="12" fontSize="7" fontWeight="bold" fill="#E2E8F0">27R</text>
                {/* Green Threshold lights */}
                <circle cx="40" cy="9" r="2" fill="#22C55E" />
                <circle cx="50" cy="9" r="2" fill="#22C55E" />
                <circle cx="60" cy="9" r="2" fill="#22C55E" />
                {/* Badges */}
                <rect x="0" y="20" width="36" height="7" rx="2" fill="#0F172A" />
                <text x="18" y="25" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#38BDF8">RWY 27R</text>
                <rect x="40" y="20" width="80" height="7" rx="2" fill="#0F172A" />
                <text x="80" y="25" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#E2E8F0">ALS STROBES ACTIVE · CAT-III</text>
              </g>

              {/* Modern Jet Airplane with contrail */}
              <g className="animate-pulse" transform="translate(340, 85) rotate(4)">
                {/* Contrail / Airflow */}
                <line x1="-20" y1="8" x2="0" y2="8" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="4 4" />
                {/* Fuselage */}
                <path d="M 0 8 Q 20 4 35 8 Q 20 12 0 8 Z" fill="#F8FAFC" stroke="#0284C7" strokeWidth="1" />
                {/* Swept Wings */}
                <path d="M 12 8 L 8 20 L 14 20 L 22 8 Z" fill="#0284C7" />
                <path d="M 12 8 L 8 -4 L 14 -4 L 22 8 Z" fill="#0284C7" />
                {/* Tail Wing */}
                <path d="M 2 8 L -2 1 L 3 1 L 7 8 Z" fill="#0369A1" />
                {/* Cockpit */}
                <circle cx="30" cy="8" r="1.5" fill="#38BDF8" />
              </g>
            </svg>
          </div>

          {/* Avionics Badges: ATC & Airway */}
          <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            <span className="text-[9px] font-mono font-bold bg-[#0F172A] text-[#38BDF8] px-3 py-0.5 rounded border border-slate-700 shadow-2xs">
              ATC 118.1 MHz | SQUAWK 4321
            </span>
            <span className="text-[9px] font-mono font-bold bg-[#0F172A] text-[#FDE047] px-3 py-0.5 rounded border border-slate-700 shadow-2xs">
              ✈ AIRWAY W20 · FL340 RADAR CONTACT
            </span>
          </div>

          {/* Bottom Left Origin Pill */}
          <div className="absolute bottom-2 left-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 shadow-xs mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            </div>
            <div className="bg-[#F0F9FF] border border-sky-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-sky-800 tracking-wider uppercase">Origin Airport</p>
              <p className="text-xs font-bold text-zinc-900">{org}</p>
            </div>
          </div>

          {/* Bottom Right Dest Pill */}
          <div className="absolute bottom-2 right-6 z-10 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-xs mb-1">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
              <p className="text-[8px] font-extrabold text-blue-800 tracking-wider uppercase">Dest Airport</p>
              <p className="text-xs font-bold text-zinc-900">{dst}</p>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium text-zinc-600">
            <span className="text-zinc-400">⇄</span> High-altitude airway with non-stop aerial transit
          </span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ RBI ₹10 Serial Tamper-Sealed</span>
            <span className="text-amber-700 font-semibold flex items-center gap-1">⚡ Sub-50ms Handoff Lock</span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. BIKE MODE (Last-Mile Express Bikeway)
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl border border-zinc-200/90 p-5 space-y-3 shadow-xs relative overflow-hidden animate-fadeIn">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600 shadow-2xs">
            <Bike className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-zinc-900">{org} → {dst}</span>
            {carrierName && <p className="text-[10px] text-zinc-400">Verified Carrier: {carrierName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-200">
            LAST-MILE EXPRESS
          </span>
          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200/60">
            45 km/h Quick Rider
          </span>
        </div>
      </div>

      <div className="relative h-60 w-full bg-[#FCFCFD] rounded-2xl border border-zinc-100/90 overflow-hidden select-none">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Center Floating Distance Pill */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/95 border border-zinc-200 rounded-full px-3.5 py-1 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-zinc-900">{metrics.distance}</span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-600">{metrics.time}</span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs font-medium text-zinc-600">{transportName || "Express"}</span>
          </div>
        </div>

        {/* Bikeway Curve & Bike SVG */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 760 240" fill="none">
            <path d="M 110 200 Q 380 45 650 200" stroke="#059669" strokeWidth="18" strokeLinecap="round" opacity="0.8" />
            <path d="M 110 200 Q 380 45 650 200" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="8 8" />

            {/* Bike with Headlight */}
            <g className="animate-pulse" transform="translate(360, 85) rotate(3)">
              <polygon points="26,3 55,-6 55,14 26,7" fill="#FEF08A" opacity="0.6" />
              <circle cx="5" cy="10" r="4" stroke="#0F172A" strokeWidth="2" fill="none" />
              <circle cx="25" cy="10" r="4" stroke="#0F172A" strokeWidth="2" fill="none" />
              <line x1="5" y1="10" x2="14" y2="5" stroke="#7C3AED" strokeWidth="2.5" />
              <line x1="14" y1="5" x2="25" y2="10" stroke="#7C3AED" strokeWidth="2.5" />
              <line x1="14" y1="5" x2="16" y2="1" stroke="#334155" strokeWidth="2" />
              <rect x="2" y="3" width="7" height="6" rx="1" fill="#F59E0B" />
            </g>
          </svg>
        </div>

        {/* Milestones */}
        <div className="absolute bottom-11 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
          <span className="text-[9px] font-bold bg-[#DCFCE7] text-[#166534] px-2.5 py-0.5 rounded border border-[#86EFAC] shadow-2xs">
            ⚡ EV FAST CHARGE
          </span>
          <span className="text-[9px] font-bold bg-[#F5F3FF] text-[#6D28D9] px-2.5 py-0.5 rounded border border-[#DDD6FE] shadow-2xs">
            DEDICATED BIKEWAY
          </span>
        </div>

        {/* Bottom Left Origin Pill */}
        <div className="absolute bottom-2 left-6 z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-violet-100 border border-violet-300 flex items-center justify-center text-violet-700 shadow-xs mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse" />
          </div>
          <div className="bg-[#F5F3FF] border border-violet-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
            <p className="text-[8px] font-extrabold text-violet-800 tracking-wider uppercase">Pickup Point</p>
            <p className="text-xs font-bold text-zinc-900">{org}</p>
          </div>
        </div>

        {/* Bottom Right Dest Pill */}
        <div className="absolute bottom-2 right-6 z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 shadow-xs mb-1">
            <Navigation className="w-3.5 h-3.5" />
          </div>
          <div className="bg-[#EFF6FF] border border-blue-200 rounded-2xl px-3.5 py-1 text-center shadow-xs">
            <p className="text-[8px] font-extrabold text-blue-800 tracking-wider uppercase">Doorstep Express</p>
            <p className="text-xs font-bold text-zinc-900">{dst}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
        <span className="flex items-center gap-1.5 font-medium text-zinc-600">
          <span className="text-zinc-400">⇄</span> Rapid last-mile transit navigating zero traffic gridlock
        </span>
        <div className="flex items-center gap-4">
          <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ RBI ₹10 Serial Tamper-Sealed</span>
          <span className="text-amber-700 font-semibold flex items-center gap-1">⚡ Sub-50ms Handoff Lock</span>
        </div>
      </div>
    </div>
  );
}
