import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function ExpenseModal({ isOpen, onClose, onSave, expenseToEdit }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setAmount(expenseToEdit.amount.toString());
      setCategory(expenseToEdit.category);
      setDate(expenseToEdit.date);
      setNotes(expenseToEdit.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError('');
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      setError('Please fill in title and amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave({
        title: title.trim(),
        amount: parsedAmount,
        category,
        date,
        notes: notes.trim() || null
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
            {expenseToEdit ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: 'var(--accent-rose)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Description / Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Whole Foods Market"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="45.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Food">Food</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Business lunch or personal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (expenseToEdit ? 'Save Changes' : 'Add Expense')}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
