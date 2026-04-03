import { useState } from "react";
import { formatCurrency, getMetroMultiplier, budgetCategories, packages, calculateDoors, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
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

  // Specification details per category based on selected package
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

  // Find next upgrade package
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
    <div className="animate-slide-up max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Budget Allocation</span> Engine
        </h2>
        <p className="text-muted-foreground text-lg">
          See exactly where every rupee goes in your <strong>{formatCurrency(totalCost)}</strong> investment.
        </p>
      </div>

      {/* Visual Bar */}
      <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4" style={{ boxShadow: "0 4px 30px -6px hsl(262 40% 58% / 0.10), 0 1.5px 6px -2px hsl(262 40% 58% / 0.06)" }}>
        <div className="flex h-7 rounded-full overflow-hidden bg-muted/60">
          {allocations.map((a) => (
            <div
              key={a.id}
              className={cn("h-full transition-all duration-1000", colorMap[a.color])}
              style={{ width: `${a.percentage}%` }}
              title={`${a.name}: ${a.percentage}%`}
            />
          ))}
          {unallocatedPercent > 0 && (
            <div
              className="h-full bg-muted-foreground/25"
              style={{ width: `${unallocatedPercent}%` }}
              title={`Grey Box Structure: ${unallocatedPercent}%`}
            />
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {allocations.map((a) => (
            <span key={a.id} className="flex items-center gap-1.5">
              <div className={cn("w-2.5 h-2.5 rounded-full", colorMap[a.color])} />
              {a.name} ({a.percentage}%)
            </span>
          ))}
          {unallocatedPercent > 0 && (
            <span className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/25" />
              Grey Box Structure ({unallocatedPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* Category Cards — Interactive with Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {allocations.map((a, i) => {
          const spec = categorySpecs[a.id];
          const isExpanded = expandedCard === a.id;
          return (
            <div
              key={a.id}
              className={cn(
                "group rounded-2xl border bg-card cursor-pointer transition-all duration-300",
                isExpanded
                  ? "border-primary/30 ring-1 ring-primary/10"
                  : "border-border/40 hover:border-primary/20"
              )}
              style={{
                animationDelay: `${i * 0.08}s`,
                boxShadow: isExpanded
                  ? "0 8px 40px -8px hsl(262 40% 58% / 0.15), 0 2px 8px -2px hsl(262 40% 58% / 0.08)"
                  : "0 2px 16px -4px hsl(262 40% 58% / 0.08), 0 1px 4px -1px hsl(262 40% 58% / 0.04)",
              }}
              onClick={() => toggleCard(a.id)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0", iconBgMap[a.color])}>
                      {a.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-[15px] leading-tight">{spec?.heading || a.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">{spec?.sub}</p>
                      <p className="text-[11px] text-primary/70 mt-1.5 font-medium">{a.percentage}% of total budget</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-lg font-bold text-foreground">{formatCurrency(a.amount)}</span>
                    <div className="mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-primary ml-auto" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-2 bg-muted/60 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full animate-fill-bar", colorMap[a.color])}
                    style={{ width: `${a.percentage}%`, animationDelay: `${i * 0.15}s` }}
                  />
                </div>
              </div>

              {/* Expanded Specifications */}
              {isExpanded && spec && (
                <div className="px-5 pb-5 animate-fade-in-up">
                  <div className="border-t border-border/50 pt-4 space-y-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80 mb-3">
                      📋 {selectedPackage.name} Package Specifications
                    </p>
                    {spec.specs.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 py-2 px-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors"
                      >
                        <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                        <span className="text-xs font-semibold text-foreground text-right">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Grey Box Structure — Unallocated */}
        {unallocatedPercent > 0 && (
          <div
            className={cn(
              "rounded-2xl border cursor-pointer transition-all duration-300",
              expandedCard === "greybox"
                ? "border-muted-foreground/30 ring-1 ring-muted-foreground/10 bg-muted/60"
                : "border-border/40 bg-muted/40 hover:bg-muted/50"
            )}
            style={{
              boxShadow: expandedCard === "greybox"
                ? "0 8px 40px -8px hsl(260 10% 50% / 0.12)"
                : "0 2px 16px -4px hsl(260 10% 50% / 0.06)",
            }}
            onClick={() => toggleCard("greybox")}
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-muted-foreground/10 shrink-0">
                    🧱
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-[15px] leading-tight">Grey Box Structure</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">Core structure, plastering, waterproofing, labour & overheads</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1.5 font-medium">{unallocatedPercent}% of total budget</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-lg font-bold text-foreground">{formatCurrency(unallocatedAmount)}</span>
                  <div className="mt-1">
                    {expandedCard === "greybox" ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-muted-foreground/30 animate-fill-bar" style={{ width: `${unallocatedPercent}%` }} />
              </div>
            </div>

            {expandedCard === "greybox" && (
              <div className="px-5 pb-5 animate-fade-in-up">
                <div className="border-t border-border/50 pt-4 space-y-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 mb-3">
                    📋 What's Included
                  </p>
                  {[
                    { label: "RCC Structure", value: "Columns, beams, slabs & foundation" },
                    { label: "Brickwork", value: "Internal & external wall masonry" },
                    { label: "Plastering", value: "Internal & external plaster finish" },
                    { label: "Waterproofing", value: "Terrace, toilet & balcony waterproofing" },
                    { label: "Labour", value: "Skilled & unskilled construction labour" },
                    { label: "Overheads", value: "Site management, scaffolding & safety" },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 py-2 px-3 rounded-xl bg-background/60 hover:bg-background transition-colors"
                    >
                      <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
                      <span className="text-xs font-semibold text-foreground text-right">{s.value}</span>
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
          className="rounded-2xl border border-primary/20 bg-card p-6 space-y-4"
          style={{ boxShadow: "0 6px 36px -8px hsl(262 40% 58% / 0.14), 0 2px 10px -3px hsl(262 40% 58% / 0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">Upgrade to {nextPackage.name} ({nextPackage.nameHindi})</h3>
              <p className="text-sm text-muted-foreground">{nextPackage.tagline}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[11px] text-muted-foreground mb-1">Extra Cost</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(upgradeCost)}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[11px] text-muted-foreground mb-1">Per Month</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(upgradeMonthly)}/mo</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[11px] text-muted-foreground mb-1">New Rate</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(nextPackage.pricePerSqft)}/sqft</p>
            </div>
          </div>
          <p className="text-xs text-primary/80 text-center">
            💡 For just <strong>{formatCurrency(upgradeMonthly)}/month</strong> more, get {nextPackage.highlights.flooring}, {nextPackage.highlights.switches} & more.
          </p>
        </div>
      )}

      {/* Trust note */}
      <div className="p-4 rounded-xl text-sm text-center text-muted-foreground bg-sage/8 border border-sage/15">
        💡 Budget allocations are industry-standard benchmarks. Actual spending can be customized within each wallet.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext}>
          Compare Packages <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
