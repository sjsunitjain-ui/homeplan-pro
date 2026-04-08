import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectDetails } from "@/data/packages";
import { Home, ArrowRight, Plus, Minus, MapPin, User, Phone, Mail, Ruler, BedDouble, Bath } from "lucide-react";
import { submitLead } from "@/lib/submitLead";

interface StartJourneyProps {
  onNext: (details: ProjectDetails) => void;
}

export default function StartJourney({ onNext }: StartJourneyProps) {
  const [details, setDetails] = useState<ProjectDetails>({
    name: "",
    mobile: "",
    email: "",
    city: "",
    isMetro: true,
    bua: 1500,
    bedrooms: 3,
    bathrooms: 2,
    otherRequirements: "",
  });

  const update = (field: keyof ProjectDetails, value: any) =>
    setDetails((prev) => ({ ...prev, [field]: value }));

  const isValid = details.name && details.mobile && details.city && details.bua >= 800;

  return (
    <div className="animate-slide-up max-w-2xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center space-y-5">
        <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-xl shimmer animate-scale-in">
          <Home className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] hero-text-shadow">
            Start Your <span className="text-gradient">Dream Home</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Every great home begins with a clear vision. Tell us about yours.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card-elevated p-7 md:p-10 space-y-8">
        {/* Section label */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
          <User className="w-3.5 h-3.5" />
          Personal Details
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" /> Your Name *
            </Label>
            <Input
              placeholder="Enter your full name"
              value={details.name}
              onChange={(e) => update("name", e.target.value)}
              className="premium-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Mobile Number *
            </Label>
            <Input
              placeholder="+91 XXXXX XXXXX"
              value={details.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              className="premium-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email
            </Label>
            <Input
              placeholder="you@example.com"
              type="email"
              value={details.email}
              onChange={(e) => update("email", e.target.value)}
              className="premium-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> City *
            </Label>
            <Input
              placeholder="e.g. Jaipur, Lucknow"
              value={details.city}
              onChange={(e) => update("city", e.target.value)}
              className="premium-input"
            />
          </div>
        </div>

        {/* Metro Toggle */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Location Type</Label>
          <div className="flex bg-muted/50 rounded-xl p-1 border border-border/30">
            <button
              onClick={() => update("isMetro", true)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                details.isMetro
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Metro
            </button>
            <button
              onClick={() => update("isMetro", false)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !details.isMetro
                  ? "gradient-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Non-Metro
            </button>
          </div>
        </div>

        <div className="section-divider" />

        {/* Section label */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary/70">
          <Ruler className="w-3.5 h-3.5" />
          Project Specifications
        </div>

        {/* BUA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Built-Up Area *</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={800}
                max={12000}
                value={details.bua}
                onChange={(e) => update("bua", Math.max(800, Math.min(12000, Number(e.target.value))))}
                className="w-28 premium-input text-center font-bold text-base"
              />
              <span className="text-sm text-muted-foreground font-medium">sqft</span>
            </div>
          </div>
          <Slider
            value={[details.bua]}
            onValueChange={([v]) => update("bua", v)}
            min={800}
            max={12000}
            step={50}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>800 sqft</span>
            <span className="text-primary font-semibold">{details.bua.toLocaleString()} sqft</span>
            <span>12,000 sqft</span>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5 text-muted-foreground" /> Bedrooms
            </Label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => update("bedrooms", Math.max(1, details.bedrooms - 1))}
                className="w-11 h-11 rounded-xl bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all border border-border/30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Input
                type="number"
                min={1}
                max={20}
                value={details.bedrooms}
                onChange={(e) => update("bedrooms", Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-16 h-11 premium-input text-center font-bold text-lg"
              />
              <button
                onClick={() => update("bedrooms", Math.min(20, details.bedrooms + 1))}
                className="w-11 h-11 rounded-xl bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all border border-border/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => update("bedrooms", n)}
                  className={`w-10 h-9 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    details.bedrooms === n
                      ? "gradient-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted/40 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-muted-foreground" /> Bathrooms
            </Label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => update("bathrooms", Math.max(1, details.bathrooms - 1))}
                className="w-11 h-11 rounded-xl bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all border border-border/30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Input
                type="number"
                min={1}
                max={20}
                value={details.bathrooms}
                onChange={(e) => update("bathrooms", Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-16 h-11 premium-input text-center font-bold text-lg"
              />
              <button
                onClick={() => update("bathrooms", Math.min(20, details.bathrooms + 1))}
                className="w-11 h-11 rounded-xl bg-muted/60 text-muted-foreground hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all border border-border/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => update("bathrooms", n)}
                  className={`w-10 h-9 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    details.bathrooms === n
                      ? "gradient-primary text-primary-foreground shadow-md scale-105"
                      : "bg-muted/40 text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="section-divider" />

        {/* Other */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Other Requirements</Label>
          <Textarea
            placeholder="Parking, terrace garden, lift, specific materials..."
            value={details.otherRequirements}
            onChange={(e) => update("otherRequirements", e.target.value)}
            className="rounded-xl resize-none border-border/40 bg-background/60 backdrop-blur-sm focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            rows={3}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <Button
          variant="hero"
          size="xl"
          disabled={!isValid}
          onClick={() => {
            submitLead(details);
            onNext(details);
          }}
          className="w-full max-w-sm text-base font-semibold shimmer"
        >
          See Your Build Plan <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Trust */}
      <p className="text-center text-xs text-muted-foreground/70 flex items-center justify-center gap-1.5">
        <span className="w-4 h-4 rounded-full bg-sage/20 flex items-center justify-center text-[10px]">🔒</span>
        Your information is secure and only used to personalize your plan.
      </p>
    </div>
  );
}
