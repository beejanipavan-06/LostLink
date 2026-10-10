import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CampusMapPicker } from '../components/CampusMapPicker';
import { ShieldCheck, PlusCircle, AlertCircle, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const ReportFound = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    location: 'Library',
    dateReported: new Date().toISOString().split('T')[0],
    color: '',
    brand: '',
    publicDetails: '',
    privateDetails: '', // HIDDEN FROM PUBLIC API
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Electronics', 'Documents / ID', 'Books', 'Bags', 'Accessories', 'Clothing', 'Keys', 'Other'];
  const locations = ['Library', 'Canteen', 'Labs', 'Classrooms', 'Hostel', 'Parking', 'Sports Area', 'Main Block'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/items', {
        ...formData,
        type: 'FOUND'
      });
      navigate(`/items/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit found report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '40px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '10px', background: 'rgba(253, 123, 65, 0.12)', borderRadius: '12px', border: '1px solid rgba(253, 123, 65, 0.3)' }}>
            <PlusCircle size={28} color="#FD7B41" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>REPORT FOUND ITEM</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Protect true owners by separating public details from private verification marks.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
            <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Item Name *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Black Backpack, Student ID Card..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Found Location *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              >
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Interactive Campus Map Picker */}
          <div style={{ marginBottom: '20px' }}>
            <CampusMapPicker
              selectedLat={formData.latitude}
              selectedLng={formData.longitude}
              locationName={formData.location}
              onLocationSelect={(lat, lng, presetName) => {
                setFormData(prev => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                  location: presetName || prev.location
                }));
              }}
            />
          </div>

          {/* PUBLIC VS PRIVATE DETAILS SEPARATION BOXES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            margin: '24px 0',
            padding: '20px',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            {/* PUBLIC DETAILS FIELD */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                <Eye size={18} color="var(--calcite-orange)" /> PUBLIC DETAILS
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Visible to everyone browsing the catalog.
              </p>
              <textarea
                name="publicDetails"
                rows={4}
                value={formData.publicDetails}
                onChange={handleChange}
                placeholder="e.g. Black laptop backpack found under desk on 2nd floor Library..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* PRIVATE DETAILS FIELD - CRITICAL FEATURE */}
            <div style={{
              background: 'rgba(253, 123, 65, 0.08)',
              padding: '14px',
              borderRadius: '8px',
              border: '1px dashed rgba(253, 123, 65, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#D97706', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                <Lock size={18} /> PRIVATE IDENTIFYING DETAILS
              </div>
              <p style={{ fontSize: '0.75rem', color: '#D97706', marginBottom: '8px' }}>
                STRICTLY HIDDEN. Used only for ownership verification!
              </p>
              <textarea
                name="privateDetails"
                rows={4}
                value={formData.privateDetails}
                onChange={handleChange}
                placeholder="e.g. Small Star Wars sticker inside front pocket, broken zipper on left pocket, specific contents..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid rgba(253, 123, 65, 0.4)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Date Found
              </label>
              <input
                type="date"
                name="dateReported"
                value={formData.dateReported}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Black"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. North Face"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
            {loading ? 'Processing Smart Matching...' : 'Submit Found Report & Protect Privacy'}
          </button>
        </form>
      </div>
    </div>
  );
};
