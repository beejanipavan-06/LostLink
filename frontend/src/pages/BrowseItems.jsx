import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Filter, Layers, MapPin, Calendar, Tag, ShieldCheck } from 'lucide-react';

export const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');

  const categories = ['', 'Electronics', 'Documents / ID', 'Books', 'Bags', 'Accessories', 'Clothing', 'Keys', 'Other'];
  const locations = ['', 'Library', 'Canteen', 'Labs', 'Classrooms', 'Hostel', 'Parking', 'Sports Area', 'Main Block'];

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (query) params.query = query;
      if (category) params.category = category;
      if (type) params.type = type;
      if (location) params.location = location;

      const response = await api.get('/items/search', { params });
      setItems(response.data.content || []);
    } catch (err) {
      console.error('Failed to search items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type, category, location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>ANURAG CAMPUS RECOVERY CATALOG</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginTop: '4px' }}>
          Explore lost and found belongings across campus zones. Private verification details remain protected.
        </p>
      </div>

      {/* Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="glass-panel" style={{
        padding: '22px',
        marginBottom: '36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        alignItems: 'end',
        borderTop: '3px solid var(--calcite-orange)'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
            Keyword Search
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Backpack, ID Card, Key..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                background: 'rgba(30, 33, 36, 0.8)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
            <Search size={16} color="var(--calcite-orange)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
            Report Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(30, 33, 36, 0.8)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Types (Lost &amp; Found)</option>
            <option value="LOST">LOST</option>
            <option value="FOUND">FOUND</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(30, 33, 36, 0.8)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Categories</option>
            {categories.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '6px' }}>
            Campus Zone
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(30, 33, 36, 0.8)',
              border: '1px solid var(--border-color)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
          >
            <option value="">All Locations</option>
            {locations.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
          Filter Results
        </button>
      </form>

      {/* Item Grid */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Searching LostLink database...
        </div>
      ) : items.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Layers size={44} color="var(--text-dim)" style={{ marginBottom: '14px' }} />
          <h3 style={{ color: '#ffffff' }}>No matching items found</h3>
          <p style={{ fontSize: '0.92rem', marginTop: '6px' }}>Try broadening your search query or filters.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '26px' }}>
          {items.map(item => (
            <div key={item.id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              overflow: 'hidden'
            }}>
              <div>
                {/* Image Header */}
                <div style={{
                  height: '145px',
                  width: '100%',
                  background: item.imageUrl ? `url(${item.imageUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #272a2e, #3C4044)',
                  position: 'relative',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                      {item.type}
                    </span>
                    <span className={`badge ${item.status === 'RECOVERED' ? 'badge-recovered' : 'badge-pending'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '22px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '18px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description || item.publicDetails || 'No additional public description provided.'}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="var(--calcite-orange)" /> Location: <strong style={{ color: '#ffffff' }}>{item.location}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="var(--calcite-orange)" /> Reported: <strong style={{ color: '#ffffff' }}>{item.dateReported}</strong>
                    </div>
                    {item.color && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={15} color="var(--calcite-peach)" /> Color: <strong style={{ color: '#ffffff' }}>{item.color}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border-color)', background: 'rgba(30, 33, 36, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>By {item.reporterName}</span>
                <Link to={`/items/${item.id}`} className="btn btn-primary" style={{ padding: '7px 16px', fontSize: '0.82rem' }}>
                  View Details &amp; Matches
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
