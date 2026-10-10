import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdminClaims = () => {
  const [claims, setClaims] = useState([]);
  const [suspicious, setSuspicious] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [claimsRes, suspRes] = await Promise.all([
        api.get('/admin/claims'),
        api.get('/admin/suspicious')
      ]);
      setClaims(claimsRes.data || []);
      setSuspicious(suspRes.data || []);
    } catch (err) {
      console.error('Failed to load admin claims & suspicious activity', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveSuspicious = async (id, status) => {
    try {
      await api.put(`/admin/suspicious/${id}/resolve`, { status });
      fetchData();
    } catch (err) {
      alert('Failed to resolve flag');
    }
  };

  const handleApproveClaim = async (claimId) => {
    try {
      await api.put(`/claims/${claimId}/approve`);
      fetchData();
    } catch (err) {
      alert('Failed to approve claim');
    }
  };

  const handleRejectClaim = async (claimId) => {
    const reason = prompt('Reason for rejection:') || 'Rejected by Admin review.';
    try {
      await api.put(`/claims/${claimId}/reject`, { reason });
      fetchData();
    } catch (err) {
      alert('Failed to reject claim');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>ADMIN MODERATION &amp; FRAUD CONTROL</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Review rule-based suspicious claim flags, multi-claimant disputes, and system-wide verification claims.
        </p>
      </div>

      {/* Flagged Suspicious Claims Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={22} color="#f87171" /> FLAGGED SUSPICIOUS ACTIVITIES ({suspicious.length})
        </h2>

        {loading ? (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Loading flags...</div>
        ) : suspicious.length === 0 ? (
          <div className="glass-panel" style={{ padding: '24px', color: '#34d399', fontSize: '0.9rem' }}>
            ✓ No active suspicious claim flags detected. System integrity clear.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {suspicious.map(item => (
              <div key={item.id} className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="badge badge-suspicious">⚠ SUSPICIOUS CLAIM FLAG</span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                      Item #{item.itemId} • Claimant User #{item.userId}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#f87171', marginTop: '4px', fontWeight: 600 }}>
                      Reason: {item.reason}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleResolveSuspicious(item.id, 'REVIEWED')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      Mark Reviewed
                    </button>
                    <button onClick={() => handleResolveSuspicious(item.id, 'DISMISSED')} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                      Dismiss Flag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All System Claims Table */}
      <section>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
          All System Verification Claims ({claims.length})
        </h2>

        {claims.length === 0 ? (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No claims found.</div>
        ) : (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textTransform: 'uppercase', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Claim ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Item</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Claimant</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Score</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>#{c.id}</td>
                    <td style={{ padding: '12px' }}>{c.item?.title || `Item #${c.itemId}`}</td>
                    <td style={{ padding: '12px' }}>{c.claimantName} ({c.claimantEmail})</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 800, color: c.verificationScore >= 70 ? '#48cae4' : '#f59e0b' }}>
                      {Math.round(c.verificationScore)}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className={`badge ${c.status === 'APPROVED' ? 'badge-recovered' : c.status === 'REJECTED' ? 'badge-suspicious' : 'badge-pending'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {c.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleApproveClaim(c.id)} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#10b981' }}>
                            Approve
                          </button>
                          <button onClick={() => handleRejectClaim(c.id)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
