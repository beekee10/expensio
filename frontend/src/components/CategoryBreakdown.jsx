import React from 'react';
import { Utensils, Zap, Film, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

const categoryConfig = {
  Food: { icon: Utensils, color: '#06b6d4' },
  Utilities: { icon: Zap, color: '#6366f1' },
  Entertainment: { icon: Film, color: '#8b5cf6' },
  Subscriptions: { icon: RefreshCw, color: '#f59e0b' },
  Other: { icon: Layers, color: '#94a3b8' }
};

export default function CategoryBreakdown({ categories, summary }) {
  const monthlySpent = summary?.monthly_spent ?? 0;
  const monthlyBudget = summary?.monthly_budget ?? 2000;
  const savingsProgress = Math.max(0, Math.min(100, Math.round(((monthlyBudget - monthlySpent) / monthlyBudget) * 100)));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
      gap: '20px',
      marginBottom: '28px'
    }}>
      
      {/* Spending by Category Card */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
          Spending by Category
        </h3>

        {(!categories || categories.length === 0) ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
            No expense data yet. Click "+ Add Expense" to begin tracking.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map((cat) => {
              const config = categoryConfig[cat.category] || categoryConfig.Other;
              const Icon = config.icon;

              return (
                <div key={cat.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        padding: '6px',
                        borderRadius: '8px',
                        background: `${config.color}20`,
                        color: config.color,
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <Icon size={16} />
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{cat.category}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                        ${cat.total_amount.toFixed(2)}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, cat.percentage)}%`,
                      height: '100%',
                      background: config.color,
                      borderRadius: '4px',
                      transition: 'width 0.4s ease-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Budget & Savings Progress Meter Card */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
            Monthly Budget Health
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Remaining discretionary spending buffer for current month
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 0'
          }}>
            <div style={{
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: `conic-gradient(var(--accent-cyan) ${savingsProgress * 3.6}deg, rgba(255, 255, 255, 0.06) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)'
            }}>
              <div style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: '#131c2e',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {savingsProgress}%
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Buffer Left
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--card-border)'
        }}>
          <CheckCircle2 size={18} color="var(--accent-emerald)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Spent <strong>${monthlySpent}</strong> out of your <strong>${monthlyBudget}</strong> monthly target.
          </span>
        </div>
      </div>

    </div>
  );
}
