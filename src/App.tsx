/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  App.tsx — India's UPI Revolution
 *  React shell that mounts the p5.js cinematic sketch
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from 'react';
import { createSketch } from './sketch';
import { soundEngine } from './soundEngine';
import type p5 from 'p5';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef    = useRef<p5 | null>(null);
  const [started, setStarted]       = useState(false);
  const [muted,   setMuted]         = useState(false);
  const [sceneHint, setSceneHint]   = useState('');

  const hints = [
    '🌌 Scene 1 — Digital Universe Boot',
    '💸 Scene 2 — Live Digital Economy',
    '📱 Scene 3 — Futuristic Phone Payment',
    '🖱️ Scene 4 — Interactive Network',
    '🌍 Scene 5 — Global UPI Impact',
    '🎆 Scene 6 — Grand Finale',
  ];

  /* ── Launch sketch ─────────────────────────────────────────────────── */
  function handleStart() {
    setStarted(true);
    soundEngine.init();

    setTimeout(() => {
      if (!containerRef.current) return;
      sketchRef.current = createSketch(containerRef.current);
    }, 50);
  }

  /* ── Mute toggle ───────────────────────────────────────────────────── */
  function toggleMute() {
    const next = !muted;
    setMuted(next);
    soundEngine.setMasterVolume(next ? 0 : 0.7);
  }

  /* ── Scene hint cycling ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!started) return;
    let idx = 0;
    setSceneHint(hints[0]);
    const iv = setInterval(() => {
      idx = (idx + 1) % hints.length;
      setSceneHint(hints[idx]);
    }, (400 / 60) * 1000); // ~SCENE_DURATION frames at 60fps
    return () => clearInterval(iv);
  }, [started]);

  /* ── Resize ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    const onResize = () => {
      if (sketchRef.current && containerRef.current) {
        (sketchRef.current as any).windowResized?.();
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* ── Cleanup ────────────────────────────────────────────────────────── */
  useEffect(() => {
    return () => { sketchRef.current?.remove(); };
  }, []);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#05081200',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* ── p5 canvas container ── */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', display: started ? 'block' : 'none' }}
      />

      {/* ── Splash / Launch screen ── */}
      {!started && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,#050812 60%,#120830 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 24,
          }}
        >
          {/* Animated glow rings */}
          <div style={{ position: 'relative', width: 180, height: 180, marginBottom: 8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `${4-i}px solid rgba(0,255,255,${0.35-i*0.08})`,
                animation: `ping ${1.2+i*0.4}s ease-out infinite`,
                animationDelay: `${i*0.3}s`,
              }}/>
            ))}
            <div style={{
              position: 'absolute', inset: '20%',
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(0,191,255,0.25) 0%,transparent 70%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 52, filter: 'drop-shadow(0 0 18px cyan)' }}>₹</span>
            </div>
          </div>

          <h1 style={{
            color: '#fff', fontSize: 'clamp(28px,5vw,56px)',
            fontWeight: 800, letterSpacing: 2, margin: 0, textAlign: 'center',
            textShadow: '0 0 40px rgba(0,255,255,0.7)',
          }}>
            India's UPI Revolution
          </h1>

          <p style={{
            color: 'rgba(0,255,157,0.85)', fontSize: 'clamp(14px,2vw,20px)',
            margin: 0, letterSpacing: 1, textAlign: 'center',
          }}>
            Ultra-Cinematic Fintech Experience 2030
          </p>

          <p style={{
            color: 'rgba(64,224,208,0.65)', fontSize: 13,
            maxWidth: 480, textAlign: 'center', lineHeight: 1.6, margin: '0 24px',
          }}>
            Features immersive <strong style={{color:'rgba(0,255,255,0.9)'}}>Web Audio API</strong> sound
            design + <strong style={{color:'rgba(0,255,255,0.9)'}}>Speech Synthesis</strong> — your
            browser will <em>speak</em> "Payment successful!" just like a real UPI app.
          </p>

          <button
            onClick={handleStart}
            style={{
              marginTop: 8,
              padding: '16px 52px',
              background: 'linear-gradient(135deg,#00bfff,#0080ff)',
              border: 'none', borderRadius: 50,
              color: '#fff', fontSize: 18, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 1,
              boxShadow: '0 0 32px rgba(0,191,255,0.6)',
              transition: 'transform 0.15s,box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.transform='scale(1.06)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow='0 0 48px rgba(0,191,255,0.9)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform='scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow='0 0 32px rgba(0,191,255,0.6)';
            }}
          >
            🚀 Launch Experience
          </button>

          {/* Controls legend */}
          <div style={{
            marginTop: 12,
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '6px 24px',
            color: 'rgba(255,255,255,0.45)', fontSize: 12,
            textAlign: 'left',
          }}>
            {[
              ['SPACE','Next scene'],['R','Restart'],
              ['0 – 5','Jump to scene'],['Click','Burst effect'],
              ['Z / X','Zoom in / out'],['Arrow keys','Pan camera'],
            ].map(([k,v]) => (
              <div key={k}>
                <span style={{
                  background:'rgba(0,255,255,0.12)', padding:'1px 6px',
                  borderRadius:4, marginRight:6, fontFamily:'monospace',
                  color:'rgba(0,255,255,0.8)',
                }}>{k}</span>
                {v}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HUD overlay (shown once sketch is running) ── */}
      {started && (
        <>
          {/* Scene hint bar */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            background: 'linear-gradient(90deg,rgba(0,191,255,0.12),rgba(138,43,226,0.12))',
            backdropFilter: 'blur(6px)',
            borderBottom: '1px solid rgba(0,255,255,0.15)',
            padding: '7px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            zIndex: 100,
          }}>
            <span style={{ color:'rgba(0,255,255,0.75)', fontSize:12, letterSpacing:1 }}>
              {sceneHint}
            </span>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11 }}>
                SPACE = next · R = restart · 0-5 = jump
              </span>
              {/* Mute button */}
              <button
                onClick={toggleMute}
                title={muted ? 'Unmute' : 'Mute'}
                style={{
                  background: muted
                    ? 'rgba(255,0,128,0.25)'
                    : 'rgba(0,255,157,0.18)',
                  border: `1px solid ${muted ? 'rgba(255,0,128,0.5)' : 'rgba(0,255,157,0.45)'}`,
                  borderRadius: 8, padding: '4px 12px',
                  color: muted ? 'rgba(255,80,140,0.9)' : 'rgba(0,255,157,0.9)',
                  fontSize: 13, cursor: 'pointer', fontWeight: 600,
                }}
              >
                {muted ? '🔇 Muted' : '🔊 Sound On'}
              </button>
            </div>
          </div>

          {/* "Payment Successful" badge — appears briefly during scene 2 */}
          <PaymentBadge />
        </>
      )}

      {/* Ping animation keyframes */}
      <style>{`
        @keyframes ping {
          0%   { transform: scale(0.85); opacity: 0.8; }
          100% { transform: scale(1.6);  opacity: 0; }
        }
        @keyframes successPop {
          0%   { transform: translateX(-50%) scale(0.7); opacity:0; }
          20%  { transform: translateX(-50%) scale(1.08); opacity:1; }
          80%  { transform: translateX(-50%) scale(1);    opacity:1; }
          100% { transform: translateX(-50%) scale(0.9);  opacity:0; }
        }
      `}</style>
    </div>
  );
}

/* ── Payment badge component shown at scene 2 success moment ── */
function PaymentBadge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Scene 2 at 60fps × 0.65 progress = ~173s from start; we trigger via a
    // simple offset after mount and repeat every full cycle (6 scenes × ~6.67s)
    const SCENE_MS  = (400 / 60) * 1000;   // ≈ 6666 ms per scene
    const CYCLE_MS  = SCENE_MS * 6;         // full loop
    const OFFSET_MS = SCENE_MS * 2 + SCENE_MS * 0.65; // scene 2 @ 65% progress

    function show() {
      setVisible(true);
      setTimeout(() => setVisible(false), 2800);
    }

    const t1 = setTimeout(show, OFFSET_MS);
    const interval = setInterval(show, CYCLE_MS);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg,rgba(0,30,15,0.95),rgba(0,20,10,0.98))',
      border: '2px solid rgba(57,255,20,0.75)',
      borderRadius: 18, padding: '18px 36px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      boxShadow: '0 0 40px rgba(57,255,20,0.4), 0 0 80px rgba(0,255,157,0.2)',
      zIndex: 200,
      animation: 'successPop 2.8s ease-in-out forwards',
      whiteSpace: 'nowrap',
    }}>
      <div style={{ fontSize: 28 }}>✅</div>
      <div style={{
        color: '#39ff14', fontSize: 22, fontWeight: 800, letterSpacing: 1,
        textShadow: '0 0 20px rgba(57,255,20,0.8)',
      }}>
        Payment Successful!
      </div>
      <div style={{ color: 'rgba(255,215,0,0.9)', fontSize: 16, fontWeight: 600 }}>
        ₹ 1,234.00
      </div>
      <div style={{ color: 'rgba(64,224,208,0.65)', fontSize: 11 }}>
        🔊 Hear the voice announcement above ↑
      </div>
    </div>
  );
}
