import React from 'react';
import { Sparkles, Lightbulb, AlertTriangle, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';

export const InsightsView: React.FC = () => {
  const { insights, openAffordModal, openAddExpense } = useBudget();

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Rule-Based Intelligence
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Spending Insights
            </h3>
          </div>
        </div>

        <button
          onClick={openAffordModal}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Test a purchase</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {insights.map((item) => {
          const typeClasses = {
            positive: 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200',
            warning: 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200',
            danger: 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200',
            info: 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200',
          }[item.type];

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all hover:scale-101 flex items-start gap-3.5 ${typeClasses}`}
            >
              <span className="text-2xl shrink-0 select-none">{item.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actionable Student Tip footer */}
      <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Rule logic runs 100% locally in your browser. Zero cloud dependencies.</span>
        </span>
        <button
          onClick={openAddExpense}
          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          + Log expense
        </button>
      </div>
    </div>
  );
};
