import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Download, ShieldCheck, Lock } from 'lucide-react';

export const SmartQRCodeModal = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  const qrUrl = `${window.location.origin}/items/${item.id}?qrToken=${item.qrCodeToken || 'tag'}`;

  const handleDownload = () => {
    const svg = document.getElementById('item-qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `LostLink_QR_Tag_${item.title.replace(/\s+/g, '_')}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(43, 26, 21, 0.55)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '32px',
        position: 'relative',
        textAlign: 'center',
        background: 'var(--bg-card)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(201, 110, 75, 0.12)', borderRadius: '14px', marginBottom: '12px' }}>
          <QrCode size={32} color="var(--terracotta)" />
        </div>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
          SMART RECOVERY QR TAG
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Attach this QR tag to your <strong>{item.title}</strong>. Finders can scan it to launch a privacy-safe recovery contact without seeing your phone number or email!
        </p>

        {/* QR Code Graphic Box */}
        <div style={{
          background: '#FFFFFF',
          padding: '20px',
          borderRadius: '16px',
          display: 'inline-block',
          boxShadow: '0 8px 24px rgba(113, 63, 50, 0.12)',
          border: '2px solid var(--terracotta)',
          marginBottom: '20px'
        }}>
          <QRCodeSVG id="item-qr-code-svg" value={qrUrl} size={180} fgColor="#713F32" bgColor="#FFFFFF" level="H" />
          <div style={{ fontSize: '0.7rem', color: '#713F32', fontWeight: 800, marginTop: '8px', letterSpacing: '0.05em' }}>
            ANURAG UNIV • LOSTLINK #{item.id}
          </div>
        </div>

        <div style={{
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-secondary)',
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: 'left'
        }}>
          <Lock size={16} color="var(--terracotta)" />
          <strong>Privacy Guard:</strong> Scanners will see a safe contact portal where they can message you anonymously.
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDownload} className="btn btn-primary" style={{ flex: 1 }}>
            <Download size={16} /> Download Printable QR Tag
          </button>
        </div>
      </div>
    </div>
  );
};
