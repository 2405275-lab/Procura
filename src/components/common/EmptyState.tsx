import React from 'react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-xl mb-4">
        <Icon size={24} className="text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-normal">{description}</p>
      {actionText && onAction && (
        <Button size="sm" onClick={onAction} className="text-xs font-semibold">
          {actionText}
        </Button>
      )}
    </div>
  );
};
