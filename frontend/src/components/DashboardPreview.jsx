import React from 'react';
import { TrendingDown } from 'lucide-react';

export default function DashboardPreview() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none transition-all duration-500 ease-out lg:[transform:perspective(1200px)_rotateY(-8deg)_rotateX(4deg)] hover:lg:[transform:perspective(1200px)_rotateY(0deg)_rotateX(0deg)]">
      {/* Subtle ambient glow behind card */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-teal-500/25 via-indigo-500/20 to-teal-500/25 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

      {/* Translucent Frosted Glass Card */}
      <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-black/50">
        
        {/* Top bar: live indicator & trend pill */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              October Overview
            </span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
            <TrendingDown className="w-3 h-3" />
            <span>8.4% under budget</span>
          </div>
        </div>

        {/* Primary metric summary */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 py-4">
          <div>
            <span className="text-xs text-slate-400">Total Spent</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
              ₹24,850{' '}
              <span className="text-xs font-normal text-slate-500">
                / ₹40,000 budget
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div>
              <span className="block text-[11px] text-slate-500">Remaining</span>
              <span className="font-semibold text-emerald-400">₹15,150</span>
            </div>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="block text-[11px] text-slate-500">Top Spend</span>
              <span className="font-semibold text-slate-200">Food &bull; ₹6,250</span>
            </div>
          </div>
        </div>

        {/* Mini translucent visual previews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3.5 border-t border-slate-800/60">
          
          {/* Weekly activity bars */}
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 block mb-2">
              Weekly Trend
            </span>
            <div className="flex items-end justify-between h-14 gap-2 px-1">
              {[
                { label: 'W1', height: '40%' },
                { label: 'W2', height: '65%' },
                { label: 'W3', height: '48%' },
                { label: 'W4', height: '82%' },
                { label: 'W5', height: '54%' },
              ].map((bar) => (
                <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-sm bg-gradient-to-t from-teal-500/40 to-teal-400"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[9px] text-slate-500 font-medium">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown pills */}
          <div className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3.5 flex flex-col justify-between">
            <span className="text-[11px] font-medium text-slate-400 block mb-1">
              Top Categories
            </span>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Food &amp; Dining</span>
                  <span className="text-slate-400 font-medium">₹6,250</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full w-[65%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Utilities</span>
                  <span className="text-slate-400 font-medium">₹4,200</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full w-[44%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">Entertainment</span>
                  <span className="text-slate-400 font-medium">₹3,150</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full w-[33%]" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
