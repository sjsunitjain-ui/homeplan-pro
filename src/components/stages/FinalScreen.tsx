import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Phone, Download, Share2, Sparkles, Shield, CheckCircle } from "lucide-react";

interface FinalScreenProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onRestart: () => void;
}

export default function FinalScreen({ details, selectedPackage, onRestart }: FinalScreenProps) {
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));
  const confidenceScore = selectedPackage.recommended ? 92 : selectedPackage.id === "utkrisht" ? 95 : 85;

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-xl">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
          You're closer than<br />
          <span className="text-gradient">you think.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Your personalized construction plan is ready. Take the next step toward your dream home.
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass-card-static p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Plan Summary</h3>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-sage" />
            <span className="text-sage font-medium">Confidence: {confidenceScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Client</p>
            <p className="font-semibold text-foreground">{details.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="font-semibold text-foreground">{details.city} ({details.isMetro ? "Metro" : "Non-Metro"})</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Configuration</p>
            <p className="font-semibold text-foreground">{details.bedrooms}BHK • {details.bua.toLocaleString()} sqft</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Package</p>
            <p className="font-semibold text-foreground">{selectedPackage.name} ({selectedPackage.nameHindi})</p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Investment</p>
              <p className="text-3xl font-bold text-gradient">{formatCurrency(totalCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Cost per sqft</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(selectedPackage.pricePerSqft)}</p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {[
            "Personalized plan based on your needs",
            "Industry-standard budget allocation",
            "Transparent material specifications",
            "Dedicated project management included",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-foreground/80">
              <CheckCircle className="w-4 h-4 text-sage shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="hero" size="lg" className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Book Consultation
        </Button>
        <Button variant="glass" size="lg" className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download Plan
        </Button>
        <Button variant="glass" size="lg" className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Plan
        </Button>
      </div>

      {/* Micro conversions */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <button className="text-primary hover:underline">🔒 Lock this estimate</button>
        <button className="text-primary hover:underline">👨‍💼 Get expert review</button>
        <button className="text-primary hover:underline">💬 Talk to planner</button>
      </div>

      {/* Trust footer */}
      <div className="glass-card-static p-4 text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Built with transparency • Trusted by 10,000+ homeowners • Your data is secure
        </p>
        <Button variant="ghost" size="sm" onClick={onRestart}>
          Start a New Plan
        </Button>
      </div>
    </div>
  );
}
