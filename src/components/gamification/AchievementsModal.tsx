import React from 'react';
import { Trophy, CheckCircle2, Lock, Flame, Sparkles } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const AchievementsModal: React.FC = () => {
  const { achievements, streak, openAddExpense } = useBudget();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border border-amber-300/40 dark:border-amber-700/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 shrink-0">
            🏆
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Student Milestone Rewards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Financial Achievements
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Building healthy college spending habits one milestone at a time.
            </p>
          </div>
        </div>

        {/* Global Progress */}
        <div className="flex flex-col items-start md:items-end shrink-0">
          <span className="text-xs font-semibold text-slate-400">Mastery Progress</span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {unlockedCount} / {achievements.length}
          </span>
          <div className="w-40 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak Highlight Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Current Money Streak: {streak.currentStreak} Days
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Staying within your safe spend limit each day unlocks the <strong>7 Day Saver</strong> badge.
            </p>
          </div>
        </div>

        <button
          onClick={openAddExpense}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shrink-0"
        >
          + Log Expense
        </button>
      </div>

      {/* Achievement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((item) => {
          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                item.unlocked
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  {item.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Progress</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {item.progress} / {item.maxProgress}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.unlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((item.progress / item.maxProgress) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
