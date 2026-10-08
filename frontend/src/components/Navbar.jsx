import React from 'react';
import { Plus, LogOut, TrendingUp, ShieldCheck } from 'lucide-react';

export default function Navbar({ user, onAddExpense, onLogout, onOpenAuth }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--card-border)',
      background: 'rgba(11, 15, 25, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 0'
    }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-cyan)'
          }}>
            <TrendingUp size={20} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Zenith<span style={{ color: 'var(--accent-cyan)' }}>Finance</span>
            </h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em' }}>
              FASTAPI &bull; SQLALCHEMY &bull; REACT
            </span>
          </div>
        </div>

        {/* Actions / User profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <button 
                id="btn-add-expense"
                className="btn btn-primary" 
                onClick={onAddExpense}
              >
                <Plus size={18} strokeWidth={2.5} />
                Add Expense
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px',
                borderRadius: '30px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--card-border)'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-indigo)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.full_name || user.email.split('@')[0]}
                </span>
                <button 
                  onClick={onLogout}
                  title="Sign Out"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    marginLeft: '4px'
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
