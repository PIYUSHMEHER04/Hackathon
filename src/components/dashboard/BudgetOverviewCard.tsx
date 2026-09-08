import React from 'react';
import { Wallet, Sparkles, TrendingDown, ArrowUpRight, Cpu } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const BudgetOverviewCard: React.FC = () => {
  const { overview, budgetHealth, metrics, currentBudget, openSettings, themePalette } = useBudget();

  const isOver = overview.isOverBudget;
  const progressPercent = Math.min(100, Math.max(0, overview.percentage));

  const accentGlow =
    themePalette === 'emerald'
      ? 'from-emerald-500/20 via-teal-500/10'
      : themePalette === 'violet'
      ? 'from-purple-500/20 via-indigo-500/10'
      : 'from-cyan-500/20 via-blue-500/10';

  const progressBg = isOver
    ? 'bg-rose-500 shadow-rose-500/50'
    : overview.percentage >= 80
    ? 'bg-amber-400 shadow-amber-400/50'
    : themePalette === 'violet'
    ? 'bg-gradient-to-r from-purple-500 to-indigo-400'
    : themePalette === 'cyan'
    ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
    : 'bg-gradient-to-r from-emerald-400 to-teal-400';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121624] via-[#0E121E] to-[#0A0D15] text-white p-6 sm:p-8 shadow-2xl border border-white/10">
      {/* Background ambient lighting */}
      <div className={`absolute -top-12 -right-12 w-80 h-80 bg-gradient-to-br ${accentGlow} to-transparent rounded-full blur-3xl pointer-events-none`} />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Allowance Header & Health Badge */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] backdrop-blur-xl flex items-center justify-center text-white border border-white/10 shadow-inner">
            <Cpu className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Monthly Allowance Target
              </span>
              <button
                onClick={openSettings}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline"
              >
                Change
              </button>
            </div>
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono mt-0.5">
              ₹{overview.totalBudget.toLocaleString('en-IN')}
            </p>
            {overview.savingsTarget > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-xs text-slate-400">
                  Spendable: <strong className="text-slate-200 font-mono">₹{overview.spendableBudget.toLocaleString('en-IN')}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <span>🔒 Reserved:</span>
                  <strong className="font-mono">₹{overview.savingsTarget.toLocaleString('en-IN')}</strong>
                </span>
                {overview.isDippingIntoSavings && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⚠️ Dipping into savings!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Health Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border backdrop-blur-md transition-all ${
              isOver
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs shadow-rose-500/30'
                : overview.percentage >= 80
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs shadow-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs shadow-emerald-500/30'
            }`}
          >
            <span className="w-2 h-2 rounded-full animate-ping bg-current" />
            <span>{budgetHealth.label}</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics 4-Col Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6">
        {/* Money Spent */}
        <div className="flex flex-col p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[11px] font-semibold text-slate-400">Money spent</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              ₹{overview.totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1">
            {overview.percentage.toFixed(1)}% consumed
          </span>
        </div>

        {/* Money Left */}
        <div className="flex flex-col p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[11px] font-semibold text-slate-400">Money left</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                isOver ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isOver ? '-' : ''}₹{overview.overage.toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1">
            {isOver ? 'Exceeded balance' : `${(100 - overview.percentage).toFixed(1)}% remaining`}
          </span>
        </div>

        {/* Days Remaining */}
        <div className="flex flex-col p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[11px] font-semibold text-slate-400">Days remaining</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {metrics.daysRemaining}
            </span>
            <span className="text-xs font-bold text-slate-400">days</span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-1">
            Day {metrics.currentDay} of {metrics.daysInMonth}
          </span>
        </div>

        {/* Daily Safe Spend */}
        <div className="flex flex-col p-3 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 glow-emerald">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Safe Spend</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-2xl sm:text-3xl font-black font-mono ${
                isOver ? 'text-rose-400' : 'text-emerald-300'
              }`}
            >
              ₹{overview.dailySafeSpend.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">/day</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {isOver ? 'Limit reached' : 'Safe daily allowance'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 pt-1">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-slate-400">Monthly budget progress</span>
          <span className="font-mono text-emerald-400 font-extrabold text-sm">
            {overview.percentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${progressBg}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
