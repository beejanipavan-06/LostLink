import React, { useState } from 'react';
import api from '../services/api';
import { Send, Shield, X, MessageSquare } from 'lucide-react';

export const MessageModal = ({ isOpen, item, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen || !item) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await api.post('/messages', {
        itemId: item.id,
        content: content
      });
      setSent(true);
      setContent('');
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '480px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        background: '#FFFFFF'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <MessageSquare size={24} color="var(--calcite-orange)" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--calcite-dark)' }}>ANONYMOUS CAMPUS CONTACT</h3>
        </div>

        <div style={{
          fontSize: '0.78rem',
          color: '#D97706',
          background: 'rgba(253, 123, 65, 0.1)',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Shield size={14} /> Personal email &amp; phone numbers remain hidden until claim is approved.
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ color: '#059669', fontWeight: 700, marginBottom: '12px' }}>Message sent securely to finder!</p>
            <button onClick={() => { setSent(false); onClose(); }} className="btn btn-secondary">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--calcite-dark)', marginBottom: '6px' }}>
                Message to Reporter of "{item.title}":
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Hello, I believe this is my item. I have submitted ownership verification details..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  color: 'var(--calcite-dark)',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
              <Send size={16} /> {loading ? 'Sending...' : 'Send Anonymous Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
