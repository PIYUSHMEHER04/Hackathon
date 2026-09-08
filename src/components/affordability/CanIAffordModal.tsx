import React, { useState } from 'react';
import { X, HelpCircle, ArrowRight, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
        {/* Close */}
        <button
          onClick={closeAffordModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Impulse Purchase Simulator
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Can I afford this?
            </h2>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-slate-300 mb-2">
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
              className="w-full pl-10 pr-4 py-3.5 text-2xl font-black rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              placeholder="e.g. 800"
              autoFocus
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-xs text-slate-400 font-semibold">Try amounts:</span>
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setInputAmount(amt.toString())}
                className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-200 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-200 dark:border-white/5 transition-colors"
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
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                : result.status === 'caution'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 glow-emerald'
            }`}
          >
            {/* Verdict Header */}
            <div className="flex items-center gap-2.5 mb-2">
              {result.status === 'danger' ? (
                <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
              ) : result.status === 'caution' ? (
                <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              )}
              <h3 className="text-lg font-black tracking-tight">{result.title}</h3>
            </div>

            <p className="text-xs font-semibold leading-relaxed mb-4 opacity-90">
              {result.impactText}
            </p>

            {/* Before vs After Impact Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  Daily Safe Allowance
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-mono font-bold">
                  <span className="text-slate-500 line-through">
                    ₹{result.currentDailySafe}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span
                    className={
                      result.status === 'danger'
                        ? 'text-rose-400 font-black'
                        : 'text-emerald-400 font-black'
                    }
                  >
                    ₹{result.newDailySafe}/day
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  Remaining Money
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-mono font-bold">
                  <span className="text-slate-500 line-through">
                    ₹{overview.remainingBudget.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span
                    className={
                      result.newRemaining < 0
                        ? 'text-rose-400 font-black'
                        : 'text-emerald-400 font-black'
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
            className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleLogExpense}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <span>Log an Expense</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
