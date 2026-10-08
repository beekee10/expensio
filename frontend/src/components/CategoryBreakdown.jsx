import React from 'react';
import { Utensils, Zap, Film, RefreshCw, Layers, CheckCircle } from 'lucide-react';

const categoryIcons = {
  Food: Utensils,
  Utilities: Zap,
  Entertainment: Film,
  Subscriptions: RefreshCw,
  Other: Layers
};

const categoryColors = {
  Food: 'bg-teal-500',
  Utilities: 'bg-indigo-500',
  Entertainment: 'bg-purple-500',
  Subscriptions: 'bg-amber-500',
  Other: 'bg-slate-500'
};

export default function CategoryBreakdown({ categories, summary }) {
  const monthlySpent = summary?.monthly_spent ?? 0;
  const monthlyBudget = summary?.monthly_budget ?? 25000;
  
  // Percentage of budget remaining
  const budgetLeftPercent = Math.max(0, Math.min(100, Math.round(((monthlyBudget - monthlySpent) / monthlyBudget) * 100)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      
      {/* 1. Category Spending Progress Bars */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">
          Spending by Category
        </h3>

        {(!categories || categories.length === 0) ? (
          <p className="text-sm text-slate-500 italic py-6">
            No expenses found yet. Click "+ Add Expense" to record one!
          </p>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.category] || Layers;
              const barColor = categoryColors[cat.category] || 'bg-slate-500';

              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-200">{cat.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">
                        ₹{cat.total_amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({cat.percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Tailwind Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Monthly Budget Health */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Monthly Budget Health</h3>
          <p className="text-xs text-slate-400 mt-1">
            Tracking your monthly spending limit of ₹{monthlyBudget.toLocaleString('en-IN')}
          </p>

          {/* Simple Circle / Metric Display */}
          <div className="flex flex-col items-center justify-center my-6">
            <div className="w-36 h-36 rounded-full border-4 border-slate-800 border-t-teal-400 flex flex-col items-center justify-center bg-slate-950/60 shadow-inner">
              <span className="text-3xl font-extrabold text-white">
                {budgetLeftPercent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Remaining
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs text-slate-300">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            You have spent <strong className="text-white">₹{monthlySpent.toLocaleString('en-IN')}</strong> of your{' '}
            <strong className="text-white">₹{monthlyBudget.toLocaleString('en-IN')}</strong> monthly limit.
          </span>
        </div>
      </div>

    </div>
  );
}
