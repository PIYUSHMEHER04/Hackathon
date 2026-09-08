import React, { useState } from 'react';
import { X, HelpCircle, ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { evaluateAffordability } from '../../lib/calculations';

export const CanIAffordModal: React.FC = () => {
  const {
    isAffordModalOpen,
    closeAffordModal,
    overview,
    metrics,
    openAddExpense,
  } = useBudget();

  const [inputAmount, setInputAmount] = useState<string>('800');

  if (!isAffordModalOpen) return null;

  const parsedAmount = Math.max(0, parseInt(inputAmount, 10) || 0);

  const result = evaluateAffordability(
    parsedAmount,
    overview.totalBudget,
    overview.totalSpent,
    overview.remainingBudget,
    metrics.daysRemaining
  );

  const presets = [300, 500, 800, 1500, 3000];

  const handleLogExpense = () => {
    closeAffordModal();
    openAddExpense();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
        {/* Close */}
        <button
          onClick={closeAffordModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Impulse Purchase Simulator
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Can I afford this?
            </h2>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            I want to spend:
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400 font-mono">
              ₹
            </span>
            <input
              type="number"
              min="1"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 text-2xl font-black rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              placeholder="e.g. 800"
              autoFocus
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-slate-400 font-medium">Try amounts:</span>
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setInputAmount(amt.toString())}
                className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors"
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Verdict Card */}
        {parsedAmount > 0 && (
          <div
            className={`rounded-2xl p-5 border transition-all ${
              result.status === 'danger'
                ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                : result.status === 'caution'
                ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            {/* Verdict Header */}
            <div className="flex items-center gap-2.5 mb-2">
              {result.status === 'danger' ? (
                <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
              ) : result.status === 'caution' ? (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              )}
              <h3 className="text-lg font-black tracking-tight">{result.title}</h3>
            </div>

            <p className="text-xs font-semibold leading-relaxed mb-4 opacity-90">
              {result.impactText}
            </p>

            {/* Before vs After Impact Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-black/10 dark:border-white/10 text-xs">
              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  Daily Safe Allowance
                </span>
                <div className="flex items-center gap-1 mt-1 font-mono font-bold">
                  <span className="text-slate-400 line-through">
                    ₹{result.currentDailySafe}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span
                    className={
                      result.status === 'danger'
                        ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                        : 'text-slate-900 dark:text-white font-extrabold'
                    }
                  >
                    ₹{result.newDailySafe}/day
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  Remaining Money
                </span>
                <div className="flex items-center gap-1 mt-1 font-mono font-bold">
                  <span className="text-slate-400 line-through">
                    ₹{overview.remainingBudget.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span
                    className={
                      result.newRemaining < 0
                        ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                        : 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                    }
                  >
                    ₹{result.newRemaining.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeAffordModal}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Done
          </button>
          <button
            type="button"
            onClick={handleLogExpense}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <span>Log an Expense</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
