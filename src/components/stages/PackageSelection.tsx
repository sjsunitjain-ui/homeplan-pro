import { packages, formatCurrency, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Star, Check, Sparkles } from "lucide-react";

interface PackageSelectionProps {
  details: ProjectDetails;
  onSelect: (pkg: Package) => void;
  onBack: () => void;
}

function getBHKLabel(bedrooms: number): string {
  return `${bedrooms}BHK`;
}

export default function PackageSelection({ details, onSelect, onBack }: PackageSelectionProps) {
  return (
    <div className="animate-slide-up max-w-5xl mx-auto space-y-8">
      {/* Summary */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Your Ideal <span className="text-gradient">Build Plan</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Based on your {getBHKLabel(details.bedrooms)} home • {details.bua.toLocaleString()} sqft • {details.city}
        </p>
      </div>

      {/* Mini Summary Card */}
      <div className="glass-card-static p-4 flex flex-wrap items-center justify-center gap-6 text-sm">
        <span className="flex items-center gap-2">🏠 <strong>{details.bua.toLocaleString()}</strong> sqft</span>
        <span className="flex items-center gap-2">🛏️ <strong>{details.bedrooms}</strong> Bedrooms</span>
        <span className="flex items-center gap-2">🚿 <strong>{details.bathrooms}</strong> Bathrooms</span>
        <span className="flex items-center gap-2">📍 {details.city} ({details.isMetro ? "Metro" : "Non-Metro"})</span>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {packages.map((pkg, i) => (
          <div
            key={pkg.id}
            className={cn(
              "glass-card relative flex flex-col p-6 space-y-4 cursor-pointer group",
              pkg.recommended && "ring-2 ring-primary shadow-lg scale-[1.02]"
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
            onClick={() => onSelect(pkg)}
          >
            {pkg.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3" /> Most Recommended
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">{pkg.nameHindi}</p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-gradient">
                {formatCurrency(pkg.pricePerSqft)}
              </div>
              <p className="text-xs text-muted-foreground">per sqft + taxes</p>
            </div>

            <p className="text-sm text-muted-foreground italic">{pkg.tagline}</p>

            {/* USPs */}
            <ul className="space-y-2 flex-1">
              {pkg.usps.map((usp, j) => (
                <li key={j} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-sage mt-0.5 shrink-0" />
                  <span className="text-foreground/80">{usp}</span>
                </li>
              ))}
            </ul>

            {/* Estimated total */}
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Estimated Total</p>
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(pkg.pricePerSqft * details.bua)}
              </p>
            </div>

            {pkg.recommended && (
              <div className="bg-primary/5 rounded-xl p-3 text-xs text-primary flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Most homeowners like you choose this — best balance of cost & value</span>
              </div>
            )}

            <Button
              variant={pkg.recommended ? "hero" : "glass"}
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pkg);
              }}
            >
              Select Plan <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Back */}
      <div className="flex justify-center">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Details
        </Button>
      </div>
    </div>
  );
}
