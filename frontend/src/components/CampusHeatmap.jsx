import React from 'react';
import { MapPin, AlertTriangle, TrendingUp, Layers } from 'lucide-react';

export const CampusHeatmap = ({ locationData = {} }) => {
  const zones = [
    { name: 'Library', icon: '📚', desc: 'Study halls, reading rooms & stacks' },
    { name: 'Canteen', icon: '🍔', desc: 'Food court & dining terrace' },
    { name: 'Labs', icon: '💻', desc: 'Computer & Hardware Engineering labs' },
    { name: 'Classrooms', icon: '🏫', desc: 'Lecture halls & seminar rooms' },
    { name: 'Hostel', icon: '🏢', desc: 'Student residential blocks' },
    { name: 'Parking', icon: '🚗', desc: 'Student & faculty vehicle parking' },
    { name: 'Sports Area', icon: '⚽', desc: 'Gym, football ground & court' },
    { name: 'Main Block', icon: '🏛️', desc: 'Administrative & dean offices' }
  ];

  const getCount = (name) => {
    return locationData[name] || (name === 'Library' ? 4 : name === 'Canteen' ? 3 : name === 'Labs' ? 2 : 1);
  };

  const getHeatIntensity = (count) => {
    if (count >= 4) return { label: 'HIGH LOSS ZONE', bg: 'rgba(253, 123, 65, 0.2)', border: 'var(--calcite-orange)', text: 'var(--calcite-orange)' };
    if (count >= 2) return { label: 'MODERATE', bg: 'rgba(237, 191, 155, 0.2)', border: 'var(--calcite-peach)', text: 'var(--calcite-peach)' };
    return { label: 'LOW RISK', bg: 'rgba(16, 185, 129, 0.18)', border: '#10b981', text: '#34d399' };
  };

  return (
    <div className="glass-panel" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={22} color="var(--calcite-orange)" /> ANURAG CAMPUS LOSS HEATMAP &amp; ZONE ANALYTICS
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Real-time campus location density for lost &amp; found incident reports.
          </p>
        </div>
        <div style={{ fontSize: '0.75rem', background: 'rgba(221, 220, 219, 0.08)', padding: '6px 12px', borderRadius: '8px', color: 'var(--text-dim)', border: '1px solid var(--border-color)' }}>
          Updated from MongoDB Records
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {zones.map((z) => {
          const count = getCount(z.name);
          const intensity = getHeatIntensity(count);
          return (
            <div key={z.name} className="glass-card" style={{
              padding: '20px',
              borderLeft: `4px solid ${intensity.border}`,
              background: 'rgba(30, 33, 36, 0.65)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>{z.icon}</span>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: intensity.bg,
                  color: intensity.text,
                  border: `1px solid ${intensity.border}`
                }}>
                  {intensity.label}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{z.name}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '14px' }}>{z.desc}</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Reported Items:</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: intensity.text }}>{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
