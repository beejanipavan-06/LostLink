import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Bell, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {}
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>ANURAG CAMPUS NOTIFICATIONS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Real-time alerts for smart matches, verification updates &amp; claims.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Bell size={40} color="var(--text-dim)" style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#ffffff' }}>No notifications yet</h3>
          <p style={{ fontSize: '0.88rem', marginTop: '6px' }}>You will receive updates when potential matches or claims occur.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map(n => (
            <div key={n.id} className="glass-card" style={{
              padding: '20px',
              borderLeft: n.read ? '3px solid var(--border-color)' : '3px solid var(--calcite-orange)',
              opacity: n.read ? 0.8 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={18} color="var(--calcite-orange)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{n.title}</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                </span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: '10px 0 14px 0' }}>{n.message}</p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {n.link ? (
                  <Link to={n.link} onClick={() => handleMarkAsRead(n.id)} style={{ fontSize: '0.85rem', color: 'var(--calcite-peach)', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                    View details <ArrowRight size={14} />
                  </Link>
                ) : <div />}

                {!n.read && (
                  <button onClick={() => handleMarkAsRead(n.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
