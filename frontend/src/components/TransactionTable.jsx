import React from 'react';
import { Search, Filter, Trash2, Edit2 } from 'lucide-react';

const categoryBadges = {
  Food: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  Utilities: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Entertainment: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Subscriptions: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Other: 'bg-slate-700/30 text-slate-300 border-slate-700'
};

export default function TransactionTable({
  expenses,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onEdit,
  onDelete
}) {
  const categories = ['All', 'Food', 'Utilities', 'Entertainment', 'Subscriptions', 'Other'];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg mb-10">
      
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-800 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {(!expenses || expenses.length === 0) ? (
        <div className="text-center py-10 text-slate-500 text-sm italic">
          No transactions found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {expenses.map((item) => {
                const badgeStyle = categoryBadges[item.category] || categoryBadges.Other;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {item.date}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeStyle}`}>
                        {item.category}
                      </span>
                    </td>

                    {/* Title & Notes */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-100">{item.title}</div>
                      {item.notes && (
                        <div className="text-xs text-slate-500">{item.notes}</div>
                      )}
                    </td>

                    {/* Amount in Rupees */}
                    <td className="py-3.5 px-4 text-right font-bold text-rose-400 whitespace-nowrap">
                      -₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          title="Edit"
                          className="p-1.5 text-slate-400 hover:text-teal-400 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
