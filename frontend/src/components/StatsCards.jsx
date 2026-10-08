import React from 'react';
import { Wallet, CreditCard, PiggyBank, ArrowUpRight } from 'lucide-react';

export default function StatsCards({ summary }) {
  const totalSpent = summary?.total_spent ?? 0;
  const monthlySpent = summary?.monthly_spent ?? 0;
  const budgetRemaining = summary?.budget_remaining ?? 0;
  const monthlyBudget = summary?.monthly_budget ?? 25000;

  // Percentage of budget used
  const budgetPercentage = Math.min(100, Math.round((monthlySpent / monthlyBudget) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      
      {/* 1. All-time Total Spent */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Spending (All-Time)</p>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
          <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Tracked
          </span>
          <span>{summary?.transaction_count ?? 0} total transactions</span>
        </div>
      </div>

      {/* 2. Monthly Spending */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">This Month's Spending</p>
            <h2 className="text-3xl font-extrabold text-white mt-2">
              ₹{monthlySpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
          <span className={`px-2 py-0.5 rounded-full font-semibold ${
            budgetPercentage > 85 ? 'text-rose-400 bg-rose-500/10' : 'text-teal-400 bg-teal-500/10'
          }`}>
            {budgetPercentage}% of budget
          </span>
          <span>Target: ₹{monthlyBudget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* 3. Remaining Budget */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Remaining Budget</p>
            <h2 className={`text-3xl font-extrabold mt-2 ${
              budgetRemaining < 5000 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              ₹{budgetRemaining.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <PiggyBank className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
          <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
            Safe to spend
          </span>
          <span>Current calendar month</span>
        </div>
      </div>

    </div>
  );
}
