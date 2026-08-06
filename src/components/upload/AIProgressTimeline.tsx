import { cn } from '@/utils/cn';
import { Check, Loader } from 'lucide-react';

const STEPS = [
  'OCR Completed',
  'Text Extracted',
  'Information Parsed',
  'Validating Fields',
  'Final Validation',
];

interface AIProgressTimelineProps {
  currentStep: number; // 0 to 5
}

export const AIProgressTimeline: React.FC<AIProgressTimelineProps> = ({ currentStep }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
      <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        AI Extraction Engine Status
      </h4>
      
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;
          
          return (
            <div key={step} className="flex items-center gap-3 text-xs select-none">
              <div
                className={cn(
                  'h-5 w-5 rounded-full flex items-center justify-center border transition-all duration-200',
                  {
                    'bg-green-100 border-green-200 text-green-700 dark:bg-green-950/40 dark:border-green-800 dark:text-green-400': isCompleted,
                    'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-400 ring-4 ring-amber-500/10': isActive,
                    'bg-slate-50 border-slate-200 text-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-600': isPending,
                  }
                )}
              >
                {isCompleted ? (
                  <Check size={11} className="stroke-[3]" />
                ) : isActive ? (
                  <Loader size={11} className="animate-spin text-amber-500" />
                ) : (
                  <span className="text-[9px] font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={cn('font-semibold', {
                  'text-green-700 dark:text-green-400': isCompleted,
                  'text-amber-700 dark:text-amber-400': isActive,
                  'text-slate-400 dark:text-slate-600': isPending,
                })}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
