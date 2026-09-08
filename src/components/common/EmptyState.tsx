import React from 'react';
import { PlusCircle, Sparkles } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  showDemoButton?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your spending story starts here.',
  description = 'Add your first expense and start understanding where your money goes.',
  actionLabel = '+ Add Expense',
  onAction,
  showDemoButton = true,
}) => {
  const { openAddExpense, toggleDemoMode } = useBudget();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white/70 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl my-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-3xl mb-4 shadow-inner">
        📊
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onAction || openAddExpense}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
        {showDemoButton && (
          <button
            onClick={toggleDemoMode}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium text-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Try Demo Mode
          </button>
        )}
      </div>
    </div>
  );
};
