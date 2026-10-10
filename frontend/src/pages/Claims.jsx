import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle2, XCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';

export const Claims = () => {
  const { user } = useAuth();
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/claims/my');
      setMyClaims(response.data || []);
    } catch (err) {
      console.error('Failed to load claims', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleApprove = async (claimId) => {
    setActionLoading(claimId);
    try {
      await api.put(`/claims/${claimId}/approve`);
      fetchClaims();
    } catch (err) {
      alert('Failed to approve claim: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (claimId) => {
    const reason = prompt('Reason for rejection (optional):') || 'Verification answers did not match private records.';
    setActionLoading(claimId);
    try {
      await api.put(`/claims/${claimId}/reject`, { reason });
      fetchClaims();
    } catch (err) {
      alert('Failed to reject claim: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--calcite-dark)' }}>OWNERSHIP VERIFICATION CLAIMS</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Review submitted claims and verify confidential ownership responses.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading verification claims...
        </div>
      ) : myClaims.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Clock size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: 'var(--calcite-dark)' }}>No verification claims found</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>You haven't submitted or received any claims yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {myClaims.map(claim => (
            <div key={claim.id} className="glass-panel" style={{ padding: '24px', borderLeft: claim.status === 'APPROVED' ? '4px solid #10b981' : claim.status === 'REJECTED' ? '4px solid #EF4444' : '4px solid #D97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <span className={`badge ${claim.status === 'APPROVED' ? 'badge-recovered' : claim.status === 'REJECTED' ? 'badge-suspicious' : 'badge-pending'}`}>
                    {claim.status}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--calcite-dark)', marginTop: '6px' }}>
                    Item: {claim.item?.title || `Item #${claim.itemId}`}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Claimant: <strong style={{ color: 'var(--calcite-dark)' }}>{claim.claimantName}</strong> ({claim.claimantEmail})
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Verification Score</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: claim.verificationScore >= 70 ? 'var(--calcite-orange)' : '#D97706' }}>
                    {Math.round(claim.verificationScore)}%
                  </div>
                </div>
              </div>

              {claim.reviewNotes && (
                <div style={{ background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--calcite-dark)', marginBottom: '14px' }}>
                  <strong>Review Notes:</strong> {claim.reviewNotes}
                </div>
              )}

              {/* Approval controls for finder/admin if claim is PENDING */}
              {claim.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => handleApprove(claim.id)}
                    disabled={actionLoading === claim.id}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem', background: '#10b981' }}
                  >
                    <CheckCircle2 size={16} /> Approve Claim &amp; Release Item
                  </button>
                  <button
                    onClick={() => handleReject(claim.id)}
                    disabled={actionLoading === claim.id}
                    className="btn btn-danger"
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    <XCircle size={16} /> Reject Claim
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
