import React from 'react';
import { Wallet, TrendingDown, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const BudgetOverviewCard: React.FC = () => {
  const { overview, budgetHealth, metrics, currentBudget, openSettings } = useBudget();

  const isOver = overview.isOverBudget;
  const progressPercent = Math.min(100, Math.max(0, overview.percentage));

  // Determine progress bar color based on health status
  const getProgressColor = () => {
    if (overview.percentage >= 100) return 'bg-rose-500';
    if (overview.percentage >= 80) return 'bg-amber-500';
    if (overview.percentage >= 70) return 'bg-yellow-500';
    if (overview.percentage >= 50) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/20 border border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Title & Health Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/15">
            <Wallet className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                Monthly Allowance
              </span>
              <button
                onClick={openSettings}
                className="text-[11px] text-indigo-300 hover:text-white underline font-medium"
              >
                Edit
              </button>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              ₹{overview.totalBudget.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Dynamic Health Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${
              isOver
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : overview.percentage >= 80
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
            <span>{budgetHealth.label}</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics: Money Spent vs Money Left */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6">
        {/* Money Spent */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-400">Money spent</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
              ₹{overview.totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {overview.percentage.toFixed(1)}% of budget
          </span>
        </div>

        {/* Money Left */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-400">Money left</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl sm:text-2xl font-black font-mono ${
                isOver ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isOver ? '-' : ''}₹{overview.overage.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {isOver ? 'Exceeded by this amount' : `${(100 - overview.percentage).toFixed(1)}% remaining`}
          </span>
        </div>

        {/* Days Remaining */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-400">Days remaining</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
              {metrics.daysRemaining}
            </span>
            <span className="text-xs text-slate-400">days</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Day {metrics.currentDay} of {metrics.daysInMonth}
          </span>
        </div>

        {/* Daily Safe Spend */}
        <div className="flex flex-col p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily safe spend</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-xl sm:text-2xl font-black font-mono ${
                isOver ? 'text-rose-400' : 'text-amber-300'
              }`}
            >
              ₹{overview.dailySafeSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400">/day</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {isOver ? 'Zero safe spend left' : 'To finish month safely'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-300">Budget used</span>
          <span className="font-mono text-indigo-300">
            {overview.percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getProgressColor()}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
