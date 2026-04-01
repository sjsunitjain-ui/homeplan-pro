import { useEffect, useState } from "react";
import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";

interface InvestmentSummaryProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
}

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

export default function InvestmentSummary({ details, selectedPackage, onNext, onBack }: InvestmentSummaryProps) {
  const multiplier = getMetroMultiplier(details.isMetro);
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * multiplier);
  const animatedCost = useCountUp(totalCost);

  const inflationRate = 0.08;
  const cost1Year = Math.round(totalCost * (1 + inflationRate));
  const cost3Years = Math.round(totalCost * Math.pow(1 + inflationRate, 3));
  const savings1Year = cost1Year - totalCost;
  const savings3Years = cost3Years - totalCost;

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">
          Your <span className="text-gradient">Investment Summary</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          {selectedPackage.name} Package • {details.bua.toLocaleString()} sqft
        </p>
      </div>

      {/* Main Cost Card */}
      <div className="glass-card-static p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">Total Estimated Investment</p>
        <div className="text-5xl md:text-6xl font-bold text-gradient">
          {formatCurrency(animatedCost)}
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>{formatCurrency(selectedPackage.pricePerSqft)}/sqft</span>
          <span>•</span>
          <span>{selectedPackage.name} ({selectedPackage.nameHindi})</span>
          {details.isMetro && (
            <>
              <span>•</span>
              <span className="text-primary">Metro pricing</span>
            </>
          )}
        </div>

        {/* Visual cost bar */}
        <div className="mt-6 space-y-2">
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full animate-fill-bar" style={{ width: "100%" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Construction</span>
            <span>Finishes</span>
            <span>Fittings</span>
            <span>Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Future Cost Protection */}
      <div className="glass-card-static p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-warm rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Future Cost Protection</h3>
            <p className="text-sm text-muted-foreground">Construction costs rise ~8% annually</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-sage/10 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Today</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-sage">
              <Shield className="w-3 h-3" /> Best Price
            </div>
          </div>
          <div className="text-center p-4 bg-accent/10 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">In 1 Year</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(cost1Year)}</p>
            <p className="text-xs text-accent mt-2">+{formatCurrency(savings1Year)} more</p>
          </div>
          <div className="text-center p-4 bg-destructive/10 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">In 3 Years</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(cost3Years)}</p>
            <p className="text-xs text-destructive mt-2">+{formatCurrency(savings3Years)} more</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl text-sm text-primary">
          <Clock className="w-4 h-4 shrink-0" />
          <span>Every month you delay adds approximately <strong>{formatCurrency(Math.round(totalCost * inflationRate / 12))}</strong> to your project cost.</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack}>← Change Package</Button>
        <Button variant="hero" size="xl" onClick={onNext}>
          View Budget Breakdown <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
