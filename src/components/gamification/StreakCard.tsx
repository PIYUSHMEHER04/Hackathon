import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const StreakCard: React.FC = () => {
  const { streak, achievements, setActiveTab } = useBudget();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 glow-amber">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Discipline Streak
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Money Streak
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('achievements')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>
              {unlockedCount}/{achievements.length} Badges
            </span>
          </button>
        </div>

        <div className="my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight text-amber-400">
              🔥 {streak.currentStreak}
            </span>
            <span className="text-sm font-bold text-slate-400">
              day safe streak
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
            Consecutive days staying within your calculated daily safe spend allowance.
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs text-amber-400/90 font-semibold">
        <span>Personal Best: {streak.bestStreak} days</span>
        <button
          onClick={() => setActiveTab('achievements')}
          className="font-bold hover:underline"
        >
          View badges →
        </button>
      </div>
    </div>
  );
};
