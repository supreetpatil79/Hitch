// Hitch Standard Pricing & Commission Engine
// 38% Hitch Platform Fee | 62% Carrier Payout

export const TRANSPORT_RATES = {
  train:  { perKg: 70,  minFloor: 100, label: "Train (Vande Bharat)", speed: "~4h – 16h", speedScore: "130 km/h Track Speed" },
  bus:    { perKg: 60,  minFloor: 80,  label: "Bus (Intercity Volvo)", speed: "~6h – 18h", speedScore: "80 km/h Highway" },
  car:    { perKg: 90,  minFloor: 120, label: "Car (Expressway)",     speed: "~3h – 12h", speedScore: "100 km/h Trunk" },
  flight: { perKg: 150, minFloor: 250, label: "Flight (Direct)",      speed: "~1.5h – 3h", speedScore: "750 km/h Airway" },
  bike:   { perKg: 50,  minFloor: 60,  label: "Bike (Quick Courier)", speed: "~1h – 3h",   speedScore: "45 km/h Last-Mile" },
};

export const HITCH_COMMISSION_PERCENT = 0.38; // 38% Hitch Platform Commission
export const CARRIER_PAYOUT_PERCENT = 0.62;   // 62% Carrier Take-Home

export function calculatePricing(weightKg = 2, mode = "train") {
  const safeWeight = Math.max(0.1, parseFloat(weightKg) || 1.0);
  const modeConfig = TRANSPORT_RATES[mode] || TRANSPORT_RATES.train;
  
  const rawFare = Math.round(safeWeight * modeConfig.perKg);
  const totalSenderPrice = Math.max(rawFare, modeConfig.minFloor);
  
  const carrierPayout = Math.round(totalSenderPrice * CARRIER_PAYOUT_PERCENT);
  const hitchCommission = totalSenderPrice - carrierPayout; // Exactly 38%
  
  // Traditional courier comparison benchmark (BlueDart / DTDC / Air Cargo equivalent)
  const traditionalCourierPrice = Math.max(350, Math.round(200 + safeWeight * 135));
  const savingsRupees = Math.max(0, traditionalCourierPrice - totalSenderPrice);
  const savingsPercent = Math.round((savingsRupees / traditionalCourierPrice) * 100);

  return {
    weightKg: safeWeight,
    mode,
    ratePerKg: modeConfig.perKg,
    minFloor: modeConfig.minFloor,
    totalSenderPrice,
    carrierPayout,
    hitchCommission,
    traditionalCourierPrice,
    savingsRupees,
    savingsPercent,
  };
}
