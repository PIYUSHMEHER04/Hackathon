import { AppState, Expense, MonthlyBudget, UserPreferences } from '../types';
import { getCurrentMonthKey, generateDemoData } from '../constants/demoData';

const STORAGE_KEY = 'campuSpend_state_v1';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  themePalette: 'emerald',
  hasCompletedOnboarding: false,
  demoModeActive: false,
  studentName: 'Student Engineer',
  collegeName: 'Campus',
};

export const getInitialState = (): AppState => {
  const currentMonth = getCurrentMonthKey();
  return {
    budgets: {
      [currentMonth]: {
        month: currentMonth,
        totalBudget: 15000,
        weeklyBudget: 3750,
        savingsTarget: 2000,
      },
    },
    expenses: [],
    savingsGoals: [],
    preferences: DEFAULT_PREFERENCES,
    selectedMonth: currentMonth,
  };
};

export const loadStorageState = (): AppState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialState();
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return getInitialState();
    }

    const currentMonth = getCurrentMonthKey();
    const state: AppState = {
      budgets: parsed.budgets && typeof parsed.budgets === 'object' ? parsed.budgets : {},
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      savingsGoals: Array.isArray(parsed.savingsGoals) ? parsed.savingsGoals : [],
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...(parsed.preferences || {}),
      },
      selectedMonth: parsed.selectedMonth || currentMonth,
    };

    // Ensure current month has a default budget if not present
    if (!state.budgets[currentMonth]) {
      state.budgets[currentMonth] = {
        month: currentMonth,
        totalBudget: 15000,
        weeklyBudget: 3750,
        savingsTarget: 2000,
      };
    }

    return state;
  } catch (err) {
    console.error('Error loading from localStorage, recovering with default state:', err);
    return getInitialState();
  }
};

export const saveStorageState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const clearStorageState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
};

export const seedDemoState = (): AppState => {
  const { budgets, expenses, savingsGoals } = generateDemoData();
  const currentMonth = getCurrentMonthKey();

  const demoState: AppState = {
    budgets,
    expenses,
    savingsGoals,
    preferences: {
      theme: (localStorage.getItem('campuSpend_theme') as 'light' | 'dark') || 'dark',
      themePalette: 'emerald',
      hasCompletedOnboarding: true,
      demoModeActive: true,
      studentName: 'Alex (CSE)',
      collegeName: 'National Tech Campus',
    },
    selectedMonth: currentMonth,
  };

  saveStorageState(demoState);
  return demoState;
};
