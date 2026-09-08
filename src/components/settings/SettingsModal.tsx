import React, { useState } from 'react';
import { X, Moon, Sun, Trash2, Sparkles, Wallet, RefreshCw, Palette } from 'lucide-react';
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
    themePalette,
    setThemePalette,
    state,
    toggleDemoMode,
    resetDemoData,
    resetAllData,
  } = useBudget();

  const [budgetVal, setBudgetVal] = useState(currentBudget.totalBudget.toString());
  const [weeklyVal, setWeeklyVal] = useState(
    (currentBudget.weeklyBudget || Math.round(currentBudget.totalBudget / 4)).toString()
  );
  const [savingsVal, setSavingsVal] = useState((currentBudget.savingsTarget || 0).toString());
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  if (!isSettingsOpen) return null;

  const isDark = state.preferences.theme === 'dark';

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseInt(budgetVal, 10);
    const w = parseInt(weeklyVal, 10);
    const s = parseInt(savingsVal, 10);
    if (!isNaN(b) && b > 0) {
      setBudgetForMonth(
        selectedMonth,
        b,
        !isNaN(w) && w > 0 ? w : Math.round(b / 4),
        !isNaN(s) && s >= 0 ? s : 0
      );
    }
    closeSettings();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        <button
          onClick={closeSettings}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            System Preferences
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Settings & Themes
          </h2>
        </div>

        <div className="space-y-5">
          {/* Section 1: Monthly Budget Adjustments */}
          <form onSubmit={handleSaveBudget} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Budget Limits ({selectedMonth})</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Allowance (₹)
              </label>
              <input
                type="number"
                value={budgetVal}
                onChange={(e) => setBudgetVal(e.target.value)}
                className="w-full px-3 py-2 text-sm font-black rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Weekly Target (₹)
              </label>
              <input
                type="number"
                value={weeklyVal}
                onChange={(e) => setWeeklyVal(e.target.value)}
                className="w-full px-3 py-2 text-sm font-black rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monthly Savings Target Reserve (₹)
              </label>
              <input
                type="number"
                value={savingsVal}
                onChange={(e) => setSavingsVal(e.target.value)}
                className="w-full px-3 py-2 text-sm font-black rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Safely subtracted before calculating your Daily Safe Spend.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white transition-all shadow-md shadow-emerald-500/20"
            >
              Save Budget Limits
            </button>
          </form>

          {/* Section 2: Theme & Palette */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-emerald-400" />
                  <span>Color Theme Accent</span>
                </h4>
                <p className="text-xs text-slate-400">Choose your fintech aesthetic</p>
              </div>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-200"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                <span>{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>

            {/* Color Palette Chips */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setThemePalette('emerald')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${
                  themePalette === 'emerald'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-500/30 glow-emerald'
                    : 'border-white/10 bg-black/20 text-slate-400 hover:bg-white/5'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span>Emerald</span>
              </button>

              <button
                type="button"
                onClick={() => setThemePalette('violet')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${
                  themePalette === 'violet'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300 ring-2 ring-purple-500/30 glow-indigo'
                    : 'border-white/10 bg-black/20 text-slate-400 hover:bg-white/5'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-purple-400" />
                <span>Violet</span>
              </button>

              <button
                type="button"
                onClick={() => setThemePalette('cyan')}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${
                  themePalette === 'cyan'
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-500/30 glow-emerald'
                    : 'border-white/10 bg-black/20 text-slate-400 hover:bg-white/5'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-cyan-400" />
                <span>Cyan</span>
              </button>
            </div>
          </div>

          {/* Section 3: Demo Mode Controls */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hackathon Demo Mode</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Quickly seed realistic engineering expenses
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={toggleDemoMode}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all shadow-sm"
              >
                {state.preferences.demoModeActive ? 'Exit Demo' : 'Activate Demo'}
              </button>
              {state.preferences.demoModeActive && (
                <button
                  type="button"
                  onClick={resetDemoData}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-bold text-slate-200 hover:bg-white/[0.1] transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 4: Danger Zone / Reset All Data */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-400">
                Reset All Data
              </h4>
              <p className="text-[11px] text-rose-400/80">
                Wipe all expenses & restart setup
              </p>
            </div>
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
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
