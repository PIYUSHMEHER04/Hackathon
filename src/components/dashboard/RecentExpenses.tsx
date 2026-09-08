import React, { useState } from 'react';
import { Edit2, Trash2, ArrowRight, Plus } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { getCategory } from '../../constants/categories';
import { Expense } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';

export const RecentExpenses: React.FC = () => {
  const { currentMonthExpenses, openEditExpense, deleteExpense, openAddExpense, setActiveTab } =
    useBudget();
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const recent = currentMonthExpenses.slice(0, 5);

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Activity Ledger
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Expenses</h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openAddExpense}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 font-bold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add</span>
          </button>
          {currentMonthExpenses.length > 5 && (
            <button
              onClick={() => setActiveTab('expenses')}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>View all ({currentMonthExpenses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          title="No expenses logged this month"
          description="Track your mess dinner, transit, or books to monitor your daily allowance."
        />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
          {recent.map((exp) => {
            const cat = getCategory(exp.categoryId);
            return (
              <div
                key={exp.id}
                className="group flex items-center justify-between py-3.5 hover:bg-slate-50 dark:hover:bg-white/[0.02] px-3 rounded-2xl transition-all"
              >
                {/* Left: Icon & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border border-white/10 bg-white/[0.04]"
                  >
                    {cat.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {exp.description || cat.label}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-300">
                        {cat.label}
                      </span>
                      <span>•</span>
                      <span>{formatDateLabel(exp.date)}</span>
                      {exp.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-bold text-emerald-400 uppercase font-mono">
                            {exp.paymentMethod}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                    ₹{exp.amount.toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditExpense(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/[0.06] transition-colors"
                      title="Edit expense"
                      aria-label="Edit expense"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpenseToDelete(exp)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                      title="Delete expense"
                      aria-label="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        title="Delete Expense?"
        message={`Are you sure you want to delete "${expenseToDelete?.description || 'this expense'}" of ₹${expenseToDelete?.amount.toLocaleString('en-IN')}? This will immediately restore your remaining budget.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (expenseToDelete) {
            deleteExpense(expenseToDelete.id);
            setExpenseToDelete(null);
          }
        }}
        onCancel={() => setExpenseToDelete(null)}
      />
    </div>
  );
};
