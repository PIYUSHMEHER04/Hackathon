import React from 'react';
import { CheckCircle2, Lock } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const AchievementsModal: React.FC = () => {
  const { achievements, streak, openAddExpense } = useBudget();

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 shrink-0">
            🏆
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
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
          <div className="w-40 h-2 bg-slate-200 dark:bg-black/50 rounded-full overflow-hidden mt-1.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak Highlight Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Current Safe Spending Streak: {streak.currentStreak} Days
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Staying within your safe spend limit each day unlocks the <strong>7 Day Saver</strong> badge.
            </p>
          </div>
        </div>

        <button
          onClick={openAddExpense}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all shrink-0 shadow-md shadow-emerald-500/20"
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
                  ? 'bg-white dark:bg-[#101422] border-emerald-500/40 shadow-sm glow-emerald'
                  : 'bg-slate-50/70 dark:bg-[#0D101C] border-slate-200 dark:border-white/[0.05] opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{item.icon}</span>
                  {item.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-400 border border-white/5">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5">
                  <span>Progress</span>
                  <span className="font-mono text-slate-200">
                    {item.progress} / {item.maxProgress}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.unlocked ? 'bg-emerald-400 shadow-xs shadow-emerald-400/50' : 'bg-slate-600'
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
