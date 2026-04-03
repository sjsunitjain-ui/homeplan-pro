import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Circle, Milestone } from "lucide-react";
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

// Category groupings for visual sections
const phases = [
  { label: "🏗️ Foundation & Structure", range: [0, 5] },
  { label: "🧱 Superstructure", range: [6, 9] },
  { label: "🔨 Finishing — External", range: [10, 12] },
  { label: "⚡ Finishing — Internal", range: [13, 20] },
  { label: "🚪 Fitments & Fixtures", range: [21, 25] },
  { label: "🎨 Final Finishing & Handover", range: [26, 27] },
];

export default function PaymentMilestones({ details, selectedPackage, onNext, onBack }: PaymentMilestonesProps) {
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));

  const computedMilestones = milestones.map((m) => {
    if (m.isBooking) {
      return { ...m, amount: BOOKING_AMOUNT };
    }
    const rawAmount = Math.round(totalCost * (m.percentage / 100));
    const amount = m.deductBooking ? rawAmount - BOOKING_AMOUNT : rawAmount;
    return { ...m, amount };
  });

  let runningTotal = 0;

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

      {/* Milestone Timeline */}
      {phases.map((phase) => {
        const phaseItems = computedMilestones.filter(
          (m) => m.sno >= phase.range[0] && m.sno <= phase.range[1]
        );
        return (
          <div key={phase.label} className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider px-1">
              {phase.label}
            </h3>
            <div className="space-y-2">
              {phaseItems.map((m) => {
                runningTotal += m.amount;
                const cumulativePercent = Math.round((runningTotal / totalCost) * 100);
                return (
                  <div
                    key={m.sno}
                    className={cn(
                      "glass-card-static p-4 flex items-start gap-3",
                      m.isBooking && "ring-1 ring-primary/30 bg-primary/5"
                    )}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center mt-1 shrink-0">
                      {m.isBooking ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/40" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Stage {m.sno}</p>
                          <p className="text-sm font-medium text-foreground leading-snug">{m.name}</p>
                          {m.deductBooking && (
                            <p className="text-[11px] text-primary/70 mt-0.5">
                              ({m.percentage}% of total = {formatCurrency(Math.round(totalCost * (m.percentage / 100)))} − ₹40,000 booking)
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-base font-bold text-foreground">{formatCurrency(m.amount)}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {m.isBooking ? "Fixed" : `${m.percentage}%`}
                          </p>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-primary transition-all duration-700"
                          style={{ width: `${Math.min(cumulativePercent, 100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1 text-right">
                        Cumulative: {formatCurrency(runningTotal)} ({cumulativePercent}%)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

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
