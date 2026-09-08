import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const Toast: React.FC = () => {
  const { toast } = useBudget();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
  };

  const bgClasses = {
    success: 'bg-white dark:bg-slate-900 border-emerald-500/30 text-slate-800 dark:text-slate-100',
    warning: 'bg-white dark:bg-slate-900 border-amber-500/30 text-slate-800 dark:text-slate-100',
    info: 'bg-white dark:bg-slate-900 border-blue-500/30 text-slate-800 dark:text-slate-100',
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-bounce duration-300 pointer-events-none">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${bgClasses[toast.type]} min-w-[260px] max-w-sm`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
    </div>
  );
};
