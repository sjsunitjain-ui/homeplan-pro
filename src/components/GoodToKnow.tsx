import { useState } from "react";
import { ChevronDown, BookOpen, HelpCircle, Shield, Clock, IndianRupee, Hammer, FileCheck, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  icon: React.ReactNode;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    icon: <Clock className="w-4 h-4" />,
    category: "Timeline",
    question: "How long does it take to build a house?",
    answer: "Typically 8-14 months depending on the size (1000-3000 sqft). This includes foundation (1-2 months), structure (3-4 months), finishing (3-5 months), and final handover. Weather conditions and approvals can affect timelines.",
  },
  {
    icon: <FileCheck className="w-4 h-4" />,
    category: "Approvals",
    question: "What approvals do I need before construction?",
    answer: "You'll need: Building plan approval from local authority, NOC from fire department (for multi-story), environmental clearance (if applicable), water & electricity connection approvals. We assist with all documentation.",
  },
  {
    icon: <IndianRupee className="w-4 h-4" />,
    category: "Budget",
    question: "Are there any hidden costs I should know about?",
    answer: "Our packages are transparent and all-inclusive. However, plan for: Government approvals (₹50K-2L), temporary electricity/water (₹10-20K), compound wall (if needed), and interior design (separate from construction). We clearly list everything upfront.",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    category: "Quality",
    question: "How do you ensure construction quality?",
    answer: "We follow IS code standards with 30+ quality checkpoints. Each milestone undergoes inspection before payment release. We use branded materials (JSW/TATA steel, Ultratech cement) with test certificates. A dedicated project manager oversees your build.",
  },
  {
    icon: <Hammer className="w-4 h-4" />,
    category: "Materials",
    question: "Can I choose my own materials or brands?",
    answer: "Yes! Our packages define a base specification. You can upgrade materials within or beyond the package — for example, choosing Italian marble instead of standard tiles. We'll adjust pricing transparently for any upgrades.",
  },
  {
    icon: <IndianRupee className="w-4 h-4" />,
    category: "Payment",
    question: "How does the payment milestone system work?",
    answer: "You pay in stages linked to construction progress: ₹40K booking → material mobilization → foundation → structure → finishing → handover. Each payment unlocks the next phase. This protects both parties and ensures accountability.",
  },
  {
    icon: <TreePine className="w-4 h-4" />,
    category: "Vastu",
    question: "Do you follow Vastu principles?",
    answer: "Yes, our architects incorporate Vastu guidelines into the design — main entrance direction, kitchen placement, bedroom orientation, and staircase positioning. Custom Vastu consultations are available on request.",
  },
  {
    icon: <HelpCircle className="w-4 h-4" />,
    category: "Warranty",
    question: "What warranty do you provide after handover?",
    answer: "We provide: 10-year structural warranty, 2-year waterproofing warranty, 1-year electrical & plumbing warranty. Post-handover support includes a dedicated helpline for any maintenance concerns during the warranty period.",
  },
];

export default function GoodToKnow() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-lg card-title-shadow">Good to Know</h3>
          <p className="text-xs text-muted-foreground">Essential knowledge before you begin</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {faqData.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={cn(
                "rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
                isOpen
                  ? "border-primary/20 enhanced-card-shadow"
                  : "border-border/30 hover:border-primary/10 card-shadow"
              )}
              style={{ background: isOpen ? "hsl(var(--card) / 0.9)" : "hsl(var(--card) / 0.6)" }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  isOpen ? "gradient-primary text-primary-foreground shadow-sm" : "bg-primary/8 text-primary"
                )}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-widest text-primary/60 font-bold">{item.category}</span>
                  <p className="text-sm font-semibold text-foreground leading-tight mt-0.5">{item.question}</p>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300", isOpen && "rotate-180 text-primary")} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 animate-fade-in-up">
                  <div className="pl-11 text-sm text-muted-foreground leading-relaxed border-t border-border/20 pt-3">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
