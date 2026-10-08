import React from 'react';
import { Search, Filter, Trash2, Edit2 } from 'lucide-react';

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

  const getBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return 'badge badge-food';
      case 'utilities': return 'badge badge-utilities';
      case 'entertainment': return 'badge badge-entertainment';
      case 'subscriptions': return 'badge badge-subscriptions';
      default: return 'badge badge-other';
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '40px' }}>
      
      {/* Table Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
          Recent Transactions
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px' }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ height: '38px', minWidth: '130px' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {(!expenses || expenses.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.95rem' }}>No transactions found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Description</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr 
                  key={item.id} 
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {item.date}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={getBadgeClass(item.category)}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    <div>{item.title}</div>
                    {item.notes && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        {item.notes}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--accent-rose)' }}>
                    -${item.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => onEdit(item)}
                        title="Edit expense"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          transition: 'color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        title="Delete expense"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          transition: 'color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
