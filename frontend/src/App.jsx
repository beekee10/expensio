import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import CategoryBreakdown from './components/CategoryBreakdown';
import TransactionTable from './components/TransactionTable';
import ExpenseModal from './components/ExpenseModal';
import AuthModal from './components/AuthModal';
import { authService, expenseService } from './api';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(authService.getUser());
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getUser());
    };
    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, user]);

  // Handle Create / Update Expense
  const handleSaveExpense = async (expenseData) => {
    if (expenseToEdit) {
      await expenseService.updateExpense(expenseToEdit.id, expenseData);
    } else {
      await expenseService.createExpense(expenseData);
    }
    fetchDashboardData();
  };

  // Handle Delete Expense
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

  // Auto-seed sample demo data for new accounts
  const handleSeedDemoData = async () => {
    const samples = [
      { title: 'Whole Foods Market', amount: 115.30, category: 'Food', date: '2026-10-06', notes: 'Weekly groceries' },
      { title: 'Electricity Bill', amount: 210.50, category: 'Utilities', date: '2026-10-05', notes: 'Monthly utility provider' },
      { title: 'Movie Tickets & Snacks', amount: 45.00, category: 'Entertainment', date: '2026-10-04', notes: 'Weekend cinema' },
      { title: 'Netflix & Spotify Premium', amount: 29.99, category: 'Subscriptions', date: '2026-10-03', notes: 'Digital entertainment' },
      { title: 'Specialty Coffee', amount: 7.50, category: 'Food', date: '2026-10-02', notes: 'Morning roast' },
      { title: 'Internet Fiber Connection', amount: 80.00, category: 'Utilities', date: '2026-10-01', notes: 'Gigabit fiber optic' }
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation */}
      <Navbar
        user={user}
        onAddExpense={() => { setExpenseToEdit(null); setIsExpenseModalOpen(true); }}
        onLogout={() => authService.logout()}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content */}
      <main className="app-container" style={{ flex: 1, paddingBottom: '60px' }}>
        
        {!user ? (
          /* Unauthenticated Landing State */
          <div style={{
            textAlign: 'center',
            padding: '100px 20px',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '24px'
            }}>
              <Sparkles size={16} /> Python Developer Full-Stack Portfolio
            </div>

            <h2 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '20px' }}>
              High-Velocity Wealth &amp; <span style={{ color: 'var(--accent-cyan)' }}>Expense Analytics</span>
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '36px' }}>
              An interview-grade full-stack architecture powered by <strong>FastAPI</strong>, <strong>SQLAlchemy 2.0</strong>, <strong>Alembic</strong>, and <strong>React</strong>. Engineered with strict Pydantic schemas and automated <code>pytest</code> coverage.
            </p>

            <button
              className="btn btn-primary"
              style={{ fontSize: '1.05rem', padding: '14px 32px' }}
              onClick={() => setIsAuthModalOpen(true)}
            >
              Explore Live Dashboard <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <>
            {/* Quick Demo Seed Banner (if no transactions exist yet) */}
            {expenses.length === 0 && !loading && (
              <div style={{
                marginTop: '24px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <strong style={{ color: '#c7d2fe' }}>Start with sample data:</strong>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginLeft: '8px' }}>
                    Populate 6 realistic financial transactions in 1 click to preview charts and metrics.
                  </span>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={handleSeedDemoData}
                  style={{ background: '#4f46e5', borderColor: '#6366f1', color: '#ffffff' }}
                >
                  <Sparkles size={16} /> Load Sample Transactions
                </button>
              </div>
            )}

            {/* 1. Top KPI Summary Cards */}
            <StatsCards summary={summary} />

            {/* 2. Middle Section: Category Breakdown & Savings Progress */}
            <CategoryBreakdown categories={summary?.categories || []} summary={summary} />

            {/* 3. Bottom Section: Searchable & Filterable Transactions Table */}
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

      {/* Modals */}
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

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--card-border)',
        padding: '24px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        background: 'rgba(11, 15, 25, 0.6)'
      }}>
        <div className="app-container">
          <p>
            Zenith Finance &bull; Full-Stack Python REST Engine &bull; Built with FastAPI, SQLAlchemy 2.0, Pydantic, SQLite/PostgreSQL &amp; React
          </p>
        </div>
      </footer>

    </div>
  );
}
