import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const CategoryBreakdown: React.FC = () => {
  const { categorySummaries, overview, setActiveTab } = useBudget();

  // Show categories that have spending, plus top primary categories
  const activeCategories = categorySummaries.filter((c) => c.totalAmount > 0);
  const displayed = activeCategories.length > 0 ? activeCategories.slice(0, 6) : categorySummaries.slice(0, 4);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Categorized Spending
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Where your money goes
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('analytics')}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
        >
          <span>View Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {displayed.map((item) => (
          <div
            key={item.categoryId}
            className={`flex flex-col p-3.5 rounded-2xl border transition-all hover:scale-102 ${item.category.bgLight} ${item.category.borderColor}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{item.category.emoji}</span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                {item.percentage}%
              </span>
            </div>

            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
              {item.category.label}
            </span>

            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              ₹{item.totalAmount.toLocaleString('en-IN')}
            </span>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden mt-2">
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
