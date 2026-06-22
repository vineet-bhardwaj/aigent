'use client';
/* ====== AIgent Impact — accept-to-enter gate ======
   Renders a full-screen modal that fully obscures the site until the
   visitor clicks "Accept". The gate is shown on every page load and
   reload — acceptance is not remembered. */
import { useState, useEffect } from 'react';

export default function ConsentGate({ children }) {
  // Gated on every load/reload — the site is never shown until the visitor
  // explicitly accepts, and the choice is intentionally not persisted.
  const [gated, setGated] = useState(true);
  const ready = true;

  // Lock background scroll while the gate is up.
  useEffect(() => {
    document.body.style.overflow = gated ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [gated]);

  const accept = () => setGated(false);

  return (
    <>
      {children}
      {gated && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-title"
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'linear-gradient(135deg, #01267C 0%, #0A1E5E 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
            // tiny fade so it doesn't pop harshly once we've confirmed state
            opacity: ready ? 1 : 1,
          }}
        >
          {/* soft glow accent */}
          <div style={{
            position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
            width: 900, height: 600, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, rgba(75,141,250,0.30), transparent 65%)',
          }} />
          <div style={{
            position: 'relative', width: '100%', maxWidth: 460,
            background: 'var(--surface, #fff)', borderRadius: 18,
            boxShadow: '0 30px 80px -20px rgba(8,22,59,0.55)',
            padding: '38px 36px 32px', textAlign: 'center',
          }}>
            <div className="wordmark" style={{ fontSize: 30, lineHeight: 1, marginBottom: 22 }}>
              <span className="ai" style={{ color: 'var(--navy, #01267C)', fontStyle: 'italic', fontWeight: 800 }}>AI</span>
              <span className="rest" style={{ color: 'var(--azure, #4B8DFA)', fontWeight: 800 }}>gent&nbsp;Impact</span>
            </div>
            <h2 id="consent-title" style={{
              fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em',
              color: 'var(--ink, #08163B)', margin: '0 0 12px',
            }}>
              Before you continue
            </h2>
            <p style={{
              fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-2, #3A4A72)', margin: '0 0 26px',
            }}>
              This site and its reports contain confidential analysis prepared for
              authorized recipients. By selecting <strong>Accept</strong> you agree to
              our terms and acknowledge this information is for your private use only.
            </p>
            <button
              onClick={accept}
              className="btn btn-primary"
              style={{
                width: '100%', fontSize: 16, fontWeight: 600, padding: '15px 26px',
                border: 'none', borderRadius: 12, cursor: 'pointer', color: '#fff',
                backgroundColor: 'rgb(222, 125, 108)',
                justifyContent: 'center', textAlign: 'center',
              }}
            >
              Accept &amp; Continue
            </button>
            <a
              href="https://www.google.com"
              style={{
                display: 'inline-block', marginTop: 16, fontSize: 13,
                fontWeight: 500, color: 'var(--ink-3, #6B7AA0)', textDecoration: 'none',
              }}
            >
              Decline and leave
            </a>
          </div>
        </div>
      )}
    </>
  );
}
