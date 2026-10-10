import React from 'react';
import { ShieldCheck, Cpu, Lock, MapPin, CheckCircle2, Database } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: '80px',
      borderTop: '1px solid var(--border-color)',
      background: 'var(--bg-secondary)',
      padding: '48px 32px 28px 32px',
      color: 'var(--text-muted)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '36px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <ShieldCheck size={26} color="var(--c-amber)" />
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>LOST<span style={{ color: 'var(--c-amber)' }}>LINK</span></span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.65', color: 'var(--text-muted)' }}>
            Smart Campus Recovery &amp; Lost-and-Found Intelligence System. Built with multi-attribute weighted matching, privacy-preserving ownership verification, and live MongoDB Atlas integration.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '14px', fontSize: '0.98rem', fontWeight: 700 }}>Core Intelligence Engine</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={15} color="var(--c-amber)" /> Multi-Attribute Smart Match Algorithm (0–100%)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={15} color="var(--c-bronze)" /> Privacy-Preserving Ownership Verification</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={15} color="var(--c-amber)" /> Fraud &amp; Duplicate Claim Prevention</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Database size={15} color="var(--c-peach)" /> MongoDB Atlas + Spring Boot 3 + React Architecture</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: '14px', fontSize: '0.98rem', fontWeight: 700 }}>Anurag University Access</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.65', color: 'var(--text-muted)' }}>
            All campus members must register and login using their official university email address (<strong style={{ color: 'var(--c-amber)' }}>xxxx@anurag.edu.in</strong>).
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '36px auto 0 auto',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.8rem',
        color: 'var(--text-dim)'
      }}>
        <span>&copy; 2026 LostLink — Intelligence Platform. All rights reserved.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-amber)', fontWeight: 600 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--c-amber)', display: 'inline-block' }}></span>        </span>
      </div>
    </footer>
  );
};
