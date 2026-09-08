import { Expense, MonthlyBudget } from '../types';
import { getCategory } from '../constants/categories';

export const exportExpensesToCSV = (
  expenses: Expense[],
  monthKey: string,
  budget?: MonthlyBudget
): void => {
  if (!expenses || expenses.length === 0) {
    alert('No expenses to export for this month.');
    return;
  }

  const headers = ['Date', 'Category', 'Description', 'Payment Method', 'Amount (INR)'];
  const rows = expenses.map((e) => {
    const cat = getCategory(e.categoryId);
    return [
      `"${e.date}"`,
      `"${cat.label}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"${e.paymentMethod || 'UPI'}"`,
      e.amount,
    ].join(',');
  });

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const totalBudget = budget?.totalBudget || 0;
  const remaining = totalBudget - totalSpent;

  const summary = [
    '',
    `"--- Monthly Summary (${monthKey}) ---"`,
    `"Monthly Budget",${totalBudget}`,
    `"Total Spent",${totalSpent}`,
    `"Money Left",${remaining}`,
  ];

  const csvContent = [headers.join(','), ...rows, ...summary].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `CampusSpend_${monthKey}_Report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const triggerPrintReport = (): void => {
  window.print();
};
