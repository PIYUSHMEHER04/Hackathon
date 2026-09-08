import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
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
    state,
    streak,
    toggleDemoMode,
  } = useBudget();

  const isDark = state.preferences.theme === 'dark';

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: <ReceiptText className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <PieChart className="w-5 h-5" />,
    },
    {
      id: 'history',
      label: 'History',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Trophy className="w-5 h-5" />,
      badge: streak.currentStreak > 0 ? `${streak.currentStreak}d` : undefined,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-screen sticky top-0 shrink-0 p-5 select-none justify-between z-30">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <span className="text-xl font-black tracking-tight font-mono">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  Campus<span className="text-indigo-600 dark:text-indigo-400">Spend</span>
                </h1>
              </div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Student Finance
              </p>
            </div>
          </div>
        </div>

        {/* Demo Mode Pill */}
        {state.preferences.demoModeActive ? (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Demo Mode Active
              </span>
            </div>
            <button
              onClick={toggleDemoMode}
              className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
            >
              Exit
            </button>
          </div>
        ) : (
          <button
            onClick={toggleDemoMode}
            className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 text-xs font-medium border border-transparent hover:border-indigo-200 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Try Demo Mode
          </button>
        )}

        {/* Primary Action Button */}
        <button
          onClick={openAddExpense}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Theme Section */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        {/* Streak Preview Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {streak.currentStreak} Day Streak
              </p>
              <p className="text-[10px] text-slate-400">Staying under daily safe spend</p>
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs shadow">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Student</p>
              <p className="text-[11px] text-slate-400">Budget Planner</p>
            </div>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
