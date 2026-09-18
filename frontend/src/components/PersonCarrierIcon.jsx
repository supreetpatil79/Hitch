import React from "react";

export default function PersonCarrierIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Head */}
      <circle cx="9" cy="4" r="2" />
      
      {/* Running Torso & Legs */}
      <path d="M 9 8 L 8 13 L 5 16 L 3 21" />
      <path d="M 8 13 L 11 17 L 14 21" />
      
      {/* Forward Arms Holding Package */}
      <path d="M 9 9 L 13 10 L 15 13" />
      
      {/* Parcel Box with Center Seam */}
      <rect x="13" y="7" width="8" height="7" rx="1.5" />
      <path d="M 17 7 L 17 14" strokeWidth="1.5" />
    </svg>
  );
}
