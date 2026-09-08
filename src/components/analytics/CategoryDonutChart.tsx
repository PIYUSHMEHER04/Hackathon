import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CategorySpendSummary } from '../../types';

interface CategoryDonutChartProps {
  data: CategorySpendSummary[];
  totalSpent: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data, totalSpent }) => {
  const chartData = data
    .filter((d) => d.totalAmount > 0)
    .map((d) => ({
      name: d.category.label,
      value: d.totalAmount,
      color: d.category.hex,
      emoji: d.category.emoji,
      percentage: d.percentage,
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm">
        <span className="text-3xl mb-2">📊</span>
        <span>No category expenses recorded yet</span>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/90 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700 backdrop-blur-md">
          <p className="font-bold flex items-center gap-1.5">
            <span>{item.emoji}</span>
            <span>{item.name}</span>
          </p>
          <p className="font-mono text-emerald-400 font-bold mt-0.5">
            ₹{item.value.toLocaleString('en-IN')} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Donut Chart with center label */}
      <div className="relative w-full md:w-1/2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Spent
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            ₹{totalSpent.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Legend & Breakdown */}
      <div className="w-full md:w-1/2 flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                {item.emoji} {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono shrink-0">
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{item.value.toLocaleString('en-IN')}
              </span>
              <span className="text-slate-400 text-[11px] w-10 text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
