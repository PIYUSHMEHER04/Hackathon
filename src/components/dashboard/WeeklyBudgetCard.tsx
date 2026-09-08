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
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <CalendarRange className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pacing Control
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly spending limit
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isEditing ? 'Save weekly target' : 'Edit weekly target'}
          >
            {isEditing ? <Check className="w-4 h-4 text-emerald-500" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>

        {/* Display This Week spent vs limit */}
        <div className="my-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-500">This Week</span>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={customWeeklyLimit}
                  onChange={(e) => setCustomWeeklyLimit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="w-24 px-2 py-0.5 text-sm font-bold rounded-lg border border-indigo-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-500">
                Target: ₹{weekly.weeklyBudget.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              ₹{weekly.weeklySpent.toLocaleString('en-IN')}
            </span>
            <span className="text-sm font-bold text-slate-400 font-mono">
              / ₹{weekly.weeklyBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isOverWeekly ? (
              <span className="text-rose-500 font-semibold">
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
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverWeekly ? 'bg-rose-500' : progressPercent > 75 ? 'bg-amber-500' : 'bg-purple-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-medium">
            <span>{progressPercent}% used</span>
            <span>Default: Monthly ÷ 4</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Mon – Sun cycle</span>
        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
          {7 - new Date().getDay() || 7} days left this week
        </span>
      </div>
    </div>
  );
};
