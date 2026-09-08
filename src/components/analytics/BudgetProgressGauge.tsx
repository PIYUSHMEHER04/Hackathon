import React from 'react';

interface BudgetProgressGaugeProps {
  percentage: number;
  totalBudget: number;
  remainingBudget: number;
  isOverBudget: boolean;
}

export const BudgetProgressGauge: React.FC<BudgetProgressGaugeProps> = ({
  percentage,
  totalBudget,
  remainingBudget,
  isOverBudget,
}) => {
  const radius = 80;
  const strokeWidth = 14;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const clampedPercent = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  const getStrokeColor = () => {
    if (percentage >= 100) return '#F43F5E'; // Red
    if (percentage >= 80) return '#F59E0B'; // Amber
    if (percentage >= 70) return '#EAB308'; // Yellow
    if (percentage >= 50) return '#3B82F6'; // Blue
    return '#10B981'; // Emerald
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Background circle track */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-slate-100 dark:text-slate-800"
          />
          {/* Animated progress circle */}
          <circle
            stroke={getStrokeColor()}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {percentage.toFixed(0)}%
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Budget used
          </span>
        </div>
      </div>

      {/* Metric details */}
      <div className="mt-2 text-center">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isOverBudget ? (
            <span className="text-rose-500 font-bold">
              Exceeded by ₹{Math.abs(remainingBudget).toLocaleString('en-IN')}
            </span>
          ) : (
            <span>
              Remaining: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">₹{remainingBudget.toLocaleString('en-IN')}</strong>
            </span>
          )}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          of ₹{totalBudget.toLocaleString('en-IN')} allowance
        </p>
      </div>
    </div>
  );
};
