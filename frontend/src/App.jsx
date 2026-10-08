import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import CategoryBreakdown from './components/CategoryBreakdown';
import TransactionTable from './components/TransactionTable';
import ExpenseModal from './components/ExpenseModal';
import AuthModal from './components/AuthModal';
import DashboardPreview from './components/DashboardPreview';
import { authService, expenseService } from './api';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(authService.getUser());
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search and Category filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal open/close state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Fetch dashboard metrics and list of expenses
  const fetchDashboardData = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setSummary(null);
      setExpenses([]);
      return;
    }

    setLoading(true);
    try {
      const summaryData = await expenseService.getDashboardSummary();
      setSummary(summaryData);

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const expenseList = await expenseService.getExpenses(params);
      setExpenses(expenseList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  // Listen for login/logout changes
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getUser());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  // Reload data when filters or user changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, user]);

  // Create or Update Expense
  const handleSaveExpense = async (expenseData) => {
    if (expenseToEdit) {
      await expenseService.updateExpense(expenseToEdit.id, expenseData);
    } else {
      await expenseService.createExpense(expenseData);
    }
    fetchDashboardData();
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        fetchDashboardData();
      } catch (err) {
        alert('Failed to delete expense: ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  // Update user's personal monthly budget limit
  const handleUpdateBudget = async (newBudget) => {
    try {
      await authService.updateBudget(newBudget);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update monthly budget: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Pre-fill realistic Indian Rupee (₹) sample transactions for new accounts
  const handleSeedDemoData = async () => {
    const samples = [
      { title: 'Swiggy Food Delivery', amount: 480.00, category: 'Food', date: '2026-10-06', notes: 'Dinner with friends' },
      { title: 'Electricity & Water Bill', amount: 2450.00, category: 'Utilities', date: '2026-10-05', notes: 'Monthly utility bill' },
      { title: 'PVR Cinema & Popcorn', amount: 850.00, category: 'Entertainment', date: '2026-10-04', notes: 'Weekend movie' },
      { title: 'Netflix & Spotify Premium', amount: 699.00, category: 'Subscriptions', date: '2026-10-03', notes: 'Monthly streaming pack' },
      { title: 'Chai & Snacks at Cafe', amount: 150.00, category: 'Food', date: '2026-10-02', notes: 'Evening tea break' },
      { title: 'Airtel Broadband Wi-Fi', amount: 999.00, category: 'Utilities', date: '2026-10-01', notes: 'Fiber high-speed internet' }
    ];

    try {
      for (const sample of samples) {
        await expenseService.createExpense(sample);
      }
      fetchDashboardData();
    } catch (err) {
      alert('Could not populate demo transactions: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* 1. Header Navigation */}
      <Navbar
        user={user}
        onAddExpense={() => { setExpenseToEdit(null); setIsExpenseModalOpen(true); }}
        onLogout={() => authService.logout()}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* 2. Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {!user ? (
          /* Unauthenticated Landing State */
          <div className="py-10 sm:py-16 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Hero Text & Action */}
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold mb-6">
                  <Sparkles className="w-4 h-4" /> Expensio
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                  Personal Wealth &amp; <span className="text-teal-400">Expense Tracker</span>
                </h2>
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                  Track your everyday expenses, understand your spending habits,
                  and stay in control of your finances.
                </p>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-base px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-teal-500/20"
                >
                  Start Tracking <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Right Column: Sideways 3D Tilted Card */}
              <div className="w-full">
                <DashboardPreview />
              </div>

            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <>
            {/* Quick Demo Seed Banner for empty accounts */}
            {expenses.length === 0 && !loading && (
              <div className="mb-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-indigo-300">
                    Your account is empty!
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click to load 6 realistic sample transactions in Rupees (₹) to preview your graphs.
                  </p>
                </div>
                <button
                  onClick={handleSeedDemoData}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample Transactions
                </button>
              </div>
            )}

            {/* Top KPI Summary Cards */}
            <StatsCards summary={summary} onUpdateBudget={handleUpdateBudget} />

            {/* Category Breakdown & Budget Health */}
            <CategoryBreakdown categories={summary?.categories || []} summary={summary} />

            {/* Transactions Table with Search & Filter */}
            <TransactionTable
              expenses={expenses}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onEdit={(item) => { setExpenseToEdit(item); setIsExpenseModalOpen(true); }}
              onDelete={handleDeleteExpense}
            />
          </>
        )}

      </main>

      {/* 3. Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        expenseToEdit={expenseToEdit}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={fetchDashboardData}
      />

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          Zenith Finance &bull; Python FastAPI &bull; SQLAlchemy &bull; React &bull; Tailwind CSS
        </p>
      </footer>

    </div>
  );
}
