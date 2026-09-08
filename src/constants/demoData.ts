import { Expense, MonthlyBudget } from '../types';

export const getCurrentMonthKey = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getPreviousMonthKey = (): string => {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // 0-indexed: current month - 1 is previous month index
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  return `${year}-${String(month).padStart(2, '0')}`;
};

export const generateDemoData = (): {
  budgets: Record<string, MonthlyBudget>;
  expenses: Expense[];
} => {
  const currentMonth = getCurrentMonthKey();
  const previousMonth = getPreviousMonthKey();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1;
  const currentDay = now.getDate();

  // Helper to format date in YYYY-MM-DD
  const makeDate = (day: number, monthNum = currentMonthNum, year = currentYear): string => {
    const clampedDay = Math.min(Math.max(1, day), 28);
    return `${year}-${String(monthNum).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
  };

  const prevMonthNum = currentMonthNum === 1 ? 12 : currentMonthNum - 1;
  const prevYear = currentMonthNum === 1 ? currentYear - 1 : currentYear;

  // Realistic student transactions for current month
  // Spread up to current day (or first 8 days if early in month)
  const baseDay = Math.max(currentDay, 8);

  const currentExpenses: Expense[] = [
    {
      id: 'demo-exp-1',
      amount: 1400,
      categoryId: 'food',
      description: 'Hostel mess monthly meal coupons',
      date: makeDate(Math.max(1, baseDay - 7)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 7 * 86400000,
    },
    {
      id: 'demo-exp-2',
      amount: 600,
      categoryId: 'transport',
      description: 'Monthly Metro Smartcard recharge',
      date: makeDate(Math.max(1, baseDay - 6)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 6 * 86400000,
    },
    {
      id: 'demo-exp-3',
      amount: 420,
      categoryId: 'stationery',
      description: 'Engineering drawing sheets & rotring pens',
      date: makeDate(Math.max(1, baseDay - 5)),
      paymentMethod: 'Cash',
      createdAt: Date.now() - 5 * 86400000,
    },
    {
      id: 'demo-exp-4',
      amount: 850,
      categoryId: 'food',
      description: 'Weekend hostel wing pizza party',
      date: makeDate(Math.max(1, baseDay - 4)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'demo-exp-5',
      amount: 450,
      categoryId: 'entertainment',
      description: 'Weekend movie ticket with batchmates',
      date: makeDate(Math.max(1, baseDay - 4)),
      paymentMethod: 'Card',
      createdAt: Date.now() - 4 * 86400000,
    },
    {
      id: 'demo-exp-6',
      amount: 320,
      categoryId: 'transport',
      description: 'Auto share to railway station',
      date: makeDate(Math.max(1, baseDay - 3)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      id: 'demo-exp-7',
      amount: 299,
      categoryId: 'recharge',
      description: 'Mobile 5G student data recharge',
      date: makeDate(Math.max(1, baseDay - 3)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 3 * 86400000,
    },
    {
      id: 'demo-exp-8',
      amount: 500,
      categoryId: 'transport',
      description: 'Cab ride for inter-college hackathon',
      date: makeDate(Math.max(1, baseDay - 2)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'demo-exp-9',
      amount: 530,
      categoryId: 'entertainment',
      description: 'Spotify Student + Steam game bundle',
      date: makeDate(Math.max(1, baseDay - 2)),
      paymentMethod: 'Card',
      createdAt: Date.now() - 2 * 86400000,
    },
    {
      id: 'demo-exp-10',
      amount: 200,
      categoryId: 'stationery',
      description: 'Spiral lab notebooks & Xerox prints',
      date: makeDate(Math.max(1, baseDay - 1)),
      paymentMethod: 'Cash',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'demo-exp-11',
      amount: 180,
      categoryId: 'health',
      description: 'Multivitamins & cold medicine',
      date: makeDate(Math.max(1, baseDay - 1)),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'demo-exp-12',
      amount: 950,
      categoryId: 'food',
      description: 'Campus cafeteria & midnight snacks',
      date: makeDate(baseDay),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 3600000,
    },
    {
      id: 'demo-exp-13',
      amount: 721,
      categoryId: 'other',
      description: 'Hostel laundry service & room essentials',
      date: makeDate(baseDay),
      paymentMethod: 'Cash',
      createdAt: Date.now() - 1800000,
    },
  ];

  // Past month transactions for history comparison
  const previousExpenses: Expense[] = [
    {
      id: 'demo-prev-1',
      amount: 4200,
      categoryId: 'food',
      description: 'Monthly mess fee + snacks',
      date: makeDate(5, prevMonthNum, prevYear),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 35 * 86400000,
    },
    {
      id: 'demo-prev-2',
      amount: 1800,
      categoryId: 'transport',
      description: 'Metro + auto passes',
      date: makeDate(8, prevMonthNum, prevYear),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 32 * 86400000,
    },
    {
      id: 'demo-prev-3',
      amount: 1100,
      categoryId: 'stationery',
      description: 'Reference textbooks (2nd hand)',
      date: makeDate(12, prevMonthNum, prevYear),
      paymentMethod: 'Cash',
      createdAt: Date.now() - 28 * 86400000,
    },
    {
      id: 'demo-prev-4',
      amount: 1650,
      categoryId: 'entertainment',
      description: 'College fest tickets & outings',
      date: makeDate(18, prevMonthNum, prevYear),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 22 * 86400000,
    },
    {
      id: 'demo-prev-5',
      amount: 299,
      categoryId: 'recharge',
      description: 'SIM recharge',
      date: makeDate(20, prevMonthNum, prevYear),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 20 * 86400000,
    },
    {
      id: 'demo-prev-6',
      amount: 950,
      categoryId: 'other',
      description: 'Room supplies & toiletries',
      date: makeDate(25, prevMonthNum, prevYear),
      paymentMethod: 'UPI',
      createdAt: Date.now() - 15 * 86400000,
    },
  ];

  const budgets: Record<string, MonthlyBudget> = {
    [currentMonth]: {
      month: currentMonth,
      totalBudget: 15000,
      weeklyBudget: 3750,
      primaryCategories: ['food', 'transport', 'stationery', 'entertainment'],
    },
    [previousMonth]: {
      month: previousMonth,
      totalBudget: 14000,
      weeklyBudget: 3500,
      primaryCategories: ['food', 'transport', 'stationery'],
    },
  };

  return {
    budgets,
    expenses: [...currentExpenses, ...previousExpenses],
  };
};
