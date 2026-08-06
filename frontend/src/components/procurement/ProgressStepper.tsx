import React from 'react';
import { cn } from '@/utils/cn';
import { Check } from 'lucide-react';

const STAGES = [
  'Purchase Request',
  'Upload Quotations',
  'AI Extraction',
  'Vendor Comparison',
  'Approval',
  'Purchase Order',
];

interface ProgressStepperProps {
  currentStage: typeof STAGES[number];
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStage }) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-2">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <React.Fragment key={stage}>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-200',
                    {
                      'bg-green-600 border-green-600 text-white': isCompleted,
                      'bg-primary-600 border-primary-600 text-white ring-4 ring-primary-500/10': isActive,
                      'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400': !isCompleted && !isActive,
                    }
                  )}
                >
                  {isCompleted ? <Check size={14} /> : <span>{index + 1}</span>}
                </div>
                <div>
                  <h4
                    className={cn('text-xs font-semibold transition-colors duration-200', {
                      'text-green-700 dark:text-green-400': isCompleted,
                      'text-primary-600 dark:text-primary-400': isActive,
                      'text-slate-500 dark:text-slate-400': !isCompleted && !isActive,
                    })}
                  >
                    {stage}
                  </h4>
                </div>
              </div>
              
              {/* Connector line */}
              {index < STAGES.length - 1 && (
                <div
                  className={cn(
                    'hidden md:block flex-1 h-0.5 mx-2 rounded transition-colors duration-200',
                    {
                      'bg-green-600': index < currentIndex,
                      'bg-slate-200 dark:bg-slate-800': index >= currentIndex,
                    }
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
