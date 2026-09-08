import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const CategoryBreakdown: React.FC = () => {
  const { categorySummaries, setActiveTab } = useBudget();

  // Show categories that have spending, plus top primary categories
  const activeCategories = categorySummaries.filter((c) => c.totalAmount > 0);
  const displayed = activeCategories.length > 0 ? activeCategories.slice(0, 6) : categorySummaries.slice(0, 4);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#101422] border border-slate-200/80 dark:border-white/[0.08] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Categorized Spending
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Where your money goes
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('analytics')}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-300"
        >
          <span>Deep Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayed.map((item) => (
          <div
            key={item.categoryId}
            className="flex flex-col p-4 rounded-2xl border border-slate-200/80 dark:border-white/[0.06] bg-slate-50/70 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-all hover:-translate-y-0.5 shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{item.category.emoji}</span>
              <span className="text-[11px] font-bold text-slate-400 font-mono">
                {item.percentage}%
              </span>
            </div>

            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {item.category.label}
            </span>

            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-1">
              ₹{item.totalAmount.toLocaleString('en-IN')}
            </span>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, item.percentage)}%`,
                  backgroundColor: item.category.hex,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
