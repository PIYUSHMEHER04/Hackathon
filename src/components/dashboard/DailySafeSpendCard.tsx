import React from 'react';
import { ShieldCheck, AlertCircle, ArrowUpRight, Sparkles } from 'lucide-react';
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
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-2xl ${
                isExceeded
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald'
              }`}
            >
              {isExceeded ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
                Fintech Guard
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Safe to spend today
              </h3>
            </div>
          </div>

          <button
            onClick={openAffordModal}
            className="text-xs font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
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
              <span className="text-4xl font-black text-rose-500 font-mono tracking-tight">
                ₹0
              </span>
              <p className="text-xs font-bold text-rose-400 mt-1">
                ₹0 safe spending remaining
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  ₹{safeToday.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-slate-400">daily target</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                To stay within budget, try to keep today's spending under{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  ₹{safeToday.toLocaleString('en-IN')}
                </strong>
                .
              </p>
            </div>
          )}
        </div>

        {/* Today's pacing micro-bar */}
        {!isExceeded && safeToday > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
              <span>Today's spend: ₹{spentToday.toLocaleString('en-IN')}</span>
              <span className="text-emerald-500 dark:text-emerald-400">Left: ₹{remainingSafeToday.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  spentToday > safeToday ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${todaySpendPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Formula explanation footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span>Formula: Remaining Money ÷ {metrics.daysRemaining} days left</span>
        <span className="font-mono text-slate-400 font-bold">
          Day {metrics.currentDay} / {metrics.daysInMonth}
        </span>
      </div>
    </div>
  );
};
