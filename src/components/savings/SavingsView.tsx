import React, { useState } from 'react';
import {
  PiggyBank,
  Plus,
  Target,
  Sparkles,
  ShieldCheck,
  Trophy,
  ArrowDownRight,
  Pencil,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { SavingsGoal } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const SavingsView: React.FC = () => {
  const {
    savingsGoals,
    totalSaved,
    openSavingsModal,
    openDepositModal,
    deleteSavingsGoal,
    currentBudget,
    setSavingsTarget,
    selectedMonth,
    overview,
    themePalette,
  } = useBudget();

  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
  const [isEditingMonthlyTarget, setIsEditingMonthlyTarget] = useState(false);
  const [targetInput, setTargetInput] = useState(
    (currentBudget.savingsTarget || 0).toString()
  );

  const currentSavingsTarget = currentBudget.savingsTarget || 0;

  const handleSaveMonthlyTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val >= 0) {
      setSavingsTarget(selectedMonth, val);
      setIsEditingMonthlyTarget(false);
    }
  };

  const totalTargetAllGoals = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercentage =
    totalTargetAllGoals > 0
      ? Math.min(100, Math.round((totalSaved / totalTargetAllGoals) * 100))
      : 0;

  const completedGoals = savingsGoals.filter((g) => g.currentAmount >= g.targetAmount);
  const inProgressGoals = savingsGoals.filter((g) => g.currentAmount < g.targetAmount);

  const filteredGoals = savingsGoals.filter((g) => {
    if (filter === 'completed') return g.currentAmount >= g.targetAmount;
    if (filter === 'in-progress') return g.currentAmount < g.targetAmount;
    return true;
  });

  const primaryBtnClass =
    themePalette === 'emerald'
      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25'
      : themePalette === 'violet'
      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
      : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/25';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0A0D17] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Vault</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Student Savings Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Savings & Goal Vaults
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mt-1.5 leading-relaxed">
            Pay yourself first. Target a monthly reserve and save up for semester trips, gadgets,
            and campus emergencies without blowing your daily safe spend.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => openSavingsModal()}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${primaryBtnClass}`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>New Savings Goal</span>
          </button>
        </div>
      </div>

      {/* Top Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total In Vault */}
        <div className="p-5 rounded-3xl bg-white/95 dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total In Vault
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              ₹{totalSaved.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-medium">
              <span>Across {savingsGoals.length} goals</span>
              <span className="text-emerald-400 font-bold">{overallPercentage}% funded</span>
            </div>
          </div>
          {/* Mini progress */}
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 2: Monthly Target Reserve */}
        <div className="p-5 rounded-3xl bg-white/95 dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Monthly Reserve ({selectedMonth})
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3">
            {isEditingMonthlyTarget ? (
              <form onSubmit={handleSaveMonthlyTarget} className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  autoFocus
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-full px-2.5 py-1 text-base font-black font-mono rounded-lg border border-emerald-500 bg-slate-100 dark:bg-black/50 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold shrink-0"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingMonthlyTarget(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  ₹{currentSavingsTarget.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => {
                    setTargetInput(currentSavingsTarget.toString());
                    setIsEditingMonthlyTarget(true);
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Reserved out of ₹{overview.totalBudget.toLocaleString('en-IN')} budget
            </p>
          </div>
        </div>

        {/* Card 3: Daily Safe Spend Protection */}
        <div className="p-5 rounded-3xl bg-white/95 dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Safe Spend Protection
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3">
            {overview.isDippingIntoSavings ? (
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Dipping into savings!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Reserve 100% Protected</span>
              </div>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Spendable allowance: <strong className="text-white font-mono">₹{overview.spendableBudget.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>

        {/* Card 4: Milestones */}
        <div className="p-5 rounded-3xl bg-white/95 dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Milestones
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {completedGoals.length} <span className="text-base text-slate-400 font-sans font-medium">/ {savingsGoals.length}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {inProgressGoals.length} goals actively accumulating
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Goals ({savingsGoals.length})
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'in-progress'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            In Progress ({inProgressGoals.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'completed'
                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedGoals.length})
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Click on any goal to deposit or withdraw savings</span>
        </div>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          title="No savings goals in this view"
          description="Create a dedicated savings vault for your upcoming hostel trip, tech upgrade, or emergency fund."
          actionLabel="Create Your First Goal"
          onAction={() => openSavingsModal()}
          showDemoButton={false}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((goal) => {
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const percentage = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100)
            );
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className={`p-6 rounded-3xl bg-white/95 dark:bg-[#0E121F] border transition-all duration-300 relative group flex flex-col justify-between ${
                  isCompleted
                    ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                    : 'border-slate-200 dark:border-white/10 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5'
                }`}
              >
                <div>
                  {/* Card Header: Emoji + Title + Action buttons */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                        {goal.emoji || '🎯'}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                          {goal.title}
                        </h3>
                        {goal.notes && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{goal.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openSavingsModal(goal)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit Goal"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Financial Numbers */}
                  <div className="space-y-2 py-3 border-t border-b border-slate-100 dark:border-white/5 my-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400 font-semibold">Accumulated</span>
                      <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                        ₹{goal.currentAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400 font-medium">Target</span>
                      <span className="text-slate-400 font-mono font-bold">
                        ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isCompleted
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm shadow-amber-400/50'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1.5 font-bold">
                        <span className={isCompleted ? 'text-amber-400' : 'text-emerald-400'}>
                          {percentage}% reached
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {isCompleted
                            ? 'Goal Achieved! 🏆'
                            : `₹${remaining.toLocaleString('en-IN')} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Deposit / Withdraw Actions */}
                <div className="pt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openDepositModal(goal)}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>+ Deposit</span>
                  </button>

                  <button
                    onClick={() => openDepositModal(goal)}
                    className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Manage / Withdraw</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Philosophy Callout Card */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              CampusSpend Smart Savings Safeguard
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              When you allocate a Monthly Reserve, CampusSpend automatically adjusts your Daily Safe
              Spend so you can comfortably spend without risking your savings.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTargetInput(currentSavingsTarget.toString());
            setIsEditingMonthlyTarget(true);
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
        >
          Adjust Monthly Target
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        title="Delete Savings Goal?"
        message={`Are you sure you want to remove "${goalToDelete?.title}"? Any accumulated amount logged here will be deleted.`}
        confirmLabel="Delete Goal"
        isDestructive
        onConfirm={() => {
          if (goalToDelete) {
            deleteSavingsGoal(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
};
