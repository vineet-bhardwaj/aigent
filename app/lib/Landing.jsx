'use client';
/* ====== AIgent Impact — Nav, Hero, page root ====== */
import { useState, useEffect } from 'react';
import { Wordmark, ScoreGauge, ScanFeed } from './engine';
import {
  TaglineFlow, RealitySection, EngineSection, LeaderboardSection,
  OutcomesSection, CitationSection, TrendSection, RecoSection, FinalCTA, Footer,
} from './sections';

/* Baked-in content (the design's final tweak defaults) */
const CONTENT = {
  yourScore: 82,
  headline: 'Be an agent |AI recommends|.',
  subhead:
    'When a buyer asks an AI assistant for an insurance agent they can trust, one name comes back first. AIgent Impact scores your visibility across every answer engine — and shows you how to be that name and dominate your local market.',
  liveBoard: true,
};

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  const links = [['How it works', '#engine'], ['Rankings', '#rankings'], ['Citations', '#citations'], ['Trend', '#trend']];
  return (
    <header style={{
      position: 'sticky', top: 'var(--banner-h, 0px)', zIndex: 50,
      background: scrolled ? 'rgba(247,249,254,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(180%) blur(14px)' : 'none',
      borderBottom: '1px solid ' + (scrolled ? 'var(--line)' : 'transparent'),
      transition: 'background .3s, border-color .3s'
    }}>
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        <a href="#top"><Wordmark size={31} /></a>
        <nav style={{ display: 'flex', gap: 30 }} className="nav-links">
          {links.map((l) =>
          <a key={l[0]} href={l[1]} style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--ink-2)', transition: 'color .15s', whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => e.target.style.color = 'var(--azure-600)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--ink-2)'}>{l[0]}</a>
          )}
        </nav>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }} className="nav-login">Log in</a>
          <button className="btn btn-primary nav-cta" style={{ padding: '11px 20px', fontSize: 14.5, backgroundColor: "rgb(222, 125, 108)" }}>See your score</button>
        </div>
      </div>
    </header>);

}

function Hero({ headline, sub, score }) {
  // recalculating loop — nudges the displayed score and flips the label
  const [liveScore, setLiveScore] = useState(score);
  const [recalc, setRecalc] = useState(false);
  useEffect(() => {setLiveScore(score);}, [score]);
  useEffect(() => {
    const t = setInterval(() => {
      setRecalc(true);
      setTimeout(() => {
        setLiveScore(() => {
          const base = score;
          const j = Math.round((Math.random() - 0.5) * 4);
          return Math.max(35, Math.min(98, base + j));
        });
        setRecalc(false);
      }, 1100);
    }, 5200);
    return () => clearInterval(t);
  }, [score]);

  return (
    <section id="top" style={{ position: 'relative', paddingTop: 28, paddingBottom: 90, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 1100, height: 700, background: 'radial-gradient(ellipse at center, rgba(75,141,250,0.12), transparent 62%)', pointerEvents: 'none' }}></div>
      <div className="wrap" style={{ position: 'relative' }}>
        {/* header banner image */}
        <div style={{ position: 'relative', marginBottom: 44, borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Allstate agent with a client"
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1900&q=80"
            style={{ display: 'block', width: '100%', height: 340, objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(1,38,124,0.78) 0%, rgba(1,38,124,0.45) 42%, rgba(1,38,124,0) 72%)', pointerEvents: 'none' }}></div>
          <div style={{ position: 'absolute', left: 40, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none', maxWidth: '70%' }}>
            <div className="wordmark" style={{ fontSize: 38, lineHeight: 1 }}>
              <span className="ai" style={{ color: '#fff' }}>AI</span><span className="rest" style={{ color: 'var(--azure-400)' }}>gent&nbsp;Impact</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.92)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.01em', marginTop: 12, maxWidth: 460 }}>Helping Allstate Agents dominate local AI Search and Answers</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }} className="hero-grid">
          <div>
            <span className="eyebrow"><span className="dot"></span>Generative &amp; Answer Engine Optimization</span>
            <h1 className="h-display" style={{ marginTop: 24 }}>
              {headline.split('|').map((part, i) => i === 1 ?
              <span key={i} className="grad-text">{part}</span> :
              <span key={i}>{part}</span>)}
            </h1>
            <p className="lead" style={{ marginTop: 24, maxWidth: 520 }}>{sub}</p>
            <div className="hero-cta" style={{ display: 'flex', gap: 13, marginTop: 36, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ fontSize: 16, padding: '15px 26px', backgroundColor: "rgb(222, 125, 108)" }}>Get my score</button>
              <button className="btn btn-ghost" style={{ fontSize: 16, padding: '15px 26px' }}>How the engine works</button>
            </div>
          </div>

          {/* live engine card */}
          <div className="card" style={{ padding: 30, boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg, var(--navy), var(--azure-600))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontStyle: 'italic', fontSize: 16, flexShrink: 0 }}>JS</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, letterSpacing: '-0.01em' }}>John Smith</div>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>Allstate Agent · Plano, TX</div>
                </div>
              </div>
              <span className="mono" style={{ fontSize: 10.5, fontWeight: 600, color: recalc ? 'var(--warn)' : 'var(--pos)', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'color .3s' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', animation: 'livePulse 2s infinite' }}></span>
                {recalc ? 'computing' : 'live'}
              </span>
            </div>
            <ScoreGauge score={liveScore} recalc={recalc} />
            <div style={{ marginTop: 8, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 13 }}>Engine scan · last 60s</div>
              <div style={{ '--dk-2': 'var(--bg-soft)', '--dk-line': 'var(--line)', '--dk-ink-2': 'var(--ink-2)' }}>
                <ScanFeed />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

export default function Landing() {
  return (
    <>
      <Nav />
      <Hero headline={CONTENT.headline} sub={CONTENT.subhead} score={CONTENT.yourScore} />
      <RealitySection />
      <TaglineFlow />
      <LeaderboardSection youScore={CONTENT.yourScore} live={CONTENT.liveBoard} />
      <OutcomesSection />
      <div id="engine"><EngineSection /></div>
      <CitationSection />
      <TrendSection />
      <RecoSection />
      <FinalCTA />
      <Footer />
    </>);

}
