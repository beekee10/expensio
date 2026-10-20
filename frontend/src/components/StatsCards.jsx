import React, { useState } from 'react';
import { Wallet, CreditCard, PiggyBank, ArrowUpRight, Edit2, Check, X } from 'lucide-react';

export default function StatsCards({ summary, onUpdateBudget }) {
  const totalSpent = summary?.total_spent ?? 0;
  const monthlySpent = summary?.monthly_spent ?? 0;
  const budgetRemaining = summary?.budget_remaining ?? 0;
  const monthlyBudget = summary?.monthly_budget ?? 25000;

  // Inline budget edit state
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Percentage of budget used
  const budgetPercentage = Math.min(100, Math.round((monthlySpent / monthlyBudget) * 100));

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(budgetInput);
    if (!parsed || parsed <= 0) return;

    setIsSaving(true);
    try {
      if (onUpdateBudget) {
        await onUpdateBudget(parsed);
      }
      setIsEditingBudget(false);
    } catch (err) {
      alert('Failed to update budget: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSaving(false);
    }
  };

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
        <div className="flex items-center justify-between gap-2 mt-4 text-xs text-slate-400 flex-wrap">
          <span className={`px-2 py-0.5 rounded-full font-semibold ${
            budgetPercentage > 85 ? 'text-rose-400 bg-rose-500/10' : 'text-teal-400 bg-teal-500/10'
          }`}>
            {budgetPercentage}% of limit
          </span>

          
        </div>
      </div>

    
{/* 3. Remaining Budget */}
<div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
  
  {/* Header */}
  <div className="flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-400">
        Remaining Budget
      </p>

      <h2 className={`text-3xl font-extrabold mt-2 ${
        budgetRemaining < 5000
          ? 'text-rose-400'
          : 'text-emerald-400'
      }`}>
        ₹{budgetRemaining.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </h2>
    </div>

    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
      <PiggyBank className="w-6 h-6" />
    </div>
  </div>


  {/* Budget Progress */}
  <div className="mt-6">

    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-slate-500">
        Budget used
      </span>

      <span className={`text-xs font-semibold ${
        budgetPercentage > 85
          ? 'text-rose-400'
          : 'text-slate-300'
      }`}>
        {budgetPercentage}%
      </span>
    </div>

    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          budgetPercentage > 85
            ? 'bg-rose-400'
            : budgetPercentage > 70
              ? 'bg-amber-400'
              : 'bg-emerald-400'
        }`}
        style={{ width: `${budgetPercentage}%` }}
      />
    </div>

  </div>


  {/* Budget Limit */}
  <div className="mt-5 pt-4 border-t border-slate-800">

    {!isEditingBudget ? (

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-slate-500">
            Monthly limit
          </p>

          <p className="text-sm font-semibold text-slate-200 mt-0.5">
            ₹{monthlyBudget.toLocaleString('en-IN')}
          </p>
        </div>

        {onUpdateBudget && (
          <button
            type="button"
            onClick={() => {
              setBudgetInput(monthlyBudget.toString());
              setIsEditingBudget(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                       text-xs font-medium text-slate-400
                       bg-slate-800 hover:bg-slate-700
                       hover:text-teal-400
                       border border-slate-700
                       transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}

      </div>

    ) : (

      <form
        onSubmit={handleSaveBudget}
        className="flex items-center justify-between gap-3"
      >

        <div>
          <p className="text-xs text-slate-500 mb-1">
            Monthly limit
          </p>

          <div className="flex items-center">
            <span className="text-sm text-slate-400 mr-1">
              ₹
            </span>

            <input
              type="number"
              min="100"
              step="100"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-28 bg-slate-800 border border-teal-500
                         rounded-lg px-2.5 py-1.5
                         text-sm text-white
                         focus:outline-none focus:ring-1
                         focus:ring-teal-500"
              autoFocus
            />
          </div>
        </div>


        <div className="flex items-center gap-1">

          <button
            type="submit"
            disabled={isSaving}
            title="Save limit"
            className="p-2 rounded-lg
                       text-teal-400
                       bg-teal-500/10
                       hover:bg-teal-500/20
                       transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsEditingBudget(false)}
            title="Cancel"
            className="p-2 rounded-lg
                       text-slate-400
                       bg-slate-800
                       hover:text-rose-400
                       hover:bg-slate-700
                       transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </form>

    )}

  </div>

</div>  
      

    </div>
  );
}
