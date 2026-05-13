/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  UPI CINEMATIC SOUND ENGINE
 *  Web Audio API + Speech Synthesis — "Payment Successful" System
 * ═══════════════════════════════════════════════════════════════════════════
 */

export class UPISoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private initiated = false;
  private paymentSoundPlayed = false;

  /** Call once after a user gesture to unlock AudioContext */
  init() {
    if (this.initiated) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.ctx.destination);
    this.initiated = true;
  }

  private get ac(): AudioContext {
    if (!this.ctx) this.init();
    return this.ctx!;
  }

  private get mg(): GainNode {
    return this.masterGain!;
  }

  // ─── Primitive helpers ───────────────────────────────────────────────────

  private playTone(
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    gainPeak: number,
    attackTime = 0.01,
    releaseTime = 0.05
  ) {
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainPeak, startTime + attackTime);
    gain.gain.setValueAtTime(gainPeak, startTime + duration - releaseTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(this.mg);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  private playNoise(
    startTime: number,
    duration: number,
    gainPeak: number,
    filterFreq = 2000
  ) {
    const bufferSize = this.ac.sampleRate * duration;
    const buffer = this.ac.createBuffer(1, bufferSize, this.ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ac.createBufferSource();
    src.buffer = buffer;

    const filter = this.ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.5;

    const gain = this.ac.createGain();
    gain.gain.setValueAtTime(gainPeak, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.mg);
    src.start(startTime);
    src.stop(startTime + duration);
  }

  // ─── Ambient Background Hum (scene 0 & 1) ───────────────────────────────

  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  startAmbientHum() {
    if (!this.initiated || this.ambientOsc) return;
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(55, this.ac.currentTime);
    osc.frequency.linearRampToValueAtTime(58, this.ac.currentTime + 4);
    gain.gain.setValueAtTime(0, this.ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ac.currentTime + 1.5);
    osc.connect(gain);
    gain.connect(this.mg);
    osc.start();
    this.ambientOsc = osc;
    this.ambientGain = gain;
  }

  stopAmbientHum() {
    if (!this.ambientGain || !this.ambientOsc) return;
    const t = this.ac.currentTime;
    this.ambientGain.gain.linearRampToValueAtTime(0, t + 1);
    this.ambientOsc.stop(t + 1.1);
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  // ─── Scene 0: Digital Universe Boot-up Sweep ────────────────────────────

  playBootSweep() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;

    // Rising frequency sweep
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(20, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 2.5);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
    gain.gain.linearRampToValueAtTime(0, t + 2.5);
    osc.connect(gain);
    gain.connect(this.mg);
    osc.start(t);
    osc.stop(t + 2.6);

    // White-noise burst
    this.playNoise(t, 0.6, 0.15, 1200);

    // High sparkle
    for (let i = 0; i < 5; i++) {
      this.playTone(1200 + i * 400, 'sine', t + 0.2 + i * 0.12, 0.25, 0.08, 0.01, 0.15);
    }
  }

  // ─── Transaction Ping (nodes firing) ────────────────────────────────────

  playTransactionPing() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;
    const freqs = [523, 659, 784, 1047]; // C5 E5 G5 C6
    const pick = freqs[Math.floor(Math.random() * freqs.length)];
    this.playTone(pick, 'sine', t, 0.3, 0.06, 0.005, 0.25);
    this.playTone(pick * 2, 'sine', t, 0.15, 0.02, 0.005, 0.12);
  }

  // ─── QR Scan Beep ────────────────────────────────────────────────────────

  playQRScanBeep() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;
    this.playTone(1800, 'square', t, 0.08, 0.1, 0.005, 0.05);
    this.playTone(2200, 'square', t + 0.1, 0.08, 0.08, 0.005, 0.05);
  }

  // ─── Biometric Verify Chord ──────────────────────────────────────────────

  playBiometricVerify() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;
    // Ascending arpeggio
    [440, 554, 659, 880].forEach((f, i) => {
      this.playTone(f, 'sine', t + i * 0.07, 0.3, 0.09, 0.01, 0.2);
    });
    this.playNoise(t, 0.2, 0.04, 3000);
  }

  // ─── Processing Tick ─────────────────────────────────────────────────────

  playProcessingTick() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;
    this.playTone(600, 'square', t, 0.04, 0.05, 0.002, 0.02);
  }

  // ─── 🎉 PAYMENT SUCCESS — The Star of the Show 🎉 ───────────────────────
  //
  //  Sound design:
  //  1.  Impact flash  — short white-noise burst
  //  2.  Success chord — major triad (C-E-G) with shimmer overtones
  //  3.  Rising arpeggio — cinematic upward sweep
  //  4.  Celebration sparkle — high-freq glitter
  //  5.  Speech synthesis — "Payment successful" in clear Indian English
  //
  playPaymentSuccess() {
    if (!this.initiated) return;
    if (this.paymentSoundPlayed) return;
    this.paymentSoundPlayed = true;

    const t = this.ac.currentTime;

    // 1. Impact noise burst
    this.playNoise(t, 0.12, 0.35, 800);

    // 2. Major chord  C4-E4-G4-C5 — lush sustained
    const chord = [261.63, 329.63, 392.0, 523.25];
    chord.forEach((f) => {
      this.playTone(f, 'sine', t + 0.02, 1.8, 0.18, 0.02, 0.6);
    });

    // 2b. Warm pad underneath
    [130.81, 196.0].forEach((f) => {
      this.playTone(f, 'triangle', t, 2.2, 0.12, 0.05, 0.8);
    });

    // 3. Rising arpeggio sweep
    const arpNotes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5];
    arpNotes.forEach((f, i) => {
      this.playTone(f, 'sine', t + 0.05 + i * 0.07, 0.35, 0.14, 0.01, 0.25);
    });

    // 4. Sparkle glitter layer
    for (let i = 0; i < 12; i++) {
      const glitterFreq = 2000 + Math.random() * 3000;
      this.playTone(glitterFreq, 'sine', t + 0.1 + Math.random() * 0.4, 0.12, 0.04, 0.005, 0.1);
    }

    // 5. Optional extra shimmer ring (after 0.5 s)
    const shimmerFreqs = [1046.5, 1318.5, 1568, 2093];
    shimmerFreqs.forEach((f, i) => {
      this.playTone(f, 'sine', t + 0.5 + i * 0.08, 0.4, 0.06, 0.01, 0.3);
    });

    // 6. 🗣️ Speech synthesis — speaks AFTER the chord lands
    this.speakPaymentSuccess();
  }

  /** Speech synthesis — "Payment successful" with Indian-accented English */
  private speakPaymentSuccess() {
    if (!('speechSynthesis' in window)) return;

    // Cancel any queued speech
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance();
    utter.text = 'Payment successful!';
    utter.lang = 'en-IN';       // Indian English locale
    utter.rate = 0.88;          // Slightly slower — clear announcement style
    utter.pitch = 1.1;          // Slightly higher — friendly/positive
    utter.volume = 1.0;

    // Pick best available voice (prefer en-IN, fallback en-US/GB)
    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang === 'en-IN');
      const usVoice = voices.find(v => v.lang.startsWith('en-US'));
      const gbVoice = voices.find(v => v.lang.startsWith('en-GB'));
      utter.voice = inVoice ?? usVoice ?? gbVoice ?? null;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      pickVoice();
      // Delay speech by 0.65 s so the chord plays first
      setTimeout(() => window.speechSynthesis.speak(utter), 650);
    } else {
      // Voices load asynchronously on some browsers
      window.speechSynthesis.onvoiceschanged = () => {
        pickVoice();
        setTimeout(() => window.speechSynthesis.speak(utter), 650);
      };
    }
  }

  // ─── Globe / Global connection whoosh ────────────────────────────────────

  playGlobalBeam() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.4);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.4);
    osc.connect(gain);
    gain.connect(this.mg);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  // ─── Finale explosion chord ──────────────────────────────────────────────

  playFinaleExplosion() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;

    // Massive bass hit
    this.playTone(55, 'sawtooth', t, 1.5, 0.3, 0.01, 0.8);
    this.playTone(110, 'sawtooth', t, 1.2, 0.2, 0.01, 0.6);

    // Bright stab
    [523, 659, 784].forEach((f, i) => {
      this.playTone(f, 'square', t + i * 0.03, 0.8, 0.15, 0.005, 0.5);
    });

    // White noise crash
    this.playNoise(t, 0.5, 0.4, 1500);

    // Sparkle cascade
    for (let i = 0; i < 20; i++) {
      const f = 800 + Math.random() * 4000;
      this.playTone(f, 'sine', t + 0.05 + Math.random() * 0.6, 0.2, 0.05, 0.005, 0.15);
    }
  }

  // ─── Scene transition whoosh ──────────────────────────────────────────────

  playSceneTransition() {
    if (!this.initiated) return;
    const t = this.ac.currentTime;
    const osc = this.ac.createOscillator();
    const gain = this.ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.5);
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.5);
    osc.connect(gain);
    gain.connect(this.mg);
    osc.start(t);
    osc.stop(t + 0.55);
  }

  // ─── Reset for re-play ────────────────────────────────────────────────────

  resetPaymentFlag() {
    this.paymentSoundPlayed = false;
  }

  setMasterVolume(v: number) {
    if (this.masterGain) this.masterGain.gain.value = Math.max(0, Math.min(1, v));
  }
}

export const soundEngine = new UPISoundEngine();
