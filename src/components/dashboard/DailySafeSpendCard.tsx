import React from 'react';
import { ShieldCheck, AlertCircle, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const DailySafeSpendCard: React.FC = () => {
  const { overview, metrics, currentMonthExpenses, openAffordModal } = useBudget();

  const isExceeded = overview.isOverBudget;
  const safeToday = overview.dailySafeSpend;

  // Calculate today's spent so far
  const todayStr = new Date().toISOString().slice(0, 10);
  const spentToday = currentMonthExpenses
    .filter((e) => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const remainingSafeToday = Math.max(0, safeToday - spentToday);
  const todaySpendPercentage = safeToday > 0 ? Math.min(100, Math.round((spentToday / safeToday) * 100)) : 100;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isExceeded
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {isExceeded ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Smart Spending Guard
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Safe to spend today
              </h3>
            </div>
          </div>

          <button
            onClick={openAffordModal}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
            title="Check if a planned purchase is safe"
          >
            <span>Can I afford this?</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Value Display */}
        <div className="my-3">
          {isExceeded ? (
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">
                ₹0
              </span>
              <p className="text-xs font-semibold text-rose-500 mt-1">
                ₹0 safe spending remaining
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  ₹{safeToday.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-400">daily target</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                To stay within budget, try to keep today's spending under{' '}
                <strong className="text-slate-900 dark:text-white">
                  ₹{safeToday.toLocaleString('en-IN')}
                </strong>
                .
              </p>
            </div>
          )}
        </div>

        {/* Today's pacing micro-bar */}
        {!isExceeded && safeToday > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              <span>Today's spend: ₹{spentToday.toLocaleString('en-IN')}</span>
              <span>Left for today: ₹{remainingSafeToday.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spentToday > safeToday ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${todaySpendPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Formula explanation footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Formula: Remaining Budget ÷ {metrics.daysRemaining} days left</span>
        <span className="font-mono font-medium text-slate-500 dark:text-slate-400">
          Day {metrics.currentDay} of {metrics.daysInMonth}
        </span>
      </div>
    </div>
  );
};
