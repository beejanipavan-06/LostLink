import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const isAnuragEmail = (val) => val.trim().toLowerCase().endsWith('@anurag.edu.in');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAnuragEmail(email)) {
      return setError("Invalid Email Domain: Only Anurag University email addresses ending with '@anurag.edu.in' are authorized (e.g. xxxx@anurag.edu.in).");
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'student1') {
      setEmail('student1@anurag.edu.in');
      setPassword('password');
    } else if (type === 'student2') {
      setEmail('student2@anurag.edu.in');
      setPassword('password');
    } else if (type === 'user_custom') {
      setEmail('24eg106c47@anurag.edu.in');
      setPassword('password');
    } else if (type === 'admin') {
      setEmail('admin@anurag.edu.in');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ maxWidth: '460px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderTop: '4px solid var(--calcite-orange)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--calcite-orange), var(--calcite-dark))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 0 20px rgba(253, 123, 65, 0.4)'
          }}>
            <GraduationCap size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>Anurag University Sign In</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Access LostLink campus intelligence platform
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f87171',
            padding: '14px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            lineHeight: '1.5'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 600 }}>
                University Email Address
              </label>
              {email && (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isAnuragEmail(email) ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isAnuragEmail(email) ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {isAnuragEmail(email) ? 'Valid @anurag.edu.in' : 'Must end with @anurag.edu.in'}
                </span>
              )}
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="xyz@anurag.edu.in"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(30, 33, 36, 0.8)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.92rem',
                transition: 'all 0.2s ease'
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px', display: 'block' }}>
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 600 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(30, 33, 36, 0.8)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '0.98rem' }}>
            <LogIn size={18} /> {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', fontWeight: 700 }}>
            Quick Anurag Demo Accounts:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button type="button" onClick={() => handleDemoFill('student1')} className="btn btn-secondary" style={{ padding: '7px 8px', fontSize: '0.75rem' }}>
              Student 1
            </button>
            <button type="button" onClick={() => handleDemoFill('student2')} className="btn btn-secondary" style={{ padding: '7px 8px', fontSize: '0.75rem' }}>
              Student 2
            </button>
            <button type="button" onClick={() => handleDemoFill('user_custom')} className="btn btn-secondary" style={{ padding: '7px 8px', fontSize: '0.75rem', color: 'var(--calcite-peach)' }}>
              Student 3
            </button>
            <button type="button" onClick={() => handleDemoFill('admin')} className="btn btn-secondary" style={{ padding: '7px 8px', fontSize: '0.75rem', color: 'var(--calcite-orange)' }}>
              Campus Admin
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--calcite-orange)', fontWeight: 700 }}>Register Account</Link>
        </p>
      </div>
    </div>
  );
};
