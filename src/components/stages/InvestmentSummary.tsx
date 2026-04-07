import { useEffect, useState } from "react";
import { formatCurrency, getMetroMultiplier, budgetCategories, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Clock, Zap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

const PIE_COLORS = [
  "hsl(262, 40%, 58%)",
  "hsl(16, 45%, 65%)",
  "hsl(142, 40%, 50%)",
  "hsl(262, 40%, 58%, 0.6)",
  "hsl(16, 45%, 65%, 0.6)",
  "hsl(142, 40%, 50%, 0.6)",
  "hsl(260, 10%, 55%, 0.35)",
];

export default function InvestmentSummary({ details, selectedPackage, onNext, onBack }: InvestmentSummaryProps) {
  const multiplier = getMetroMultiplier(details.isMetro);
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * multiplier);
  const animatedCost = useCountUp(totalCost);

  const inflationRate = 0.08;
  const cost1Year = Math.round(totalCost * (1 + inflationRate));
  const cost3Years = Math.round(totalCost * Math.pow(1 + inflationRate, 3));
  const savings1Year = cost1Year - totalCost;
  const savings3Years = cost3Years - totalCost;

  const sanitaryTotal = selectedPackage.sanitaryPerToilet * details.bathrooms;
  const sanitaryPercent = Math.round((sanitaryTotal / totalCost) * 100);
  const fixedCategories = budgetCategories.map((cat) => {
    if (cat.id === "sanitary") return { ...cat, percentage: sanitaryPercent };
    return cat;
  });
  const allocatedPercent = fixedCategories.reduce((sum, c) => sum + c.percentage, 0);
  const miscPercent = Math.max(0, 100 - allocatedPercent);

  const pieData = [
    ...fixedCategories.map((c) => ({ name: c.name, value: c.percentage })),
    ...(miscPercent > 0 ? [{ name: "Grey Box Structure", value: miscPercent }] : []),
  ];

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">
          Your <span className="text-gradient">Investment Summary</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          {selectedPackage.name} Package • {details.bua.toLocaleString()} sqft
        </p>
      </div>

      {/* Main Cost Card */}
      <div className="glass-card-glow p-8 md:p-10 text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 shimmer" style={{ pointerEvents: 'none' }} />
        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold">Total Estimated Investment</p>
        <div className="text-5xl md:text-7xl font-extrabold text-gradient leading-none py-2">
          {formatCurrency(animatedCost)}
        </div>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="bg-muted/40 px-3 py-1.5 rounded-full font-medium">{formatCurrency(selectedPackage.pricePerSqft)}/sqft</span>
          <span className="bg-muted/40 px-3 py-1.5 rounded-full font-medium">{selectedPackage.name} ({selectedPackage.nameHindi})</span>
          {details.isMetro && (
            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold">Metro pricing</span>
          )}
        </div>
      </div>

      {/* Pie Chart */}
      <div className="glass-card-elevated p-6 md:p-8 space-y-5">
        <h3 className="font-bold text-foreground text-center text-lg">Budget Distribution Overview</h3>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-60 h-60 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(260 20% 90% / 0.5)",
                    boxShadow: "0 8px 32px -4px rgba(0,0,0,0.12)",
                    fontSize: "13px",
                    backdropFilter: "blur(12px)",
                    background: "hsl(260 30% 99% / 0.9)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 text-xs">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-foreground/80 font-medium">{entry.name} <span className="text-primary font-bold">({entry.value}%)</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Cost Protection */}
      <div className="glass-card-elevated p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-warm rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">Future Cost Protection</h3>
            <p className="text-sm text-muted-foreground">Construction costs rise ~8% annually</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card bg-sage/8 border-sage/15">
            <div className="absolute inset-0 bg-sage/5 rounded-2xl" />
            <p className="text-[11px] text-muted-foreground mb-2 font-medium relative">Today</p>
            <p className="text-xl font-extrabold text-foreground relative">{formatCurrency(totalCost)}</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-sage font-semibold relative">
              <Shield className="w-3 h-3" /> Best Price
            </div>
          </div>
          <div className="stat-card bg-accent/8 border-accent/15">
            <p className="text-[11px] text-muted-foreground mb-2 font-medium">In 1 Year</p>
            <p className="text-xl font-extrabold text-foreground">{formatCurrency(cost1Year)}</p>
            <p className="text-xs text-accent mt-2 font-semibold">+{formatCurrency(savings1Year)}</p>
          </div>
          <div className="stat-card bg-destructive/8 border-destructive/15">
            <p className="text-[11px] text-muted-foreground mb-2 font-medium">In 3 Years</p>
            <p className="text-xl font-extrabold text-foreground">{formatCurrency(cost3Years)}</p>
            <p className="text-xs text-destructive mt-2 font-semibold">+{formatCurrency(savings3Years)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl text-sm text-primary border border-primary/10">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <span>Every month you delay adds approximately <strong>{formatCurrency(Math.round(totalCost * inflationRate / 12))}</strong> to your project cost.</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">← Change Package</Button>
        <Button variant="hero" size="xl" onClick={onNext} className="shimmer font-semibold">
          View Budget Breakdown <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
