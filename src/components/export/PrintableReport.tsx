import React from 'react';
import { useBudget } from '../../context/BudgetContext';
import { getCategory } from '../../constants/categories';

export const PrintableReport: React.FC = () => {
  const { selectedMonth, currentBudget, overview, currentMonthExpenses, categorySummaries } =
    useBudget();

  return (
    <div className="hidden print:block text-slate-900 bg-white p-8 max-w-4xl mx-auto font-sans">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            CampusSpend — Student Financial Statement
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Know where your money goes. Before it's gone.
          </p>
        </div>
        <div className="text-right text-xs">
          <p className="font-bold">Period: {selectedMonth}</p>
          <p className="text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 border border-slate-300 rounded-xl p-4 bg-slate-50">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Monthly Budget</span>
          <span className="text-lg font-black font-mono">
            ₹{overview.totalBudget.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Money Spent</span>
          <span className="text-lg font-black font-mono">
            ₹{overview.totalSpent.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Money Left</span>
          <span className="text-lg font-black font-mono">
            ₹{overview.remainingBudget.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Budget Used</span>
          <span className="text-lg font-black font-mono">{overview.percentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-700">
        Category Spending Breakdown
      </h3>
      <table className="w-full text-left text-xs border border-slate-300 mb-6">
        <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
          <tr>
            <th className="p-2">Category</th>
            <th className="p-2 text-right">Transactions</th>
            <th className="p-2 text-right">Amount (₹)</th>
            <th className="p-2 text-right">% of Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {categorySummaries
            .filter((c) => c.totalAmount > 0)
            .map((c) => (
              <tr key={c.categoryId}>
                <td className="p-2 font-semibold">
                  {c.category.emoji} {c.category.label}
                </td>
                <td className="p-2 text-right">{c.count}</td>
                <td className="p-2 text-right font-mono font-bold">
                  ₹{c.totalAmount.toLocaleString('en-IN')}
                </td>
                <td className="p-2 text-right font-mono">{c.percentage}%</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Transactions List */}
      <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-slate-700">
        Transaction Activity Ledger ({currentMonthExpenses.length} entries)
      </h3>
      <table className="w-full text-left text-xs border border-slate-300 mb-6">
        <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Description</th>
            <th className="p-2">Method</th>
            <th className="p-2 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {currentMonthExpenses.map((e) => {
            const cat = getCategory(e.categoryId);
            return (
              <tr key={e.id}>
                <td className="p-2">{e.date}</td>
                <td className="p-2">
                  {cat.emoji} {cat.label}
                </td>
                <td className="p-2">{e.description || cat.label}</td>
                <td className="p-2">{e.paymentMethod || 'UPI'}</td>
                <td className="p-2 text-right font-mono font-bold">
                  ₹{e.amount.toLocaleString('en-IN')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-400 text-center">
        CampusSpend Student Financial Companion • Offline Client-Side Generated Report
      </div>
    </div>
  );
};
