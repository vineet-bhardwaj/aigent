'use client';
/* ====== AIgent Impact — page sections ====== */
import { useInView, useCountUp, Wordmark, Delta } from './engine';
import { TrendChart, Leaderboard, CitationCard, ENGINES } from './viz';

/* ---------- Tagline pipeline: Data → Insights → Action → Growth ---------- */
export function TaglineFlow() {
  const steps = [
  { w: 'Data', d: 'every answer engine, scanned' },
  { w: 'Insights', d: 'one score, fully explained' },
  { w: 'Action', d: 'a prioritized playbook' },
  { w: 'Growth', d: 'visibility that compounds' }];

  const [ref, seen] = useInView({ threshold: 0.4 });
  return (
    <section style={{ padding: '8px 0 64px' }}>
      <div className="wrap" ref={ref}>
        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }} className="tag-flow">
          {steps.map((s, i) =>
          <div key={s.w} style={{ display: 'contents' }}>
              <div style={{
              flex: 1, minWidth: 150, padding: '4px 2px',
              opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(10px)',
              transition: `opacity .6s ease ${i * 130}ms, transform .6s ease ${i * 130}ms`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <span className="mono tnum" style={{ fontSize: 11, fontWeight: 600, color: 'var(--azure-600)', letterSpacing: '0.1em' }}>0{i + 1}</span>
                  <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--line-2), transparent)' }}></span>
                </div>
                <div style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--navy)' }}>{s.w}.</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{s.d}</div>
              </div>
              {i < steps.length - 1 &&
            <span aria-hidden="true" style={{ alignSelf: 'flex-start', marginTop: 2, color: 'var(--line-2)', fontSize: 18, fontWeight: 700, paddingTop: 2 }} className="tag-arrow">→</span>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

}

export function SectionHead({ eyebrow, title, lead, center, light }) {
  return (
    <div className="section-head" style={center ? { margin: '0 auto', textAlign: 'center' } : undefined}>
      <span className="eyebrow" style={center ? {} : undefined}>{eyebrow}</span>
      <h2 className="h-sect" style={{ marginTop: 22, color: light ? '#fff' : 'var(--ink)' }}>{title}</h2>
      {lead && <p className="lead" style={{ marginTop: 18, color: light ? 'var(--dk-ink)' : undefined }}>{lead}</p>}
    </div>);

}

/* ---------- The Reality (AI adoption stats) ---------- */
export function RealitySection() {
  const stats = [
  { n: 47, l: 'Used AI for purchase decisions' },
  { n: 57, l: 'Found better prices via AI' },
  { n: 54, l: 'Compared products with AI' },
  { n: 48, l: 'Used AI review summaries' }];

  const [ref, seen] = useInView({ threshold: 0.25 });
  return (
    <section className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="wrap" ref={ref}>
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 56, alignItems: 'center' }} className="reality-top">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span>The reality</span>
            <h2 className="h-sect" style={{ marginTop: 22 }}>AI already shapes the buying decision.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Generative- and answer-engines like ChatGPT and Google AI are increasingly central to US household decision-making — and it will only continue to accelerate.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Someone using their phone / AI at home"
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80"
              style={{ display: 'block', width: '100%', aspectRatio: '5 / 4', minHeight: 380, objectFit: 'cover', borderRadius: 22, boxShadow: 'var(--shadow)' }} />
            <div style={{ position: 'absolute', left: 18, bottom: 18, right: 18, display: 'flex', alignItems: 'center', gap: 11, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '12px 15px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--azure-600)', flexShrink: 0 }}></span>
              <span className="mono" style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500 }}>Who is the best homeowners insurance agent near me?</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginTop: 44 }} className="reality-grid">
          {stats.map((s, i) => <RealityStat key={i} s={s} seen={seen} />)}
        </div>
      </div>
    </section>);

}

function RealityStat({ s, seen }) {
  const n = useCountUp(s.n, { dur: 1400, run: seen });
  return (
    <div className="card" style={{ padding: '34px 30px' }}>
      <div className="tnum" style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--azure-600)', lineHeight: 1 }}>
        {n}<span style={{ fontSize: 40 }}>%</span>
      </div>
      <p style={{ fontSize: 16, color: 'var(--ink-2)', marginTop: 16, lineHeight: 1.45, fontWeight: 500 }}>{s.l}</p>
    </div>);
}

/* ---------- The engine: how the algorithm works (dark) ---------- */
export function EngineSection() {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const pillars = [
  { name: 'Visibility', weight: 40, score: 78, color: '#4B8DFA', subs: [
    { label: 'Listing Consistency', value: 84 },
    { label: 'Directory Coverage', value: 71 },
    { label: 'AI Discoverability', value: 79 }] },
  { name: 'Reputation', weight: 35, score: 88, color: '#8FB8FF', subs: [
    { label: 'Reviews', value: 91 },
    { label: 'Digital Bio & Story', value: 85 }] },
  { name: 'Engagement', weight: 25, score: 73, color: '#DE7D6C', subs: [
    { label: 'Local Press & Awards', value: 64 },
    { label: 'Community Presence', value: 78 },
    { label: 'Referral Network', value: 77 }] }];

  return (
    <section className="section" style={{ background: 'var(--dk)', color: 'var(--dk-ink)', borderRadius: 32, margin: '0 16px', overflow: 'hidden', position: 'relative' }} ref={ref}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(75,141,250,0.18), transparent 45%), radial-gradient(circle at 90% 100%, rgba(1,38,124,0.5), transparent 50%)', pointerEvents: 'none' }}></div>
      <div className="wrap" style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="engine-grid">
          <div>
            <span className="eyebrow" style={{ background: 'var(--dk-2)', borderColor: 'var(--dk-line)', color: 'var(--azure-400)' }}>
              <span className="dot"></span>The scoring model
            </span>
            <h2 className="h-sect" style={{ marginTop: 22, color: '#fff' }}>Three pillars decide who AI <span style={{ color: 'var(--azure-400)' }}>recommends.</span></h2>
            <p className="lead" style={{ marginTop: 18, color: 'var(--dk-ink)' }}>Your score breaks down into three weighted pillars — Visibility, Reputation, and Engagement. We track the live signals inside each, then recompute your number as your market shifts beneath you.
            </p>
            <div style={{ display: 'flex', gap: 28, marginTop: 34, flexWrap: 'wrap' }}>
              {pillars.map((p, i) =>
              <div key={i}>
                  <div className="tnum" style={{ fontSize: 34, fontWeight: 800, color: p.color, letterSpacing: '-0.04em' }}>{p.weight}%</div>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--dk-ink-2)', marginTop: 2 }}>{p.name}</div>
                </div>
              )}
            </div>
          </div>
          <div style={{ background: 'var(--dk-2)', border: '1px solid var(--dk-line)', borderRadius: 22, padding: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <span className="mono" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dk-ink-2)', whiteSpace: 'nowrap' }}>factor breakdown</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--pos)' }}>◉ live</span>
            </div>
            {pillars.map((p, pi) =>
            <div key={pi} style={{ marginBottom: pi < pillars.length - 1 ? 20 : 0, paddingBottom: pi < pillars.length - 1 ? 20 : 0, borderBottom: pi < pillars.length - 1 ? '1px solid var(--dk-line)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 13 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }}></span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.01em' }}>{p.name}</span>
                  <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color: p.color, background: 'color-mix(in srgb, ' + p.color + ' 16%, transparent)', padding: '2px 7px', borderRadius: 999, whiteSpace: 'nowrap' }}>{p.weight}% weight</span>
                  <span className="mono tnum" style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 700, color: p.color }}>{seen ? p.score : 0}</span>
                </div>
                {p.subs.map((sub, si) =>
              <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 4px 18px' }}>
                    <span style={{ fontSize: 13, color: 'var(--dk-ink)', flex: 1 }}>{sub.label}</span>
                    <div style={{ width: 72, height: 6, borderRadius: 999, background: 'rgba(120,160,255,0.12)', overflow: 'hidden', flexShrink: 0 }}>
                      <div style={{ height: '100%', width: (seen ? sub.value : 0) + '%', borderRadius: 999, background: p.color, transition: `width 1.1s cubic-bezier(.2,.8,.2,1) ${(pi * 3 + si) * 90}ms` }}></div>
                    </div>
                    <span className="mono tnum" style={{ fontSize: 12, color: 'var(--dk-ink-2)', width: 22, textAlign: 'right', flexShrink: 0 }}>{seen ? sub.value : 0}</span>
                  </div>
              )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- Leaderboard section ---------- */
export function LeaderboardSection({ youScore, live }) {
  return (
    <section className="section" id="rankings">
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 64, alignItems: 'center' }} className="lb-grid">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span>Local market dominance</span>
            <h2 className="h-sect" style={{ marginTop: 22 }}>Own the answer in <br />your local market.</h2>
            <p className="lead" style={{ marginTop: 18 }}>AI recommends locally — and your score only matters relative to the agents next door. AIgent Impact tracks everyone competing for the same answers in your area and shows your live position, so you can dominate your local market.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Benchmarked against every insurance agent in your local market', 'Watch competitors rise and fall in real time'].map((t, i) =>
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 15.5, color: 'var(--ink-2)' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, background: 'var(--bg-soft)', color: 'var(--azure-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800 }}>✓</span>
                  {t}
                </li>
              )}
            </ul>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, padding: '0 4px' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Insurance agents · Plano, TX</span>
              <span className="mono" style={{ fontSize: 11, color: 'var(--pos)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><span className="dot" style={{ position: 'static' }}></span>live</span>
            </div>
            <Leaderboard youScore={youScore} live={live} />
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- Citations section ---------- */
export function CitationSection() {
  const [ref, seen] = useInView({ threshold: 0.2 });
  return (
    <section className="section" id="citations" style={{ background: 'var(--bg-soft)' }}>
      <div className="wrap" ref={ref}>
        <SectionHead
          eyebrow={<><span className="dot"></span>Visibility · AI Discoverability</>}
          title="Know every time an AI says your name."
          lead="AI Discoverability is the live edge of your Visibility pillar. We monitor where each engine cites you, where you're missed, and which assistant is sending the most trust your way." />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18, marginTop: 50 }}>
          {ENGINES.map((e, i) => <CitationCard key={e.name} e={e} run={seen} delay={i * 120} />)}
        </div>
      </div>
    </section>);

}

/* ---------- Trend section ---------- */
export function TrendSection() {
  const data = [
  { m: 'Jan', v: 38 }, { m: 'Feb', v: 44 }, { m: 'Mar', v: 41 }, { m: 'Apr', v: 53 },
  { m: 'May', v: 61 }, { m: 'Jun', v: 68 }, { m: 'Jul', v: 74 }, { m: 'Aug', v: 82 }];

  return (
    <section className="section" id="trend">
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 56, alignItems: 'center' }} className="lb-grid">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span>Trajectory</span>
            <h2 className="h-sect" style={{ marginTop: 22 }}>Watch your worth compound.</h2>
            <p className="lead" style={{ marginTop: 18 }}>AI Impact isn't a one-time fix. Track your score month over month, tie every gain back to the work that earned it, and prove ROI to the people who matter.</p>
            <div style={{ display: 'flex', gap: 36, marginTop: 32 }}>
              <div>
                <div className="tnum" style={{ fontSize: 40, fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.04em' }}>+44</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>points in 8 months</div>
              </div>
              <div>
                <div className="tnum" style={{ fontSize: 40, fontWeight: 800, color: 'var(--pos)', letterSpacing: '-0.04em' }}>3.1×</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>more AI citations</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ padding: '30px 26px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 4px' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>AI Visibility Score — 2026</span>
              <Delta value={44} className="" />
            </div>
            <TrendChart data={data} />
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- Recommendations ---------- */
export function RecoSection() {
  const recos = [
  { tag: 'High impact', tagc: 'var(--coral)', pillar: 'Visibility · Listing Consistency', pts: 9, t: 'Fix your name & address across 14 directories', d: 'Conflicting listings split your authority — engines can\'t tell which "you" to trust. We reconcile every source.' },
  { tag: 'Quick win', tagc: 'var(--pos)', pillar: 'Visibility · AI Discoverability', pts: 5, t: 'Claim the 12 questions buyers ask AI most', d: 'You\'re absent from "whole vs. term" answers in your area. Publish structured answers to capture them.' },
  { tag: 'Momentum', tagc: 'var(--warn)', pillar: 'Reputation · Reviews', pts: 4, t: 'Turn 6 recent 5-star reviews into citable proof', d: 'Recent, source-trusted sentiment is weighted heavily and refreshes fast across every engine.' }];

  return (
    <section className="section" id="recommendations" style={{ background: 'var(--bg-soft)' }}>
      <div className="wrap">
        <SectionHead
          eyebrow={<><span className="dot"></span>Your move</>}
          title="Not just a score — a playbook."
          lead="Every number comes with the exact, prioritized actions that will move it most. Do the work, watch it climb." />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginTop: 50 }}>
          {recos.map((r, i) =>
          <div key={i} className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: r.tagc, background: 'color-mix(in srgb, ' + r.tagc + ' 12%, transparent)', padding: '5px 10px', borderRadius: 999 }}>{r.tag}</span>
                <span className="tnum" style={{ fontSize: 15, fontWeight: 700, color: 'var(--azure-600)' }}>+{r.pts} pts</span>
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10, lineHeight: 1.2 }}>{r.t}</h3>
              <p style={{ fontSize: 14.5, color: 'var(--ink-2)', lineHeight: 1.5, flex: 1 }}>{r.d}</p>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.04em', color: 'var(--ink-3)', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)' }}>{r.pillar}</div>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--azure-600)', fontWeight: 600, fontSize: 14.5 }}>
                Start <span style={{ transition: 'transform .2s' }}>→</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- Final CTA + footer ---------- */
export function FinalCTA() {
  return (
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div style={{ background: 'linear-gradient(135deg, var(--navy), var(--azure-600))', borderRadius: 32, padding: '72px 40px', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15), transparent 40%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative' }}>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 22 }}>DATA · INSIGHTS · ACTION · GROWTH</div>
            <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', color: '#fff', letterSpacing: '-0.035em', lineHeight: 1.05 }}>Find out what AI says<br />about you.</h2>
            <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.85)', marginTop: 20, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>Order your first AI Impact Report. See how you rank and how you can improve your visibility.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
              <button className="btn btn-dark" style={{ fontSize: 16, padding: '15px 28px' }}>Order Today</button>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

export function Footer() {
  const cols = [
  ['Platform', ['Visibility Score', 'Competitive rank', 'Citation tracking', 'Trend reports']],
  ['For agents', ['Independent agencies', 'Allstate agents', 'Agency teams', 'New producers']],
  ['Company', ['How it works', 'Methodology', 'Pricing', 'Contact']]];

  return (
    <footer style={{ background: 'var(--dk)', color: 'var(--dk-ink)', padding: '64px 0 40px', marginTop: 20 }}>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40 }} className="foot-grid">
          <div>
            <Wordmark size={24} light />
            <p style={{ fontSize: 14, color: 'var(--dk-ink-2)', marginTop: 16, maxWidth: 260, lineHeight: 1.55 }}>
              The visibility engine for Allstate agents in the age of AI answers.
            </p>
          </div>
          {cols.map((c, i) =>
          <div key={i}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dk-ink-2)', marginBottom: 16 }}>{c[0]}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {c[1].map((l) => <li key={l}><a style={{ fontSize: 14.5, color: 'var(--dk-ink)' }} href="#">{l}</a></li>)}
              </ul>
            </div>
          )}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--dk-line)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--dk-ink-2)' }}>© 2026 AIgent Impact. All rights reserved.</span>
        </div>
      </div>
    </footer>);

}
