import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

function Footer() {
  return (
    <footer
      style={{
        background: 'var(--secondary)',
        color: 'rgba(255, 255, 255, 0.65)',
        padding: '60px 40px 30px',
        marginTop: '100px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}
      >
        {/* About section */}
        <div style={{ gridColumn: 'span 2' }}>
          <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏥</span> MediScan AI
          </h3>
          <p style={{ lineHeight: 1.6, fontSize: '14px', maxWidth: '320px', marginBottom: '20px' }}>
            Understand blood reports, prescriptions, or lab results instantly with our advanced, secure AI medical analysis platform.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://twitter.com" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}>
              <FiTwitter size={20} />
            </a>
            <a href="https://github.com" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}>
              <FiGithub size={20} />
            </a>
            <a href="mailto:support@mediscan.ai" style={{ color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.6)'}>
              <FiMail size={20} />
            </a>
          </div>
        </div>

        {/* Links: Platform */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Platform</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li><Link to="/" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>Home</Link></li>
            <li><Link to="/upload" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>Upload Report</Link></li>
            <li><Link to="/analysis" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>AI Dashboard</Link></li>
            <li><Link to="/history" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>Report History</Link></li>
          </ul>
        </div>

        {/* Links: Resources */}
        <div>
          <h4 style={{ color: 'white', marginBottom: '16px', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>Resources</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <li><a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>Privacy Policy</a></li>
            <li><a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>Terms of Service</a></li>
            <li><a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>Medical Disclaimer</a></li>
            <li><a href="#" style={{ color: 'inherit', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='inherit'}>SLA Agreement</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', marginBottom: '30px' }} />

      {/* Bottom section */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '12px',
        }}
      >
        <p>© 2026 MediScan AI. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <FiHeart color="#ef4444" fill="#ef4444" size={12} /> for healthy lives.
        </p>
      </div>
    </footer>
  );
}

export default Footer;