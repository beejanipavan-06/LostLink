import React from 'react';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export const RecoveryOutlookCard = ({ outlook }) => {
  if (!outlook) return null;

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      borderLeft: '4px solid #10b981',
      background: '#FFFFFF'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="#10b981" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--calcite-dark)' }}>RECOVERY OUTLOOK INDICATOR</h3>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#059669', background: 'rgba(16, 185, 129, 0.12)', padding: '3px 8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: 700 }}>
          SYSTEM ESTIMATE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '14px' }}>
        <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#059669' }}>
          {Math.round(outlook.recoveryProbability)}%
        </span>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--calcite-dark)' }}>
          {outlook.outlookText}
        </span>
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>
        Positive Recovery Factors:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {(outlook.positiveFactors || []).map((factor, i) => (
          <div key={i} style={{ fontSize: '0.84rem', color: 'var(--calcite-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#10b981" /> {factor}
          </div>
        ))}
      </div>
    </div>
  );
};
