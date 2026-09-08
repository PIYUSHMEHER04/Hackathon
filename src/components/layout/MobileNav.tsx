import React from 'react';
import { LayoutDashboard, ReceiptText, Plus, PiggyBank, PieChart, Trophy, Settings } from 'lucide-react';
import { NavigationTab, useBudget } from '../../context/BudgetContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, openAddExpense, themePalette } = useBudget();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'expenses', label: 'Expenses', icon: <ReceiptText className="w-5 h-5" /> },
    { id: 'savings', label: 'Vault', icon: <PiggyBank className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart className="w-5 h-5" /> },
    { id: 'achievements', label: 'Rewards', icon: <Trophy className="w-5 h-5" /> },
  ];

  const activeColor =
    themePalette === 'emerald'
      ? 'text-emerald-400 font-bold'
      : themePalette === 'violet'
      ? 'text-purple-400 font-bold'
      : 'text-cyan-400 font-bold';

  const floatingBtnClass =
    themePalette === 'emerald'
      ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30'
      : themePalette === 'violet'
      ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
      : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/30';

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A0D17]/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl"
    >
      {/* Home & Expenses & Vault */}
      {navItems.slice(0, 2).map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? activeColor
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}

      {/* Center Floating Quick Add Button */}
      <div className="relative -top-5">
        <button
          onClick={openAddExpense}
          className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg active:scale-95 transition-all border-4 border-slate-50 dark:border-[#0A0D17] ${floatingBtnClass}`}
          aria-label="Add Expense"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Savings, Analytics, Rewards */}
      {navItems.slice(2).map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
              isActive
                ? activeColor
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
