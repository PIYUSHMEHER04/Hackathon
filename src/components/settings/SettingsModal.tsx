import React, { useState } from 'react';
import { X, Moon, Sun, Trash2, Sparkles, Wallet, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    currentBudget,
    setBudgetForMonth,
    selectedMonth,
    toggleTheme,
    state,
    toggleDemoMode,
    resetDemoData,
    resetAllData,
  } = useBudget();

  const [budgetVal, setBudgetVal] = useState(currentBudget.totalBudget.toString());
  const [weeklyVal, setWeeklyVal] = useState(
    (currentBudget.weeklyBudget || Math.round(currentBudget.totalBudget / 4)).toString()
  );
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  if (!isSettingsOpen) return null;

  const isDark = state.preferences.theme === 'dark';

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseInt(budgetVal, 10);
    const w = parseInt(weeklyVal, 10);
    if (!isNaN(b) && b > 0) {
      setBudgetForMonth(selectedMonth, b, !isNaN(w) && w > 0 ? w : Math.round(b / 4));
    }
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        <button
          onClick={closeSettings}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Preferences & Settings
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Settings
          </h2>
        </div>

        <div className="space-y-6">
          {/* Section 1: Monthly Budget Adjustments */}
          <form onSubmit={handleSaveBudget} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              <span>Budget Limits ({selectedMonth})</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Monthly Allowance (₹)
              </label>
              <input
                type="number"
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weekly Target (₹)
              </label>
              <input
                type="number"
                value={weeklyVal}
                onChange={(e) => setWeeklyVal(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs"
            >
              Update Budget
            </button>
          </form>

          {/* Section 2: Appearance */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Theme</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Current: {isDark ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Switch Light' : 'Switch Dark'}</span>
            </button>
          </div>

          {/* Section 3: Demo Mode Controls */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Hackathon Demo Mode</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-seeds ₹15k budget & realistic engineering transactions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={toggleDemoMode}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                {state.preferences.demoModeActive ? 'Exit Demo' : 'Activate Demo'}
              </button>
              {state.preferences.demoModeActive && (
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Danger Zone / Reset All Data */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">
                Reset All Data
              </h4>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">
                Wipe all expenses & restart setup
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Confirmation Dialog for Reset */}
        <ConfirmDialog
          isOpen={isResetConfirmOpen}
          title="Delete all your budget data?"
          message="This cannot be undone. All your expenses, budgets, history, and achievements will be erased from browser storage, returning you to the initial setup."
          confirmLabel="Delete Everything"
          cancelLabel="Cancel"
          isDestructive={true}
          onConfirm={() => {
            setIsResetConfirmOpen(false);
            closeSettings();
            resetAllData();
          }}
          onCancel={() => setIsResetConfirmOpen(false)}
        />
      </div>
    </div>
  );
};
