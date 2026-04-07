import { useState } from "react";
import { formatCurrency, getMetroMultiplier, budgetCategories, packages, calculateDoors, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetAllocationProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
}

interface SpecItem {
  label: string;
  value: string;
}

export default function BudgetAllocation({ details, selectedPackage, onNext, onBack }: BudgetAllocationProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const multiplier = getMetroMultiplier(details.isMetro);
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * multiplier);

  const sanitaryTotal = selectedPackage.sanitaryPerToilet * details.bathrooms;
  const sanitaryPercent = Math.round((sanitaryTotal / totalCost) * 100);
  const doorCount = calculateDoors(details.bedrooms, details.bathrooms);

  const allocations = budgetCategories.map((cat) => {
    if (cat.id === "sanitary") {
      return { ...cat, percentage: sanitaryPercent, amount: sanitaryTotal };
    }
    const amount = Math.round(totalCost * (cat.percentage / 100));
    return { ...cat, amount };
  });

  const allocatedPercent = allocations.reduce((sum, a) => sum + a.percentage, 0);
  const unallocatedPercent = Math.max(0, 100 - allocatedPercent);
  const unallocatedAmount = Math.round(totalCost * (unallocatedPercent / 100));

  const colorMap: Record<string, string> = {
    primary: "gradient-primary",
    accent: "gradient-warm",
    sage: "gradient-sage",
  };

  const iconBgMap: Record<string, string> = {
    primary: "bg-primary/10",
    accent: "bg-accent/10",
    sage: "bg-sage/10",
  };

  const categorySpecs: Record<string, { heading: string; sub: string; specs: SpecItem[] }> = {
    flooring: {
      heading: "Flooring & Finishes",
      sub: selectedPackage.highlights.flooring,
      specs: [
        { label: "Tile Range", value: selectedPackage.highlights.flooring },
        { label: "Painting", value: selectedPackage.highlights.painting },
        { label: "Package", value: `${selectedPackage.name} (${selectedPackage.nameHindi})` },
      ],
    },
    sanitary: {
      heading: "Sanitary Fittings",
      sub: `${formatCurrency(selectedPackage.sanitaryPerToilet)} × ${details.bathrooms} toilets`,
      specs: [
        { label: "Per Toilet Budget", value: formatCurrency(selectedPackage.sanitaryPerToilet) },
        { label: "Number of Toilets", value: `${details.bathrooms}` },
        { label: "Total Sanitary", value: formatCurrency(sanitaryTotal) },
        { label: "Includes", value: "WC, Basin, Shower, Fittings, Accessories" },
      ],
    },
    doors: {
      heading: "Doors & Windows",
      sub: `${selectedPackage.highlights.doors}`,
      specs: [
        { label: "Door Type", value: selectedPackage.highlights.doors },
        { label: "Window Type", value: selectedPackage.highlights.windows },
        { label: "Total Doors", value: `${doorCount} (${details.bathrooms} bath + ${details.bedrooms} bed + 1 main + 1 additional)` },
      ],
    },
    electrical: {
      heading: "Electrical & Wiring",
      sub: selectedPackage.highlights.switches,
      specs: [
        { label: "Switch Brand", value: selectedPackage.highlights.switches },
        { label: "Wiring", value: "Concealed copper wiring" },
        { label: "Includes", value: "MCBs, DBs, Sockets, Switch plates" },
      ],
    },
    utilities: {
      heading: "Utilities & Infra",
      sub: "Plumbing, drainage, water tank & connections",
      specs: [
        { label: "Plumbing", value: "CPVC hot & cold water supply" },
        { label: "Drainage", value: "PVC drainage & sewage lines" },
        { label: "Water Storage", value: "Overhead & underground tanks" },
        { label: "Connections", value: "Water, electricity, sewage hookups" },
      ],
    },
    construction: {
      heading: "Construction (CBS)",
      sub: `${selectedPackage.highlights.steel} • ${selectedPackage.highlights.cement}`,
      specs: [
        { label: "Steel", value: selectedPackage.highlights.steel },
        { label: "Cement", value: selectedPackage.highlights.cement },
        { label: "Structure", value: "RCC framed construction" },
        { label: "Walls", value: selectedPackage.id === "sampoorna" || selectedPackage.id === "utkrisht" ? "8-inch outer walls" : "6-inch outer walls" },
      ],
    },
  };

  const currentIndex = packages.findIndex((p) => p.id === selectedPackage.id);
  const nextPackage = currentIndex < packages.length - 1 ? packages[currentIndex + 1] : null;
  const upgradeCost = nextPackage
    ? Math.round(nextPackage.pricePerSqft * details.bua * multiplier) - totalCost
    : 0;
  const upgradeMonthly = nextPackage ? Math.round(upgradeCost / 12) : 0;

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">
          <span className="text-gradient">Budget Allocation</span> Engine
        </h2>
        <p className="text-muted-foreground text-lg">
          See exactly where every rupee goes in your <strong className="text-foreground">{formatCurrency(totalCost)}</strong> investment.
        </p>
      </div>

      {/* Visual Bar */}
      <div className="glass-card-elevated p-6 space-y-5">
        <div className="flex h-8 rounded-full overflow-hidden bg-muted/40 shadow-inner">
          {allocations.map((a) => (
            <div
              key={a.id}
              className={cn("h-full transition-all duration-1000 animate-fill-bar", colorMap[a.color])}
              style={{ width: `${a.percentage}%` }}
              title={`${a.name}: ${a.percentage}%`}
            />
          ))}
          {unallocatedPercent > 0 && (
            <div
              className="h-full bg-muted-foreground/20"
              style={{ width: `${unallocatedPercent}%` }}
              title={`Grey Box Structure: ${unallocatedPercent}%`}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {allocations.map((a) => (
            <span key={a.id} className="flex items-center gap-1.5 font-medium">
              <div className={cn("w-3 h-3 rounded-full shadow-sm", colorMap[a.color])} />
              {a.name} ({a.percentage}%)
            </span>
          ))}
          {unallocatedPercent > 0 && (
            <span className="flex items-center gap-1.5 font-medium">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/25" />
              Grey Box Structure ({unallocatedPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {allocations.map((a, i) => {
          const spec = categorySpecs[a.id];
          const isExpanded = expandedCard === a.id;
          return (
            <div
              key={a.id}
              className={cn(
                "group rounded-2xl border cursor-pointer transition-all duration-400 animate-fade-in-up",
                isExpanded
                  ? "border-primary/25 bg-card/90"
                  : "border-border/30 bg-card/70 hover:border-primary/15"
              )}
              style={{
                animationDelay: `${i * 0.08}s`,
                boxShadow: isExpanded
                  ? "0 12px 48px -8px hsl(262 40% 58% / 0.18), inset 0 1px 0 0 hsl(0 0% 100% / 0.08)"
                  : "0 4px 20px -4px hsl(262 40% 58% / 0.08), inset 0 1px 0 0 hsl(0 0% 100% / 0.06)",
              }}
              onClick={() => toggleCard(a.id)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm", iconBgMap[a.color])}>
                      {a.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-foreground text-[15px] leading-tight">{spec?.heading || a.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{spec?.sub}</p>
                      <p className="text-[11px] text-primary/70 mt-1.5 font-semibold">{a.percentage}% of total</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-lg font-extrabold text-foreground">{formatCurrency(a.amount)}</span>
                    <div className="mt-1.5">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-primary ml-auto" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground/50 ml-auto group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full animate-fill-bar", colorMap[a.color])}
                    style={{ width: `${a.percentage}%`, animationDelay: `${i * 0.15}s` }}
                  />
                </div>
              </div>

              {isExpanded && spec && (
                <div className="px-5 pb-5 animate-fade-in-up">
                  <div className="border-t border-border/30 pt-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary/80 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" /> {selectedPackage.name} Specifications
                    </p>
                    {spec.specs.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 py-2.5 px-3.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/20"
                      >
                        <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                        <span className="text-xs font-bold text-foreground text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Grey Box Structure */}
        {unallocatedPercent > 0 && (
          <div
            className={cn(
              "rounded-2xl border cursor-pointer transition-all duration-400 animate-fade-in-up",
              expandedCard === "greybox"
                ? "border-muted-foreground/25 bg-muted/50"
                : "border-border/30 bg-muted/30 hover:bg-muted/40"
            )}
            style={{
              animationDelay: '0.5s',
              boxShadow: expandedCard === "greybox"
                ? "0 12px 48px -8px hsl(260 10% 50% / 0.12), inset 0 1px 0 0 hsl(0 0% 100% / 0.06)"
                : "0 4px 20px -4px hsl(260 10% 50% / 0.06), inset 0 1px 0 0 hsl(0 0% 100% / 0.04)",
            }}
            onClick={() => toggleCard("greybox")}
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-muted-foreground/8 shrink-0 shadow-sm">
                    🧱
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-[15px] leading-tight">Grey Box Structure</h4>
                    <p className="text-xs text-muted-foreground mt-1">Core structure, plastering, waterproofing & overheads</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1.5 font-semibold">{unallocatedPercent}% of total</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-lg font-extrabold text-foreground">{formatCurrency(unallocatedAmount)}</span>
                  <div className="mt-1.5">
                    {expandedCard === "greybox" ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground/50 ml-auto" />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 h-2 bg-background/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-muted-foreground/25 animate-fill-bar" style={{ width: `${unallocatedPercent}%` }} />
              </div>
            </div>

            {expandedCard === "greybox" && (
              <div className="px-5 pb-5 animate-fade-in-up">
                <div className="border-t border-border/30 pt-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80 mb-3">
                    📋 What's Included
                  </p>
                  {[
                    { label: "RCC Structure", value: "Columns, beams, slabs & foundation" },
                    { label: "Brickwork", value: "Internal & external wall masonry" },
                    { label: "Plastering", value: "Internal & external plaster finish" },
                    { label: "Waterproofing", value: "Terrace, toilet & balcony" },
                    { label: "Labour", value: "Skilled & unskilled construction" },
                    { label: "Overheads", value: "Site management & scaffolding" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 py-2.5 px-3.5 rounded-xl bg-background/50 hover:bg-background/70 transition-colors border border-border/20"
                    >
                      <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                      <span className="text-xs font-bold text-foreground text-right">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upgrade Upsell Card */}
      {nextPackage && (
        <div
          className="glass-card-glow p-6 md:p-8 space-y-5 relative overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg shimmer">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Upgrade to {nextPackage.name} ({nextPackage.nameHindi})</h3>
              <p className="text-sm text-muted-foreground">{nextPackage.tagline}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="stat-card bg-primary/5 border-primary/10">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">Extra Cost</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(upgradeCost)}</p>
            </div>
            <div className="stat-card bg-primary/5 border-primary/10">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">Per Month</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(upgradeMonthly)}/mo</p>
            </div>
            <div className="stat-card bg-primary/5 border-primary/10">
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">New Rate</p>
              <p className="text-xl font-extrabold text-primary">{formatCurrency(nextPackage.pricePerSqft)}/sqft</p>
            </div>
          </div>
          <p className="text-xs text-primary/80 text-center font-medium">
            💡 For just <strong>{formatCurrency(upgradeMonthly)}/month</strong> more, get {nextPackage.highlights.flooring}, {nextPackage.highlights.switches} & more.
          </p>
        </div>
      )}

      {/* Trust */}
      <div className="p-4 rounded-xl text-sm text-center text-muted-foreground bg-sage/8 border border-sage/15">
        💡 Budget allocations are industry-standard benchmarks. Actual spending can be customized within each wallet.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext} className="shimmer font-semibold">
          Compare Packages <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
