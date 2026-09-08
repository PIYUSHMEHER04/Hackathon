import React, { useState } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000];

export const SavingsDepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    depositTargetGoal,
    closeDepositModal,
    depositToGoal,
    withdrawFromGoal,
    themePalette,
  } = useBudget();

  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');

  if (!isDepositModalOpen || !depositTargetGoal) return null;

  const currentVal = depositTargetGoal.currentAmount;
  const targetVal = depositTargetGoal.targetAmount;
  const numAmount = parseFloat(amount) || 0;

  const projectedBalance =
    mode === 'deposit'
      ? currentVal + numAmount
      : Math.max(0, currentVal - numAmount);

  const projectedPercent = Math.min(
    100,
    Math.round((projectedBalance / targetVal) * 100)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numAmount <= 0) return;

    if (mode === 'deposit') {
      depositToGoal(depositTargetGoal.id, numAmount);
    } else {
      withdrawFromGoal(depositTargetGoal.id, numAmount);
    }
    setAmount('');
    closeDepositModal();
  };

  const handleQuickSelect = (amt: number) => {
    setAmount(amt.toString());
  };

  const primaryBtnClass =
    mode === 'deposit'
      ? themePalette === 'emerald'
        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25'
        : themePalette === 'violet'
        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
        : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/25'
      : 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/25';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        <button
          onClick={closeDepositModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Goal Emoji and Title */}
        <div className="mb-6 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shadow-inner">
            {depositTargetGoal.emoji || '🎯'}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Vault Action
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[240px]">
              {depositTargetGoal.title}
            </h2>
          </div>
        </div>

        {/* Deposit vs Withdraw Mode Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 mb-5">
          <button
            type="button"
            onClick={() => setMode('deposit')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mode === 'deposit'
                ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4 text-emerald-400" />
            <span>Deposit (Save)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              mode === 'withdraw'
                ? 'bg-white dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200 dark:border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
            <span>Withdraw</span>
          </button>
        </div>

        {/* Current State vs Projected */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] mb-5 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Current balance</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ₹{currentVal.toLocaleString('en-IN')} / ₹{targetVal.toLocaleString('en-IN')}
            </span>
          </div>

          {numAmount > 0 && (
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200 dark:border-white/5">
              <span className="text-slate-400 font-medium">After transaction</span>
              <span className="font-mono font-black text-emerald-400">
                ₹{projectedBalance.toLocaleString('en-IN')}{' '}
                <span className="text-[10px] text-slate-400">({projectedPercent}%)</span>
              </span>
            </div>
          )}

          <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                mode === 'deposit' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
              style={{ width: `${projectedPercent}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                autoFocus
                required
                min="1"
                step="1"
                placeholder="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-3 text-xl font-black font-mono rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quick Select
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickSelect(amt)}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 text-slate-300 hover:text-white transition-all active:scale-95"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={numAmount <= 0}
              className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${primaryBtnClass}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {mode === 'deposit'
                  ? `Confirm Deposit of ₹${numAmount > 0 ? numAmount.toLocaleString('en-IN') : '0'}`
                  : `Confirm Withdrawal of ₹${numAmount > 0 ? numAmount.toLocaleString('en-IN') : '0'}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
