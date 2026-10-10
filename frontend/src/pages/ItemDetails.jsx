import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Timeline } from '../components/Timeline';
import { VerificationModal } from '../components/VerificationModal';
import { MessageModal } from '../components/MessageModal';
import { SmartQRCodeModal } from '../components/SmartQRCodeModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ShieldCheck, MapPin, Calendar, Tag, Lock, Sparkles, MessageSquare, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';

const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);

  const fetchItemData = async () => {
    try {
      const [itemRes, matchesRes, timelineRes] = await Promise.all([
        api.get(`/items/${id}`),
        api.get(`/items/${id}/matches`),
        api.get(`/items/${id}/timeline`)
      ]);
      setItem(itemRes.data);
      setMatches(matchesRes.data || []);
      setTimeline(timelineRes.data || []);
    } catch (err) {
      console.error('Failed to load item details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading LostLink Item Intelligence...</div>;
  }

  if (!item) {
    return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--terracotta)' }}>Item not found or access restricted.</div>;
  }

  const highestMatch = matches.length > 0 ? matches[0] : null;
  const isOwner = user && user.id === item.userId;
  const lat = item.latitude || 17.4208;
  const lng = item.longitude || 78.6565;

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 24px' }}>
      <VerificationModal
        item={item}
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        onSuccess={() => { fetchItemData(); }}
      />

      <MessageModal
        item={item}
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
      />

      <SmartQRCodeModal
        item={item}
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left Column: Item Public Info & Matches */}
        <div>
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                  {item.type} ITEM
                </span>
                <span className={`badge ${item.status === 'RECOVERED' ? 'badge-recovered' : 'badge-pending'}`}>
                  {item.status}
                </span>
              </div>

              <button
                onClick={() => setIsQROpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  background: 'rgba(201, 110, 75, 0.12)',
                  border: '1px solid rgba(201, 110, 75, 0.3)',
                  color: 'var(--terracotta)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <QrCode size={14} /> Smart QR Recovery Tag
              </button>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>{item.title}</h1>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
              {item.description || item.publicDetails || 'No additional public description provided.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '20px 0', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
              <div><span style={{ color: 'var(--text-muted)' }}>Category:</span> <strong style={{ color: 'var(--text-main)' }}>{item.category}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Location:</span> <strong style={{ color: 'var(--text-main)' }}>{item.location}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Date:</span> <strong style={{ color: 'var(--text-main)' }}>{item.dateReported}</strong></div>
              <div><span style={{ color: 'var(--text-muted)' }}>Color / Brand:</span> <strong style={{ color: 'var(--text-main)' }}>{item.color || 'N/A'} {item.brand ? `(${item.brand})` : ''}</strong></div>
            </div>

            {item.publicDetails && (
              <div style={{ margin: '16px 0', padding: '12px', background: 'rgba(201, 110, 75, 0.08)', borderRadius: '8px', border: '1px solid rgba(201, 110, 75, 0.2)', fontSize: '0.85rem', color: 'var(--terracotta)' }}>
                <strong>Public Identifying Mark:</strong> {item.publicDetails}
              </div>
            )}

            {/* Location Map Preview */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--terracotta)" /> Pinned Location on Anurag Campus Map
              </div>
              <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <MapContainer center={[lat, lng]} zoom={16} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[lat, lng]} icon={pinIcon}>
                    <Popup>{item.title} - {item.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

            {/* Privacy Protection Callout */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              <Lock size={16} color="var(--terracotta)" /> Private details are hidden to protect ownership against false claims.
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              {!isOwner && item.status !== 'RECOVERED' && (
                <button onClick={() => setIsVerificationOpen(true)} className="btn btn-primary" style={{ flex: 1 }}>
                  <ShieldCheck size={18} /> Request Verification
                </button>
              )}

              {!isOwner && (
                <button onClick={() => setIsMessageOpen(true)} className="btn btn-secondary">
                  <MessageSquare size={18} /> Contact Finder
                </button>
              )}
            </div>
          </div>

          {/* Smart Match Detection Box */}
          {highestMatch && (
            <div className="glass-panel" style={{
              padding: '24px',
              border: '1px solid var(--border-highlight)',
              background: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="var(--terracotta)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--terracotta)', textTransform: 'uppercase' }}>
                    SMART MATCH ENGINE EXPLANATION
                  </span>
                </div>
                <span className="badge badge-recovered" style={{ fontSize: '0.85rem' }}>
                  {Math.round(highestMatch.matchScore)}% MATCH
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 700 }}>
                {highestMatch.confidenceLevel}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0 14px 0' }}>
                Why this matches: {highestMatch.matchReason}
              </p>

              {/* Match Score Breakdown Checkmarks */}
              {highestMatch.reasonCheckmarks && highestMatch.reasonCheckmarks.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                  {highestMatch.reasonCheckmarks.map((reason, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={14} color="var(--terracotta)" /> {reason}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Matched candidate: <strong>{highestMatch.foundItem?.title || highestMatch.lostItem?.title}</strong> ({highestMatch.foundItem?.location || highestMatch.lostItem?.location})
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Recovery Timeline */}
        <div>
          <Timeline events={timeline} itemStatus={item.status} />
        </div>
      </div>
    </div>
  );
};
