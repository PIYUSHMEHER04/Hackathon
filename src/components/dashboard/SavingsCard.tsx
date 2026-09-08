import React from 'react';
import { PiggyBank, ArrowRight, Plus, Sparkles, ArrowDownRight } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const SavingsCard: React.FC = () => {
  const {
    savingsGoals,
    totalSaved,
    currentBudget,
    setActiveTab,
    openSavingsModal,
    openDepositModal,
  } = useBudget();

  const monthlyTarget = currentBudget.savingsTarget || 0;
  const topGoals = savingsGoals.slice(0, 2);

  return (
    <div className="p-6 rounded-3xl bg-white/95 dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Protected Reserve
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Savings & Vaults
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('savings')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Top Summary Balance */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] mb-4">
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Total in Vault</span>
            <div className="text-lg sm:text-xl font-black font-mono text-slate-900 dark:text-white mt-0.5">
              ₹{totalSaved.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Monthly Target</span>
            <div className="text-lg sm:text-xl font-black font-mono text-emerald-400 mt-0.5">
              ₹{monthlyTarget.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Top Goals Preview */}
        {savingsGoals.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-slate-400 mb-3">No active savings goals yet.</p>
            <button
              onClick={() => openSavingsModal()}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Goal</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {topGoals.map((goal) => {
              const pct = Math.min(
                100,
                Math.round((goal.currentAmount / goal.targetAmount) * 100)
              );
              return (
                <div
                  key={goal.id}
                  className="p-3 rounded-2xl bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/[0.06] hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{goal.emoji || '🎯'}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                        {goal.title}
                      </span>
                    </div>
                    <button
                      onClick={() => openDepositModal(goal)}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 transition-all"
                    >
                      <ArrowDownRight className="w-3 h-3" />
                      <span>+ Save</span>
                    </button>
                  </div>

                  <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>₹{goal.currentAmount.toLocaleString('en-IN')}</span>
                    <span>₹{goal.targetAmount.toLocaleString('en-IN')} ({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Footer Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-medium">
          {savingsGoals.length} {savingsGoals.length === 1 ? 'goal' : 'goals'} running
        </span>
        <button
          onClick={() => openSavingsModal()}
          className="text-xs font-bold text-slate-300 hover:text-white inline-flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>
    </div>
  );
};
