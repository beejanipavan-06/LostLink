import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, PlusCircle, Search, Layers, Clock, CheckCircle2, Star, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, claimsRes] = await Promise.all([
          api.get('/items/my'),
          api.get('/claims/my')
        ]);
        setUserItems(itemsRes.data || []);
        setUserClaims(claimsRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lostItems = userItems.filter(i => i.type === 'LOST');
  const foundItems = userItems.filter(i => i.type === 'FOUND');
  const recoveredItems = userItems.filter(i => i.status === 'RECOVERED');
  const pendingClaims = userClaims.filter(c => c.status === 'PENDING');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 24px' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--calcite-orange)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>
            CAMPUS RECOVERY DASHBOARD
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome back, <span className="gradient-text">{user?.fullName}</span>
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Student ID: {user?.studentId} • {user?.email}
          </p>
        </div>

        {/* Recovery Contribution Score Badge */}
        <div style={{
          background: 'rgba(253, 123, 65, 0.08)',
          border: '1px solid rgba(253, 123, 65, 0.25)',
          padding: '16px 24px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>
            RECOVERY CONTRIBUTION
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Star size={24} fill="#D97706" color="#D97706" /> {user?.recoveryScore || 50} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>pts</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
            Trust Reputation Level 4
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <Link to="/report-lost" className="btn btn-primary" style={{ padding: '16px', justifyContent: 'center' }}>
          <PlusCircle size={20} /> Report Lost Item
        </Link>
        <Link to="/report-found" className="btn btn-outline-teal" style={{ padding: '16px', justifyContent: 'center' }}>
          <PlusCircle size={20} /> Report Found Item
        </Link>
        <Link to="/claims" className="btn btn-secondary" style={{ padding: '16px', justifyContent: 'center' }}>
          <Clock size={20} color="#D97706" /> Pending Claims ({pendingClaims.length})
        </Link>
        <Link to="/browse" className="btn btn-secondary" style={{ padding: '16px', justifyContent: 'center' }}>
          <Search size={20} /> Explore All Items
        </Link>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--calcite-orange)', fontWeight: 700 }}>MY LOST REPORTS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>{lostItems.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#0284C7', fontWeight: 700 }}>MY FOUND REPORTS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>{foundItems.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>RECOVERED ITEMS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>{recoveredItems.length}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 700 }}>CLAIMS SUBMITTED</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '6px' }}>{userClaims.length}</div>
        </div>
      </div>

      {/* My Reported Items Section */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>My Item Listings</h2>
          <Link to="/browse" style={{ fontSize: '0.85rem', color: 'var(--calcite-orange)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View catalog <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading listings...</div>
        ) : userItems.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Layers size={36} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
            <p>You haven't reported any lost or found items yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {userItems.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                      {item.type}
                    </span>
                    <span className={`badge ${item.status === 'RECOVERED' ? 'badge-recovered' : 'badge-pending'}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {item.location} • {item.dateReported}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category: {item.category}</span>
                  <Link to={`/items/${item.id}`} className="btn btn-outline-teal" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    View &amp; Timeline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
