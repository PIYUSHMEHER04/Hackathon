import {
  AffordabilityResult,
  BudgetHealth,
  BudgetHealthStatus,
  CategorySpendSummary,
  Expense,
  MonthlyBudget,
  SpendingInsight,
} from '../types';
import { CATEGORIES, getCategory } from '../constants/categories';

export interface MonthDateMetrics {
  year: number;
  monthIndex: number; // 0-11
  monthNumber: number; // 1-12
  daysInMonth: number;
  currentDay: number;
  daysRemaining: number;
  daysElapsed: number;
  isCurrentMonth: boolean;
  isPastMonth: boolean;
  isFutureMonth: boolean;
}

export const getMonthMetrics = (monthKey: string): MonthDateMetrics => {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const monthNumber = parseInt(monthStr, 10) || new Date().getMonth() + 1;
  const monthIndex = monthNumber - 1;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth();
  const currentDay = now.getDate();

  // Days in selected month (day 0 of next month is last day of current month)
  const daysInMonth = new Date(year, monthNumber, 0).getDate();

  const isCurrentMonth = year === currentYear && monthIndex === currentMonthIndex;
  const isPastMonth =
    year < currentYear || (year === currentYear && monthIndex < currentMonthIndex);
  const isFutureMonth =
    year > currentYear || (year === currentYear && monthIndex > currentMonthIndex);

  let daysRemaining = 0;
  let daysElapsed = 0;

  if (isCurrentMonth) {
    daysRemaining = Math.max(1, daysInMonth - currentDay + 1); // including today
    daysElapsed = Math.max(1, currentDay);
  } else if (isPastMonth) {
    daysRemaining = 0;
    daysElapsed = daysInMonth;
  } else {
    daysRemaining = daysInMonth;
    daysElapsed = 0;
  }

  return {
    year,
    monthIndex,
    monthNumber,
    daysInMonth,
    currentDay: isCurrentMonth ? currentDay : daysInMonth,
    daysRemaining,
    daysElapsed,
    isCurrentMonth,
    isPastMonth,
    isFutureMonth,
  };
};

export const calculateBudgetOverview = (
  budget: MonthlyBudget,
  expenses: Expense[],
  monthMetrics: MonthDateMetrics
) => {
  const totalBudget = Math.max(0, budget?.totalBudget ?? 0);
  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : totalSpent > 0 ? 100 : 0;

  // Smart daily safe spend calculation
  let dailySafeSpend = 0;
  if (remainingBudget > 0) {
    const daysToSpread = monthMetrics.isPastMonth ? 1 : Math.max(1, monthMetrics.daysRemaining);
    dailySafeSpend = Math.round(remainingBudget / daysToSpread);
  } else {
    dailySafeSpend = 0;
  }

  // End of month projection calculation
  const daysTracked = Math.max(1, monthMetrics.daysElapsed);
  const averageDailySpend = Math.round(totalSpent / daysTracked);
  const projectedMonthlySpend = averageDailySpend * monthMetrics.daysInMonth;
  const projectedDifference = projectedMonthlySpend - totalBudget;
  const isProjectedOver = projectedDifference > 0;

  return {
    totalBudget,
    totalSpent,
    remainingBudget,
    percentage: Math.min(Math.round(percentage * 10) / 10, 999),
    rawPercentage: percentage,
    dailySafeSpend,
    averageDailySpend,
    projectedMonthlySpend,
    projectedDifference: Math.abs(projectedDifference),
    isProjectedOver,
    isOverBudget: remainingBudget < 0,
    overage: Math.abs(remainingBudget),
  };
};

export const getBudgetHealth = (
  percentage: number,
  overage: number,
  totalBudget: number
): BudgetHealth => {
  if (percentage >= 100) {
    return {
      status: 'exceeded',
      percentage,
      label: 'Budget exceeded',
      message: `🚨 You've exceeded your monthly budget by ₹${overage.toLocaleString('en-IN')}.`,
      badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300 dark:border-rose-800',
      borderClass: 'border-rose-500/50 dark:border-rose-500/40',
      bgClass: 'bg-rose-50 dark:bg-rose-950/20',
      colorHex: '#F43F5E',
    };
  }

  if (percentage >= 80) {
    return {
      status: 'alert',
      percentage,
      label: 'Budget Alert',
      message: `⚠️ You've used ${Math.round(percentage)}% of your monthly budget (₹${(totalBudget * (percentage / 100)).toLocaleString('en-IN')}). Consider limiting non-essential spending.`,
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      borderClass: 'border-amber-500/50 dark:border-amber-500/40',
      bgClass: 'bg-amber-50/70 dark:bg-amber-950/20',
      colorHex: '#F59E0B',
    };
  }

  if (percentage >= 70) {
    return {
      status: 'warning',
      percentage,
      label: 'Watch your spending',
      message: `You've used ${Math.round(percentage)}% of your budget. Maintain pace to reach month-end comfortably.`,
      badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      borderClass: 'border-yellow-400/50 dark:border-yellow-500/30',
      bgClass: 'bg-yellow-50/50 dark:bg-yellow-950/15',
      colorHex: '#EAB308',
    };
  }

  if (percentage >= 50) {
    return {
      status: 'on-track',
      percentage,
      label: "You're on track",
      message: `You've spent ${Math.round(percentage)}% of your budget. Spending is steady and well-controlled.`,
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      borderClass: 'border-blue-300 dark:border-blue-800',
      bgClass: 'bg-blue-50/50 dark:bg-blue-950/15',
      colorHex: '#3B82F6',
    };
  }

  return {
    status: 'great',
    percentage,
    label: "You're doing great",
    message: "Smooth sailing! You're keeping expenses well below limits.",
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    borderClass: 'border-emerald-300 dark:border-emerald-800',
    bgClass: 'bg-emerald-50/50 dark:bg-emerald-950/15',
    colorHex: '#10B981',
  };
};

export const calculateCategorySummaries = (
  expenses: Expense[],
  totalSpent: number
): CategorySpendSummary[] => {
  const map: Partial<Record<string, { amount: number; count: number }>> = {};

  expenses.forEach((exp) => {
    if (!map[exp.categoryId]) {
      map[exp.categoryId] = { amount: 0, count: 0 };
    }
    map[exp.categoryId]!.amount += exp.amount;
    map[exp.categoryId]!.count += 1;
  });

  const list: CategorySpendSummary[] = Object.keys(CATEGORIES).map((key) => {
    const catId = key as any;
    const cat = getCategory(catId);
    const amount = map[catId]?.amount || 0;
    const count = map[catId]?.count || 0;
    const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 1000) / 10 : 0;
    return {
      categoryId: catId,
      category: cat,
      totalAmount: amount,
      percentage,
      count,
    };
  });

  return list.sort((a, b) => b.totalAmount - a.totalAmount);
};

export const calculateWeeklySpend = (
  expenses: Expense[]
): { weeklySpent: number; currentWeekDays: string[] } => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  let weeklySpent = 0;
  const currentWeekDays: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    currentWeekDays.push(d.toISOString().slice(0, 10));
  }

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);
    if (expDate >= monday && expDate <= sunday) {
      weeklySpent += exp.amount;
    }
  });

  return { weeklySpent, currentWeekDays };
};

export const evaluateAffordability = (
  spendAmount: number,
  totalBudget: number,
  totalSpent: number,
  remainingBudget: number,
  daysRemaining: number
): AffordabilityResult => {
  const days = Math.max(1, daysRemaining);
  const currentDailySafe = remainingBudget > 0 ? Math.round(remainingBudget / days) : 0;
  const newRemaining = remainingBudget - spendAmount;
  const newSpent = totalSpent + spendAmount;
  const newPercentage = totalBudget > 0 ? Math.round((newSpent / totalBudget) * 100) : 100;
  const newDailySafe = newRemaining > 0 ? Math.round(newRemaining / days) : 0;

  if (newRemaining < 0) {
    const overage = Math.abs(newRemaining);
    return {
      status: 'danger',
      title: 'Not Recommended',
      message: 'This would put you on track to exceed your monthly budget.',
      impactText: `This purchase exceeds your remaining money by ₹${overage.toLocaleString('en-IN')}. Your safe daily allowance will hit ₹0.`,
      currentDailySafe,
      newDailySafe: 0,
      newRemaining,
      newPercentage,
    };
  }

  if (newPercentage >= 80 || (currentDailySafe > 0 && newDailySafe < currentDailySafe * 0.6)) {
    return {
      status: 'caution',
      title: 'Think Twice',
      message: 'This purchase would push your projected monthly spending close to your limit.',
      impactText: `You can afford this, but your safe daily budget would drop from ₹${currentDailySafe.toLocaleString('en-IN')} to ₹${newDailySafe.toLocaleString('en-IN')}.`,
      currentDailySafe,
      newDailySafe,
      newRemaining,
      newPercentage,
    };
  }

  return {
    status: 'safe',
    title: 'Looks Safe',
    message: 'Comfortably within your monthly allowance.',
    impactText: `You can afford this! Your safe daily budget would gently adjust from ₹${currentDailySafe.toLocaleString('en-IN')} to ₹${newDailySafe.toLocaleString('en-IN')}.`,
    currentDailySafe,
    newDailySafe,
    newRemaining,
    newPercentage,
  };
};

export const generateSpendingInsights = (
  budget: MonthlyBudget,
  expenses: Expense[],
  categorySummaries: CategorySpendSummary[],
  metrics: MonthDateMetrics
): SpendingInsight[] => {
  const insights: SpendingInsight[] = [];
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budget?.totalBudget || 0;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (expenses.length === 0) {
    return [
      {
        id: 'no-data',
        type: 'info',
        title: 'Spending story starts here',
        description: 'Log daily expenses or enable Demo Mode to see intelligent financial advice.',
        icon: '💡',
      },
    ];
  }

  // Check 1: Budget Exceeded
  if (percentage >= 100) {
    insights.push({
      id: 'exceeded',
      type: 'danger',
      title: 'Budget Limit Crossed',
      description: `🚨 You've exceeded your monthly budget by ₹${Math.round(totalSpent - totalBudget).toLocaleString('en-IN')}. Consider freezing non-essential outings.`,
      icon: '🚨',
    });
  } else if (percentage >= 80) {
    // Check 2: 80% Warning
    insights.push({
      id: 'approaching-limit',
      type: 'warning',
      title: 'Approaching Monthly Limit',
      description: `⚠️ You've used ${Math.round(percentage)}% of your monthly budget. Limit dining out and entertainment for the remaining ${metrics.daysRemaining} days.`,
      icon: '⚠️',
    });
  }

  // Check 3: Food spending > 40%
  const foodSummary = categorySummaries.find((c) => c.categoryId === 'food');
  if (foodSummary && foodSummary.percentage > 40) {
    insights.push({
      id: 'food-heavy',
      type: 'warning',
      title: 'Food is Your Biggest Spend',
      description: `🍔 Food takes up ${foodSummary.percentage}% of your spending (₹${foodSummary.totalAmount.toLocaleString('en-IN')}). Consider setting a weekly canteen limit or sharing group orders.`,
      icon: '🍔',
      category: 'food',
    });
  }

  // Check 4: Entertainment > 20%
  const entSummary = categorySummaries.find((c) => c.categoryId === 'entertainment');
  if (entSummary && entSummary.percentage > 20) {
    insights.push({
      id: 'ent-heavy',
      type: 'warning',
      title: 'Entertainment Spike',
      description: `🎮 Entertainment is taking ${entSummary.percentage}% of your budget this month. Consider sticking to campus events and free student activities.`,
      icon: '🎮',
      category: 'entertainment',
    });
  }

  // Check 5: Transport > 20%
  const transSummary = categorySummaries.find((c) => c.categoryId === 'transport');
  if (transSummary && transSummary.percentage > 20) {
    insights.push({
      id: 'trans-trending',
      type: 'info',
      title: 'Transport Trending High',
      description: `🚌 Transport is ${transSummary.percentage}% of spending. Look into monthly student bus/metro passes or ridesharing to cut costs.`,
      icon: '🚌',
      category: 'transport',
    });
  }

  // Check 6: Mid-month pacing
  const monthProgressPct = (metrics.daysElapsed / metrics.daysInMonth) * 100;
  if (metrics.daysElapsed >= 10 && percentage < monthProgressPct - 10) {
    insights.push({
      id: 'good-pacing',
      type: 'positive',
      title: 'Excellent Spending Pace',
      description: `✨ You've only used ${Math.round(percentage)}% of your budget while ${Math.round(monthProgressPct)}% of the month has passed. You're set to save money!`,
      icon: '✨',
    });
  }

  // Check 7: Safe Spend Buffer
  const remaining = totalBudget - totalSpent;
  const safeSpend = metrics.daysRemaining > 0 ? Math.round(remaining / metrics.daysRemaining) : 0;
  if (safeSpend > 600 && percentage < 70) {
    insights.push({
      id: 'healthy-daily-safe',
      type: 'positive',
      title: 'Comfortable Daily Buffer',
      description: `💪 Your daily safe spend is ₹${safeSpend.toLocaleString('en-IN')}/day. You have room for unexpected college project costs.`,
      icon: '🛡️',
    });
  }

  return insights.slice(0, 5);
};

export const calculateStreak = (
  expenses: Expense[],
  dailySafeTarget: number
): { currentStreak: number; bestStreak: number } => {
  if (expenses.length === 0 || dailySafeTarget <= 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Group expenses by date (YYYY-MM-DD)
  const dayMap: Record<string, number> = {};
  expenses.forEach((e) => {
    dayMap[e.date] = (dayMap[e.date] || 0) + e.amount;
  });

  const now = new Date();
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  // Check the last 14 days
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const spentOnDay = dayMap[dateStr] || 0;

    // A day is "safe" if either no expense logged or spent <= safe spend target * 1.15
    const isSafe = spentOnDay <= Math.max(300, dailySafeTarget);

    if (isSafe) {
      tempStreak += 1;
      if (i === 0 || currentStreak === i) {
        currentStreak += 1;
      }
    } else {
      if (i === 0) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
  }

  return {
    currentStreak: Math.max(1, currentStreak),
    bestStreak: Math.max(currentStreak, bestStreak, 3),
  };
};
