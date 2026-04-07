import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, X, Sparkles } from "lucide-react";

interface OfferPopupProps {
  open: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export default function OfferPopup({ open, onClose, onBookNow }: OfferPopupProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-0 rounded-2xl" style={{ boxShadow: '0 25px 80px -12px hsl(262 40% 58% / 0.3), 0 10px 24px -4px rgba(0,0,0,0.15)' }}>
        <DialogTitle className="sr-only">Special Offer</DialogTitle>
        {/* Gradient Header */}
        <div className="gradient-primary p-7 text-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
          <button onClick={onClose} className="absolute top-3 right-3 text-primary-foreground/50 hover:text-primary-foreground transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          <div className="w-18 h-18 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 w-[72px] h-[72px] relative">
            <Gift className="w-9 h-9 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-primary-foreground relative">🎉 Limited Time Offer!</h3>
          <p className="text-primary-foreground/70 text-xs mt-1 font-medium relative">Exclusive for new homeowners</p>
        </div>

        {/* Content */}
        <div className="p-7 space-y-5 text-center">
          <div className="text-5xl">👨‍👩‍👧‍👦</div>
          <div className="space-y-3">
            <h4 className="text-xl font-extrabold text-foreground">
              Book Now & Get <span className="text-gradient">FREE</span>
            </h4>
            <div className="glass-card-glow p-4 rounded-xl">
              <p className="text-sm font-bold text-foreground flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> False Ceiling in 500 Sqft Area
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">Worth ₹1,50,000+ — Absolutely Free!</p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/70">
            *Offer valid for bookings made within 48 hours. T&C apply.
          </p>

          <div className="space-y-3">
            <Button variant="hero" size="lg" className="w-full shimmer font-semibold text-base" onClick={onBookNow}>
              🏠 Book Now — Just ₹40,000
            </Button>
            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
