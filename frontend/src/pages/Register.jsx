import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserPlus, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';

export const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const isAnuragEmail = (val) => val.trim().toLowerCase().endsWith('@anurag.edu.in');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAnuragEmail(email)) {
      return setError("Invalid University Email: Only Anurag University email addresses (@anurag.edu.in) are permitted to register (e.g. xxxx@anurag.edu.in).");
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setError('');
    setLoading(true);

    try {
      await register(fullName, email, studentId, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px', borderTop: '4px solid var(--calcite-orange)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>Create Anurag Account</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Register with your @anurag.edu.in university email ID
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
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 600 }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder=""
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(30, 33, 36, 0.8)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.92rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.86rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Anurag Email
                </label>
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(30, 33, 36, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
              {email && (
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isAnuragEmail(email) ? '#34d399' : '#f87171', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {isAnuragEmail(email) ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {isAnuragEmail(email) ? 'Valid @anurag.edu.in' : 'Must end with @anurag.edu.in'}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 600 }}>
                Student ID / Roll No
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder=""
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(30, 33, 36, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
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
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(30, 33, 36, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 600 }}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  background: 'rgba(30, 33, 36, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.86rem', color: 'var(--text-main)', marginBottom: '6px', fontWeight: 600 }}>
              Campus Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(30, 33, 36, 0.8)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            >
              <option value="STUDENT">STUDENT</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '0.98rem' }}>
            <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Register Anurag Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--calcite-orange)', fontWeight: 700 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};
