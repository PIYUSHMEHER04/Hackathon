import React, { useEffect, useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORY_LIST, getCategory } from '../../constants/categories';
import { CategoryId, PaymentMethod } from '../../types';

export const ExpenseModal: React.FC = () => {
  const {
    isAddExpenseOpen,
    closeAddExpense,
    editingExpense,
    closeEditExpense,
    addExpense,
    updateExpense,
  } = useBudget();

  const isOpen = isAddExpenseOpen || !!editingExpense;
  const isEditing = !!editingExpense;

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [error, setError] = useState<string | null>(null);

  // Populate data when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategoryId(editingExpense.categoryId);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod || 'UPI');
      setError(null);
    } else {
      setAmount('');
      setCategoryId('food');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setPaymentMethod('UPI');
      setError(null);
    }
  }, [editingExpense, isAddExpenseOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isEditing) closeEditExpense();
    else closeAddExpense();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (!categoryId) {
      setError('Please select an expense category.');
      return;
    }

    if (!date) {
      setError('Please select an expense date.');
      return;
    }

    if (isEditing && editingExpense) {
      updateExpense(editingExpense.id, {
        amount: Math.round(parsedAmount),
        categoryId,
        description: description.trim() || getCategory(categoryId).label,
        date,
        paymentMethod,
      });
      closeEditExpense();
    } else {
      addExpense({
        amount: Math.round(parsedAmount),
        categoryId,
        description: description.trim() || getCategory(categoryId).label,
        date,
        paymentMethod,
      });
      closeAddExpense();
    }
  };

  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isEditing ? 'Modify Transaction' : 'Quick Logging'}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            {isEditing ? 'Edit Expense' : 'Add Expense'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                required
                className="w-full pl-10 pr-4 py-3 text-2xl font-extrabold rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Quick Amount Pills */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-slate-400">Quick add:</span>
              {quickAmounts.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => {
                    const current = parseInt(amount, 10) || 0;
                    setAmount((current + q).toString());
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORY_LIST.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-xl mb-1">{cat.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mess dinner, Auto fare, Xerox prints"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="UPI">UPI (GPay / PhonePe)</option>
                <option value="Cash">Cash</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 transition-all active:scale-95"
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 stroke-[3]" />}
              <span>{isEditing ? 'Save Changes' : '+ Add Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
