import React from 'react';
import { TrendingUp, CheckCircle, AlertOctagon } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const ProjectionCard: React.FC = () => {
  const { overview, metrics } = useBudget();

  const isOver = overview.isProjectedOver;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2.5 rounded-2xl ${
                isOver
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Forecast AI Logic
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                End-of-month projection
              </h3>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isOver
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isOver ? (
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>{isOver ? 'Over budget risk' : 'On track to save'}</span>
          </div>
        </div>

        {/* Forecast Numbers */}
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ₹{overview.projectedMonthlySpend.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-slate-400">projected total</span>
          </div>

          <div className="mt-2 text-xs font-semibold">
            {isOver ? (
              <p className="text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                <span>🔴</span>
                <span>
                  At current pace, you'll exceed your budget by{' '}
                  <strong>₹{overview.projectedDifference.toLocaleString('en-IN')}</strong>.
                </span>
              </p>
            ) : (
              <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span>🟢</span>
                <span>
                  Projected to stay within budget with{' '}
                  <strong>₹{overview.projectedDifference.toLocaleString('en-IN')}</strong> saved.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Current spending</span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm mt-0.5 block">
              ₹{overview.totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Daily average pace</span>
            <span className="font-extrabold text-slate-900 dark:text-white font-mono text-sm mt-0.5 block">
              ₹{overview.averageDailySpend.toLocaleString('en-IN')}/day
            </span>
          </div>
        </div>
      </div>

      {/* Projection calculation basis */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
        <span>Based on {metrics.daysElapsed} days of tracking</span>
        <span className="font-mono text-slate-400">
          ₹{overview.averageDailySpend} × {metrics.daysInMonth} days
        </span>
      </div>
    </div>
  );
};
