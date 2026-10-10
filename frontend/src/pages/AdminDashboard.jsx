import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CampusHeatmap } from '../components/CampusHeatmap';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldCheck, Users, FileText, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Layers } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/statistics')
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Anurag Campus Admin Intelligence Engine...</div>;
  }

  const categoryData = stats?.itemsByCategory
    ? Object.keys(stats.itemsByCategory).map(key => ({ name: key, count: stats.itemsByCategory[key] }))
    : [];

  const locationData = stats?.itemsByLocation
    ? Object.keys(stats.itemsByLocation).map(key => ({ name: key, count: stats.itemsByLocation[key] }))
    : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(30, 33, 36, 0.95) 0%, rgba(60, 64, 68, 0.8) 100%)',
        border: '1px solid var(--calcite-orange)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--calcite-orange)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={16} /> ANURAG UNIVERSITY ADMIN CONSOLE
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
            Campus Recovery Intelligence Overview
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time loss metrics, automated fraud detection &amp; zone density calculated from database records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/admin/claims" className="btn btn-secondary" style={{ border: '1px solid var(--calcite-orange)', color: 'var(--calcite-orange)' }}>
            <AlertTriangle size={18} /> Flagged Fraud &amp; Claims ({stats?.suspiciousClaims || 0})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL USERS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{stats?.totalUsers || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--calcite-orange)', fontWeight: 700 }}>TOTAL LOST</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{stats?.totalLostItems || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--calcite-peach)', fontWeight: 700 }}>TOTAL FOUND</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{stats?.totalFoundItems || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>RECOVERED ITEMS</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{stats?.totalRecoveredItems || 0}</div>
        </div>
        <div className="glass-card" style={{ padding: '22px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--calcite-orange)', fontWeight: 700 }}>RECOVERY RATE</span>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--calcite-orange)', marginTop: '4px' }}>{stats?.recoveryRate || 0}%</div>
        </div>
      </div>

      {/* Dynamic Campus Insights */}
      <section style={{ marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '28px', borderLeft: '4px solid var(--calcite-orange)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--calcite-orange)" /> SMART CAMPUS INSIGHTS (CALCULATED FROM DB)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {(stats?.dynamicInsights || []).map((insight, idx) => (
              <div key={idx} style={{
                background: 'rgba(30, 33, 36, 0.8)',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                lineHeight: '1.5'
              }}>
                {insight}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px', marginBottom: '40px' }}>
        {/* Category Breakdown */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            Items by Category
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#898E96" fontSize={11} />
                <YAxis stroke="#898E96" fontSize={11} />
                <Tooltip contentStyle={{ background: '#272a2e', borderColor: '#DDDCDB', color: '#fff' }} />
                <Bar dataKey="count" fill="#FD7B41" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Location Breakdown */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>
            Items by Location / Zone
          </h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer>
              <BarChart data={locationData}>
                <XAxis dataKey="name" stroke="#898E96" fontSize={11} />
                <YAxis stroke="#898E96" fontSize={11} />
                <Tooltip contentStyle={{ background: '#272a2e', borderColor: '#DDDCDB', color: '#fff' }} />
                <Bar dataKey="count" fill="#EDBF9B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Campus Loss Heatmap Section */}
      <section style={{ marginBottom: '40px' }}>
        <CampusHeatmap locationData={stats?.itemsByLocation || {}} />
      </section>
    </div>
  );
};
