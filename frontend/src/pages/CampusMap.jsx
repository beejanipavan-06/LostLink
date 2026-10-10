import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Filter, Layers, Eye, Tag, Calendar, ShieldCheck } from 'lucide-react';

// Custom Markers for LOST vs FOUND
const lostMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foundMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const CampusMap = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    api.get('/items')
      .then(res => setItems(res.data.content || res.data || []))
      .catch(err => console.error('Failed to load map items', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'Electronics', 'Documents / ID', 'Books', 'Bags', 'Accessories', 'Clothing', 'Keys', 'Other'];

  const filteredItems = items.filter(item => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    return true;
  });

  const centerLat = 17.4208;
  const centerLng = 78.6565;

  return (
    <div style={{ maxWidth: '1240px', margin: '30px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--terracotta)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            SPATIAL INTELLIGENCE MAP
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>ANURAG UNIVERSITY CAMPUS MAP</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Real-time geospatial distribution of active lost &amp; found reports across campus zones.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-panel" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <Filter size={16} color="var(--terracotta)" /> Filter Map:
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem' }}
          >
            <option value="ALL">All Report Types</option>
            <option value="LOST">Lost Reports Only (Red)</option>
            <option value="FOUND">Found Reports Only (Green)</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.82rem' }}
          >
            {categories.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>)}
          </select>
        </div>
      </div>

      {/* Map Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LOST ITEM PINS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{filteredItems.filter(i => i.type === 'LOST').length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FOUND ITEM PINS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{filteredItems.filter(i => i.type === 'FOUND').length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={20} color="var(--terracotta)" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL PINNED ITEMS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{filteredItems.length}</div>
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Map */}
      <div className="glass-panel" style={{ height: '540px', overflow: 'hidden', padding: '0', position: 'relative' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            Loading campus geospatial reports...
          </div>
        ) : (
          <MapContainer center={[centerLat, centerLng]} zoom={16} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredItems.map(item => {
              const lat = item.latitude || (item.location && item.location.toLowerCase().includes('library') ? 17.4215 : 17.4208);
              const lng = item.longitude || (item.location && item.location.toLowerCase().includes('library') ? 78.6570 : 78.6565);
              const icon = item.type === 'LOST' ? lostMarkerIcon : foundMarkerIcon;

              return (
                <Marker key={item.id} position={[lat, lng]} icon={icon}>
                  <Popup minWidth={220}>
                    <div style={{ padding: '4px' }}>
                      <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`} style={{ marginBottom: '6px' }}>
                        {item.type}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '4px 0 2px 0' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.78rem', margin: '0 0 8px 0', opacity: 0.85 }}>
                        {item.category} • {item.location}
                      </p>

                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                      )}

                      <Link
                        to={`/items/${item.id}`}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '6px',
                          background: 'var(--terracotta)',
                          color: '#fff',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        View Full Details &amp; Match Score
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};
