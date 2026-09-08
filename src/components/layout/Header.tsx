import React from 'react';
import {
  Calendar,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  Palette,
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
    themePalette,
    setThemePalette,
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
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 pt-2 border-b border-slate-200/60 dark:border-white/10">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}
          </h2>
          {state.preferences.demoModeActive && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              Demo Active
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          Here's your real-time money snapshot.
        </p>
      </div>

      {/* Controls & Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Month Selector Pill */}
        <div className="relative inline-flex items-center">
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none pl-8 pr-7 py-2 text-xs font-bold rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-white/20 cursor-pointer focus:outline-none backdrop-blur-md"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m} className="bg-slate-900 text-white">
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
        </div>

        {/* Theme Accent Picker (Emerald / Violet / Cyan) */}
        <div className="hidden sm:inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10">
          <button
            onClick={() => setThemePalette('emerald')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              themePalette === 'emerald'
                ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/50 scale-105'
                : 'hover:bg-white/10 text-slate-400'
            }`}
            title="Emerald Fintech Theme"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
          </button>
          <button
            onClick={() => setThemePalette('violet')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              themePalette === 'violet'
                ? 'bg-purple-600 text-white shadow-xs shadow-purple-500/50 scale-105'
                : 'hover:bg-white/10 text-slate-400'
            }`}
            title="Cyber Violet Theme"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-purple-300" />
          </button>
          <button
            onClick={() => setThemePalette('cyan')}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              themePalette === 'cyan'
                ? 'bg-cyan-500 text-white shadow-xs shadow-cyan-500/50 scale-105'
                : 'hover:bg-white/10 text-slate-400'
            }`}
            title="Ocean Cyan Theme"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300" />
          </button>
        </div>

        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-xs"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* "Can I Afford It?" feature launcher */}
        <button
          onClick={openAffordModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 dark:from-emerald-500/20 dark:via-teal-500/15 dark:to-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/50 transition-all shadow-xs active:scale-95 glow-emerald"
          title="Simulate a planned purchase before spending"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Can I afford this?</span>
        </button>

        {/* Demo Mode Toggle */}
        <button
          onClick={toggleDemoMode}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/[0.09] transition-all shadow-xs"
          title="Toggle sample student data"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">
            {state.preferences.demoModeActive ? 'Exit Demo' : '✨ Demo'}
          </span>
          <span className="sm:hidden">Demo</span>
        </button>

        {/* Quick Add (mobile/tablet) */}
        <button
          onClick={openAddExpense}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30"
          aria-label="Add Expense"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </header>
  );
};
