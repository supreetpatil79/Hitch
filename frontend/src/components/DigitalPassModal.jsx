import React from "react";
import { X, QrCode, Train, Plane, Car, Bus, ShieldCheck, Download, Share2, Sparkles, CheckCircle2 } from "lucide-react";
import { soundFX } from "../utils/audio";

export default function DigitalPassModal({ isOpen, onClose, shipment }) {
  if (!isOpen || !shipment) return null;

  const handleDownload = () => {
    soundFX.playSuccess();
    window.print();
  };

  const isFlight = shipment.mode === "flight" || (shipment.transportName && shipment.transportName.toLowerCase().includes("air"));
  const isTrain = !isFlight && (shipment.mode === "train" || (shipment.transportName && shipment.transportName.toLowerCase().includes("express")));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="relative max-w-md w-full my-6 select-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Digital Boarding Pass Ticket */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80">
          {/* Ticket Header */}
          <div className="bg-zinc-950 text-white p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-hitchOrange">H</span>
                <span className="font-display text-lg tracking-wider uppercase font-bold">Hitch Pass</span>
              </div>
              <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase">
                {shipment.status?.replace(/_/g, " ") || "VERIFIED"}
              </span>
            </div>

            {/* Corridor route */}
            <div className="flex items-center justify-between relative z-10 my-2">
              <div>
                <p className="text-3xl font-black tracking-tight">{shipment.from?.substring(0, 3).toUpperCase() || "BLR"}</p>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium">{shipment.from || "Bengaluru"}</p>
              </div>

              <div className="flex-1 flex flex-col items-center px-4">
                {isFlight ? (
                  <Plane className="w-5 h-5 text-hitchOrange mb-1" />
                ) : isTrain ? (
                  <Train className="w-5 h-5 text-hitchOrange mb-1" />
                ) : (
                  <Car className="w-5 h-5 text-hitchOrange mb-1" />
                )}
                <div className="w-full h-px border-t-2 border-dashed border-zinc-700 relative" />
                <span className="text-[10px] font-mono text-zinc-400 mt-1">{shipment.eta || "Direct Lane"}</span>
              </div>

              <div className="text-right">
                <p className="text-3xl font-black tracking-tight">{shipment.to?.substring(0, 3).toUpperCase() || "MUM"}</p>
                <p className="text-xs text-zinc-400 mt-0.5 font-medium">{shipment.to || "Mumbai"}</p>
              </div>
            </div>
          </div>

          {/* Tear-off Notches */}
          <div className="relative flex items-center justify-between bg-zinc-950 px-4">
            <div className="w-6 h-6 rounded-full bg-black/60 -ml-7" />
            <div className="flex-1 border-t-2 border-dashed border-zinc-200" />
            <div className="w-6 h-6 rounded-full bg-black/60 -mr-7" />
          </div>

          {/* Ticket Body */}
          <div className="p-6 bg-[#FAFAF8] space-y-5">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Carrier Verification</p>
                <p className="font-bold text-zinc-900 text-sm mt-0.5">Verified Commuter</p>
                <p className="text-[10px] text-zinc-500">Authenticated Luggage Traveler</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-zinc-400">Recipient Verification</p>
                <p className="font-bold text-zinc-900 text-sm mt-0.5">Authenticated Recipient</p>
                <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                  Dual-OTP Escrow Verified
                </p>
              </div>
            </div>

            {/* Parcel Details Box */}
            <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Parcel Category</span>
                <span className="font-bold text-zinc-900 capitalize">{shipment.category || "Electronics"} ({shipment.weight || 2} kg)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Tamper Seal Note</span>
                <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {shipment.banknoteSerial || "5AC 123456"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Guaranteed Escrow</span>
                <span className="font-bold text-hitchOrange">₹{shipment.payout || 180}</span>
              </div>
            </div>

            {/* QR Code Verification Section */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-zinc-200/80">
              <div className="w-20 h-20 bg-zinc-900 p-2 rounded-xl flex items-center justify-center shrink-0">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs font-bold text-zinc-900 tracking-wide">{shipment.id || "HTX-4821"}</p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                  Scan at station/terminal for zero-trust OTP verification and payout release.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-900 hover:bg-black text-white font-semibold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" /> Save Digital Pass
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
