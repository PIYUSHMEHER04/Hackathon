import React, { useState } from 'react';
import { HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { evaluateAffordability } from '../../lib/calculations';

export const QuickAffordCard: React.FC = () => {
  const { overview, metrics, openAffordModal } = useBudget();
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
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 glow-emerald">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
              Impulse Check
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Can I afford this?
            </h3>
          </div>
        </div>

        <button
          onClick={openAffordModal}
          className="text-xs font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
        Enter an amount to see if it impacts your safe daily spending allowance.
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
            className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/30 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
        <button
          onClick={openAffordModal}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all shrink-0 shadow-md shadow-emerald-500/20"
        >
          Simulate
        </button>
      </div>

      {/* Quick Picks */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[10px] font-semibold text-slate-400">Quick:</span>
        {quickPicks.map((amt) => (
          <button
            key={amt}
            onClick={() => setTestAmount(amt.toString())}
            className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 hover:border-emerald-500/50 text-slate-600 dark:text-slate-300 transition-colors"
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
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : result.status === 'caution'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2 font-black mb-1">
            {result.status === 'danger' ? (
              <AlertOctagon className="w-4 h-4 text-rose-500" />
            ) : result.status === 'caution' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{result.title}</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">{result.impactText}</p>
        </div>
      )}
    </div>
  );
};
