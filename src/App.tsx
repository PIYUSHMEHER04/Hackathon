import React, { useEffect } from 'react';
import { BudgetProvider, useBudget } from './context/BudgetContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ExpenseList } from './components/expenses/ExpenseList';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { MonthlyHistoryView } from './components/history/MonthlyHistoryView';
import { AchievementsModal } from './components/gamification/AchievementsModal';
import { ExpenseModal } from './components/expenses/ExpenseModal';
import { CanIAffordModal } from './components/affordability/CanIAffordModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { SavingsView } from './components/savings/SavingsView';
import { SavingsGoalModal } from './components/savings/SavingsGoalModal';
import { SavingsDepositModal } from './components/savings/SavingsDepositModal';
import { Toast } from './components/common/Toast';
import { PrintableReport } from './components/export/PrintableReport';

const MainLayout: React.FC = () => {
  const { activeTab, openSettings } = useBudget();

  useEffect(() => {
    if (activeTab === 'settings') {
      openSettings();
    }
  }, [activeTab, openSettings]);

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Printable Report (hidden except during window.print()) */}
      <PrintableReport />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-10 no-print">
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Header />

          {/* Tab View Switching */}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'expenses' && <ExpenseList />}
          {activeTab === 'savings' && <SavingsView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'history' && <MonthlyHistoryView />}
          {activeTab === 'achievements' && <AchievementsModal />}
          {activeTab === 'settings' && <DashboardView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="no-print">
        <MobileNav />
      </div>

      {/* Global Interactive Modals & Drawers */}
      <ExpenseModal />
      <CanIAffordModal />
      <OnboardingModal />
      <SettingsModal />
      <SavingsGoalModal />
      <SavingsDepositModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <BudgetProvider>
      <MainLayout />
    </BudgetProvider>
  );
}
