import React, { useState } from 'react';
import { CalendarRange, Edit3, Check } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const WeeklyBudgetCard: React.FC = () => {
  const { weekly, currentBudget, setBudgetForMonth, selectedMonth } = useBudget();
  const [isEditing, setIsEditing] = useState(false);
  const [customWeeklyLimit, setCustomWeeklyLimit] = useState(weekly.weeklyBudget.toString());

  const progressPercent = Math.min(
    100,
    weekly.weeklyBudget > 0 ? Math.round((weekly.weeklySpent / weekly.weeklyBudget) * 100) : 0
  );

  const handleSave = () => {
    const val = parseInt(customWeeklyLimit, 10);
    if (!isNaN(val) && val > 0) {
      setBudgetForMonth(selectedMonth, currentBudget.totalBudget, val);
    }
    setIsEditing(false);
  };

  const isOverWeekly = weekly.weeklySpent > weekly.weeklyBudget;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Pacing Control
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Weekly spending limit
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-white/[0.06] transition-colors"
            title={isEditing ? 'Save weekly target' : 'Edit weekly target'}
          >
            {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {/* Display This Week spent vs limit */}
        <div className="my-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-slate-400">This Week</span>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={customWeeklyLimit}
                  onChange={(e) => setCustomWeeklyLimit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="w-24 px-2 py-0.5 text-xs font-bold rounded-lg border border-purple-500/50 bg-slate-900 text-white focus:outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-400">
                Target: ₹{weekly.weeklyBudget.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              ₹{weekly.weeklySpent.toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono">
              / ₹{weekly.weeklyBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            {isOverWeekly ? (
              <span className="text-rose-400 font-bold">
                ⚠️ Exceeded this week's target by ₹
                {(weekly.weeklySpent - weekly.weeklyBudget).toLocaleString('en-IN')}
              </span>
            ) : (
              <span>
                ₹{(weekly.weeklyBudget - weekly.weeklySpent).toLocaleString('en-IN')} left for this
                week
              </span>
            )}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2.5 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverWeekly ? 'bg-rose-500' : progressPercent > 75 ? 'bg-amber-400' : 'bg-purple-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-semibold">
            <span>{progressPercent}% used</span>
            <span>Monthly Target ÷ 4</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between">
        <span>Mon – Sun cycle</span>
        <span className="text-purple-400 font-bold">
          {7 - new Date().getDay() || 7} days left this week
        </span>
      </div>
    </div>
  );
};
