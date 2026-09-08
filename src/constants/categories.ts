import { Category, CategoryId } from '../types';

export const CATEGORIES: Record<CategoryId, Category> = {
  food: {
    id: 'food',
    label: 'Food',
    emoji: '🍔',
    color: 'amber',
    bgLight: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800/40',
    hex: '#F59E0B',
  },
  transport: {
    id: 'transport',
    label: 'Transport',
    emoji: '🚌',
    color: 'blue',
    bgLight: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800/40',
    hex: '#3B82F6',
  },
  stationery: {
    id: 'stationery',
    label: 'Stationery',
    emoji: '📚',
    color: 'purple',
    bgLight: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800/40',
    hex: '#8B5CF6',
  },
  entertainment: {
    id: 'entertainment',
    label: 'Entertainment',
    emoji: '🎮',
    color: 'pink',
    bgLight: 'bg-pink-50 dark:bg-pink-950/30',
    textColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800/40',
    hex: '#EC4899',
  },
  rent: {
    id: 'rent',
    label: 'Rent/Hostel',
    emoji: '🏠',
    color: 'emerald',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800/40',
    hex: '#10B981',
  },
  health: {
    id: 'health',
    label: 'Health',
    emoji: '💊',
    color: 'rose',
    bgLight: 'bg-rose-50 dark:bg-rose-950/30',
    textColor: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-800/40',
    hex: '#F43F5E',
  },
  recharge: {
    id: 'recharge',
    label: 'Recharge',
    emoji: '📱',
    color: 'cyan',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/30',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-200 dark:border-cyan-800/40',
    hex: '#06B6D4',
  },
  other: {
    id: 'other',
    label: 'Other',
    emoji: '🛒',
    color: 'slate',
    bgLight: 'bg-slate-100 dark:bg-slate-800/40',
    textColor: 'text-slate-600 dark:text-slate-400',
    borderColor: 'border-slate-200 dark:border-slate-700/50',
    hex: '#64748B',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const getCategory = (id: CategoryId | string): Category => {
  return CATEGORIES[id as CategoryId] || CATEGORIES.other;
};
