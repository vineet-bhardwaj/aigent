'use client';
/* ====== AIgent Impact — data viz: trend chart, leaderboard, citations ====== */
import { useState, useEffect, useRef } from 'react';
import { useInView, useCountUp, Delta } from './engine';

/* ---------- Trend chart (draws on view) ---------- */
export function TrendChart({ data, height = 230 }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const pathRef = useRef(null);
  const W = 720, H = height, pad = 30;
  const max = 100, min = 0;
  const xs = (i) => pad + (i / (data.length - 1)) * (W - pad * 2);
  const ys = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xs(i)} ${ys(d.v)}`).join(' ');
  const area = `${line} L ${xs(data.length - 1)} ${H - pad} L ${xs(0)} ${H - pad} Z`;

  useEffect(() => {
    if (!seen || !pathRef.current) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.transition = 'none';
    pathRef.current.style.strokeDasharray = len;
    pathRef.current.style.strokeDashoffset = len;
    pathRef.current.getBoundingClientRect();
    pathRef.current.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)';
    pathRef.current.style.strokeDashoffset = 0;
  }, [seen]);

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--azure)" stopOpacity="0.22" />
            <stop offset="1" stopColor="var(--azure)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 50, 75].map((g) => (
          <g key={g}>
            <line x1={pad} y1={ys(g)} x2={W - pad} y2={ys(g)} stroke="var(--line)" strokeWidth="1" strokeDasharray="3 5" />
            <text x={pad - 8} y={ys(g) + 4} textAnchor="end" fontSize="11" fill="var(--ink-3)" fontFamily="var(--mono)">{g}</text>
          </g>
        ))}
        <path d={area} fill="url(#trendArea)" style={{ opacity: seen ? 1 : 0, transition: 'opacity 1s ease 0.6s' }} />
        <path ref={pathRef} d={line} fill="none" stroke="var(--azure-600)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i} style={{ opacity: seen ? 1 : 0, transition: `opacity .4s ease ${0.8 + i * 0.08}s` }}>
            <circle cx={xs(i)} cy={ys(d.v)} r={i === data.length - 1 ? 6 : 4} fill="#fff" stroke="var(--azure-600)" strokeWidth="2.5" />
            <text x={xs(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--mono)">{d.m}</text>
          </g>
        ))}
        {/* highlight last point */}
        <circle cx={xs(data.length - 1)} cy={ys(data[data.length - 1].v)} r="6" fill="var(--azure-600)"
          style={{ opacity: seen ? 1 : 0, transition: 'opacity .4s ease 1.4s' }} />
      </svg>
    </div>
  );
}

/* ---------- Reshuffling competitor leaderboard ---------- */
const BASE_BOARD = [
  { name: 'Maria Delgado · State Farm', you: false, score: 91 },
  { name: 'You — John Smith, Allstate', you: true, score: 82 },
  { name: 'Brightpath · Progressive', you: false, score: 79 },
  { name: 'Kevin Tran · Farmers', you: false, score: 74 },
  { name: 'Summit Shield · Geico', you: false, score: 68 },
  { name: 'Capstone · Nationwide', you: false, score: 61 },
];
export function Leaderboard({ youScore = 82, live = true }) {
  const [board, setBoard] = useState(() => BASE_BOARD.map((b) => ({ ...b, score: b.you ? youScore : b.score })));
  const ROW_H = 64, GAP = 10;

  useEffect(() => {
    setBoard((prev) => prev.map((b) => (b.you ? { ...b, score: youScore } : b)));
  }, [youScore]);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      setBoard((prev) => prev.map((b) => {
        if (b.you) return b;
        const jitter = Math.round((Math.random() - 0.45) * 4);
        return { ...b, score: Math.max(40, Math.min(98, b.score + jitter)) };
      }));
    }, 2600);
    return () => clearInterval(t);
  }, [live]);

  const sorted = [...board].sort((a, b) => b.score - a.score);
  const rankOf = {};
  sorted.forEach((b, i) => { rankOf[b.name] = i; });

  return (
    <div style={{ position: 'relative', height: board.length * (ROW_H + GAP) - GAP }}>
      {board.map((b) => {
        const rank = rankOf[b.name];
        return (
          <div key={b.name} style={{
            position: 'absolute', left: 0, right: 0, height: ROW_H,
            transform: `translateY(${rank * (ROW_H + GAP)}px)`,
            transition: 'transform .8s cubic-bezier(.4,0,.2,1)',
            display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px',
            borderRadius: 14,
            background: b.you ? 'linear-gradient(100deg, var(--navy), var(--azure-600))' : 'var(--surface)',
            border: '1px solid ' + (b.you ? 'transparent' : 'var(--line)'),
            boxShadow: b.you ? 'var(--shadow-blue)' : 'var(--shadow-sm)',
            color: b.you ? '#fff' : 'var(--ink)',
          }}>
            <span className="mono tnum" style={{ fontSize: 18, fontWeight: 700, width: 30, color: b.you ? 'rgba(255,255,255,.85)' : 'var(--ink-3)' }}>
              {String(rank + 1).padStart(2, '0')}
            </span>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: b.you ? 'rgba(255,255,255,.18)' : 'var(--bg-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: b.you ? '#fff' : 'var(--navy)',
            }}>{b.name.replace('You — ', '').split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>
            <span style={{ fontWeight: 600, fontSize: 15.5, letterSpacing: '-0.01em', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</span>
            <span className="mono tnum" style={{ fontSize: 22, fontWeight: 700 }}>{b.score}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Citation grid across AI engines ---------- */
export const ENGINES = [
  { name: 'ChatGPT', share: 38, cites: 142, trend: 12 },
  { name: 'Perplexity', share: 24, cites: 89, trend: 7 },
  { name: 'Gemini', share: 16, cites: 41, trend: -3 },
  { name: 'Claude', share: 14, cites: 52, trend: 9 },
  { name: 'Copilot', share: 8, cites: 18, trend: 1 },
];
export function CitationCard({ e, run, delay }) {
  const cites = useCountUp(run ? e.cites : 0, { dur: 1300, run });
  const [w, setW] = useState(0);
  useEffect(() => { if (run) { const t = setTimeout(() => setW(e.share), delay); return () => clearTimeout(t); } }, [run]);
  return (
    <div className="card" style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>{e.name}</span>
        <Delta value={e.trend} suffix="%" />
      </div>
      <div className="tnum" style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--navy)', lineHeight: 1 }}>{cites}</div>
      <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4, marginBottom: 16 }}>citations this month</div>
      <div style={{ height: 7, borderRadius: 999, background: 'var(--bg-soft)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: w + '%', borderRadius: 999, background: 'linear-gradient(90deg, var(--navy), var(--azure))', transition: 'width 1.2s cubic-bezier(.2,.8,.2,1)' }}></div>
      </div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8 }}>{e.share}% answer share</div>
    </div>
  );
}
