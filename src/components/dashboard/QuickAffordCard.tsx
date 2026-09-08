import React, { useState } from 'react';
import { HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { evaluateAffordability } from '../../lib/calculations';

export const QuickAffordCard: React.FC = () => {
  const { overview, metrics, currentBudget, openAffordModal } = useBudget();
  const [testAmount, setTestAmount] = useState<string>('');

  const numVal = parseInt(testAmount, 10);
  const result = !isNaN(numVal) && numVal > 0
    ? evaluateAffordability(
        numVal,
        overview.totalBudget,
        overview.totalSpent,
        overview.remainingBudget,
        metrics.daysRemaining
      )
    : null;

  const quickPicks = [250, 500, 1000, 2000];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-50/50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Impulse Purchase Check
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Can I afford this?
            </h3>
          </div>
        </div>

        <button
          onClick={openAffordModal}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
        >
          <span>Full Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Thinking of buying something? Enter the amount to see if it endangers your safe daily allowance.
      </p>

      {/* Input box */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
            ₹
          </span>
          <input
            type="number"
            value={testAmount}
            onChange={(e) => setTestAmount(e.target.value)}
            placeholder="e.g. 800"
            className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          onClick={openAffordModal}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shrink-0"
        >
          Check
        </button>
      </div>

      {/* Quick Picks */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[10px] font-medium text-slate-400">Quick:</span>
        {quickPicks.map((amt) => (
          <button
            key={amt}
            onClick={() => setTestAmount(amt.toString())}
            className="px-2 py-0.5 text-[11px] font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-600 dark:text-slate-300 transition-colors"
          >
            ₹{amt}
          </button>
        ))}
      </div>

      {/* Live Verdict preview */}
      {result && (
        <div
          className={`mt-4 p-3.5 rounded-2xl border text-xs animate-fade-in ${
            result.status === 'danger'
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
              : result.status === 'caution'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            {result.status === 'danger' ? (
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            ) : result.status === 'caution' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
            <span>{result.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed">{result.impactText}</p>
        </div>
      )}
    </div>
  );
};
