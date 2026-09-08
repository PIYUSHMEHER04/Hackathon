import React, { useState, useEffect } from 'react';
import { X, Sparkles, PiggyBank } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

const EMOJI_OPTIONS = ['🏖️', '💻', '🎧', '🎒', '📚', '👟', '📱', '🎮', '🛡️', '🚴', '🍕', '🎸'];

export const SavingsGoalModal: React.FC = () => {
  const {
    isSavingsModalOpen,
    closeSavingsModal,
    editingSavingsGoal,
    addSavingsGoal,
    updateSavingsGoal,
    themePalette,
  } = useBudget();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingSavingsGoal) {
      setTitle(editingSavingsGoal.title);
      setTargetAmount(editingSavingsGoal.targetAmount.toString());
      setCurrentAmount(editingSavingsGoal.currentAmount.toString());
      setEmoji(editingSavingsGoal.emoji || '🎯');
      setNotes(editingSavingsGoal.notes || '');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setEmoji('🎯');
      setNotes('');
    }
  }, [editingSavingsGoal, isSavingsModalOpen]);

  if (!isSavingsModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(currentAmount) || 0;

    if (!title.trim() || isNaN(target) || target <= 0) {
      return;
    }

    if (editingSavingsGoal) {
      updateSavingsGoal(editingSavingsGoal.id, {
        title: title.trim(),
        targetAmount: target,
        currentAmount: Math.max(0, initial),
        emoji,
        notes: notes.trim() || undefined,
      });
    } else {
      addSavingsGoal({
        title: title.trim(),
        targetAmount: target,
        currentAmount: Math.max(0, initial),
        emoji,
        notes: notes.trim() || undefined,
      });
    }

    closeSavingsModal();
  };

  const primaryBtnClass =
    themePalette === 'emerald'
      ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25'
      : themePalette === 'violet'
      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/25'
      : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-cyan-500/25';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        <button
          onClick={closeSavingsModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Campus Vault
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {editingSavingsGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Select an Icon
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-200/80 dark:border-white/[0.06]">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-110'
                      : 'hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Goal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Goa Semester Trip, New Laptop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Target Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                ₹
              </span>
              <input
                type="number"
                required
                min="1"
                step="1"
                placeholder="5000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-base font-bold font-mono rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Starting Balance */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Initial / Current Saved (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 text-base font-bold font-mono rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Notes or Target Date (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Target: Diwali Break / Semester End"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${primaryBtnClass}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{editingSavingsGoal ? 'Update Goal' : 'Save New Goal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
