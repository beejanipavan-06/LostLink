import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { DuplicateCheckModal } from '../components/DuplicateCheckModal';
import { CampusMapPicker } from '../components/CampusMapPicker';
import { ShieldCheck, PlusCircle, AlertCircle, FileText, MapPin, Tag } from 'lucide-react';

export const ReportLost = () => {
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
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [duplicateData, setDuplicateData] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

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
      // 1. Check for duplicates first
      const dupRes = await api.post('/items/check-duplicate', {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        type: 'LOST'
      });

      if (dupRes.data.isDuplicateDetected) {
        setDuplicateData(dupRes.data);
        setShowDuplicateModal(true);
        setLoading(false);
        return;
      }

      // 2. Submit lost item report directly if no duplicate warning
      await submitReport();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
      setLoading(false);
    }
  };

  const submitReport = async () => {
    try {
      const response = await api.post('/items', {
        ...formData,
        type: 'LOST'
      });
      navigate(`/items/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px' }}>
      <DuplicateCheckModal
        isOpen={showDuplicateModal}
        duplicateData={duplicateData}
        onCancel={() => { setShowDuplicateModal(false); navigate('/browse'); }}
        onConfirm={() => { setShowDuplicateModal(false); submitReport(); }}
      />

      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ padding: '10px', background: 'rgba(209, 128, 30, 0.15)', borderRadius: '12px', border: '1px solid rgba(209, 128, 30, 0.3)' }}>
            <FileText size={28} color="var(--c-amber)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>REPORT LOST ITEM</h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              LostLink Smart Match Engine will continuously analyze found reports for matches.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(209, 128, 30, 0.15)', border: '1px solid rgba(209, 128, 30, 0.3)', color: '#B76E16', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
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
              placeholder="e.g. Black Dell Laptop, Blue Backpack..."
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
                Campus Location Lost *
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                Date Lost
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
                placeholder="e.g. Black / Navy"
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
                placeholder="e.g. Dell, Nike..."
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

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe where you lost it, context, or distinguishing features..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.88rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Public Identifying Feature (Optional)
            </label>
            <input
              type="text"
              name="publicDetails"
              value={formData.publicDetails}
              onChange={handleChange}
              placeholder="e.g. Blue keychain attached to zipper..."
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
            {loading ? 'Analyzing Duplicate & Saving...' : 'Submit Lost Report'}
          </button>
        </form>
      </div>
    </div>
  );
};
