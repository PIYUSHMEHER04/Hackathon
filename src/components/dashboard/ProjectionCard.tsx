import React from 'react';
import { TrendingUp, CheckCircle, AlertOctagon } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const ProjectionCard: React.FC = () => {
  const { overview, metrics } = useBudget();

  const isOver = overview.isProjectedOver;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isOver
                  ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400'
                  : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Forecast Intelligence
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                End-of-month projection
              </h3>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              isOver
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
            }`}
          >
            {isOver ? (
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span>{isOver ? 'Over budget risk' : 'On track to save'}</span>
          </div>
        </div>

        {/* Forecast Numbers */}
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              ₹{overview.projectedMonthlySpend.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-semibold text-slate-400">projected total</span>
          </div>

          <div className="mt-2 text-xs font-medium">
            {isOver ? (
              <p className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                <span>🔴</span>
                <span>
                  At current pace, you'll exceed your budget by{' '}
                  <strong>₹{overview.projectedDifference.toLocaleString('en-IN')}</strong>.
                </span>
              </p>
            ) : (
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span>🟢</span>
                <span>
                  Projected to stay within budget with{' '}
                  <strong>₹{overview.projectedDifference.toLocaleString('en-IN')}</strong> in
                  savings.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Current spending</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              ₹{overview.totalSpent.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Daily average pace</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              ₹{overview.averageDailySpend.toLocaleString('en-IN')}/day
            </span>
          </div>
        </div>
      </div>

      {/* Projection calculation basis */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Based on {metrics.daysElapsed} days of tracked activity</span>
        <span className="font-mono">
          ₹{overview.averageDailySpend} × {metrics.daysInMonth} days
        </span>
      </div>
    </div>
  );
};
