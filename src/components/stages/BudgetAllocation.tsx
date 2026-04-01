import { formatCurrency, getMetroMultiplier, budgetCategories, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

  // Sanitary is per-toilet fixed, calculate its percentage
  const sanitaryTotal = selectedPackage.sanitaryPerToilet * details.bathrooms;
  const sanitaryPercent = Math.round((sanitaryTotal / totalCost) * 100);

  // Build the allocations
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

  const bgColorMap: Record<string, string> = {
    primary: "bg-primary/10",
    accent: "bg-accent/10",
    sage: "bg-sage/10",
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
              className="h-full bg-muted-foreground/20"
              style={{ width: `${unallocatedPercent}%` }}
              title={`Misc & Contingency: ${unallocatedPercent}%`}
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
              Misc & Contingency ({unallocatedPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allocations.map((a, i) => (
          <div
            key={a.id}
            className="glass-card p-5 space-y-3"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{a.name}</h4>
                  <p className="text-xs text-muted-foreground">{a.percentage}% of total</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">{formatCurrency(a.amount)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full animate-fill-bar", colorMap[a.color])}
                style={{ width: `${a.percentage}%`, animationDelay: `${i * 0.15}s` }}
              />
            </div>
          </div>
        ))}
        {unallocatedPercent > 0 && (
          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Misc & Contingency</h4>
                  <p className="text-xs text-muted-foreground">{unallocatedPercent}% buffer</p>
                </div>
              </div>
              <span className="text-lg font-bold text-foreground">{formatCurrency(unallocatedAmount)}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-muted-foreground/30 animate-fill-bar" style={{ width: `${unallocatedPercent}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Trust note */}
      <div className={cn("p-4 rounded-xl text-sm text-center", bgColorMap["sage"])}>
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
