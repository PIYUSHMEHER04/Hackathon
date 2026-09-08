import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORY_LIST } from '../../constants/categories';
import { CategoryId } from '../../types';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, completeOnboarding, toggleDemoMode } = useBudget();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [budgetAmount, setBudgetAmount] = useState<string>('15000');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([
    'food',
    'transport',
    'stationery',
    'entertainment',
  ]);

  if (!isOnboardingOpen) return null;

  const quickOptions = [5000, 10000, 15000, 20000, 25000];

  const handleCategoryToggle = (id: CategoryId) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const handleFinalSubmit = () => {
    const val = parseInt(budgetAmount, 10) || 15000;
    completeOnboarding(val, selectedCategories);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0E121F] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-10 max-w-lg w-full shadow-2xl relative my-8">
        {/* Step 1: Hero Landing Screen */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-500/30">
              ₹
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Welcome to CampusSpend
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Make your money last the month.
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                A smarter budget companion built for college students living away from home. Know where your money goes, before it's gone.
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 py-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Track daily expenses in 3 seconds</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>See exactly where your money goes with visual charts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Get alerts before you overspend (80% & 100% warnings)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Know exactly how much you can safely spend today</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={toggleDemoMode}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.05] hover:bg-white/[0.1] text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-white/10 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Budget Amount Input */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Step 1 of 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Set your monthly allowance.
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                How much money do you have for this month?
              </p>
            </div>

            {/* Big Input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400 font-mono">
                ₹
              </span>
              <input
                type="number"
                min="1000"
                step="500"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                autoFocus
                className="w-full pl-12 pr-4 py-4 text-3xl sm:text-4xl font-black rounded-2xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-black/40 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Quick Pick buttons */}
            <div>
              <span className="text-xs font-bold text-slate-400 block mb-2">
                Quick student allowance options:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudgetAmount(opt.toString())}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                      budgetAmount === opt.toString()
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md glow-emerald'
                        : 'bg-slate-50 dark:bg-white/[0.04] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    ₹{opt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Priority Categories */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Step 2 of 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                What are your biggest expenses?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select your major spending areas so we can personalize your alerts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORY_LIST.map((cat) => {
                const isChecked = selectedCategories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 text-emerald-300 font-extrabold'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className="text-xs font-bold">
                        {cat.label}
                      </span>
                    </div>
                    {isChecked && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-md shadow-emerald-500/25 transition-all"
              >
                <span>Final Step →</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Finished Confirmation Screen */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-4xl mx-auto shadow-inner glow-emerald">
              ✨
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Your money has a plan.
              </h2>
              <p className="text-base font-bold text-emerald-400 mt-1">
                Let's make it last.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-xs mx-auto">
                Monthly allowance set to{' '}
                <strong className="text-slate-900 dark:text-white font-mono">
                  ₹{parseInt(budgetAmount, 10).toLocaleString('en-IN')}
                </strong>
                . All safe daily calculations are ready on your terminal.
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
