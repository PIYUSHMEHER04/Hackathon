export type CategoryId =
  | 'food'
  | 'transport'
  | 'stationery'
  | 'entertainment'
  | 'rent'
  | 'health'
  | 'recharge'
  | 'other';

export type PaymentMethod = 'UPI' | 'Cash' | 'Card';

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string; // Tailwind accent or hex code
  bgLight: string;
  textColor: string;
  borderColor: string;
  hex: string; // For Recharts
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: CategoryId;
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod?: PaymentMethod;
  createdAt: number;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  totalBudget: number;
  weeklyBudget?: number;
  notes?: string;
  primaryCategories?: CategoryId[];
}

export type BudgetHealthStatus = 'great' | 'on-track' | 'warning' | 'alert' | 'exceeded';

export interface BudgetHealth {
  status: BudgetHealthStatus;
  percentage: number;
  label: string;
  message: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  colorHex: string;
}

export interface SpendingInsight {
  id: string;
  type: 'positive' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  icon: string;
  category?: CategoryId;
}

export interface AffordabilityResult {
  status: 'safe' | 'caution' | 'danger';
  title: string;
  message: string;
  impactText: string;
  currentDailySafe: number;
  newDailySafe: number;
  newRemaining: number;
  newPercentage: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  hasCompletedOnboarding: boolean;
  demoModeActive: boolean;
  studentName?: string;
  collegeName?: string;
}

export interface AppState {
  budgets: Record<string, MonthlyBudget>; // month -> budget
  expenses: Expense[];
  preferences: UserPreferences;
  selectedMonth: string; // YYYY-MM
}

export interface CategorySpendSummary {
  categoryId: CategoryId;
  category: Category;
  totalAmount: number;
  percentage: number;
  count: number;
}
