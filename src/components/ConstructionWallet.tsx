import { useState } from "react";
import ProgressTracker from "@/components/ProgressTracker";
import StartJourney from "@/components/stages/StartJourney";
import PackageSelection from "@/components/stages/PackageSelection";
import InvestmentSummary from "@/components/stages/InvestmentSummary";
import BudgetAllocation from "@/components/stages/BudgetAllocation";
import CompareDecide from "@/components/stages/CompareDecide";
import PaymentMilestones from "@/components/stages/PaymentMilestones";
import LoanEMI from "@/components/stages/LoanEMI";
import FinalScreen from "@/components/stages/FinalScreen";
import OfferPopup from "@/components/OfferPopup";
import type { ProjectDetails, Package } from "@/data/packages";

export default function ConstructionWallet() {
  const [stage, setStage] = useState(1);
  const [details, setDetails] = useState<ProjectDetails | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showOffer, setShowOffer] = useState(false);

  const totalStages = 8;

  const goTo = (s: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStage(s);
    if (s === 5) {
      setTimeout(() => setShowOffer(true), 2000);
    }
  };

  const handleBookNow = () => {
    setShowOffer(false);
    goTo(8);
  };

  return (
    <div className="min-h-screen bg-background gradient-mesh-bg relative overflow-hidden">
      {/* Background orbs */}
      <div className="floating-orb w-[400px] h-[400px] bg-primary/20 top-[-100px] left-[-100px]" />
      <div className="floating-orb w-[300px] h-[300px] bg-accent/15 bottom-[-50px] right-[-50px]" style={{ animationDelay: '3s' }} />
      <div className="floating-orb w-[200px] h-[200px] bg-sage/15 top-[40%] right-[10%]" style={{ animationDelay: '5s' }} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/70 border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shimmer">
              <span className="text-primary-foreground font-bold text-base">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">HomesutraPro</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5 font-medium tracking-wider uppercase">Construction Wallet</p>
            </div>
          </div>
          {stage > 1 && (
            <div className="flex items-center gap-2">
              <div className="text-xs font-medium text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Step {stage} of {totalStages}
              </div>
            </div>
          )}
        </div>
        {stage > 1 && <ProgressTracker currentStage={stage} />}
        {/* Gradient line at bottom */}
        <div className="h-[1px] w-full" style={{ background: 'linear-gradient(90deg, transparent, hsl(262 40% 58% / 0.3), hsl(280 45% 65% / 0.3), transparent)' }} />
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 relative z-10">
        {stage === 1 && (
          <StartJourney
            onNext={(d) => {
              setDetails(d);
              goTo(2);
            }}
          />
        )}

        {stage === 2 && details && (
          <PackageSelection
            details={details}
            onSelect={(pkg) => {
              setSelectedPackage(pkg);
              goTo(3);
            }}
            onBack={() => goTo(1)}
          />
        )}

        {stage === 3 && details && selectedPackage && (
          <InvestmentSummary
            details={details}
            selectedPackage={selectedPackage}
            onNext={() => goTo(4)}
            onBack={() => goTo(2)}
          />
        )}

        {stage === 4 && details && selectedPackage && (
          <BudgetAllocation
            details={details}
            selectedPackage={selectedPackage}
            onNext={() => goTo(5)}
            onBack={() => goTo(3)}
          />
        )}

        {stage === 5 && details && selectedPackage && (
          <CompareDecide
            details={details}
            selectedPackage={selectedPackage}
            onChangePackage={(pkg) => setSelectedPackage(pkg)}
            onNext={() => goTo(6)}
            onBack={() => goTo(4)}
          />
        )}

        {stage === 6 && details && selectedPackage && (
          <PaymentMilestones
            details={details}
            selectedPackage={selectedPackage}
            onNext={() => goTo(7)}
            onBack={() => goTo(5)}
            onBookNow={handleBookNow}
          />
        )}

        {stage === 7 && details && selectedPackage && (
          <LoanEMI
            details={details}
            selectedPackage={selectedPackage}
            onNext={() => goTo(8)}
            onBack={() => goTo(6)}
          />
        )}

        {stage === 8 && details && selectedPackage && (
          <FinalScreen
            details={details}
            selectedPackage={selectedPackage}
            onRestart={() => {
              setDetails(null);
              setSelectedPackage(null);
              goTo(1);
            }}
          />
        )}
      </main>

      {/* Offer Popup */}
      <OfferPopup
        open={showOffer}
        onClose={() => setShowOffer(false)}
        onBookNow={handleBookNow}
      />
    </div>
  );
}
