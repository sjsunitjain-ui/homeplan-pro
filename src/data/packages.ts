export interface Package {
  id: string;
  name: string;
  nameHindi: string;
  pricePerSqft: number;
  recommended?: boolean;
  tagline: string;
  usps: string[];
  sanitaryPerToilet: number;
  highlights: {
    steel: string;
    cement: string;
    flooring: string;
    doors: string;
    switches: string;
    painting: string;
    windows: string;
  };
}

export const packages: Package[] = [
  {
    id: "aarambh",
    name: "Aarambh",
    nameHindi: "आरम्भ",
    pricePerSqft: 1589,
    tagline: "Your solid beginning",
    usps: [
      "Quality construction with Fe 550D Steel",
      "Standard tiles & finishes",
      "Complete electrical provisions",
      "Dedicated project manager",
    ],
    sanitaryPerToilet: 20000,
    highlights: {
      steel: "Fe 550D – Moyra",
      cement: "43 Grade PPC – Wonder/JK Super",
      flooring: "Tiles upto ₹40/sqft",
      doors: "Flush doors with laminate upto ₹12,000",
      switches: "Anchor Ziva",
      painting: "Asian Tractor Emulsion",
      windows: "3 Track Aluminium @₹270/sqft",
    },
  },
  {
    id: "rachana",
    name: "Rachana",
    nameHindi: "रचना",
    pricePerSqft: 1789,
    recommended: true,
    tagline: "Best balance of cost & value",
    usps: [
      "Premium Ultratech cement",
      "Enhanced tile & flooring range",
      "Smart home automation upto ₹20,000",
      "500 sqft false ceiling included",
      "Solar & AC provisions",
    ],
    sanitaryPerToilet: 30000,
    highlights: {
      steel: "Fe 550D – Moyra",
      cement: "43 Grade PPC – Ultratech",
      flooring: "Tiles upto ₹60/sqft",
      doors: "Flush doors with laminate upto ₹18,000",
      switches: "Anchor Roma Classic",
      painting: "Asian Tractor Shyne Emulsion",
      windows: "3 Track Aluminium Domal @₹400/sqft",
    },
  },
  {
    id: "sampoorna",
    name: "Sampoorna",
    nameHindi: "संपूर्ण",
    pricePerSqft: 1989,
    tagline: "Complete luxury living",
    usps: [
      "Ultratech/ACC premium cement",
      "8-inch outer wall construction",
      "Veneer doors & UPVC windows",
      "700 sqft false ceiling",
      "Smart home upto ₹50,000",
      "Copper gas connection included",
    ],
    sanitaryPerToilet: 45000,
    highlights: {
      steel: "Fe 550D – JSW/TATA",
      cement: "Ultratech/ACC",
      flooring: "Tiles upto ₹90/sqft",
      doors: "Veneer doors upto ₹18,000",
      switches: "Anchor Roma Plus / Legrand Myrius",
      painting: "Asian Apcolite Premium Emulsion",
      windows: "2.5 Track UPVC @₹800/sqft",
    },
  },
  {
    id: "utkrisht",
    name: "Utkrisht",
    nameHindi: "उत्कृष्ट",
    pricePerSqft: 2489,
    tagline: "Uncompromised excellence",
    usps: [
      "JSW/TATA steel & Ultratech/ACC cement",
      "Marble/premium tile flooring upto ₹200/sqft",
      "Teak wood main door upto ₹40,000",
      "1000 sqft false ceiling",
      "Smart home upto ₹1,00,000",
      "Grohe sanitary fittings",
      "System windows @₹1200/sqft",
    ],
    sanitaryPerToilet: 65000,
    highlights: {
      steel: "JSW/TATA",
      cement: "Ultratech/ACC",
      flooring: "Tiles/Marble upto ₹200/sqft",
      doors: "Teak door & frame upto ₹40,000",
      switches: "Legrand Lyncus / GM",
      painting: "Asian Royale Luxury Emulsion",
      windows: "System Windows @₹1200/sqft",
    },
  },
];

export interface ProjectDetails {
  name: string;
  mobile: string;
  email: string;
  city: string;
  isMetro: boolean;
  bua: number;
  bedrooms: number;
  bathrooms: number;
  otherRequirements: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  icon: string;
  color: string;
}

export const budgetCategories: BudgetCategory[] = [
  { id: "flooring", name: "Flooring & Finishes", percentage: 11, icon: "🏗️", color: "primary" },
  { id: "sanitary", name: "Sanitary Fittings", percentage: 0, icon: "🚿", color: "accent" },
  { id: "doors", name: "Doors & Windows", percentage: 6, icon: "🚪", color: "sage" },
  { id: "electrical", name: "Electrical & Wiring", percentage: 6, icon: "⚡", color: "primary" },
  { id: "utilities", name: "Utilities & Infra", percentage: 6, icon: "🔧", color: "accent" },
  { id: "construction", name: "Construction (CBS)", percentage: 10, icon: "🏠", color: "sage" },
];

export const progressionStages = [
  { id: 1, label: "Dreaming", icon: "✨" },
  { id: 2, label: "Planning", icon: "📐" },
  { id: 3, label: "Evaluating", icon: "📊" },
  { id: 4, label: "Deciding", icon: "🎯" },
  { id: 5, label: "Ready to Build", icon: "🏠" },
];

export function calculateDoors(bedrooms: number, bathrooms: number): number {
  return bathrooms + bedrooms + 1 + 1; // 1 per bath, 1 per bed, main, additional
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getMetroMultiplier(isMetro: boolean): number {
  return isMetro ? 1.1 : 1.0;
}
