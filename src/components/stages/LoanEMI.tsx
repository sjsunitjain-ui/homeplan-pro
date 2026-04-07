import { useState } from "react";
import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calculator, IndianRupee, Percent, CalendarDays } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface LoanEMIProps {
  details: ProjectDetails;
  selectedPackage: Package;
  onNext: () => void;
  onBack: () => void;
}

function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export default function LoanEMI({ details, selectedPackage, onNext, onBack }: LoanEMIProps) {
  const totalCost = Math.round(selectedPackage.pricePerSqft * details.bua * getMetroMultiplier(details.isMetro));

  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const downPayment = Math.round(totalCost * downPaymentPercent / 100);
  const loanAmount = totalCost - downPayment;
  const emi = Math.round(calculateEMI(loanAmount, interestRate, tenure));
  const totalPayable = Math.round(emi * tenure * 12);
  const totalInterest = totalPayable - loanAmount;

  const donutData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
    { name: "Down Payment", value: downPayment },
  ];

  const donutColors = [
    "hsl(262, 40%, 58%)",
    "hsl(16, 45%, 65%)",
    "hsl(150, 20%, 55%)",
  ];

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl shimmer">
          <Calculator className="w-8 h-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold leading-[1.1]">
          <span className="text-gradient">Loan EMI</span> Planner
        </h2>
        <p className="text-muted-foreground text-lg">Plan your home loan comfortably</p>
      </div>

      {/* Controls */}
      <div className="glass-card-elevated p-6 md:p-10 space-y-8">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-primary" />
              </div>
              Down Payment
            </Label>
            <span className="text-lg font-extrabold text-foreground">{downPaymentPercent}% — {formatCurrency(downPayment)}</span>
          </div>
          <Slider value={[downPaymentPercent]} onValueChange={([v]) => setDownPaymentPercent(v)} min={10} max={50} step={5} />
        </div>

        <div className="section-divider" />

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Percent className="w-4 h-4 text-accent" />
              </div>
              Interest Rate
            </Label>
            <span className="text-lg font-extrabold text-foreground">{interestRate}%</span>
          </div>
          <Slider value={[interestRate]} onValueChange={([v]) => setInterestRate(v)} min={6} max={14} step={0.25} />
        </div>

        <div className="section-divider" />

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <div className="w-8 h-8 bg-sage/10 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-sage" />
              </div>
              Loan Tenure
            </Label>
            <span className="text-lg font-extrabold text-foreground">{tenure} years</span>
          </div>
          <Slider value={[tenure]} onValueChange={([v]) => setTenure(v)} min={5} max={30} step={1} />
        </div>
      </div>

      {/* Result */}
      <div className="glass-card-glow p-6 md:p-10 relative overflow-hidden">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-semibold">Your Monthly EMI</p>
          <div className="text-5xl md:text-6xl font-extrabold text-gradient leading-none py-2">{formatCurrency(emi)}</div>
          <p className="text-sm text-muted-foreground font-medium">per month for {tenure} years</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Donut Chart */}
          <div className="w-48 h-48 mx-auto shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {donutData.map((_, index) => (
                    <Cell key={index} fill={donutColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-3 w-full">
            <div className="stat-card bg-primary/5 border-primary/10">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Property Cost</p>
              <p className="text-base font-extrabold text-foreground mt-1">{formatCurrency(totalCost)}</p>
            </div>
            <div className="stat-card bg-sage/8 border-sage/15">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Loan Amount</p>
              <p className="text-base font-extrabold text-foreground mt-1">{formatCurrency(loanAmount)}</p>
            </div>
            <div className="stat-card bg-accent/8 border-accent/15">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total Interest</p>
              <p className="text-base font-extrabold text-foreground mt-1">{formatCurrency(totalInterest)}</p>
            </div>
            <div className="stat-card">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total Payable</p>
              <p className="text-base font-extrabold text-foreground mt-1">{formatCurrency(totalPayable)}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs font-medium">
          {donutData.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: donutColors[i] }} />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext} className="shimmer font-semibold">
          View Your Plan Summary <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
