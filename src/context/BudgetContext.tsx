import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Achievement,
  AppState,
  BudgetHealth,
  CategorySpendSummary,
  Expense,
  MonthlyBudget,
  SpendingInsight,
  UserPreferences,
} from '../types';
import {
  clearStorageState,
  loadStorageState,
  saveStorageState,
  seedDemoState,
} from '../lib/storage';
import {
  calculateBudgetOverview,
  calculateCategorySummaries,
  calculateStreak,
  calculateWeeklySpend,
  getBudgetHealth,
  getMonthMetrics,
  generateSpendingInsights,
  MonthDateMetrics,
} from '../lib/calculations';
import { evaluateAchievements, triggerConfetti } from '../lib/gamification';
import { getCurrentMonthKey } from '../constants/demoData';

export type NavigationTab =
  | 'dashboard'
  | 'expenses'
  | 'analytics'
  | 'history'
  | 'achievements'
  | 'settings';

interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface BudgetContextType {
  state: AppState;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  availableMonths: string[];
  currentBudget: MonthlyBudget;
  currentMonthExpenses: Expense[];
  metrics: MonthDateMetrics;
  overview: ReturnType<typeof calculateBudgetOverview>;
  budgetHealth: BudgetHealth;
  categorySummaries: CategorySpendSummary[];
  insights: SpendingInsight[];
  weekly: {
    weeklySpent: number;
    weeklyBudget: number;
    currentWeekDays: string[];
  };
  streak: { currentStreak: number; bestStreak: number };
  achievements: Achievement[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  // Modals
  isAddExpenseOpen: boolean;
  openAddExpense: () => void;
  closeAddExpense: () => void;
  editingExpense: Expense | null;
  openEditExpense: (expense: Expense) => void;
  closeEditExpense: () => void;
  isAffordModalOpen: boolean;
  openAffordModal: () => void;
  closeAffordModal: () => void;
  isOnboardingOpen: boolean;
  closeOnboarding: () => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setBudgetForMonth: (monthKey: string, totalBudget: number, weeklyBudget?: number) => void;
  toggleTheme: () => void;
  toggleDemoMode: () => void;
  resetDemoData: () => void;
  resetAllData: () => void;
  completeOnboarding: (initialBudget: number, categories?: string[]) => void;
  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => loadStorageState());
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [toast, setToast] = useState<ToastState | null>(null);

  // Modal visibility states
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAffordModalOpen, setIsAffordModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state with localStorage
  useEffect(() => {
    saveStorageState(state);
  }, [state]);

  // Sync theme with DOM root
  useEffect(() => {
    const isDark = state.preferences.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.preferences.theme]);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3000);
  };

  const selectedMonth = state.selectedMonth || getCurrentMonthKey();

  const setSelectedMonth = (month: string) => {
    setState((prev) => ({ ...prev, selectedMonth: month }));
  };

  // Derive available months from both budgets and expense dates
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    monthsSet.add(getCurrentMonthKey());
    Object.keys(state.budgets).forEach((m) => monthsSet.add(m));
    state.expenses.forEach((e) => {
      if (e.date) {
        monthsSet.add(e.date.slice(0, 7));
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [state.budgets, state.expenses]);

  // Current month budget
  const currentBudget = useMemo<MonthlyBudget>(() => {
    return (
      state.budgets[selectedMonth] || {
        month: selectedMonth,
        totalBudget: 15000,
        weeklyBudget: 3750,
      }
    );
  }, [state.budgets, selectedMonth]);

  // Filter expenses for selected month
  const currentMonthExpenses = useMemo(() => {
    return state.expenses
      .filter((e) => e.date && e.date.startsWith(selectedMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);
  }, [state.expenses, selectedMonth]);

  // Metrics (days in month, days remaining, etc.)
  const metrics = useMemo(() => getMonthMetrics(selectedMonth), [selectedMonth]);

  // Overview metrics (spent, remaining, safe daily spend, projection)
  const overview = useMemo(
    () => calculateBudgetOverview(currentBudget, currentMonthExpenses, metrics),
    [currentBudget, currentMonthExpenses, metrics]
  );

  // Budget Health state
  const budgetHealth = useMemo(
    () => getBudgetHealth(overview.percentage, overview.overage, overview.totalBudget),
    [overview.percentage, overview.overage, overview.totalBudget]
  );

  // Category Summaries
  const categorySummaries = useMemo(
    () => calculateCategorySummaries(currentMonthExpenses, overview.totalSpent),
    [currentMonthExpenses, overview.totalSpent]
  );

  // Weekly Spend
  const weekly = useMemo(() => {
    const { weeklySpent, currentWeekDays } = calculateWeeklySpend(currentMonthExpenses);
    const weeklyBudget = currentBudget.weeklyBudget || Math.round(currentBudget.totalBudget / 4);
    return { weeklySpent, weeklyBudget, currentWeekDays };
  }, [currentMonthExpenses, currentBudget]);

  // Spending Insights
  const insights = useMemo(
    () => generateSpendingInsights(currentBudget, currentMonthExpenses, categorySummaries, metrics),
    [currentBudget, currentMonthExpenses, categorySummaries, metrics]
  );

  // Streaks
  const streak = useMemo(
    () => calculateStreak(currentMonthExpenses, overview.dailySafeSpend),
    [currentMonthExpenses, overview.dailySafeSpend]
  );

  // Achievements
  const achievements = useMemo(
    () => evaluateAchievements(currentMonthExpenses, currentBudget, streak.currentStreak),
    [currentMonthExpenses, currentBudget, streak.currentStreak]
  );

  // CRUD Actions
  const addExpense = (newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };

    setState((prev) => {
      const updated = [expense, ...prev.expenses];
      return { ...prev, expenses: updated };
    });

    showToast('Expense added successfully.', 'success');
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    }));
    showToast('Expense updated.', 'info');
  };

  const deleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    showToast('Expense deleted.', 'warning');
  };

  const setBudgetForMonth = (monthKey: string, totalBudget: number, weeklyBudget?: number) => {
    setState((prev) => ({
      ...prev,
      budgets: {
        ...prev.budgets,
        [monthKey]: {
          month: monthKey,
          totalBudget,
          weeklyBudget: weeklyBudget || Math.round(totalBudget / 4),
        },
      },
    }));
    showToast(`Budget set to ₹${totalBudget.toLocaleString('en-IN')}.`, 'success');
  };

  const toggleTheme = () => {
    setState((prev) => {
      const nextTheme = prev.preferences.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('campuSpend_theme', nextTheme);
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          theme: nextTheme,
        },
      };
    });
  };

  const toggleDemoMode = () => {
    if (state.preferences.demoModeActive) {
      // Deactivate demo mode: restore clean empty user state
      clearStorageState();
      const clean = loadStorageState();
      clean.preferences.hasCompletedOnboarding = true;
      clean.preferences.demoModeActive = false;
      setState(clean);
      showToast('Exited Demo Mode. Fresh workspace ready.', 'info');
    } else {
      // Activate demo mode
      const demo = seedDemoState();
      setState(demo);
      triggerConfetti();
      showToast('Demo Mode Activated! Sample student data loaded.', 'success');
    }
  };

  const resetDemoData = () => {
    const demo = seedDemoState();
    setState(demo);
    triggerConfetti();
    showToast('Demo data reloaded successfully.', 'success');
  };

  const resetAllData = () => {
    clearStorageState();
    const fresh = loadStorageState();
    setState(fresh);
    showToast('All budget data has been reset.', 'info');
  };

  const completeOnboarding = (initialBudget: number, _categories?: string[]) => {
    const currentMonth = getCurrentMonthKey();
    setState((prev) => ({
      ...prev,
      budgets: {
        ...prev.budgets,
        [currentMonth]: {
          month: currentMonth,
          totalBudget: initialBudget,
          weeklyBudget: Math.round(initialBudget / 4),
        },
      },
      preferences: {
        ...prev.preferences,
        hasCompletedOnboarding: true,
      },
    }));
    triggerConfetti();
    showToast('Budget initialized! Welcome to CampusSpend.', 'success');
  };

  const isOnboardingOpen = !state.preferences.hasCompletedOnboarding;
  const closeOnboarding = () => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, hasCompletedOnboarding: true },
    }));
  };

  return (
    <BudgetContext.Provider
      value={{
        state,
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        currentBudget,
        currentMonthExpenses,
        metrics,
        overview,
        budgetHealth,
        categorySummaries,
        insights,
        weekly,
        streak,
        achievements,
        activeTab,
        setActiveTab,
        // Modals
        isAddExpenseOpen,
        openAddExpense: () => setIsAddExpenseOpen(true),
        closeAddExpense: () => setIsAddExpenseOpen(false),
        editingExpense,
        openEditExpense: (expense: Expense) => setEditingExpense(expense),
        closeEditExpense: () => setEditingExpense(null),
        isAffordModalOpen,
        openAffordModal: () => setIsAffordModalOpen(true),
        closeAffordModal: () => setIsAffordModalOpen(false),
        isOnboardingOpen,
        closeOnboarding,
        isSettingsOpen,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        // Actions
        addExpense,
        updateExpense,
        deleteExpense,
        setBudgetForMonth,
        toggleTheme,
        toggleDemoMode,
        resetDemoData,
        resetAllData,
        completeOnboarding,
        // Toast
        toast,
        showToast,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
