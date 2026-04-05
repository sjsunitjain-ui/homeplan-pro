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
    // Show offer popup when entering the Deciding stage (5)
    if (s === 5) {
      setTimeout(() => setShowOffer(true), 2000);
    }
  };

  const handleBookNow = () => {
    setShowOffer(false);
    goTo(8); // Go to final screen
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">HomesutraPro</h1>
              <p className="text-[10px] text-muted-foreground -mt-0.5">Construction Wallet</p>
            </div>
          </div>
          {stage > 1 && (
            <div className="text-xs text-muted-foreground">
              Step {stage} of {totalStages}
            </div>
          )}
        </div>
        {stage > 1 && <ProgressTracker currentStage={stage} />}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
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
