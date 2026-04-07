import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Milestone, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMilestonesProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
  onBookNow: () => void;
}

const BOOKING_AMOUNT = 40000;

const milestones = [
  { sno: 0, name: "Booking / Token Amount", percentage: 0, isBooking: true },
  { sno: 1, name: "Advance for Material Mobilisation", percentage: 10, deductBooking: true },
  { sno: 2, name: "Completion of excavation, foundation & column pedestals — Set 1 works", percentage: 5 },
  { sno: 3, name: "Completion of plinth slab works", percentage: 8 },
  { sno: 4, name: "Completion of Ground Floor column raising, brickwork, staircase & lintel works", percentage: 4 },
  { sno: 5, name: "Completion of Ground Floor slab & staircase works", percentage: 5 },
  { sno: 6, name: "Completion of First Floor column raising, brickwork, staircase & lintel works", percentage: 4 },
  { sno: 7, name: "Completion of First Floor slab & staircase works", percentage: 5 },
  { sno: 8, name: "Completion of Second Floor column raising, brickwork, staircase & lintel works", percentage: 4 },
  { sno: 9, name: "Completion of Second Floor slab & staircase works", percentage: 5 },
  { sno: 10, name: "Completion of external plaster works including headroom, parapet & drip moulds", percentage: 5 },
  { sno: 11, name: "Completion of concealed plumbing works including toilet & balcony waterproofing", percentage: 3 },
  { sno: 12, name: "Completion of external drainage & supply line stack works", percentage: 4 },
  { sno: 13, name: "Completion of Ground Floor internal plaster with concealed electrical conduiting", percentage: 1.5 },
  { sno: 14, name: "Completion of First Floor internal plaster with concealed electrical conduiting", percentage: 1.5 },
  { sno: 15, name: "Completion of Second Floor internal plaster with concealed electrical conduiting", percentage: 1.5 },
  { sno: 16, name: "Completion of terrace waterproofing and finishing works", percentage: 4 },
  { sno: 17, name: "Completion of electrical wiring & fittings", percentage: 4 },
  { sno: 18, name: "Completion of Ground Floor tiling works", percentage: 2 },
  { sno: 19, name: "Completion of First Floor tiling works", percentage: 2 },
  { sno: 20, name: "Completion of Second Floor tiling works", percentage: 2 },
  { sno: 21, name: "Completion of doors & windows installation", percentage: 3 },
  { sno: 22, name: "Completion of railing & other fabrication works", percentage: 3 },
  { sno: 23, name: "Completion of electrical switches, sockets & internal MCBs/DBs", percentage: 2.5 },
  { sno: 24, name: "Completion of first coat internal paint & external primer works", percentage: 2 },
  { sno: 25, name: "Completion of CP sanitary installation works", percentage: 2 },
  { sno: 26, name: "Completion of internal painting — final coat", percentage: 2 },
  { sno: 27, name: "Completion of cleaning & handover", percentage: 5 },
];

const phases = [
  { label: "Foundation & Structure", icon: "🏗️", range: [0, 5] },
  { label: "Superstructure", icon: "🧱", range: [6, 9] },
  { label: "Finishing — External", icon: "🔨", range: [10, 12] },
  { label: "Finishing — Internal", icon: "⚡", range: [13, 20] },
  { label: "Fitments & Fixtures", icon: "🚪", range: [21, 25] },
  { label: "Final Finishing & Handover", icon: "🎨", range: [26, 27] },
];

const phaseColors = [
  "bg-primary/8 border-primary/15",
  "bg-accent/8 border-accent/15",
  "bg-sage/8 border-sage/15",
  "bg-primary/6 border-primary/12",
  "bg-accent/6 border-accent/12",
  "bg-sage/6 border-sage/12",
];

export default function PaymentMilestones({ details, selectedPackage, onNext, onBack, onBookNow }: PaymentMilestonesProps) {
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));

  const computedMilestones = milestones.map((m) => {
    if (m.isBooking) return { ...m, amount: BOOKING_AMOUNT };
    const rawAmount = Math.round(totalCost * (m.percentage / 100));
    const amount = m.deductBooking ? rawAmount - BOOKING_AMOUNT : rawAmount;
    return { ...m, amount };
  });

  const stage0 = computedMilestones[0];
  const stage1 = computedMilestones[1];

  const getPhaseTotal = (range: number[]) => {
    return computedMilestones
      .filter((m) => m.sno >= range[0] && m.sno <= range[1])
      .reduce((sum, m) => sum + m.amount, 0);
  };

  const getPhasePercentage = (range: number[]) => {
    return milestones
      .filter((m) => m.sno >= range[0] && m.sno <= range[1])
      .reduce((sum, m) => sum + m.percentage, 0);
  };

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl shimmer">
          <Milestone className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">
          <span className="text-gradient">Payment</span> Milestones
        </h2>
        <p className="text-muted-foreground text-lg">
          Stage-wise payment schedule for your <strong className="text-foreground">{formatCurrency(totalCost)}</strong> project
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass-card-elevated p-6 grid grid-cols-3 gap-4 text-center">
        <div className="stat-card">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total Cost</p>
          <p className="text-xl font-extrabold text-foreground mt-1">{formatCurrency(totalCost)}</p>
        </div>
        <div className="stat-card bg-primary/5 border-primary/10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Booking</p>
          <p className="text-xl font-extrabold text-primary mt-1">{formatCurrency(BOOKING_AMOUNT)}</p>
        </div>
        <div className="stat-card">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Milestones</p>
          <p className="text-xl font-extrabold text-foreground mt-1">{milestones.length}</p>
        </div>
      </div>

      {/* Stage 0 & 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-primary/70 px-1">
          🏗️ Booking & Mobilisation
        </div>

        <div className="glass-card-glow p-5 flex items-start gap-4 animate-fade-in-up">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Stage 0</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{stage0.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-extrabold text-foreground">{formatCurrency(stage0.amount)}</p>
                <p className="text-[10px] text-primary font-semibold">Fixed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card-elevated p-5 flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Stage 1</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">{stage1.name}</p>
                <p className="text-[11px] text-primary/60 mt-1 font-medium">
                  (10% of total = {formatCurrency(Math.round(totalCost * 0.1))} − ₹40,000 booking)
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-extrabold text-foreground">{formatCurrency(stage1.amount)}</p>
                <p className="text-[10px] text-muted-foreground font-semibold">10%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Phases */}
      <div className="space-y-3">
        {phases.slice(1).map((phase, i) => {
          const phaseTotal = getPhaseTotal(phase.range);
          const phasePercent = getPhasePercentage(phase.range);
          const stageCount = phase.range[1] - phase.range[0] + 1;

          return (
            <div
              key={phase.label}
              className={cn(
                "rounded-2xl border p-5 flex items-center justify-between gap-4 transition-all hover:shadow-md animate-fade-in-up",
                phaseColors[i % phaseColors.length]
              )}
              style={{
                animationDelay: `${(i + 2) * 0.08}s`,
                boxShadow: '0 2px 12px -4px hsl(262 40% 58% / 0.06), inset 0 1px 0 0 hsl(0 0% 100% / 0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{phase.icon}</div>
                <div>
                  <p className="text-sm font-bold text-foreground">{phase.label}</p>
                  <p className="text-[11px] text-muted-foreground font-medium">
                    {stageCount} stages · {phasePercent}% of total
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-extrabold text-foreground">{formatCurrency(phaseTotal)}</p>
                <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cumulative Summary */}
      <div className="glass-card-elevated p-5 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total across all milestones</p>
        <p className="text-2xl font-extrabold text-foreground mt-1">{formatCurrency(totalCost)}</p>
        <p className="text-[11px] text-muted-foreground mt-1 font-medium">100% of project cost covered</p>
      </div>

      {/* Trust */}
      <div className="p-4 rounded-xl text-sm text-center bg-sage/8 border border-sage/15 text-muted-foreground">
        💡 Payments are linked to verified construction milestones — you pay only when work is completed and inspected.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">← Back</Button>
        <Button variant="hero" size="xl" onClick={onBookNow} className="shimmer font-semibold">
          <CreditCard className="w-5 h-5" /> Book Now — ₹40,000
        </Button>
        <Button variant="glass" size="lg" onClick={onNext} className="font-semibold">
          Plan Your Loan EMI <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
