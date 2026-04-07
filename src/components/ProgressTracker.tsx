import { progressionStages } from "@/data/packages";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentStage: number;
}

const stageToProgression = (stage: number): number => {
  if (stage <= 1) return 1;
  if (stage <= 2) return 2;
  if (stage <= 4) return 3;
  if (stage <= 6) return 4;
  return 5;
};

export default function ProgressTracker({ currentStage }: ProgressTrackerProps) {
  const activeProgression = stageToProgression(currentStage);

  return (
    <div className="w-full px-4 py-4">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {progressionStages.map((stage, index) => {
          const isActive = stage.id <= activeProgression;
          const isCurrent = stage.id === activeProgression;
          const isCompleted = stage.id < activeProgression;
          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-11 h-11 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 relative",
                    isActive
                      ? "gradient-primary shadow-lg"
                      : "bg-muted/60 border border-border/40",
                    isCurrent && "animate-glow-pulse scale-110 ring-4 ring-primary/15",
                    isCompleted && "scale-100"
                  )}
                >
                  {stage.icon}
                  {isCurrent && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-sage rounded-full border-2 border-background" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors duration-300 whitespace-nowrap tracking-wide uppercase",
                    isActive ? "text-primary" : "text-muted-foreground/60"
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {index < progressionStages.length - 1 && (
                <div className="flex-1 h-[3px] mx-2 mt-[-18px] rounded-full overflow-hidden bg-muted/40">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700 ease-out",
                      stage.id < activeProgression
                        ? "gradient-primary w-full"
                        : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
