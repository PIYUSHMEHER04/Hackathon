import React from 'react';
import { Flame, Trophy, Award, CheckCircle } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const StreakCard: React.FC = () => {
  const { streak, achievements, setActiveTab } = useBudget();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-300/40 dark:border-amber-700/40 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/25">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Financial Discipline
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Money Streak
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('achievements')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>
              {unlockedCount}/{achievements.length} Badges
            </span>
          </button>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
              🔥 {streak.currentStreak}
            </span>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              day spending streak
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Consecutive days staying within your calculated daily safe spend allowance.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-800/40 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
        <span>Personal Best: {streak.bestStreak} days</span>
        <button
          onClick={() => setActiveTab('achievements')}
          className="font-bold hover:underline"
        >
          View all badges →
        </button>
      </div>
    </div>
  );
};
