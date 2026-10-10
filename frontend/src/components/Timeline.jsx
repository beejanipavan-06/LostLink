import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, AlertCircle, Sparkles, FileText } from 'lucide-react';

export const Timeline = ({ events = [], itemStatus = 'OPEN' }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'ITEM_LOST':
      case 'ITEM_FOUND':
      case 'ITEM_REPORTED':
        return <FileText size={16} color="var(--calcite-orange)" />;
      case 'MATCH_DETECTED':
        return <Sparkles size={16} color="var(--calcite-peach)" />;
      case 'CLAIM_SUBMITTED':
      case 'OWNERSHIP_VERIFIED':
        return <Clock size={16} color="#F59E0B" />;
      case 'CLAIM_APPROVED':
      case 'ITEM_RECOVERED':
        return <CheckCircle2 size={16} color="#10b981" />;
      case 'CLAIM_REJECTED':
        return <AlertCircle size={16} color="#f43f5e" />;
      default:
        return <ShieldCheck size={16} color="var(--calcite-orange)" />;
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Clock size={30} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
        <p style={{ fontSize: '0.9rem' }}>Timeline event tracking initializing...</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '26px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ShieldCheck size={20} color="var(--calcite-orange)" /> ITEM RECOVERY TIMELINE
      </h3>

      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Timeline Connecting Line */}
        <div style={{
          position: 'absolute',
          left: '9px',
          top: '12px',
          bottom: '12px',
          width: '2px',
          background: 'linear-gradient(180deg, var(--calcite-orange) 0%, #10b981 100%)',
          opacity: 0.5
        }} />

        {events.map((evt, idx) => (
          <div key={evt.id || idx} style={{ position: 'relative', marginBottom: idx === events.length - 1 ? 0 : '24px' }}>
            {/* Timeline Dot Icon */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '0px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#272a2e',
              border: '2px solid var(--calcite-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(253, 123, 65, 0.4)'
            }}>
              {getEventIcon(evt.eventType)}
            </div>

            <div style={{ paddingLeft: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                  {evt.eventType.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {evt.createdAt ? new Date(evt.createdAt).toLocaleString() : 'Just now'}
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
