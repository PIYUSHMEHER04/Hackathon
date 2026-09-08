import React from 'react';
import { AlertOctagon, AlertTriangle, ArrowRight } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const BudgetAlertBanner: React.FC = () => {
  const { overview, budgetHealth, setActiveTab } = useBudget();

  // Only render if percentage is >= 80%
  if (overview.percentage < 80) return null;

  const isExceeded = overview.percentage >= 100;

  return (
    <div
      role="alert"
      className={`w-full rounded-2xl p-4 sm:p-5 border transition-all shadow-md animate-fade-in ${
        isExceeded
          ? 'bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/40 text-rose-900 dark:text-rose-200'
          : 'bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-amber-500/40 text-amber-900 dark:text-amber-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              isExceeded
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
            }`}
          >
            {isExceeded ? (
              <AlertOctagon className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isExceeded
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {budgetHealth.label}
              </span>
              <span className="text-xs font-semibold opacity-80">
                {overview.percentage.toFixed(1)}% Used
              </span>
            </div>
            <p className="text-sm font-semibold mt-1 leading-snug">
              {budgetHealth.message}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            isExceeded
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
          }`}
        >
          <span>See Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
