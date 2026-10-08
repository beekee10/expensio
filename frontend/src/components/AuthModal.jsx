import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { authService } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await authService.register(email, password, fullName);
      } else {
        await authService.login(email, password);
      }
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Try logging into demo account, or auto-create it if it doesn't exist yet
      try {
        await authService.login('demo@zenith.com', 'password123');
      } catch {
        await authService.register('demo@zenith.com', 'password123', 'Demo Interviewer');
      }
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError('Could not connect to backend server. Make sure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>
              {isRegister ? 'Create an Account' : 'Welcome Back'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {isRegister ? 'Sign up to start tracking expenses with Python FastAPI' : 'Sign in to access your financial dashboard'}
            </p>
          </div>
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

        {/* Demo Account Quick Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          style={{
            width: '100%',
            marginBottom: '20px',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.12)'}
        >
          <Sparkles size={16} /> 1-Click Demo Interviewer Login
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or with credentials</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
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

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </button>
        </div>

      </div>
    </div>
  );
}
