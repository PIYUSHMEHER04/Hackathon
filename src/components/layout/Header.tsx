import React from 'react';
import {
  Calendar,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const Header: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    openAffordModal,
    openAddExpense,
    toggleTheme,
    toggleDemoMode,
    state,
  } = useBudget();

  const isDark = state.preferences.theme === 'dark';

  // Dynamic greeting based on user's current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning 👋';
    if (hour < 17) return 'Good afternoon 👋';
    return 'Good evening 👋';
  };

  // Format month name (e.g., '2026-09' -> 'September 2026')
  const formatMonthLabel = (key: string) => {
    try {
      const [y, m] = key.split('-');
      const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return key;
    }
  };

  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 pt-2 border-b border-slate-200/80 dark:border-slate-800/80">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}
          </h2>
          {state.preferences.demoModeActive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Demo Active
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          Here's your money snapshot.
        </p>
      </div>

      {/* Controls & Actions */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Month Selector Pill */}
        <div className="relative inline-flex items-center">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
        </div>

        {/* "Can I Afford It?" feature launcher */}
        <button
          onClick={openAffordModal}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-700/50 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-all shadow-xs active:scale-95"
          title="Simulate a planned purchase before spending"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Can I afford this?</span>
        </button>

        {/* Demo Mode Toggle (quick access on header) */}
        <button
          onClick={toggleDemoMode}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-sm"
          title="Toggle realistic student demo dataset"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">
            {state.preferences.demoModeActive ? 'Exit Demo' : '✨ Demo Mode'}
          </span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Quick Add (visible on mobile/tablet top bar) */}
        <button
          onClick={openAddExpense}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl bg-indigo-600 text-white shadow-sm"
          aria-label="Add Expense"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Mobile Theme Switcher */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
