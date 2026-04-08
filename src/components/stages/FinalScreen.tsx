import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Phone, Download, Share2, Sparkles, Shield, CheckCircle, PartyPopper } from "lucide-react";
import { generatePlanPDF } from "@/lib/generatePlanPDF";
import { submitLead } from "@/lib/submitLead";
import { toast } from "sonner";
import { useEffect } from "react";

interface FinalScreenProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onRestart: () => void;
}

export default function FinalScreen({ details, selectedPackage, onRestart }: FinalScreenProps) {
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));
  const confidenceScore = selectedPackage.recommended ? 92 : selectedPackage.id === "utkrisht" ? 95 : 85;

  useEffect(() => {
    submitLead(details, selectedPackage);
  }, []);

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-5">
        <div className="w-24 h-24 gradient-primary rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shimmer animate-scale-in relative">
          <Sparkles className="w-12 h-12 text-primary-foreground" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <PartyPopper className="w-4 h-4 text-accent-foreground" />
          </div>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-[1.1] hero-text-shadow">
          You're closer than<br />
          <span className="text-gradient">you think.</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          Your personalized construction plan is ready. Take the next step toward your dream home.
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass-card-elevated p-7 md:p-9 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-lg">Plan Summary</h3>
          <div className="flex items-center gap-2 text-sm bg-sage/10 px-3 py-1.5 rounded-full border border-sage/15">
            <Shield className="w-4 h-4 text-sage" />
            <span className="text-sage font-semibold">Confidence: {confidenceScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Client", value: details.name },
            { label: "Location", value: `${details.city} (${details.isMetro ? "Metro" : "Non-Metro"})` },
            { label: "Configuration", value: `${details.bedrooms}BHK • ${details.bua.toLocaleString()} sqft` },
            { label: "Package", value: `${selectedPackage.name} (${selectedPackage.nameHindi})` },
          ].map((item) => (
            <div key={item.label} className="space-y-1.5 p-3 rounded-xl bg-muted/20">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
              <p className="font-bold text-foreground text-sm">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="section-divider" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Total Investment</p>
            <p className="text-4xl font-extrabold text-gradient mt-1">{formatCurrency(totalCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Cost per sqft</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{formatCurrency(selectedPackage.pricePerSqft)}</p>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-3 pt-2">
          {[
            "Personalized plan based on your needs",
            "Industry-standard budget allocation",
            "Transparent material specifications",
            "Dedicated project management included",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-foreground/80">
              <div className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center shrink-0">
                <CheckCircle className="w-3 h-3 text-sage" />
              </div>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="hero" size="lg" className="flex items-center gap-2 shimmer font-semibold">
          <Phone className="w-5 h-5" />
          Book Consultation
        </Button>
        <Button variant="glass" size="lg" className="flex items-center gap-2 font-semibold" onClick={() => {
          generatePlanPDF(details, selectedPackage);
          toast.success("PDF downloaded successfully!");
        }}>
          <Download className="w-5 h-5" />
          Download Plan
        </Button>
        <Button variant="glass" size="lg" className="flex items-center gap-2 font-semibold">
          <Share2 className="w-5 h-5" />
          Share Plan
        </Button>
      </div>

      {/* Micro conversions */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <button className="text-primary hover:underline font-medium transition-colors hover:text-primary/80">🔒 Lock this estimate</button>
        <button className="text-primary hover:underline font-medium transition-colors hover:text-primary/80">👨‍💼 Get expert review</button>
        <button className="text-primary hover:underline font-medium transition-colors hover:text-primary/80">💬 Talk to planner</button>
      </div>

      {/* Trust footer */}
      <div className="glass-card-elevated p-5 text-center space-y-3">
        <p className="text-sm text-muted-foreground font-medium">
          Built with transparency • Trusted by 10,000+ homeowners • Your data is secure
        </p>
        <Button variant="ghost" size="sm" onClick={onRestart} className="text-muted-foreground hover:text-foreground">
          Start a New Plan
        </Button>
      </div>
    </div>
  );
}
