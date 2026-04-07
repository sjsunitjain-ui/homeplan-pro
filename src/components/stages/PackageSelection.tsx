import { packages, formatCurrency, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Star, Check, Sparkles, Crown, Zap, Shield } from "lucide-react";

interface PackageSelectionProps {
  details: ProjectDetails;
  onSelect: (pkg: Package) => void;
  onBack: () => void;
}

const pkgIcons: Record<string, any> = {
  aarambh: Zap,
  rachana: Star,
  sampoorna: Shield,
  utkrisht: Crown,
};

export default function PackageSelection({ details, onSelect, onBack }: PackageSelectionProps) {
  return (
    <div className="animate-slide-up max-w-6xl mx-auto space-y-10">
      {/* Summary */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-[1.1]">
          Your Ideal <span className="text-gradient">Build Plan</span>
        </h2>
        <p className="text-muted-foreground text-lg">
          Based on your {details.bedrooms}BHK home • {details.bua.toLocaleString()} sqft • {details.city}
        </p>
      </div>

      {/* Client Brief Summary */}
      <div className="glass-card-elevated p-6 space-y-3 max-w-3xl mx-auto">
        <p className="text-foreground/90 text-sm leading-relaxed">
          <strong className="text-foreground">{details.name}</strong>, you're planning a beautiful <strong>{details.bedrooms}BHK</strong> home 
          with <strong>{details.bathrooms} bathrooms</strong> in <strong>{details.city}</strong> ({details.isMetro ? "Metro" : "Non-Metro"}). 
          Your built-up area of <strong>{details.bua.toLocaleString()} sqft</strong> gives you ample space 
          to create the home of your dreams.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border/30">
          {[
            { icon: "🏠", text: `${details.bua.toLocaleString()} sqft` },
            { icon: "🛏️", text: `${details.bedrooms} Bed` },
            { icon: "🚿", text: `${details.bathrooms} Bath` },
            { icon: "📍", text: details.city },
          ].map((item) => (
            <span key={item.text} className="flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-full font-medium">
              {item.icon} {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg, i) => {
          const IconComp = pkgIcons[pkg.id] || Star;
          return (
            <div
              key={pkg.id}
              className={cn(
                "relative flex flex-col p-6 space-y-5 cursor-pointer group rounded-2xl border backdrop-blur-xl transition-all duration-500",
                pkg.recommended
                  ? "border-primary/30 ring-2 ring-primary/20 scale-[1.02] bg-card/90"
                  : "border-border/30 bg-card/70 hover:border-primary/20",
                "animate-fade-in-up"
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                boxShadow: pkg.recommended
                  ? '0 20px 60px -12px hsl(262 40% 58% / 0.2), 0 6px 16px -4px hsl(262 40% 58% / 0.12), inset 0 1px 0 0 hsl(0 0% 100% / 0.1)'
                  : '0 4px 24px -4px hsl(262 40% 58% / 0.08), inset 0 1px 0 0 hsl(0 0% 100% / 0.06)',
              }}
              onClick={() => onSelect(pkg)}
            >
              {pkg.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 premium-badge flex items-center gap-1.5 shadow-lg z-10">
                  <Star className="w-3 h-3" /> Most Recommended
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  pkg.recommended ? "gradient-primary shadow-lg" : "bg-primary/10"
                )}>
                  <IconComp className={cn("w-6 h-6", pkg.recommended ? "text-primary-foreground" : "text-primary")} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium">{pkg.nameHindi}</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-3xl font-extrabold text-gradient">
                  {formatCurrency(pkg.pricePerSqft)}
                </div>
                <p className="text-xs text-muted-foreground">per sqft + taxes</p>
              </div>

              <p className="text-sm text-muted-foreground italic leading-relaxed">{pkg.tagline}</p>

              {/* USPs */}
              <ul className="space-y-2.5 flex-1">
                {pkg.usps.map((usp, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <div className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-sage" />
                    </div>
                    <span className="text-foreground/80 leading-snug">{usp}</span>
                  </li>
                ))}
              </ul>

              {/* Estimated total */}
              <div className="pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Estimated Total</p>
                <p className="text-2xl font-extrabold text-foreground">
                  {formatCurrency(pkg.pricePerSqft * details.bua)}
                </p>
              </div>

              {pkg.recommended && (
                <div className="bg-primary/5 rounded-xl p-3 text-xs text-primary flex items-start gap-2 border border-primary/10">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Most homeowners like you choose this — best balance of cost & value</span>
                </div>
              )}

              <Button
                variant={pkg.recommended ? "hero" : "glass"}
                className={cn("w-full font-semibold", pkg.recommended && "shimmer")}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(pkg);
                }}
              >
                Select Plan <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>

      {/* Back */}
      <div className="flex justify-center">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          ← Back to Details
        </Button>
      </div>
    </div>
  );
}
