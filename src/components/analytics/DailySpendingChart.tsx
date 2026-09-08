import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Expense } from '../../types';
import { MonthDateMetrics } from '../../lib/calculations';

interface DailySpendingChartProps {
  expenses: Expense[];
  metrics: MonthDateMetrics;
  dailySafeTarget: number;
}

export const DailySpendingChart: React.FC<DailySpendingChartProps> = ({
  expenses,
  metrics,
  dailySafeTarget,
}) => {
  // Aggregate spending by day of the month
  const chartData = useMemo(() => {
    const map: Record<number, number> = {};

    expenses.forEach((e) => {
      try {
        const day = parseInt(e.date.split('-')[2], 10);
        if (!isNaN(day)) {
          map[day] = (map[day] || 0) + e.amount;
        }
      } catch {
        // ignore malformed date
      }
    });

    const list = [];
    const maxDay = metrics.isCurrentMonth
      ? Math.max(metrics.currentDay, 10)
      : metrics.daysInMonth;

    for (let day = 1; day <= maxDay; day++) {
      const amount = map[day] || 0;
      list.push({
        day: `Day ${day}`,
        dayNumber: day,
        amount,
        isSpike: dailySafeTarget > 0 && amount > dailySafeTarget * 1.5,
        isToday: metrics.isCurrentMonth && day === metrics.currentDay,
      });
    }

    return list;
  }, [expenses, metrics, dailySafeTarget]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl text-xs shadow-2xl border border-slate-700 backdrop-blur-md">
          <p className="font-bold text-slate-200">
            {item.day} {item.isToday ? '(Today)' : ''}
          </p>
          <p className="font-mono text-emerald-400 font-extrabold text-sm mt-0.5">
            ₹{item.amount.toLocaleString('en-IN')}
          </p>
          {dailySafeTarget > 0 && (
            <p className="text-[10px] text-slate-400 mt-1">
              Safe Daily Limit: ₹{dailySafeTarget.toLocaleString('en-IN')}
            </p>
          )}
          {item.isSpike && (
            <p className="text-[10px] text-amber-400 font-bold mt-1">
              ⚡ High spending spike on this day
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
          <XAxis
            dataKey="dayNumber"
            tickLine={false}
            stroke="#94a3b8"
            fontSize={11}
            tickFormatter={(val) => `${val}`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            stroke="#94a3b8"
            fontSize={11}
            tickFormatter={(val) => `₹${val}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
          {dailySafeTarget > 0 && (
            <ReferenceLine
              y={dailySafeTarget}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              label={{
                value: `Safe ₹${dailySafeTarget}`,
                position: 'top',
                fill: '#F59E0B',
                fontSize: 10,
                fontWeight: 600,
              }}
            />
          )}
          <Bar
            dataKey="amount"
            fill="#4F46E5"
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
