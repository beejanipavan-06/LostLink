import React from 'react';
import { Cpu, Tag, MapPin, Calendar, Shield, Sparkles } from 'lucide-react';

export const ItemFingerprintCard = ({ fingerprint }) => {
  if (!fingerprint) return null;

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      borderLeft: '4px solid var(--calcite-orange)',
      background: '#FFFFFF',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--calcite-orange)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--calcite-dark)', letterSpacing: '-0.01em' }}>
            ITEM DIGITAL FINGERPRINT
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', background: 'rgba(253, 123, 65, 0.12)', color: 'var(--calcite-orange)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(253, 123, 65, 0.35)', fontWeight: 700 }}>
          SYSTEM ID #{fingerprint.itemId}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        fontSize: '0.85rem'
      }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Category &amp; Type</div>
          <div style={{ fontWeight: 700, color: 'var(--calcite-dark)', marginTop: '2px' }}>{fingerprint.category} • {fingerprint.itemType}</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Brand &amp; Color</div>
          <div style={{ fontWeight: 700, color: 'var(--calcite-dark)', marginTop: '2px' }}>{fingerprint.brand || 'Generic'} {fingerprint.color ? `(${fingerprint.color})` : ''}</div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Zone &amp; Date</div>
          <div style={{ fontWeight: 700, color: 'var(--calcite-dark)', marginTop: '2px' }}>{fingerprint.location} • {fingerprint.dateReported}</div>
        </div>
      </div>

      {fingerprint.distinctiveFeature && (
        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.84rem', color: 'var(--calcite-dark)' }}>
          <strong style={{ color: 'var(--calcite-orange)' }}>Distinctive Feature:</strong> {fingerprint.distinctiveFeature}
        </div>
      )}
    </div>
  );
};
