import React from 'react';
import { Search, Filter, ArrowUpDown, Download, Printer } from 'lucide-react';
import { CategoryId } from '../../types';
import { CATEGORY_LIST } from '../../constants/categories';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string; // 'all' or CategoryId
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  paymentFilter: string; // 'all' | 'UPI' | 'Cash' | 'Card'
}

interface ExpenseFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onExportCSV: () => void;
  onPrintReport: () => void;
  totalFilteredCount: number;
  totalFilteredAmount: number;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFilterChange,
  onExportCSV,
  onPrintReport,
  totalFilteredCount,
  totalFilteredAmount,
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-5 shadow-sm mb-6 space-y-4">
      {/* Top row: Search and Export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by description (e.g. Mess, Auto, Xerox)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-black/30 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Action buttons: CSV & Print */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/10 transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onPrintReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-white/10 transition-colors"
            title="Print Monthly Financial Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Category Filter, Payment Filter, Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06] text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.selectedCategory}
              onChange={(e) => onFilterChange({ ...filters, selectedCategory: e.target.value })}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151928] text-slate-700 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="all">All Categories</option>
              {CATEGORY_LIST.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method */}
          <select
            value={filters.paymentFilter}
            onChange={(e) => onFilterChange({ ...filters, paymentFilter: e.target.value })}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151928] text-slate-700 dark:text-slate-200 font-bold focus:outline-none"
          >
            <option value="all">All Payment Modes</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151928] text-slate-700 dark:text-slate-200 font-bold focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>

        {/* Counter Summary */}
        <div className="text-slate-400 font-medium">
          Showing <strong className="text-slate-200">{totalFilteredCount}</strong> expenses (Total:{' '}
          <strong className="text-emerald-400 font-mono">
            ₹{totalFilteredAmount.toLocaleString('en-IN')}
          </strong>
          )
        </div>
      </div>
    </div>
  );
};
