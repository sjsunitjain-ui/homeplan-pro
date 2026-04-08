import { useState } from "react";
import { formatCurrency } from "@/data/packages";
import { ShowerHead, ChevronRight, Check, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SanitaryItem {
  id: string;
  name: string;
  icon: string;
  tiers: { basic: number; standard: number; premium: number; basicBrand: string; standardBrand: string; premiumBrand: string };
}

const sanitaryItems: SanitaryItem[] = [
  { id: "wc", name: "Water Closet (WC)", icon: "🚽", tiers: { basic: 3500, standard: 8000, premium: 18000, basicBrand: "Hindware Standard", standardBrand: "Cera / Parryware", premiumBrand: "Kohler / Grohe" } },
  { id: "basin", name: "Wash Basin", icon: "🪥", tiers: { basic: 1500, standard: 4000, premium: 12000, basicBrand: "Local Brand", standardBrand: "Hindware / Cera", premiumBrand: "Kohler / Duravit" } },
  { id: "shower", name: "Shower Set", icon: "🚿", tiers: { basic: 2000, standard: 5000, premium: 15000, basicBrand: "Basic Chrome", standardBrand: "Jaquar / Hindware", premiumBrand: "Grohe / Hansgrohe" } },
  { id: "faucet", name: "Faucets & Taps", icon: "🔧", tiers: { basic: 1500, standard: 4000, premium: 10000, basicBrand: "Local SS", standardBrand: "Jaquar Essco", premiumBrand: "Grohe / Kohler" } },
  { id: "accessories", name: "Accessories Set", icon: "🧴", tiers: { basic: 1500, standard: 3000, premium: 8000, basicBrand: "SS Basic", standardBrand: "Hindware / Cera", premiumBrand: "Kohler / Grohe" } },
  { id: "tiles", name: "Bathroom Tiles", icon: "🏗️", tiers: { basic: 5000, standard: 8000, premium: 20000, basicBrand: "Kajaria Basic ₹40/sqft", standardBrand: "Somany/Kajaria ₹60/sqft", premiumBrand: "RAK/Johnson ₹120/sqft" } },
];

type Tier = "basic" | "standard" | "premium";

const tierLabels: Record<Tier, { label: string; color: string; badge: string }> = {
  basic: { label: "Basic", color: "bg-muted text-foreground", badge: "Essential" },
  standard: { label: "Standard", color: "gradient-warm text-accent-foreground", badge: "Popular" },
  premium: { label: "Premium", color: "gradient-primary text-primary-foreground", badge: "Luxury" },
};

interface SanitaryWalletProps {
  bathrooms: number;
  baseBudget: number;
}

export default function SanitaryWallet({ bathrooms, baseBudget }: SanitaryWalletProps) {
  const [selections, setSelections] = useState<Record<string, Tier>>(
    Object.fromEntries(sanitaryItems.map(i => [i.id, "standard"]))
  );

  const setTier = (id: string, tier: Tier) => {
    setSelections(prev => ({ ...prev, [id]: tier }));
  };

  const perToiletCost = sanitaryItems.reduce((sum, item) => sum + item.tiers[selections[item.id]], 0);
  const totalCost = perToiletCost * bathrooms;
  const diff = totalCost - baseBudget;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shimmer">
          <ShowerHead className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg card-title-shadow">Interactive Sanitary Wallet</h3>
          <p className="text-xs text-muted-foreground">Customize your bathroom fittings per toilet</p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="glass-card-elevated p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Per Toilet</p>
          <p className="text-xl font-extrabold text-foreground">{formatCurrency(perToiletCost)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{bathrooms} Toilets</p>
          <p className="text-xl font-extrabold text-gradient">{formatCurrency(totalCost)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {diff > 0 ? "Upgrade Cost" : diff < 0 ? "You Save" : "No Change"}
          </p>
          <p className={cn("text-lg font-extrabold", diff > 0 ? "text-accent" : diff < 0 ? "text-sage" : "text-foreground")}>
            {diff === 0 ? "—" : (diff > 0 ? "+" : "") + formatCurrency(Math.abs(diff))}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {sanitaryItems.map((item) => {
          const selected = selections[item.id];
          return (
            <div key={item.id} className="rounded-xl border border-border/30 overflow-hidden card-shadow transition-all duration-300 hover:border-primary/15"
              style={{ background: "hsl(var(--card) / 0.7)" }}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">{item.icon}</span>
                  <h4 className="font-bold text-sm text-foreground">{item.name}</h4>
                  <span className="ml-auto text-sm font-extrabold text-primary">{formatCurrency(item.tiers[selected])}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(["basic", "standard", "premium"] as Tier[]).map((tier) => {
                    const isSelected = selected === tier;
                    const info = tierLabels[tier];
                    return (
                      <button
                        key={tier}
                        onClick={() => setTier(item.id, tier)}
                        className={cn(
                          "relative rounded-xl p-3 text-left transition-all duration-300 border",
                          isSelected
                            ? "border-primary/30 ring-2 ring-primary/15 enhanced-card-shadow"
                            : "border-border/20 hover:border-primary/10 card-shadow"
                        )}
                        style={{ background: isSelected ? "hsl(var(--primary) / 0.06)" : "hsl(var(--muted) / 0.3)" }}
                      >
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gradient-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary-foreground" />
                          </div>
                        )}
                        <span className="text-[9px] uppercase tracking-widest font-bold text-primary/70">{info.label}</span>
                        <p className="text-xs font-bold text-foreground mt-1">{formatCurrency(item.tiers[tier])}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                          {tier === "basic" ? item.tiers.basicBrand : tier === "standard" ? item.tiers.standardBrand : item.tiers.premiumBrand}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade nudge */}
      {diff < 0 && (
        <div className="p-4 rounded-xl bg-sage/8 border border-sage/15 text-center">
          <p className="text-sm text-sage font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Great choice! You're saving {formatCurrency(Math.abs(diff))} from your package budget.
          </p>
        </div>
      )}
      {diff > 0 && (
        <div className="p-4 rounded-xl bg-accent/8 border border-accent/15 text-center">
          <p className="text-sm text-accent font-semibold flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Premium upgrade adds {formatCurrency(diff)} — just {formatCurrency(Math.round(diff / 12))}/mo extra on EMI.
          </p>
        </div>
      )}
    </div>
  );
}
