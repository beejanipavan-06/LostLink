import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShieldCheck, HelpCircle, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export const VerificationModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && item) {
      setLoading(true);
      setError('');
      setResult(null);
      api.get(`/claims/verification-questions/${item.id}`)
        .then(res => {
          setQuestions(res.data.questions || []);
          const initial = {};
          (res.data.questions || []).forEach(q => { initial[q] = ''; });
          setAnswers(initial);
        })
        .catch(err => setError('Failed to load verification questions'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const handleInputChange = (question, value) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post('/claims', {
        itemId: item.id,
        answers: answers
      });
      setResult(response.data);
      if (onSuccess) onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ownership claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(60, 64, 68, 0.45)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '36px',
        position: 'relative',
        background: '#FFFFFF',
        boxShadow: '0 20px 50px rgba(60, 64, 68, 0.15)',
        border: '1px solid var(--calcite-orange)'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}>
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldCheck size={26} color="var(--calcite-orange)" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--calcite-dark)' }}>PRIVACY OWNERSHIP VERIFICATION</h2>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
          Claiming <strong style={{ color: 'var(--calcite-orange)' }}>"{item.title}"</strong>. Answer the mystery verification questions below. Identifying private marks are hidden from public view and compared confidentially.
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#DC2626', padding: '14px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.86rem' }}>
            <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {error}
          </div>
        )}

        {result ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={38} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.45rem', color: 'var(--calcite-dark)', fontWeight: 800 }}>Claim Verification Submitted!</h3>
            
            <div style={{
              margin: '22px 0',
              padding: '18px',
              background: 'rgba(253, 123, 65, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(253, 123, 65, 0.25)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ownership Verification Confidence
              </div>
              <div style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--calcite-orange)', margin: '4px 0' }}>
                {Math.round(result.verificationScore)}%
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--calcite-dark)' }}>
                Status: <strong style={{ color: '#D97706' }}>PENDING REVIEW</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '26px' }}>
              Your verification responses have been logged. The item finder or campus administrator will review and confirm final item release.
            </p>

            <button onClick={onClose} className="btn btn-primary" style={{ width: '100%' }}>
              Close &amp; Track Claim
            </button>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
            Generating dynamic verification questions...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--calcite-dark)', marginBottom: '8px' }}>
                  <HelpCircle size={15} color="var(--calcite-orange)" style={{ display: 'inline', marginRight: '6px' }} />
                  {q}
                </label>
                <textarea
                  required
                  rows={2}
                  value={answers[q] || ''}
                  onChange={(e) => handleInputChange(q, e.target.value)}
                  placeholder="Provide precise details (e.g. sticker inside front pocket, blue keychain attached, broken zipper...)"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-color)',
                    color: 'var(--calcite-dark)',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            ))}

            <div style={{ marginTop: '26px', display: 'flex', gap: '14px' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                {submitting ? 'Evaluating Score...' : 'Submit Verification Answers'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
