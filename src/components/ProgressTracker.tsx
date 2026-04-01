import { progressionStages } from "@/data/packages";
import { cn } from "@/lib/utils";

interface ProgressTrackerProps {
  currentStage: number;
}

const stageToProgression = (stage: number): number => {
  if (stage <= 1) return 1;
  if (stage <= 2) return 2;
  if (stage <= 4) return 3;
  if (stage <= 7) return 4;
  return 5;
};

export default function ProgressTracker({ currentStage }: ProgressTrackerProps) {
  const activeProgression = stageToProgression(currentStage);

  return (
    <div className="w-full px-4 py-6">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {progressionStages.map((stage, index) => {
          const isActive = stage.id <= activeProgression;
          const isCurrent = stage.id === activeProgression;
          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500",
                    isActive
                      ? "gradient-primary shadow-md scale-110"
                      : "bg-muted",
                    isCurrent && "animate-pulse-soft ring-4 ring-primary/20"
                  )}
                >
                  {stage.icon}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-300 whitespace-nowrap",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {index < progressionStages.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mt-[-18px]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      stage.id < activeProgression
                        ? "gradient-primary"
                        : "bg-muted"
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
