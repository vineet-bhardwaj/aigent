'use client';
/* ====== AIgent Impact — engine & viz primitives (hooks + atoms) ====== */
import { useState, useEffect, useRef } from 'react';

/* ---------- hooks ---------- */
export function useInView(opts) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    const reveal = () => { if (!done) { done = true; setSeen(true); } };
    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.92 && r.bottom > 0) reveal();
    };
    check(); // reveal immediately if already on-screen
    let io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((es) => {
        es.forEach((e) => { if (e.isIntersecting) reveal(); });
      }, opts || { threshold: 0.25 });
      io.observe(el);
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    // safety net: never let gated content stay invisible in quirky scroll hosts
    const safety = setTimeout(reveal, 2200);
    return () => {
      if (io) io.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      clearTimeout(safety);
    };
  }, []);
  return [ref, seen];
}

// animated counter that eases toward `target`
export function useCountUp(target, { dur = 1200, start = 0, run = true, decimals = 0 } = {}) {
  const [val, setVal] = useState(start);
  const fromRef = useRef(start);
  useEffect(() => {
    if (!run) return;
    const from = fromRef.current;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(from + (target - from) * e);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, dur]);
  return decimals ? val.toFixed(decimals) : Math.round(val);
}

/* ---------- atoms ---------- */
export function Wordmark({ size = 22, light = false }) {
  return (
    <span className="wordmark" style={{ fontSize: size, color: light ? '#fff' : undefined }}>
      <span className="ai" style={light ? { color: '#fff' } : undefined}>AI</span><span className="rest" style={light ? { color: 'var(--azure-400)' } : undefined}>gent&nbsp;Impact</span>
    </span>
  );
}

export function Delta({ value, suffix = '', className = '' }) {
  const up = value >= 0;
  return (
    <span className={'delta ' + className} style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      color: up ? 'var(--pos)' : 'var(--coral)', fontWeight: 600, fontSize: 13,
      fontFamily: 'var(--mono)',
    }}>
      <svg width="11" height="11" viewBox="0 0 12 12" style={{ transform: up ? 'none' : 'rotate(180deg)' }}>
        <path d="M6 2 L10 8 L2 8 Z" fill="currentColor" />
      </svg>
      {up ? '+' : ''}{value}{suffix}
    </span>
  );
}

/* ---------- the live score gauge (hero centerpiece) ---------- */
export function ScoreGauge({ score = 82, recalc = false }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  const shown = useCountUp(score, { dur: 1800, run: seen });
  const R = 130, C = 2 * Math.PI * R, SW = 20;
  const cx = 160, cy = 160;

  let grade = 'Dominant', gradeColor = 'var(--pos)';
  if (shown < 40) { grade = 'Invisible'; gradeColor = 'var(--neg)'; }
  else if (shown < 65) { grade = 'Emerging'; gradeColor = 'var(--warn)'; }
  else if (shown < 82) { grade = 'Competitive'; gradeColor = 'var(--azure-600)'; }

  // derive the three pillars from the overall score so they move with the recalc
  const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
  const pillars = [
    { name: 'Visibility', weight: 40, color: '#4B8DFA', score: clamp(score - 4) },
    { name: 'Reputation', weight: 35, color: '#8FB8FF', score: clamp(score + 6) },
    { name: 'Engagement', weight: 25, color: '#DE7D6C', score: clamp(score - 9) },
  ];

  // 270° gauge starting bottom-left (135°), clockwise; gaps between weighted zones
  const START = 135, TOTAL = 270, GAP = 5;
  const usable = TOTAL - GAP * (pillars.length - 1);
  const pt = (ang) => {
    const r = (ang * Math.PI) / 180;
    return [cx + R * Math.cos(r), cy + R * Math.sin(r)];
  };
  const arc = (a1, a2) => {
    const [x1, y1] = pt(a1), [x2, y2] = pt(a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
  };
  let cursor = START;
  const segs = pillars.map((p) => {
    const span = (p.weight / 100) * usable;
    const z0 = cursor, z1 = cursor + span;
    const fillEnd = z0 + span * (p.score / 100);
    cursor = z1 + GAP;
    return { ...p, z0, z1, fillEnd, fillLen: (R * span * (p.score / 100) * Math.PI) / 180 };
  });

  return (
    <div ref={ref}>
      <div style={{ position: 'relative', width: 320, maxWidth: '100%', aspectRatio: '1 / 1', margin: '0 auto' }}>
        <svg width="320" height="320" viewBox="0 0 320 320" style={{ width: '100%', height: '100%', display: 'block' }}>
          {segs.map((s, i) => (
            <g key={i}>
              <path d={arc(s.z0, s.z1)} fill="none" stroke={s.color} strokeOpacity="0.15" strokeWidth={SW} strokeLinecap="round" />
              <path d={arc(s.z0, s.fillEnd)} fill="none" stroke={s.color} strokeWidth={SW} strokeLinecap="round"
                style={{
                  strokeDasharray: `${s.fillLen} ${C * 2}`,
                  strokeDashoffset: seen ? 0 : s.fillLen,
                  transition: `stroke-dashoffset 1.2s cubic-bezier(.3,0,.2,1) ${i * 220}ms`,
                  filter: 'drop-shadow(0 0 6px ' + s.color + '66)',
                }} />
            </g>
          ))}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-3)', textTransform: 'uppercase', marginBottom: 2 }}>
            {recalc ? 'recalculating…' : 'Impact Score'}
          </div>
          <div className="tnum" style={{ fontSize: 88, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: 'var(--navy)' }}>
            {shown}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 8, padding: '5px 13px', borderRadius: 999, background: 'var(--bg-soft)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: gradeColor }}></span>
            <span style={{ fontWeight: 700, fontSize: 14, color: gradeColor, letterSpacing: '-0.01em' }}>{grade}</span>
          </div>
        </div>
      </div>
      {/* pillar legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 4 }}>
        {segs.map((s, i) => (
          <div key={i} style={{ flex: 1, maxWidth: 96, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }}></span>
              <span className="tnum" style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.03em' }}>{seen ? s.score : 0}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{s.name}</div>
            <div className="mono" style={{ fontSize: 9.5, color: s.color, fontWeight: 600 }}>{s.weight}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- animated factor bar ---------- */
export function FactorBar({ label, value, run, delay = 0, hint }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setW(value), delay);
    return () => clearTimeout(t);
  }, [run, value, delay]);
  const shown = useCountUp(run ? value : 0, { dur: 1100, run });
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{label}</span>
        <span className="mono tnum" style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{shown}</span>
      </div>
      <div style={{ height: 9, borderRadius: 999, background: 'var(--bg-soft)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: w + '%', borderRadius: 999,
          background: 'linear-gradient(90deg, var(--navy), var(--azure-600))',
          transition: 'width 1.1s cubic-bezier(.2,.8,.2,1)' + (delay ? ` ${delay}ms` : ''),
        }}></div>
      </div>
      {hint && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 7 }}>{hint}</div>}
    </div>
  );
}

/* ---------- live engine scan feed ---------- */
const SCAN_LINES = [
  { e: 'ChatGPT', q: '"best insurance agent near Plano TX"', hit: true },
  { e: 'Perplexity', q: '"who should I trust for whole-life policies"', hit: true },
  { e: 'Gemini', q: '"top-rated local insurance agents near me"', hit: false },
  { e: 'Claude', q: '"compare local insurance agent reviews"', hit: true },
  { e: 'Copilot', q: '"affordable auto & home insurance agent"', hit: false },
  { e: 'ChatGPT', q: '"family insurance expert Dallas TX"', hit: true },
];
export function ScanFeed() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % SCAN_LINES.length), 2200);
    return () => clearInterval(t);
  }, []);
  const rows = [0, 1, 2].map((k) => SCAN_LINES[(i + k) % SCAN_LINES.length]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map((r, k) => (
        <div key={i + '-' + k} style={{
          display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px',
          background: k === 0 ? 'var(--dk-2)' : 'transparent', borderRadius: 10,
          border: '1px solid ' + (k === 0 ? 'var(--dk-line)' : 'transparent'),
          opacity: k === 0 ? 1 : 0.45 - k * 0.12,
          animation: k === 0 ? 'feedIn .5s ease' : 'none',
        }}>
          <span className="mono" style={{
            fontSize: 10.5, fontWeight: 600, padding: '3px 7px', borderRadius: 5,
            background: 'rgba(120,160,255,0.12)', color: 'var(--azure-400)', flexShrink: 0,
          }}>{r.e}</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--dk-ink-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.q}</span>
          <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: 11, fontWeight: 700, fontFamily: 'var(--mono)', color: r.hit ? 'var(--pos)' : 'var(--coral)' }}>
            {r.hit ? '◉ cited' : '○ missed'}
          </span>
        </div>
      ))}
    </div>
  );
}
