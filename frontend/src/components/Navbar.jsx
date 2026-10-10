import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShieldCheck, Search, PlusCircle, Bell, User as UserIcon, LogOut, Star, Layers, Activity, Sun, Moon, MapPin } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  // Theme Toggle State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('lostlink-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lostlink-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (user) {
      api.get('/notifications/unread-count')
        .then(res => setUnreadNotifications(res.data.count || 0))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      margin: '12px 24px',
      padding: '12px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-card)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--c-amber), #B76E16)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(209, 128, 30, 0.35)'
        }}>
          <ShieldCheck size={26} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
              LOST<span style={{ color: 'var(--c-amber)' }}>LINK</span>
            </span>
          </div>
          <span style={{ display: 'block', fontSize: '0.64rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: '-2px', fontWeight: 600 }}>
            INTELLIGENT CAMPUS RECOVERY
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/browse" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>
          <Search size={16} color="var(--terracotta)" /> Explore Items
        </Link>

        <Link to="/map" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>
          <MapPin size={16} color="var(--terracotta)" /> Campus Map
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            transition: 'all 0.25s ease'
          }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={15} color="var(--c-amber)" /> Dark Mode
            </>
          ) : (
            <>
              <Sun size={15} color="var(--c-peach)" /> Light Mode
            </>
          )}
        </button>

        {user ? (
          <>
            <Link to="/report-lost" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-amber)', fontWeight: 700, fontSize: '0.9rem' }}>
              <PlusCircle size={16} /> Report Lost
            </Link>
            <Link to="/report-found" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-bronze)', fontWeight: 700, fontSize: '0.9rem' }}>
              <PlusCircle size={16} /> Report Found
            </Link>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem' }}>
              <Layers size={16} /> Dashboard
            </Link>

            {isAdmin && (
              <Link to="/admin" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--c-amber)',
                fontWeight: 700,
                fontSize: '0.85rem',
                background: 'rgba(209, 128, 30, 0.12)',
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(209, 128, 30, 0.35)'
              }}>
                <Activity size={15} /> Admin Console
              </Link>
            )}

            <Link to="/notifications" style={{ position: 'relative', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-6px',
                  background: 'var(--c-amber)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(209, 128, 30, 0.4)'
                }}>
                  {unreadNotifications}
                </span>
              )}
            </Link>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingLeft: '14px',
              borderLeft: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.fullName}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--c-amber)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  <Star size={11} fill="var(--c-amber)" /> {user.recoveryScore || 50} pts
                </span>
              </div>

              <button onClick={handleLogout} title="Logout" style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}>
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
              Sign In
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
