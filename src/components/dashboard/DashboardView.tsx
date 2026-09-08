import React from 'react';
import { BudgetAlertBanner } from './BudgetAlertBanner';
import { BudgetOverviewCard } from './BudgetOverviewCard';
import { DailySafeSpendCard } from './DailySafeSpendCard';
import { ProjectionCard } from './ProjectionCard';
import { WeeklyBudgetCard } from './WeeklyBudgetCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { RecentExpenses } from './RecentExpenses';
import { QuickAffordCard } from './QuickAffordCard';
import { StreakCard } from '../gamification/StreakCard';
import { InsightsView } from '../insights/InsightsView';
import { SavingsCard } from './SavingsCard';

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 80% & 100%+ Dynamic Budget Alert Banner */}
      <BudgetAlertBanner />

      {/* Hero Master Budget Overview Card */}
      <BudgetOverviewCard />

      {/* Differentiating Feature Grid: Safe Spend + Projection + Savings + Weekly + Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Differentiator: Daily Safe Spend */}
        <DailySafeSpendCard />

        {/* Predictive Intelligence: End-of-month Projection */}
        <ProjectionCard />

        {/* Dedicated Student Savings Vault Card */}
        <SavingsCard />

        {/* Intermediate Control: Weekly Spending Limit */}
        <WeeklyBudgetCard />

        {/* Impulse Purchasing Guard: "Can I Afford This?" */}
        <QuickAffordCard />

        {/* Gamified Habit Formation: Money Streak */}
        <StreakCard />

        {/* Deterministic Rule-Based Intelligence: Insights preview */}
        <div className="md:col-span-2 lg:col-span-3">
          <InsightsView />
        </div>
      </div>

      {/* Visual Category Distribution */}
      <CategoryBreakdown />

      {/* Activity Feed / Recent Expenses */}
      <RecentExpenses />
    </div>
  );
};
