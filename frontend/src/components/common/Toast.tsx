import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Portal Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white dark:bg-slate-900',
                {
                  'border-green-150 bg-green-50/90 text-green-800 dark:border-green-900/30 dark:bg-green-950/90 dark:text-green-300': toast.type === 'success',
                  'border-red-150 bg-red-50/90 text-red-800 dark:border-red-900/30 dark:bg-red-950/90 dark:text-red-300': toast.type === 'error',
                  'border-amber-150 bg-amber-50/90 text-amber-800 dark:border-amber-900/30 dark:bg-amber-950/90 dark:text-amber-300': toast.type === 'warning',
                  'border-blue-150 bg-blue-50/90 text-blue-800 dark:border-blue-900/30 dark:bg-blue-950/90 dark:text-blue-300': toast.type === 'info',
                }
              )}
            >
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />}
              {toast.type === 'warning' && <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />}
              {toast.type === 'info' && <Info className="h-5 w-5 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />}

              <div className="flex-1 text-xs font-semibold leading-relaxed">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-pointer"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
