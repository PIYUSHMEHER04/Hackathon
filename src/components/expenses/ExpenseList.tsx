import React, { useMemo, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { Expense } from '../../types';
import { getCategory } from '../../constants/categories';
import { ExpenseFilters, FilterState } from './ExpenseFilters';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';
import { exportExpensesToCSV, triggerPrintReport } from '../../lib/export';

export const ExpenseList: React.FC = () => {
  const {
    currentMonthExpenses,
    openAddExpense,
    openEditExpense,
    deleteExpense,
    selectedMonth,
    currentBudget,
    themePalette,
  } = useBudget();

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'newest',
    paymentFilter: 'all',
  });

  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let list = [...currentMonthExpenses];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          getCategory(e.categoryId).label.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.selectedCategory !== 'all') {
      list = list.filter((e) => e.categoryId === filters.selectedCategory);
    }

    // Payment method filter
    if (filters.paymentFilter !== 'all') {
      list = list.filter((e) => e.paymentMethod === filters.paymentFilter);
    }

    // Sort
    list.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt;
      }
      if (filters.sortBy === 'oldest') {
        return new Date(a.date).getTime() - new Date(b.date).getTime() || a.createdAt - b.createdAt;
      }
      if (filters.sortBy === 'highest') {
        return b.amount - a.amount;
      }
      if (filters.sortBy === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return list;
  }, [currentMonthExpenses, filters]);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const averageAmount =
    filteredExpenses.length > 0 ? Math.round(totalFilteredAmount / filteredExpenses.length) : 0;

  const handleExportCSV = () => {
    exportExpensesToCSV(filteredExpenses, selectedMonth, currentBudget);
  };

  const handlePrintReport = () => {
    triggerPrintReport();
  };

  const primaryBtnClass =
    themePalette === 'emerald'
      ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25'
      : themePalette === 'violet'
      ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25'
      : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/25';

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            All Expenses
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Audit, filter, and export your college spending transactions.
          </p>
        </div>

        <button
          onClick={openAddExpense}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 self-start sm:self-auto ${primaryBtnClass}`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Quick Summary Pill Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Filtered Spend</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            ₹{totalFilteredAmount.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-4 rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Transactions</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            {filteredExpenses.length}
          </p>
        </div>
        <div className="col-span-2 sm:col-span-1 p-4 rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average / Item</span>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
            ₹{averageAmount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ExpenseFilters
        filters={filters}
        onFilterChange={setFilters}
        onExportCSV={handleExportCSV}
        onPrintReport={handlePrintReport}
        totalFilteredCount={filteredExpenses.length}
        totalFilteredAmount={totalFilteredAmount}
      />

      {/* List / Table */}
      {filteredExpenses.length === 0 ? (
        currentMonthExpenses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-12 text-center bg-white dark:bg-[#101422] border border-slate-200 dark:border-white/[0.08] rounded-3xl">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No expenses match your search or filter criteria.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  selectedCategory: 'all',
                  sortBy: 'newest',
                  paymentFilter: 'all',
                })
              }
              className="mt-3 text-xs font-bold text-emerald-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-200/80 dark:border-white/[0.06]">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Category & Description</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                  <th className="py-3 px-4 hidden md:table-cell">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filteredExpenses.map((exp) => {
                  const cat = getCategory(exp.categoryId);
                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Category & Description */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 border border-white/10 bg-white/[0.04]"
                          >
                            {cat.emoji}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {exp.description || cat.label}
                            </p>
                            <div className="flex items-center gap-2 sm:hidden text-xs text-slate-400 mt-0.5">
                              <span>{cat.label}</span>
                              <span>•</span>
                              <span>{exp.date}</span>
                            </div>
                            <span className="hidden sm:inline-block text-xs text-slate-400 font-semibold">
                              {cat.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 hidden sm:table-cell text-slate-400 font-medium font-mono text-xs">
                        {exp.date}
                      </td>

                      {/* Payment Mode */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] font-bold text-emerald-400 uppercase font-mono">
                          {exp.paymentMethod || 'UPI'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 text-right">
                        <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                          ₹{exp.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditExpense(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/[0.06] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpenseToDelete(exp)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        title="Delete Expense?"
        message={`Are you sure you want to delete "${expenseToDelete?.description || 'this expense'}" of ₹${expenseToDelete?.amount.toLocaleString('en-IN')}? This will update your monthly calculations immediately.`}
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
