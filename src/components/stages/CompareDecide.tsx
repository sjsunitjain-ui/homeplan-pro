import { packages, formatCurrency, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Star, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompareDecideProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onChangePackage: (pkg: Package) => void;
  onNext: () => void;
  onBack: () => void;
}

const comparisonRows = [
  { label: "Steel", key: "steel" as const },
  { label: "Cement", key: "cement" as const },
  { label: "Flooring", key: "flooring" as const },
  { label: "Main Door", key: "doors" as const },
  { label: "Switches", key: "switches" as const },
  { label: "Painting", key: "painting" as const },
  { label: "Windows", key: "windows" as const },
];

export default function CompareDecide({ details, selectedPackage, onChangePackage, onNext, onBack }: CompareDecideProps) {
  return (
    <div className="animate-slide-up max-w-6xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">
          <span className="text-gradient">Compare & Decide</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          See what each package offers and make an informed choice.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-card-elevated overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30">
              <th className="text-left p-5 font-semibold text-muted-foreground w-32 text-xs uppercase tracking-wider">Feature</th>
              {packages.map((pkg) => (
                <th key={pkg.id} className={cn(
                  "p-5 text-center relative transition-colors",
                  pkg.id === selectedPackage.id && "bg-primary/5"
                )}>
                  {pkg.recommended && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 premium-badge text-[9px] px-2.5 py-0.5 rounded-b-lg flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> Best Value
                    </div>
                  )}
                  <div className="font-bold text-foreground text-base mt-1">{pkg.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{formatCurrency(pkg.pricePerSqft)}/sqft</div>
                  <div className="text-base font-extrabold text-primary mt-1">{formatCurrency(pkg.pricePerSqft * details.bua)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, i) => (
              <tr key={row.key} className={cn(
                "border-b border-border/20 transition-colors hover:bg-muted/20",
                i % 2 === 0 && "bg-muted/5"
              )}>
                <td className="p-4 font-semibold text-muted-foreground text-xs">{row.label}</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className={cn(
                    "p-4 text-center text-xs font-medium",
                    pkg.id === selectedPackage.id && "bg-primary/5"
                  )}>
                    {pkg.highlights[row.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className={cn("border-b border-border/20 hover:bg-muted/20", comparisonRows.length % 2 === 0 && "bg-muted/5")}>
              <td className="p-4 font-semibold text-muted-foreground text-xs">Sanitary/Toilet</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className={cn("p-4 text-center text-xs font-bold", pkg.id === selectedPackage.id && "bg-primary/5")}>
                  {formatCurrency(pkg.sanitaryPerToilet)}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-muted/20">
              <td className="p-4 font-semibold text-muted-foreground text-xs">Smart Home</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className={cn("p-4 text-center", pkg.id === selectedPackage.id && "bg-primary/5")}>
                  {pkg.id === "aarambh" ? (
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                      <X className="w-3 h-3 text-destructive/60" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-sage/15 flex items-center justify-center mx-auto">
                      <Check className="w-3 h-3 text-sage" />
                    </div>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Switch Package */}
      <div className="glass-card-elevated p-6 space-y-5">
        <h3 className="font-bold text-foreground text-center text-lg">Want to switch?</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {packages.map((pkg) => (
            <Button
              key={pkg.id}
              variant={pkg.id === selectedPackage.id ? "hero" : "glass"}
              onClick={() => onChangePackage(pkg)}
              className={cn("min-w-[130px] font-semibold", pkg.id === selectedPackage.id && "shimmer")}
            >
              {pkg.name}
            </Button>
          ))}
        </div>
      </div>

      {/* What You're Missing */}
      {selectedPackage.id !== "utkrisht" && (
        <div className="glass-card-glow p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <h3 className="font-bold text-foreground text-lg">What you're missing by not upgrading</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {selectedPackage.id === "aarambh" && (
              <>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Smart Home Automation</div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> False Ceiling</div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Solar Provisions</div>
              </>
            )}
            {selectedPackage.id === "rachana" && (
              <>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> UPVC Windows</div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Veneer Doors</div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Copper Gas Connection</div>
              </>
            )}
            {selectedPackage.id === "sampoorna" && (
              <>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Teak Wood Doors</div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Grohe Fittings</div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> ₹1L Smart Home</div>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center font-medium">
            Upgrade for just <strong className="text-primary">{formatCurrency(
              (packages[packages.findIndex(p => p.id === selectedPackage.id) + 1]?.pricePerSqft || selectedPackage.pricePerSqft) * details.bua -
              selectedPackage.pricePerSqft * details.bua
            )}</strong> more
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext} className="shimmer font-semibold">
          View Payment Plan <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
