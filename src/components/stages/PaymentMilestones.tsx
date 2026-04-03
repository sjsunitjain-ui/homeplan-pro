import { useState } from "react";
import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Milestone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentMilestonesProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
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
  { label: "🏗️ Foundation & Structure", range: [0, 5] },
  { label: "🧱 Superstructure", range: [6, 9] },
  { label: "🔨 Finishing — External", range: [10, 12] },
  { label: "⚡ Finishing — Internal", range: [13, 20] },
  { label: "🚪 Fitments & Fixtures", range: [21, 25] },
  { label: "🎨 Final Finishing & Handover", range: [26, 27] },
];

export default function PaymentMilestones({ details, selectedPackage, onNext, onBack }: PaymentMilestonesProps) {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));

  const computedMilestones = milestones.map((m) => {
    if (m.isBooking) return { ...m, amount: BOOKING_AMOUNT };
    const rawAmount = Math.round(totalCost * (m.percentage / 100));
    const amount = m.deductBooking ? rawAmount - BOOKING_AMOUNT : rawAmount;
    return { ...m, amount };
  });

  const togglePhase = (label: string) => {
    setExpandedPhases((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Stage 0 and 1 are always visible individually
  const stage0 = computedMilestones[0];
  const stage1 = computedMilestones[1];

  // Remaining phases start from phase index 1 (Superstructure) since Foundation includes 0&1
  // We need to compute phase totals for collapsed view
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

  // Cumulative up to stage 1
  const cumulativeAfterStage1 = stage0.amount + stage1.amount;

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Milestone className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Payment</span> Milestones
        </h2>
        <p className="text-muted-foreground text-lg">
          Stage-wise payment schedule for your {formatCurrency(totalCost)} project
        </p>
      </div>

      {/* Summary Card */}
      <div className="glass-card-static p-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">Total Project Cost</p>
          <p className="text-xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Booking Amount</p>
          <p className="text-xl font-bold text-primary">{formatCurrency(BOOKING_AMOUNT)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Milestones</p>
          <p className="text-xl font-bold text-foreground">{milestones.length}</p>
        </div>
      </div>

      {/* Stage 0 — Booking */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider px-1">
          🏗️ Booking & Mobilisation
        </h3>
        <div className="glass-card-static p-4 flex items-start gap-3 ring-1 ring-primary/30 bg-primary/5">
          <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Stage 0</p>
                <p className="text-sm font-medium text-foreground">{stage0.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-foreground">{formatCurrency(stage0.amount)}</p>
                <p className="text-[11px] text-muted-foreground">Fixed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 1 — Mobilisation */}
        <div className="glass-card-static p-4 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Stage 1</p>
                <p className="text-sm font-medium text-foreground">{stage1.name}</p>
                <p className="text-[11px] text-primary/70 mt-0.5">
                  (10% of total = {formatCurrency(Math.round(totalCost * 0.1))} − ₹40,000 booking)
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-foreground">{formatCurrency(stage1.amount)}</p>
                <p className="text-[11px] text-muted-foreground">10%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remaining Phases — Collapsed by default, show only headings */}
      {phases.slice(1).map((phase) => {
        const phaseTotal = getPhaseTotal(phase.range);
        const phasePercent = getPhasePercentage(phase.range);
        const isExpanded = expandedPhases.includes(phase.label);
        const stageCount = phase.range[1] - phase.range[0] + 1;
        const phaseItems = computedMilestones.filter(
          (m) => m.sno >= phase.range[0] && m.sno <= phase.range[1]
        );

        return (
          <div key={phase.label} className="space-y-2">
            <button
              onClick={() => togglePhase(phase.label)}
              className={cn(
                "w-full glass-card-static p-4 flex items-center justify-between gap-3 cursor-pointer transition-all duration-300 hover:shadow-md",
                isExpanded && "ring-1 ring-primary/20"
              )}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">{phase.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {stageCount} stages · {phasePercent}% of total
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-foreground">{formatCurrency(phaseTotal)}</p>
              </div>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20 ml-4 animate-slide-up">
                {phaseItems.map((m) => (
                  <div key={m.sno} className="glass-card-static p-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Stage {m.sno}</p>
                          <p className="text-sm text-foreground leading-snug">{m.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-foreground">{formatCurrency(m.amount)}</p>
                          <p className="text-[10px] text-muted-foreground">{m.percentage}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Cumulative Summary */}
      <div className="glass-card-static p-4 text-center">
        <p className="text-xs text-muted-foreground">Total across all milestones</p>
        <p className="text-xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
        <p className="text-[11px] text-muted-foreground mt-1">100% of project cost covered</p>
      </div>

      {/* Trust Note */}
      <div className="p-4 rounded-xl text-sm text-center bg-sage/10">
        💡 Payments are linked to verified construction milestones — you pay only when work is completed and inspected.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext}>
          Plan Your Loan EMI <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
