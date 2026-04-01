import { useEffect, useState } from "react";
import { formatCurrency, getMetroMultiplier, budgetCategories, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";
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
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(142, 40%, 50%)",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--accent) / 0.6)",
  "hsl(142, 40%, 50% / 0.6)",
  "hsl(var(--muted-foreground) / 0.3)",
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

  // Pie chart data
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
    ...(miscPercent > 0 ? [{ name: "Misc & Contingency", value: miscPercent }] : []),
  ];

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
      </div>

      {/* Pie Chart */}
      <div className="glass-card-static p-6 space-y-4">
        <h3 className="font-semibold text-foreground text-center">Budget Distribution Overview</h3>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-56 h-56 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: "13px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
            {pieData.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                <span className="text-foreground/80">{entry.name} ({entry.value}%)</span>
              </div>
            ))}
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
