import confetti from 'canvas-confetti';
import { Achievement, Expense, MonthlyBudget } from '../types';

export const triggerConfetti = (): void => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'],
    });
  } catch {
    // Graceful fallback if canvas is not available
  }
};

export const getInitialAchievements = (): Achievement[] => [
  {
    id: 'first-expense',
    title: 'First Expense',
    description: 'Log your very first student transaction',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'budget-beginner',
    title: 'Budget Beginner',
    description: 'Set your monthly student allowance target',
    icon: '🎓',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'under-budget',
    title: 'Under Budget',
    description: 'Keep spending below 100% of your allowance',
    icon: '🛡️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: '7-day-saver',
    title: '7 Day Saver',
    description: 'Maintain a 7-day safe spend streak',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Log at least 15 expenses to build financial clarity',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 15,
  },
];

export const evaluateAchievements = (
  expenses: Expense[],
  budget: MonthlyBudget | undefined,
  streak: number
): Achievement[] => {
  const achievements = getInitialAchievements();
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = budget?.totalBudget || 0;

  // 1. First expense
  achievements[0].progress = Math.min(1, expenses.length);
  achievements[0].unlocked = expenses.length >= 1;

  // 2. Budget beginner
  achievements[1].progress = totalBudget > 0 ? 1 : 0;
  achievements[1].unlocked = totalBudget > 0;

  // 3. Under budget
  if (totalBudget > 0 && totalSpent > 0 && totalSpent <= totalBudget) {
    achievements[2].progress = 1;
    achievements[2].unlocked = true;
  } else {
    achievements[2].progress = 0;
    achievements[2].unlocked = false;
  }

  // 4. 7 Day Saver
  achievements[3].progress = Math.min(7, streak);
  achievements[3].unlocked = streak >= 7;

  // 5. Month Master
  achievements[4].progress = Math.min(15, expenses.length);
  achievements[4].unlocked = expenses.length >= 15;

  return achievements;
};
