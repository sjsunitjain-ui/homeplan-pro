import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";

interface OfferPopupProps {
  open: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export default function OfferPopup({ open, onClose, onBookNow }: OfferPopupProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <DialogTitle className="sr-only">Special Offer</DialogTitle>
        {/* Gradient Header */}
        <div className="gradient-primary p-6 text-center relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-primary-foreground/60 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-primary-foreground">🎉 Limited Time Offer!</h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center">
          {/* Family illustration placeholder */}
          <div className="text-5xl">👨‍👩‍👧‍👦</div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-foreground">
              Book Now & Get <span className="text-primary">FREE</span>
            </h4>
            <div className="glass-card-static p-3 rounded-xl">
              <p className="text-sm font-semibold text-foreground">✨ False Ceiling in 500 Sqft Area</p>
              <p className="text-xs text-muted-foreground mt-1">Worth ₹1,50,000+ — Absolutely Free!</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            *Offer valid for bookings made within 48 hours. T&C apply.
          </p>

          <div className="space-y-2">
            <Button variant="hero" size="lg" className="w-full" onClick={onBookNow}>
              🏠 Book Now — Just ₹40,000
            </Button>
            <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
