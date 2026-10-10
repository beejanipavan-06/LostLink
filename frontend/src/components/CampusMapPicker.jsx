import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Anurag University Campus Center & Presets
export const ANURAG_CAMPUS_PRESETS = [
  { name: 'Main Block', lat: 17.4208, lng: 78.6565 },
  { name: 'Library', lat: 17.4215, lng: 78.6570 },
  { name: 'Canteen', lat: 17.4202, lng: 78.6560 },
  { name: 'Labs', lat: 17.4212, lng: 78.6580 },
  { name: 'Classrooms', lat: 17.4205, lng: 78.6568 },
  { name: 'Hostel', lat: 17.4225, lng: 78.6550 },
  { name: 'Parking Area', lat: 17.4198, lng: 78.6555 },
  { name: 'Sports Area', lat: 17.4195, lng: 78.6575 }
];

const DEFAULT_CENTER = { lat: 17.4208, lng: 78.6565 };

// Fix Leaflet default icon issues in React
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

function MapRecenter({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 17, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

export const CampusMapPicker = ({ selectedLat, selectedLng, onLocationSelect, locationName, height = '260px' }) => {
  const currentLat = selectedLat || DEFAULT_CENTER.lat;
  const currentLng = selectedLng || DEFAULT_CENTER.lng;

  const handlePresetChange = (e) => {
    const preset = ANURAG_CAMPUS_PRESETS.find(p => p.name === e.target.value);
    if (preset) {
      onLocationSelect(preset.lat, preset.lng, preset.name);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
          <MapPin size={16} color="var(--terracotta)" /> Campus Location Pin (Click Map to Pin exact spot)
        </div>

        <select
          value={locationName || ''}
          onChange={handlePresetChange}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)'
          }}
        >
          <option value="">-- Jump to Campus Zone --</option>
          {ANURAG_CAMPUS_PRESETS.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      <div style={{ height, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <MapContainer center={[currentLat, currentLng]} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={(lat, lng) => onLocationSelect(lat, lng)} />
          <MapRecenter lat={currentLat} lng={currentLng} />
          <Marker position={[currentLat, currentLng]} icon={customIcon}>
            <Popup>
              <strong>{locationName || 'Selected Pin Spot'}</strong><br />
              Lat: {currentLat.toFixed(4)}, Lng: {currentLng.toFixed(4)}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};
