import React from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';

export const DuplicateCheckModal = ({ isOpen, duplicateData, onConfirm, onCancel }) => {
  if (!isOpen || !duplicateData || !duplicateData.existingMatches) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(60, 64, 68, 0.4)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        background: '#FFFFFF',
        border: '1px solid var(--border-highlight)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#D97706', marginBottom: '14px' }}>
          <AlertTriangle size={26} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--calcite-dark)' }}>POSSIBLE DUPLICATE REPORT DETECTED</h3>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          LostLink Smart Engine found similar active reports on campus.
          Score: <strong style={{ color: '#D97706' }}>{Math.round(duplicateData.highestSimilarityScore)}% similarity</strong>.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {duplicateData.existingMatches.map((m, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-secondary)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--calcite-dark)' }}>{m.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location: {m.location}</div>
              </div>
              <span className="badge badge-pending">
                {Math.round(m.similarityScore)}% SIMILAR
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Check existing reports to see if your item was already found before creating a new report.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>
            View Existing Reports
          </button>
          <button onClick={onConfirm} className="btn btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            Continue Submitting
          </button>
        </div>
      </div>
    </div>
  );
};
