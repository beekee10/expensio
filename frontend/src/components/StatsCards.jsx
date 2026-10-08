import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, PiggyBank } from 'lucide-react';

export default function StatsCards({ summary }) {
  const totalSpent = summary?.total_spent ?? 0;
  const monthlySpent = summary?.monthly_spent ?? 0;
  const budgetRemaining = summary?.budget_remaining ?? 0;
  const monthlyBudget = summary?.monthly_budget ?? 2000;

  const budgetUsagePercent = Math.min(100, Math.round((monthlySpent / monthlyBudget) * 100));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      margin: '28px 0'
    }}>
      
      {/* Total Balance / All-time Card */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              All-Time Spending
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 0 0', letterSpacing: '-0.03em' }}>
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.12)',
            color: 'var(--accent-cyan)'
          }}>
            <Wallet size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--accent-emerald)',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <ArrowUpRight size={14} /> Active
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Tracked across {summary?.transaction_count ?? 0} transactions
          </span>
        </div>
      </div>

      {/* Monthly Spending Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              This Month's Spending
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 0 0', letterSpacing: '-0.03em' }}>
              ${monthlySpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--accent-indigo)'
          }}>
            <CreditCard size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: budgetUsagePercent > 80 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(6, 182, 212, 0.12)',
            color: budgetUsagePercent > 80 ? 'var(--accent-rose)' : 'var(--accent-cyan)',
            fontWeight: 700
          }}>
            {budgetUsagePercent}% of budget
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Target: ${monthlyBudget}
          </span>
        </div>
      </div>

      {/* Remaining Budget Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Remaining Budget
            </span>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 800, 
              margin: '8px 0 0 0', 
              letterSpacing: '-0.03em',
              color: budgetRemaining < 200 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
            }}>
              ${budgetRemaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div style={{
            padding: '10px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--accent-emerald)'
          }}>
            <PiggyBank size={22} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px' }}>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-secondary)',
            fontWeight: 700
          }}>
            Safe to spend
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Resetting in next billing cycle
          </span>
        </div>
      </div>

    </div>
  );
}
