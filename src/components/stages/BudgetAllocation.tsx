import { formatCurrency, getMetroMultiplier, budgetCategories, packages, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetAllocationProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
}

export default function BudgetAllocation({ details, selectedPackage, onNext, onBack }: BudgetAllocationProps) {
  const multiplier = getMetroMultiplier(details.isMetro);
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * multiplier);

  const sanitaryTotal = selectedPackage.sanitaryPerToilet * details.bathrooms;
  const sanitaryPercent = Math.round((sanitaryTotal / totalCost) * 100);

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

  // Find next upgrade package
  const currentIndex = packages.findIndex((p) => p.id === selectedPackage.id);
  const nextPackage = currentIndex < packages.length - 1 ? packages[currentIndex + 1] : null;
  const upgradeCost = nextPackage
    ? Math.round(nextPackage.pricePerSqft * details.bua * multiplier) - totalCost
    : 0;
  const upgradeMonthly = nextPackage ? Math.round(upgradeCost / 12) : 0;

  // Highlight descriptions per category
  const categoryDescriptions: Record<string, { heading: string; sub: string }> = {
    flooring: { heading: "Flooring & Finishes", sub: selectedPackage.highlights.flooring },
    sanitary: { heading: "Sanitary Fittings", sub: `${formatCurrency(selectedPackage.sanitaryPerToilet)} × ${details.bathrooms} toilets` },
    doors: { heading: "Doors & Windows", sub: `${selectedPackage.highlights.doors} • ${selectedPackage.highlights.windows}` },
    electrical: { heading: "Electrical & Wiring", sub: selectedPackage.highlights.switches },
    utilities: { heading: "Utilities & Infra", sub: "Plumbing, drainage, water tank & connections" },
    construction: { heading: "Construction (CBS)", sub: `${selectedPackage.highlights.steel} • ${selectedPackage.highlights.cement}` },
  };

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Budget Allocation</span> Engine
        </h2>
        <p className="text-muted-foreground text-lg">
          See exactly where every rupee goes in your {formatCurrency(totalCost)} investment.
        </p>
      </div>

      {/* Visual Bar */}
      <div className="glass-card-static p-6 space-y-4">
        <div className="flex h-6 rounded-full overflow-hidden bg-muted">
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
              className="h-full bg-muted-foreground/30"
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
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              Grey Box Structure ({unallocatedPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* Category Cards with headings & sub-headings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allocations.map((a, i) => {
          const desc = categoryDescriptions[a.id];
          return (
            <div
              key={a.id}
              className="glass-card p-5 space-y-3"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{a.icon}</span>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{desc?.heading || a.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc?.sub}</p>
                    <p className="text-[11px] text-primary/70 mt-1">{a.percentage}% of total budget</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-foreground whitespace-nowrap">{formatCurrency(a.amount)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full animate-fill-bar", colorMap[a.color])}
                  style={{ width: `${a.percentage}%`, animationDelay: `${i * 0.15}s` }}
                />
              </div>
            </div>
          );
        })}

        {/* Grey Box Structure — Unallocated */}
        {unallocatedPercent > 0 && (
          <div className="p-5 space-y-3 rounded-2xl bg-muted border border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🧱</span>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Grey Box Structure</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Core structure, plastering, waterproofing, labour & overheads</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">{unallocatedPercent}% of total budget</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground whitespace-nowrap">{formatCurrency(unallocatedAmount)}</span>
            </div>
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-muted-foreground/40 animate-fill-bar" style={{ width: `${unallocatedPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Upsell Card */}
      {nextPackage && (
        <div className="glass-card-static p-6 space-y-4 ring-1 ring-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Upgrade to {nextPackage.name} ({nextPackage.nameHindi})</h3>
              <p className="text-sm text-muted-foreground">{nextPackage.tagline}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-primary/5 rounded-xl">
              <p className="text-xs text-muted-foreground">Extra Cost</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(upgradeCost)}</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-xl">
              <p className="text-xs text-muted-foreground">Per Month</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(upgradeMonthly)}/mo</p>
            </div>
            <div className="p-3 bg-primary/5 rounded-xl">
              <p className="text-xs text-muted-foreground">New Rate</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(nextPackage.pricePerSqft)}/sqft</p>
            </div>
          </div>
          <p className="text-xs text-primary/80 text-center">
            💡 For just <strong>{formatCurrency(upgradeMonthly)}/month</strong> more, get {nextPackage.highlights.flooring}, {nextPackage.highlights.switches} & more.
          </p>
        </div>
      )}

      {/* Trust note */}
      <div className="p-4 rounded-xl text-sm text-center bg-sage/10">
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
