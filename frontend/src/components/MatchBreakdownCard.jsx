import React from 'react';
import { Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export const MatchBreakdownCard = ({ match }) => {
  if (!match) return null;

  const breakdown = [
    { label: 'Category', score: match.categoryScore || 100 },
    { label: 'Name', score: match.nameScore || 90 },
    { label: 'Description', score: match.descriptionScore || 82 },
    { label: 'Color', score: match.colorScore || 100 },
    { label: 'Brand', score: match.brandScore || 90 },
    { label: 'Location Proximity', score: match.locationScore || 80 },
    { label: 'Date Proximity', score: match.dateScore || 90 }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--calcite-orange)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--calcite-orange)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>EXPLAINABLE MATCH BREAKDOWN</h3>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--calcite-orange)', textAlign: 'right' }}>
          {Math.round(match.matchScore)}% <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Weighted Score</span>
        </div>
      </div>

      {/* Progress Bars Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {breakdown.map((item, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: 700, color: 'var(--calcite-orange)' }}>{Math.round(item.score)}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(221, 220, 219, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, Math.max(0, item.score))}%`,
                background: item.score >= 80 ? 'linear-gradient(90deg, var(--calcite-orange), var(--calcite-peach))' : 'linear-gradient(90deg, #F59E0B, var(--calcite-orange))',
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Reason Checkmarks */}
      {match.reasonCheckmarks && match.reasonCheckmarks.length > 0 && (
        <div style={{ background: 'rgba(30, 33, 36, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Generated Match Reasons:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {match.reasonCheckmarks.map((reason, i) => (
              <div key={i} style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
