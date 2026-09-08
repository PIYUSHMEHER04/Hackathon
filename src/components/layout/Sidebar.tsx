import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  PieChart,
  CalendarDays,
  Trophy,
  Settings,
  Plus,
  Sparkles,
  Sun,
  Moon,
  Flame,
} from 'lucide-react';
import { NavigationTab, useBudget } from '../../context/BudgetContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    openAddExpense,
    toggleTheme,
    themePalette,
    state,
    streak,
    totalSaved,
    savingsGoals,
    toggleDemoMode,
  } = useBudget();

  const isDark = state.preferences.theme === 'dark';

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: <ReceiptText className="w-4 h-4" />,
    },
    {
      id: 'savings',
      label: 'Savings Vault',
      icon: <PiggyBank className="w-4 h-4" />,
      badge: savingsGoals.length > 0 ? `${savingsGoals.length}` : undefined,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <PieChart className="w-4 h-4" />,
    },
    {
      id: 'history',
      label: 'History',
      icon: <CalendarDays className="w-4 h-4" />,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Trophy className="w-4 h-4" />,
      badge: streak.currentStreak > 0 ? `${streak.currentStreak}d` : undefined,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  const primaryBtnClass =
    themePalette === 'emerald'
      ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25'
      : themePalette === 'violet'
      ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25'
      : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/25';

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-[#0A0D17]/95 backdrop-blur-2xl h-screen sticky top-0 shrink-0 p-5 select-none justify-between z-30">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <span className="text-xl font-black font-mono">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  Campus<span className="text-emerald-500 dark:text-emerald-400">Spend</span>
                </h1>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Student Terminal
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Pill */}
        {state.preferences.demoModeActive ? (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Demo Active
              </span>
            </div>
            <button
              onClick={toggleDemoMode}
              className="text-[10px] text-slate-400 hover:text-white underline font-semibold"
            >
              Exit
            </button>
          </div>
        ) : (
          <button
            onClick={toggleDemoMode}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.04] hover:bg-emerald-500/10 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 text-xs font-semibold border border-slate-200/60 dark:border-white/5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Demo Data</span>
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={openAddExpense}
          className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-all active:scale-98 ${primaryBtnClass}`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Theme Section */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/[0.08] flex flex-col gap-3">
        {/* Streak Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                {streak.currentStreak} Day Streak
              </p>
              <p className="text-[10px] text-slate-400">Safe spend discipline</p>
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 border border-white/20 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Student</p>
              <p className="text-[10px] text-slate-400">Budget Planner</p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
