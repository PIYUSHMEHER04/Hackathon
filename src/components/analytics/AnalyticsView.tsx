import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { CategoryDonutChart } from './CategoryDonutChart';
import { DailySpendingChart } from './DailySpendingChart';
import { BudgetProgressGauge } from './BudgetProgressGauge';
import { CategoryRanking } from './CategoryRanking';
import { EmptyState } from '../common/EmptyState';

export const AnalyticsView: React.FC = () => {
  const {
    currentMonthExpenses,
    categorySummaries,
    overview,
    metrics,
  } = useBudget();

  if (currentMonthExpenses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Spending Analytics
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Visual breakdown of your student spending patterns.
          </p>
        </div>
        <EmptyState
          title="Not enough data yet."
          description="Add a few expenses to unlock your spending insights and visual category charts."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Spending Analytics
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          Deep dive into where every rupee goes and spot spending trends.
        </p>
      </div>

      {/* Row 1: Donut Chart & Progress Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Donut (Spans 2 columns) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm">
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Distribution
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Category Donut Breakdown
            </h3>
          </div>
          <CategoryDonutChart data={categorySummaries} totalSpent={overview.totalSpent} />
        </div>

        {/* Circular Budget Progress Gauge (1 column) */}
        <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Utilization
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Budget Pace Gauge
            </h3>
          </div>
          <BudgetProgressGauge
            percentage={overview.percentage}
            totalBudget={overview.totalBudget}
            remainingBudget={overview.remainingBudget}
            isOverBudget={overview.isOverBudget}
          />
        </div>
      </div>

      {/* Row 2: Daily Spending Velocity Chart & Category Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Spending Timeline (Spans 2 columns) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Velocity Timeline
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Daily Spending & Spikes
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Safe: ₹{overview.dailySafeSpend}/day
            </span>
          </div>
          <DailySpendingChart
            expenses={currentMonthExpenses}
            metrics={metrics}
            dailySafeTarget={overview.dailySafeSpend}
          />
        </div>

        {/* Category Ranking (1 column) */}
        <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm">
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ranked Outflows
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Category Ranking
            </h3>
          </div>
          <CategoryRanking summaries={categorySummaries} totalSpent={overview.totalSpent} />
        </div>
      </div>
    </div>
  );
};
