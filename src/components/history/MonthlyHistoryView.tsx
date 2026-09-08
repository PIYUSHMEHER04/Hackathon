import React from 'react';
import { Calendar, ArrowRight, Wallet, CheckCircle2, AlertOctagon, TrendingDown } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { calculateBudgetOverview, calculateCategorySummaries, getBudgetHealth, getMonthMetrics } from '../../lib/calculations';
import { getCategory } from '../../constants/categories';

export const MonthlyHistoryView: React.FC = () => {
  const { availableMonths, state, selectedMonth, setSelectedMonth, setActiveTab } = useBudget();

  const formatMonthName = (key: string) => {
    try {
      const [y, m] = key.split('-');
      const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return key;
    }
  };

  const historyCards = availableMonths.map((monthKey) => {
    const budget = state.budgets[monthKey] || {
      month: monthKey,
      totalBudget: 15000,
      weeklyBudget: 3750,
    };
    const expenses = state.expenses.filter((e) => e.date && e.date.startsWith(monthKey));
    const metrics = getMonthMetrics(monthKey);
    const overview = calculateBudgetOverview(budget, expenses, metrics);
    const health = getBudgetHealth(overview.percentage, overview.overage, overview.totalBudget);
    const summaries = calculateCategorySummaries(expenses, overview.totalSpent);
    const topCategory = summaries.find((s) => s.totalAmount > 0);

    return {
      monthKey,
      monthName: formatMonthName(monthKey),
      budget: overview.totalBudget,
      spent: overview.totalSpent,
      remaining: overview.remainingBudget,
      percentage: overview.percentage,
      isOverBudget: overview.isOverBudget,
      topCategory,
      health,
      expenseCount: expenses.length,
      isSelected: monthKey === selectedMonth,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Monthly History
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          Review past months and track your long-term savings trajectory across academic semesters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historyCards.map((item) => (
          <div
            key={item.monthKey}
            className={`p-6 rounded-3xl border transition-all ${
              item.isSelected
                ? 'bg-white dark:bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
            }`}
          >
            {/* Header: Month name & status badge */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {item.monthName}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {item.expenseCount} expenses logged
                  </span>
                </div>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${item.health.badgeClass}`}
              >
                {item.health.label}
              </span>
            </div>

            {/* Metrics 3-column row */}
            <div className="grid grid-cols-3 gap-2 py-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Monthly Budget</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono text-sm sm:text-base">
                  ₹{item.budget.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Money Spent</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200 font-mono text-sm sm:text-base">
                  ₹{item.spent.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Money Left</span>
                <span
                  className={`font-extrabold font-mono text-sm sm:text-base ${
                    item.isOverBudget ? 'text-rose-500' : 'text-emerald-500'
                  }`}
                >
                  ₹{item.remaining.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full ${
                  item.isOverBudget
                    ? 'bg-rose-500'
                    : item.percentage >= 80
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, item.percentage)}%` }}
              />
            </div>

            {/* Top Category & Switch action */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Top Spend:</span>
                {item.topCategory ? (
                  <span className="font-bold flex items-center gap-1">
                    <span>{item.topCategory.category.emoji}</span>
                    <span>{item.topCategory.category.label}</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      (₹{item.topCategory.totalAmount.toLocaleString('en-IN')})
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-400">None</span>
                )}
              </div>

              {item.isSelected ? (
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  Active in Dashboard
                </span>
              ) : (
                <button
                  onClick={() => {
                    setSelectedMonth(item.monthKey);
                    setActiveTab('dashboard');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
                >
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
