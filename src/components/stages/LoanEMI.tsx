import { useState } from "react";
import { formatCurrency, getMetroMultiplier, type Package, type ProjectDetails } from "@/data/packages";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ArrowRight, Calculator } from "lucide-react";

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

  return (
    <div className="animate-slide-up max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <Calculator className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          <span className="text-gradient">Loan EMI</span> Planner
        </h2>
        <p className="text-muted-foreground text-lg">Plan your home loan comfortably</p>
      </div>

      {/* Controls */}
      <div className="glass-card-static p-6 md:p-8 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Down Payment</Label>
            <span className="text-lg font-bold text-foreground">{downPaymentPercent}% — {formatCurrency(downPayment)}</span>
          </div>
          <Slider value={[downPaymentPercent]} onValueChange={([v]) => setDownPaymentPercent(v)} min={10} max={50} step={5} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Interest Rate</Label>
            <span className="text-lg font-bold text-foreground">{interestRate}%</span>
          </div>
          <Slider value={[interestRate]} onValueChange={([v]) => setInterestRate(v)} min={6} max={14} step={0.25} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Loan Tenure</Label>
            <span className="text-lg font-bold text-foreground">{tenure} years</span>
          </div>
          <Slider value={[tenure]} onValueChange={([v]) => setTenure(v)} min={5} max={30} step={1} />
        </div>
      </div>

      {/* Result */}
      <div className="glass-card-static p-6 md:p-8">
        <div className="text-center space-y-2 mb-6">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">Your Monthly EMI</p>
          <div className="text-5xl font-bold text-gradient">{formatCurrency(emi)}</div>
          <p className="text-sm text-muted-foreground">per month for {tenure} years</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-primary/5 rounded-xl">
            <p className="text-xs text-muted-foreground">Property Cost</p>
            <p className="text-base font-bold text-foreground">{formatCurrency(totalCost)}</p>
          </div>
          <div className="p-4 bg-sage/10 rounded-xl">
            <p className="text-xs text-muted-foreground">Loan Amount</p>
            <p className="text-base font-bold text-foreground">{formatCurrency(loanAmount)}</p>
          </div>
          <div className="p-4 bg-accent/10 rounded-xl">
            <p className="text-xs text-muted-foreground">Total Interest</p>
            <p className="text-base font-bold text-foreground">{formatCurrency(totalInterest)}</p>
          </div>
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-xs text-muted-foreground">Total Payable</p>
            <p className="text-base font-bold text-foreground">{formatCurrency(totalPayable)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button variant="hero" size="xl" onClick={onNext}>
          View Your Plan Summary <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
