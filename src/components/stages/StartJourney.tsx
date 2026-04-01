import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectDetails } from "@/data/packages";
import { Home, ArrowRight, Plus, Minus } from "lucide-react";

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
    <div className="animate-slide-up max-w-2xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Home className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Start Your <span className="text-gradient">Project Journey</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Tell us about your dream home. Every great build begins with a clear vision.
        </p>
      </div>

      {/* Form */}
      <div className="glass-card-static p-6 md:p-8 space-y-6">
        {/* Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Your Name *</Label>
            <Input
              placeholder="Enter your full name"
              value={details.name}
              onChange={(e) => update("name", e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number *</Label>
            <Input
              placeholder="+91 XXXXX XXXXX"
              value={details.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              placeholder="you@example.com"
              type="email"
              value={details.email}
              onChange={(e) => update("email", e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
          <div className="space-y-2">
            <Label>City *</Label>
            <Input
              placeholder="e.g. Jaipur, Lucknow"
              value={details.city}
              onChange={(e) => update("city", e.target.value)}
              className="rounded-xl h-12"
            />
          </div>
        </div>

        {/* Metro Toggle */}
        <div className="flex items-center gap-4">
          <Label className="text-base">Location Type</Label>
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => update("isMetro", true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                details.isMetro
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground"
              }`}
            >
              Metro
            </button>
            <button
              onClick={() => update("isMetro", false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                !details.isMetro
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground"
              }`}
            >
              Non-Metro
            </button>
          </div>
        </div>

        {/* BUA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Built-Up Area (sqft) *</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={800}
                max={12000}
                value={details.bua}
                onChange={(e) => update("bua", Math.max(800, Math.min(12000, Number(e.target.value))))}
                className="w-28 rounded-xl h-10 text-center font-semibold"
              />
              <span className="text-sm text-muted-foreground">sqft</span>
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
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>800 sqft</span>
            <span>12,000 sqft</span>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-base">Bedrooms</Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update("bedrooms", Math.max(1, details.bedrooms - 1))}
                className="w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:bg-secondary flex items-center justify-center transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Input
                type="number"
                min={1}
                max={20}
                value={details.bedrooms}
                onChange={(e) => update("bedrooms", Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-16 h-10 rounded-xl text-center font-semibold"
              />
              <button
                onClick={() => update("bedrooms", Math.min(20, details.bedrooms + 1))}
                className="w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:bg-secondary flex items-center justify-center transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => update("bedrooms", n)}
                  className={`w-10 h-8 rounded-lg text-sm font-medium transition-all ${
                    details.bedrooms === n
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Label className="text-base">Bathrooms</Label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => update("bathrooms", Math.max(1, details.bathrooms - 1))}
                className="w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:bg-secondary flex items-center justify-center transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <Input
                type="number"
                min={1}
                max={20}
                value={details.bathrooms}
                onChange={(e) => update("bathrooms", Math.max(1, Math.min(20, Number(e.target.value))))}
                className="w-16 h-10 rounded-xl text-center font-semibold"
              />
              <button
                onClick={() => update("bathrooms", Math.min(20, details.bathrooms + 1))}
                className="w-10 h-10 rounded-xl bg-muted text-muted-foreground hover:bg-secondary flex items-center justify-center transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => update("bathrooms", n)}
                  className={`w-10 h-8 rounded-lg text-sm font-medium transition-all ${
                    details.bathrooms === n
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Other */}
        <div className="space-y-2">
          <Label>Other Requirements</Label>
          <Textarea
            placeholder="Parking, terrace garden, lift, specific materials..."
            value={details.otherRequirements}
            onChange={(e) => update("otherRequirements", e.target.value)}
            className="rounded-xl resize-none"
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
          onClick={() => onNext(details)}
          className="w-full max-w-sm"
        >
          See Your Build Plan <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Trust */}
      <p className="text-center text-xs text-muted-foreground">
        🔒 Your information is secure and only used to personalize your plan.
      </p>
    </div>
  );
}
