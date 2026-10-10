import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cpu, Lock, ArrowRight, Sparkles, AlertTriangle, Activity, Database, CheckCircle2 } from 'lucide-react';

export const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 24px' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '90px 20px 70px 20px',
        position: 'relative'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(253, 123, 65, 0.14)',
          border: '1px solid rgba(253, 123, 65, 0.35)',
          color: '#FD7B41',
          padding: '8px 20px',
          borderRadius: '24px',
          fontSize: '0.88rem',
          fontWeight: 700,
          marginBottom: '28px',
          letterSpacing: '0.04em'
        }}>
          <Sparkles size={16} /> ANURAG UNIVERSITY CAMPUS RECOVERY INTELLIGENCE
        </div>

        <h1 style={{ fontSize: '4.2rem', fontWeight: 800, lineHeight: '1.08', marginBottom: '20px' }} className="gradient-text">
          LOSTLINK
        </h1>

        <p style={{ fontSize: '1.65rem', fontWeight: 600, color: 'var(--calcite-peach)', marginBottom: '18px' }}>
          "Find what you lost. Return what you found."
        </p>

        <p style={{ maxWidth: '720px', margin: '0 auto 40px auto', fontSize: '1.12rem', color: 'var(--text-muted)', lineHeight: '1.65' }}>
          An intelligent campus recovery platform for Anurag University. Built to match belongings, verify confidential ownership, and store records directly with MongoDB Atlas &amp; Spring Boot.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/report-lost" className="btn btn-primary" style={{ padding: '15px 32px', fontSize: '1.05rem' }}>
            Report Lost Item <ArrowRight size={18} />
          </Link>
          <Link to="/report-found" className="btn btn-outline-orange" style={{ padding: '15px 32px', fontSize: '1.05rem' }}>
            Report Found Item
          </Link>
          <Link to="/browse" className="btn btn-secondary" style={{ padding: '15px 28px', fontSize: '1.05rem' }}>
            Explore Items
          </Link>
        </div>
      </section>

      {/* Visual Workflow Steps: REPORT -> MATCH -> VERIFY -> RECOVER */}
      <section style={{ margin: '60px 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '36px', letterSpacing: '0.02em' }}>
          INTELLIGENT RECOVERY WORKFLOW
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          position: 'relative'
        }}>
          {[
            { step: '01', title: 'REPORT', icon: '📝', desc: 'Students log lost or found items with public attributes & hidden verification marks.' },
            { step: '02', title: 'MATCH', icon: '⚡', desc: 'Smart Engine calculates multi-attribute similarity scores (0–100%).' },
            { step: '03', title: 'VERIFY', icon: '🔒', desc: 'Private ownership questions verify claims without public exposure.' },
            { step: '04', title: 'RECOVER', icon: '✓', desc: 'Finder approves claim, updating status & earning recovery contribution score.' }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel" style={{
              padding: '28px',
              position: 'relative',
              borderTop: '4px solid var(--calcite-orange)'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--calcite-orange)', letterSpacing: '0.1em' }}>
                STEP {item.step}
              </span>
              <div style={{ fontSize: '2.2rem', margin: '12px 0' }}>{item.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlight Cards */}
      <section style={{ margin: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>Why LostLink is Different</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '8px' }}>
            Built specifically for Anurag University to eliminate false claims and automate campus recovery.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '26px' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <Cpu size={36} color="var(--calcite-orange)" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Smart Match Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Multi-attribute weighted scoring algorithm evaluating category (20%), name (20%), description (25%), color (10%), brand (10%), location (10%), and date (5%).
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <Lock size={36} color="var(--calcite-peach)" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Private Ownership Verification</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Finders keep identifying marks private. Claimants answer mystery questionnaires to verify true ownership before items are released.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <AlertTriangle size={36} color="#F59E0B" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>Fraud &amp; Duplicate Detection</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Rule-based flags for multiple claimants, low verification scores, contradictory answers, and duplicate item report warnings.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <Database size={36} color="#10B981" style={{ marginBottom: '18px' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>MongoDB Atlas Cloud Sync</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Connected directly to MongoDB Atlas cluster for persistence, logging campus audit trails, item documents, and recovery events.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
