import React from 'react';
import {
  TrendingDown,
  Wallet,
  Utensils,
  ShoppingBag
} from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="mt-14 max-w-4xl mx-auto text-left">
      {/* Label */}
      <div className="text-center mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Your finances at a glance
        </span>
      </div>

      {/* Main Preview Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-2xl shadow-black/30">
        
        {/* Header: Period & Trend */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-slate-800/60">
          <div>
            <p className="text-xs font-medium text-slate-500">October 2026</p>
            <h3 className="text-lg font-bold text-white">Spending Overview</h3>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>8.4% less than last month</span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
              <Wallet className="w-3.5 h-3.5" />
              <span>Total Spent</span>
            </div>
            <p className="text-xl font-bold text-white">₹24,850</p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>Top Category</span>
            </div>
            <p className="text-xl font-bold text-white">Food</p>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Remaining</span>
            </div>
            <p className="text-xl font-bold text-white">₹15,150</p>
          </div>
        </div>

        {/* Lower Row: Bar Chart & Category Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Monthly Spending Comparison */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 flex flex-col justify-between">
            <p className="text-sm font-semibold text-white mb-3">
              Monthly Spending
            </p>

            <div className="flex items-end justify-between h-28 gap-3 px-1 pt-2">
              {[
                { month: 'Jun', height: '45%' },
                { month: 'Jul', height: '65%' },
                { month: 'Aug', height: '52%' },
                { month: 'Sep', height: '78%' },
                { month: 'Oct', height: '58%' },
              ].map((item) => (
                <div
                  key={item.month}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-2"
                >
                  <div
                    className="w-full max-w-8 rounded-t bg-teal-500/80 transition-all duration-300"
                    style={{ height: item.height }}
                  />
                  <span className="text-[11px] text-slate-500 font-medium">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4">
            <p className="text-sm font-semibold text-white mb-3">
              Top Categories
            </p>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Food</span>
                  <span className="text-slate-200 font-semibold">₹6,250</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-teal-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Utilities</span>
                  <span className="text-slate-200 font-semibold">₹4,200</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[52%] bg-teal-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-medium">Entertainment</span>
                  <span className="text-slate-200 font-semibold">₹3,150</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[39%] bg-teal-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
