import React from 'react';
import { Plus, LogOut, TrendingUp } from 'lucide-react';

export default function Navbar({ user, onAddExpense, onLogout, onOpenAuth }) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              Zenith<span className="text-teal-400">Finance</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Python FastAPI &bull; SQLAlchemy &bull; React
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Add Expense Button */}
              <button
                id="btn-add-expense"
                onClick={onAddExpense}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow-md shadow-teal-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1.5">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200 hidden sm:inline">
                  {user.full_name || user.email.split('@')[0]}
                </span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
            >
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
