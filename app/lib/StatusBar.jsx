'use client';
/* ====== AIgent Impact — confidential status bar ======
   Sticky bar pinned to the top of every page. It publishes its own rendered
   height to a CSS variable (--banner-h) so the sticky page nav can offset
   itself and never overlap, regardless of how the text wraps. */
import { useEffect, useRef } from 'react';

export default function StatusBar() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setVar = () =>
      document.documentElement.style.setProperty('--banner-h', `${el.offsetHeight}px`);
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener('resize', setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setVar);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="note"
      style={{
        position: 'sticky', top: 0, zIndex: 60, width: '100%',
        background: 'linear-gradient(135deg, #01267C 0%, #0A1E5E 100%)',
        color: '#fff', textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        lineHeight: 1.4, padding: '8px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      Confidential — for use in discussions with Xeno Media only. Sharing of this material is strictly prohibited.
    </div>
  );
}
