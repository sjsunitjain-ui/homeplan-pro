import { packages, formatCurrency, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, X, Star } from "lucide-react";
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
    <div className="animate-slide-up max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Compare & Decide</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          See what each package offers and make an informed choice.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-card-static overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-medium text-muted-foreground w-32">Feature</th>
              {packages.map((pkg) => (
                <th key={pkg.id} className={cn("p-4 text-center relative", pkg.id === selectedPackage.id && "bg-primary/5")}>
                  {pkg.recommended && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-b-lg flex items-center gap-1">
                      <Star className="w-2.5 h-2.5" /> Best Value
                    </div>
                  )}
                  <div className="font-bold text-foreground">{pkg.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatCurrency(pkg.pricePerSqft)}/sqft</div>
                  <div className="text-sm font-semibold text-primary mt-1">{formatCurrency(pkg.pricePerSqft * details.bua)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.key} className="border-b border-border/50">
                <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className={cn("p-4 text-center text-xs", pkg.id === selectedPackage.id && "bg-primary/5")}>
                    {pkg.highlights[row.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-border/50">
              <td className="p-4 font-medium text-muted-foreground">Sanitary/Toilet</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className={cn("p-4 text-center text-xs font-semibold", pkg.id === selectedPackage.id && "bg-primary/5")}>
                  {formatCurrency(pkg.sanitaryPerToilet)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-medium text-muted-foreground">Smart Home</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className={cn("p-4 text-center", pkg.id === selectedPackage.id && "bg-primary/5")}>
                  {pkg.id === "aarambh" ? (
                    <X className="w-4 h-4 text-muted-foreground mx-auto" />
                  ) : (
                    <Check className="w-4 h-4 text-sage mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Switch Package */}
      <div className="glass-card-static p-6 space-y-4">
        <h3 className="font-semibold text-foreground text-center">Want to switch?</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {packages.map((pkg) => (
            <Button
              key={pkg.id}
              variant={pkg.id === selectedPackage.id ? "hero" : "glass"}
              onClick={() => onChangePackage(pkg)}
              className="min-w-[120px]"
            >
              {pkg.name}
            </Button>
          ))}
        </div>
      </div>

      {/* What You're Missing */}
      {selectedPackage.id !== "utkrisht" && (
        <div className="glass-card-static p-6 space-y-3">
          <h3 className="font-semibold text-foreground">💡 What you're missing by not upgrading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            {selectedPackage.id === "aarambh" && (
              <>
                <div className="p-3 bg-primary/5 rounded-xl">Smart Home Automation</div>
                <div className="p-3 bg-primary/5 rounded-xl">False Ceiling</div>
                <div className="p-3 bg-primary/5 rounded-xl">Solar Provisions</div>
              </>
            )}
            {selectedPackage.id === "rachana" && (
              <>
                <div className="p-3 bg-primary/5 rounded-xl">UPVC Windows</div>
                <div className="p-3 bg-primary/5 rounded-xl">Veneer Doors</div>
                <div className="p-3 bg-primary/5 rounded-xl">Copper Gas Connection</div>
              </>
            )}
            {selectedPackage.id === "sampoorna" && (
              <>
                <div className="p-3 bg-primary/5 rounded-xl">Teak Wood Doors</div>
                <div className="p-3 bg-primary/5 rounded-xl">Grohe Fittings</div>
                <div className="p-3 bg-primary/5 rounded-xl">₹1L Smart Home</div>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Upgrade for just <strong>{formatCurrency(
              (packages[packages.findIndex(p => p.id === selectedPackage.id) + 1]?.pricePerSqft || selectedPackage.pricePerSqft) * details.bua -
              selectedPackage.pricePerSqft * details.bua
            )}</strong> more
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext}>
          View Payment Plan <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
