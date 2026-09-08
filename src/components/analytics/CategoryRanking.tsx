import React from 'react';
import { CategorySpendSummary } from '../../types';

interface CategoryRankingProps {
  summaries: CategorySpendSummary[];
  totalSpent: number;
}

export const CategoryRanking: React.FC<CategoryRankingProps> = ({ summaries, totalSpent }) => {
  // Only categories with spend > 0, sorted by highest
  const ranked = summaries.filter((s) => s.totalAmount > 0);

  if (ranked.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No expenses tracked yet for category ranking.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ranked.map((item, index) => {
        const rankNumber = index + 1;
        return (
          <div
            key={item.categoryId}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
          >
            {/* Rank badge + Category info */}
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  rankNumber === 1
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : rankNumber === 2
                    ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                    : rankNumber === 3
                    ? 'bg-amber-700/20 text-amber-900 dark:text-amber-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {rankNumber}
              </span>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0">{item.category.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.category.label}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {item.count} transaction{item.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount & Percentage */}
            <div className="flex flex-col items-end shrink-0 pl-2">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                ₹{item.totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                {item.percentage}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
