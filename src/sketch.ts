/**
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *                    INDIA'S UPI REVOLUTION
 *           Ultra-Cinematic Fintech Experience 2030
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import p5 from 'p5';
import { soundEngine } from './soundEngine';

// ─── Types ────────────────────────────────────────────────────────────────

interface CityData {
  name: string; x: number; y: number; volume: number; tps: number;
}

interface ConnectionData {
  name: string; code: string; angle: number; distance: number; color: number[];
}

// ─── Constants ────────────────────────────────────────────────────────────

const SCENE_DURATION = 400;

const palette = {
  void: [5, 8, 18],
  deepNavy: [10, 15, 35],
  electricCyan: [0, 255, 255],
  neonBlue: [0, 191, 255],
  ultraViolet: [138, 43, 226],
  emeraldGlow: [0, 255, 157],
  plasmaGreen: [57, 255, 20],
  fusionPurple: [186, 85, 211],
  arcticBlue: [64, 224, 208],
  quantumPink: [255, 0, 128],
  solarGold: [255, 215, 0],
};

const typography = { hero: 96, title: 64, subtitle: 36, body: 24, caption: 16, micro: 12 };

const cities: CityData[] = [
  { name: 'Mumbai',    x: 0.36, y: 0.54, volume: 3200, tps: 425 },
  { name: 'Delhi',     x: 0.42, y: 0.24, volume: 2850, tps: 380 },
  { name: 'Bangalore', x: 0.41, y: 0.69, volume: 2400, tps: 340 },
  { name: 'Hyderabad', x: 0.44, y: 0.61, volume: 1950, tps: 285 },
  { name: 'Chennai',   x: 0.46, y: 0.71, volume: 1800, tps: 260 },
  { name: 'Kolkata',   x: 0.59, y: 0.37, volume: 1650, tps: 240 },
  { name: 'Pune',      x: 0.38, y: 0.57, volume: 1420, tps: 215 },
  { name: 'Ahmedabad', x: 0.32, y: 0.37, volume: 1280, tps: 195 },
  { name: 'Jaipur',    x: 0.38, y: 0.30, volume:  980, tps: 145 },
  { name: 'Lucknow',   x: 0.46, y: 0.30, volume:  890, tps: 128 },
];

const globalConnections: ConnectionData[] = [
  { name: 'United States',       code: 'USA', angle: 200, distance: 220, color: palette.electricCyan },
  { name: 'United Arab Emirates', code: 'UAE', angle: 240, distance: 190, color: palette.solarGold },
  { name: 'Singapore',           code: 'SG',  angle: 280, distance: 180, color: palette.plasmaGreen },
  { name: 'United Kingdom',      code: 'UK',  angle: 150, distance: 210, color: palette.neonBlue },
  { name: 'France',              code: 'FR',  angle: 170, distance: 205, color: palette.fusionPurple },
  { name: 'Australia',           code: 'AU',  angle: 310, distance: 195, color: palette.arcticBlue },
];

// ─── Easing helpers ───────────────────────────────────────────────────────

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeOutQuad(t:  number) { return 1 - (1 - t) * (1 - t); }
function easeOutElastic(t: number) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

// ═════════════════════════════════════════════════════════════════════════════
//  SKETCH FACTORY
// ═════════════════════════════════════════════════════════════════════════════

export function createSketch(container: HTMLElement) {
  return new p5((s: p5) => {

    // ── State ──────────────────────────────────────────────────────────────
    let sceneState   = 0;
    let sceneTimer   = 0;
    let lastScene    = -1;

    let particles:    AmbientParticle[]   = [];
    let starfield:    Star[]              = [];
    let nodes:        TransactionNode[]   = [];
    let transactions: AdvancedMoneyFlow[] = [];
    let ripples:      Ripple[]            = [];
    let confetti:     PremiumConfetti[]   = [];
    let globalBeams:  GlobalPaymentBeam[] = [];
    let energyWaves:  EnergyWave[]        = [];
    let codeRain:     CodeStream[]        = [];
    let hudElements:  FloatingHUD[]       = [];
    let mouseTrail:   {x:number;y:number}[] = [];
    let scanLines:    number[]            = [];

    let phone:        FuturisticPhone;
    let qrScanner:    HolographicQRScanner;
    let statsDisplay: LiveStatsHUD;
    let globe:        HolographicGlobe;
    let camSys:       CinematicCamera;

    let stats = {
      tps: 0, targetTps: 15847, totalTransactions: 0,
      activeUsers: 42000000, successRate: 99.98, dailyVolume: 0, peakTps: 18500,
    };

    let camState = { x: 0, y: 0, targetZoom: 1 };

    // Sound cooldown flags per scene
    let soundFlags = {
      bootPlayed: false,
      ambientOn: false,
      qrBeepPlayed: false,
      bioPlayed: false,
      procTick: 0,
      successPlayed: false,
      globalPlayed: false,
      finalePlayed: false,
    };

    // ── Utility: glow ────────────────────────────────────────────────────

    function premiumGlow(x: number, y: number, sz: number, col: number[], alpha: number) {
      (s.drawingContext as CanvasRenderingContext2D).shadowBlur = sz;
      (s.drawingContext as CanvasRenderingContext2D).shadowColor =
        `rgba(${col[0]},${col[1]},${col[2]},${alpha / 255})`;
      s.fill(col[0], col[1], col[2], alpha * 0.2);
      s.noStroke();
      s.circle(x, y, sz);
    }

    function clearGlow() {
      (s.drawingContext as CanvasRenderingContext2D).shadowBlur = 0;
      (s.drawingContext as CanvasRenderingContext2D).shadowColor = 'transparent';
    }

    // ══════════════════════════════════════════════════════════════════════
    //  CLASSES
    // ══════════════════════════════════════════════════════════════════════

    class Star {
      x = s.random(s.width);
      y = s.random(s.height);
      z = s.random(s.width);
      pz = this.z;

      reset() {
        this.x = s.random(s.width); this.y = s.random(s.height);
        this.z = s.random(s.width); this.pz = this.z;
      }
      update() { this.z -= 1.5; if (this.z < 1) this.reset(); }
      display() {
        s.fill(255, 180); s.noStroke();
        const sx = s.map(this.x / this.z, 0, 1, 0, s.width);
        const sy = s.map(this.y / this.z, 0, 1, 0, s.height);
        const r  = s.map(this.z, 0, s.width, 3.5, 0);
        s.circle(sx, sy, r);
        const px = s.map(this.x / this.pz, 0, 1, 0, s.width);
        const py = s.map(this.y / this.pz, 0, 1, 0, s.height);
        s.stroke(255, 80); s.strokeWeight(r / 2);
        s.line(px, py, sx, sy);
        this.pz = this.z;
      }
    }

    class AmbientParticle {
      x = s.random(s.width); y = s.random(s.height);
      vx = s.random(-0.7, 0.7); vy = s.random(-0.7, 0.7);
      sz = s.random(1, 4); alpha = s.random(80, 170);
      col = [palette.neonBlue, palette.electricCyan, palette.ultraViolet][Math.floor(s.random(3))];
      phase = s.random(s.TWO_PI);

      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = s.width;
        if (this.x > s.width) this.x = 0;
        if (this.y < 0) this.y = s.height;
        if (this.y > s.height) this.y = 0;
        const d = s.dist(s.mouseX, s.mouseY, this.x, this.y);
        if (d < 130) {
          const f = s.map(d, 0, 130, 0.4, 0);
          const a = s.atan2(this.y - s.mouseY, this.x - s.mouseX);
          this.vx += Math.cos(a) * f * 0.1;
          this.vy += Math.sin(a) * f * 0.1;
        }
        this.vx *= 0.98; this.vy *= 0.98;
        this.phase += 0.05;
      }

      display() {
        const p = Math.sin(this.phase) * 0.3 + 0.7;
        s.fill(this.col[0], this.col[1], this.col[2], this.alpha * p);
        s.noStroke();
        s.circle(this.x, this.y, this.sz * p);
      }
    }

    class TransactionNode {
      x: number; y: number; name: string; volume: number; tps: number;
      pulsePhase = s.random(s.TWO_PI);
      baseSize = 18; activityLevel = 0; targetActivity = 0;

      constructor(x:number, y:number, name:string, volume:number, tps:number) {
        this.x=x; this.y=y; this.name=name; this.volume=volume; this.tps=tps;
      }

      update() {
        this.pulsePhase += 0.04;
        this.targetActivity = s.random(0.5, 1);
        this.activityLevel = s.lerp(this.activityLevel, this.targetActivity, 0.05);
      }

      display() {
        const hb = Math.sin(this.pulsePhase) * 0.25 + 0.75;
        const sz = this.baseSize * hb * (0.8 + this.activityLevel * 0.4);

        premiumGlow(this.x, this.y, sz * 8, palette.neonBlue, 80);
        premiumGlow(this.x, this.y, sz * 5, palette.electricCyan, 120);
        clearGlow();

        for (let i = 0; i < 3; i++) {
          const rp = (this.pulsePhase + i * s.PI / 1.5) % s.TWO_PI;
          const rr = sz * (1 + (rp / s.TWO_PI) * 3);
          const ra = (1 - rp / s.TWO_PI) * 180 * this.activityLevel;
          s.noFill();
          s.stroke(palette.arcticBlue[0], palette.arcticBlue[1], palette.arcticBlue[2], ra);
          s.strokeWeight(2);
          s.circle(this.x, this.y, rr);
        }

        s.fill(palette.neonBlue[0], palette.neonBlue[1], palette.neonBlue[2]);
        s.noStroke();
        s.circle(this.x, this.y, sz);
        s.fill(palette.electricCyan[0], palette.electricCyan[1], palette.electricCyan[2], 200);
        s.circle(this.x, this.y, sz * 0.7);
        s.fill(255, 200); s.circle(this.x - sz*0.2, this.y - sz*0.2, sz * 0.3);

        // label
        s.fill(220); s.noStroke();
        s.textSize(typography.micro); s.textAlign(s.CENTER, s.CENTER);
        s.text(this.name, this.x, this.y + sz + 10);
      }

      renderActivityHeatmap() {
        const hr = this.baseSize * 5 * this.activityLevel;
        for (let r = hr; r > 0; r -= 10) {
          const a = s.map(r, 0, hr, 60, 0) * this.activityLevel;
          s.fill(palette.quantumPink[0], palette.quantumPink[1], palette.quantumPink[2], a);
          s.noStroke(); s.circle(this.x, this.y, r);
        }
      }

      renderAIShield() {
        if (this.activityLevel < 0.7) return;
        const sp = (s.frameCount * 0.05) % s.TWO_PI;
        const sr = this.baseSize * 3;
        s.push(); s.translate(this.x, this.y); s.rotate(sp);
        s.noFill();
        s.stroke(palette.emeraldGlow[0], palette.emeraldGlow[1], palette.emeraldGlow[2], 140);
        s.strokeWeight(2);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * s.TWO_PI;
          const a2 = a + s.TWO_PI / 6;
          s.line(Math.cos(a)*sr, Math.sin(a)*sr, Math.cos(a2)*sr, Math.sin(a2)*sr);
        }
        s.pop();
      }

      showPremiumInfo() {
        s.push();
        const cw = 230, ch = 130, cx = this.x, cy = this.y - 95;
        s.fill(0, 0, 0, 90); s.noStroke(); s.rectMode(s.CENTER);
        s.rect(cx+4, cy+4, cw, ch, 14);
        s.fill(palette.deepNavy[0], palette.deepNavy[1], palette.deepNavy[2], 220);
        s.stroke(palette.electricCyan[0], palette.electricCyan[1], palette.electricCyan[2], 200);
        s.strokeWeight(2); s.rect(cx, cy, cw, ch, 14);

        s.fill(255); s.noStroke(); s.textSize(typography.caption); s.textStyle(s.BOLD);
        s.textAlign(s.CENTER, s.CENTER); s.text(this.name, cx, cy - 40);

        s.textStyle(s.NORMAL); s.textSize(typography.micro);
        s.fill(palette.solarGold[0], palette.solarGold[1], palette.solarGold[2]);
        s.textAlign(s.LEFT, s.CENTER);
        s.text(`Vol: ₹${this.volume}Cr/day`, cx - 100, cy - 15);
        s.fill(palette.plasmaGreen[0], palette.plasmaGreen[1], palette.plasmaGreen[2]);
        s.text(`TPS: ${this.tps}`, cx - 100, cy + 10);
        s.fill(palette.arcticBlue[0], palette.arcticBlue[1], palette.arcticBlue[2]);
        s.text(`Activity: ${(this.activityLevel * 100).toFixed(0)}%`, cx - 100, cy + 35);

        s.pop(); s.textAlign(s.CENTER, s.CENTER);
      }
    }

    class AdvancedMoneyFlow {
      from: TransactionNode; to: TransactionNode;
      progress = 0;
      speed = s.random(0.012, 0.024);
      amount = Math.floor(s.random(100, 99999));
      col = [palette.plasmaGreen, palette.electricCyan, palette.solarGold, palette.neonBlue][Math.floor(s.random(4))];
      trail: {x:number;y:number;life:number}[] = [];

      constructor(from: TransactionNode, to: TransactionNode) { this.from=from; this.to=to; }

      getPos() {
        const cx = (this.from.x + this.to.x) / 2;
        const cy = (this.from.y + this.to.y) / 2 - 100;
        return {
          x: s.bezierPoint(this.from.x, cx, cx, this.to.x, this.progress),
          y: s.bezierPoint(this.from.y, cy, cy, this.to.y, this.progress),
        };
      }

      update() {
        this.progress += this.speed;
        if (s.frameCount % 3 === 0) {
          const pos = this.getPos();
          this.trail.push({x: pos.x, y: pos.y, life: 28});
        }
        for (let i = this.trail.length - 1; i >= 0; i--) {
          this.trail[i].life--;
          if (this.trail[i].life <= 0) this.trail.splice(i, 1);
        }
      }

      display() {
        const cx = (this.from.x + this.to.x) / 2;
        const cy = (this.from.y + this.to.y) / 2 - 100;
        s.noFill();
        s.stroke(this.col[0], this.col[1], this.col[2], 70);
        s.strokeWeight(2);
        s.bezier(this.from.x, this.from.y, cx, cy, cx, cy, this.to.x, this.to.y);

        for (const t of this.trail) {
          const a = s.map(t.life, 0, 28, 0, 180);
          s.fill(this.col[0], this.col[1], this.col[2], a);
          s.noStroke(); s.circle(t.x, t.y, s.map(t.life, 0, 28, 2, 5));
        }

        const pos = this.getPos();
        s.push(); s.translate(pos.x, pos.y);
        premiumGlow(0, 0, 22, this.col, 200); clearGlow();
        s.fill(this.col[0], this.col[1], this.col[2]); s.noStroke(); s.circle(0, 0, 11);
        s.fill(255, 200); s.circle(-2, -2, 5);

        if (this.progress > 0.25 && this.progress < 0.75) {
          let la = 255;
          if (this.progress < 0.35) la = s.map(this.progress, 0.25, 0.35, 0, 255);
          if (this.progress > 0.65) la = s.map(this.progress, 0.65, 0.75, 255, 0);
          s.fill(palette.void[0], palette.void[1], palette.void[2], la * 0.8);
          s.noStroke(); s.rectMode(s.CENTER); s.rect(0, -20, 70, 18, 7);
          s.fill(this.col[0], this.col[1], this.col[2], la);
          s.textSize(typography.micro); s.textStyle(s.BOLD);
          s.text(`₹${this.amount.toLocaleString()}`, 0, -20);
        }
        s.pop();
      }

      isDead() { return this.progress >= 1; }
    }

    class EnergyWave {
      radius = 0; alpha = 255;
      constructor(public x:number, public y:number, public col=palette.electricCyan) {}
      update() { this.radius += 5; this.alpha = s.map(this.radius, 0, 200, 255, 0); }
      display() {
        for (let i = 0; i < 3; i++) {
          s.noFill();
          s.stroke(this.col[0], this.col[1], this.col[2], this.alpha*(1-i*0.3));
          s.strokeWeight(3-i);
          s.circle(this.x, this.y, this.radius + i*14);
        }
      }
      isDead() { return this.radius >= 200; }
    }

    class BurstParticle {
      x: number; y: number; vx: number; vy: number;
      life = 55; sz = s.random(3,7);
      col = [palette.plasmaGreen, palette.electricCyan, palette.solarGold][Math.floor(s.random(3))];
      constructor(x:number,y:number,angle:number,speed:number){
        this.x=x; this.y=y;
        this.vx=Math.cos(angle)*speed; this.vy=Math.sin(angle)*speed;
      }
      update(){ this.x+=this.vx; this.y+=this.vy; this.vy+=0.1; this.vx*=0.98; this.vy*=0.98; this.life--; }
      display(){
        const a=s.map(this.life,0,55,0,255);
        s.fill(this.col[0],this.col[1],this.col[2],a); s.noStroke();
        s.circle(this.x, this.y, s.map(this.life,0,55,1,this.sz));
      }
      isDead(){ return this.life<=0; }
    }

    class Ripple {
      radius=0; alpha=255;
      constructor(public x:number, public y:number){}
      update(){ this.radius+=7; this.alpha=s.map(this.radius,0,180,255,0); }
      display(){
        for(let i=0;i<4;i++){
          s.noFill();
          s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],this.alpha*(1-i*0.25));
          s.strokeWeight(4-i);
          s.circle(this.x, this.y, this.radius+i*16);
        }
      }
      isDead(){ return this.radius>=180; }
    }

    class PremiumConfetti {
      x = s.width/2 + s.random(-120,120);
      y = s.height/2 - 50;
      vx = s.random(-4,4); vy = s.random(-10,-5);
      sz = s.random(6,14); rotation = s.random(s.TWO_PI);
      rotSpd = s.random(-0.25,0.25); gravity=0.32; life=255;
      col = [palette.neonBlue,palette.electricCyan,palette.plasmaGreen,palette.solarGold,palette.quantumPink][Math.floor(s.random(5))];
      shape = Math.floor(s.random(3));

      update(){ this.x+=this.vx; this.y+=this.vy; this.vy+=this.gravity; this.rotation+=this.rotSpd; this.life-=2.5; }
      display(){
        s.push(); s.translate(this.x,this.y); s.rotate(this.rotation);
        s.fill(this.col[0],this.col[1],this.col[2],this.life); s.noStroke();
        if(this.shape===0){ s.rectMode(s.CENTER); s.rect(0,0,this.sz,this.sz*1.5); }
        else if(this.shape===1){ s.circle(0,0,this.sz); }
        else { s.triangle(0,-this.sz/2,-this.sz/2,this.sz/2,this.sz/2,this.sz/2); }
        s.pop();
      }
      isDead(){ return this.life<=0 || this.y>s.height+50; }
    }

    class CodeStream {
      x: number; y: number; speed = s.random(2,5); alpha=35;
      chars = '01₹UPI';
      constructor(x:number){ this.x=x; this.y=s.random(-s.height,0); }
      update(){ this.y+=this.speed; if(this.y>s.height){ this.y=-40; this.x=s.random(s.width); } }
      display(){
        const c = this.chars.charAt(Math.floor(s.random(this.chars.length)));
        s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],this.alpha);
        s.textSize(typography.caption); s.text(c,this.x,this.y);
      }
    }

    class FloatingHUD {
      x: number; y: number; tx: number; ty: number;
      sz = s.random(40,75); rotation=s.random(s.TWO_PI);
      constructor(){ this.x=s.random(100,s.width-100); this.y=s.random(100,s.height-100); this.tx=this.x; this.ty=this.y; }
      update(){
        if(s.frameCount%120===0){ this.tx=s.random(100,s.width-100); this.ty=s.random(100,s.height-100); }
        this.x=s.lerp(this.x,this.tx,0.02); this.y=s.lerp(this.y,this.ty,0.02); this.rotation+=0.005;
      }
      display(){
        s.push(); s.translate(this.x,this.y); s.rotate(this.rotation);
        s.noFill(); s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],55);
        s.strokeWeight(1.5);
        s.beginShape();
        for(let i=0;i<6;i++){ const a=(i/6)*s.TWO_PI; s.vertex(Math.cos(a)*this.sz/2, Math.sin(a)*this.sz/2); }
        s.endShape(s.CLOSE); s.pop();
      }
    }

    class LiveStatsHUD {
      x: number; y=100; w=255; h=275; graphData: number[]=[];
      constructor(){ this.x=s.width-265; for(let i=0;i<50;i++) this.graphData.push(s.random(0.5,1)); }

      update(){
        this.graphData.push(stats.tps/stats.peakTps);
        if(this.graphData.length>50) this.graphData.shift();
        this.x = s.width-265;
      }

      display(){
        s.push();
        s.fill(0,0,0,110); s.noStroke(); s.rect(this.x+4,this.y+4,this.w,this.h,16);
        s.fill(palette.deepNavy[0],palette.deepNavy[1],palette.deepNavy[2],200);
        s.stroke(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],150);
        s.strokeWeight(2); s.rect(this.x,this.y,this.w,this.h,16);

        s.fill(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],70);
        s.noStroke(); s.rect(this.x,this.y,this.w,44,16,16,0,0);

        s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2]);
        s.textSize(typography.caption); s.textStyle(s.BOLD); s.textAlign(s.LEFT,s.TOP);
        s.text('LIVE ANALYTICS', this.x+16, this.y+16);

        let sy = this.y+58;
        this.statRow('Transactions/sec', Math.floor(stats.tps).toLocaleString(), palette.plasmaGreen, sy);
        sy+=62;
        this.statRow('Success Rate', stats.successRate+'%', palette.emeraldGlow, sy);
        sy+=62;
        this.statRow('Active Users', (stats.activeUsers/1e6).toFixed(1)+'M', palette.electricCyan, sy);

        // mini graph
        const gx=this.x+12, gy=this.y+this.h-50, gw=this.w-24, gh=32;
        s.fill(palette.void[0],palette.void[1],palette.void[2],150);
        s.noStroke(); s.rect(gx,gy,gw,gh,4);
        s.noFill();
        s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],200);
        s.strokeWeight(2);
        s.beginShape();
        for(let i=0;i<this.graphData.length;i++){
          s.vertex(gx+(i/this.graphData.length)*gw, gy+gh-this.graphData[i]*gh);
        }
        s.endShape();

        s.pop(); s.textAlign(s.CENTER,s.CENTER);
      }

      statRow(label:string, val:string, col:number[], y:number){
        s.textStyle(s.NORMAL); s.textSize(typography.micro); s.fill(180); s.textAlign(s.LEFT,s.TOP);
        s.text(label, this.x+16, y);
        s.textStyle(s.BOLD); s.textSize(20);
        s.fill(col[0],col[1],col[2]); s.text(val, this.x+16, y+18);
      }
    }

    class FuturisticPhone {
      x: number; y: number; w=310; h=630; cr=32; rotation=0; tr=0;
      constructor(){ this.x=s.width/2; this.y=s.height/2; }

      update(_progress: number){
        this.y = s.height/2 + Math.sin(s.frameCount*0.015)*12;
        this.rotation = s.lerp(this.rotation, this.tr, 0.1);
        this.tr = Math.sin(s.frameCount*0.01)*0.02;
      }

      display(){
        s.push(); s.translate(this.x,this.y); s.rotate(this.rotation);

        // shadow
        for(let i=5;i>0;i--){ s.fill(0,0,0,18/i); s.noStroke(); s.rect(i*2,i*2,this.w,this.h,this.cr); }

        // metal edge
        s.fill(55,55,75); s.stroke(115,115,135); s.strokeWeight(9);
        s.rect(0,0,this.w,this.h,this.cr);

        // screen bezel
        s.fill(12,12,22); s.noStroke(); s.rect(0,0,this.w-10,this.h-10,this.cr-2);

        (s.drawingContext as CanvasRenderingContext2D).shadowBlur=35;
        (s.drawingContext as CanvasRenderingContext2D).shadowColor='rgba(0,191,255,0.3)';
        s.fill(8,10,20); s.rect(0,0,this.w-18,this.h-18,this.cr-4);
        clearGlow();

        // notch
        s.fill(12,12,22); s.noStroke(); s.rect(0,-this.h/2+13,105,26,13);
        s.fill(8,8,14); s.circle(-22,-this.h/2+13,11);
        s.fill(28,28,48); s.circle(-22,-this.h/2+13,7);
        s.fill(8,8,14); s.rect(10,-this.h/2+13,32,7,3);

        this.renderApp();

        s.noFill();
        s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],90);
        s.strokeWeight(1.5);
        s.rect(0,0,this.w-20,this.h-20,this.cr-4);

        s.pop();
      }

      renderApp(){
        s.push();
        // status bar
        s.fill(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],35);
        s.noStroke(); s.rect(0,-this.h/2+56,this.w-22,48,11);
        s.fill(255); s.textSize(typography.caption); s.textStyle(s.BOLD); s.textAlign(s.CENTER,s.CENTER);
        s.text('UPI Payment', 0, -this.h/2+72);

        // QR area
        s.fill(255); s.rect(0,-55,195,195,11);
        s.fill(0); s.noStroke();
        for(let i=0;i<6;i++) for(let j=0;j<6;j++){
          if((i+j+Math.floor(s.frameCount*0.1))%2===0)
            s.rect(-82+i*27,-140+j*27,25,25,2);
        }
        s.stroke(0); s.strokeWeight(4); s.noFill();
        s.rect(-78,-138,38,38,4); s.rect(40,-138,38,38,4); s.rect(-78,98,38,38,4);

        // amount
        s.textStyle(s.NORMAL); s.textSize(typography.micro); s.fill(155);
        s.textAlign(s.CENTER,s.CENTER);
        s.text('Amount to Pay', 0, 108);
        s.textSize(typography.subtitle); s.textStyle(s.BOLD);
        s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2]);
        s.text('₹ 1,234', 0, 150);

        // pay button
        const ctx = s.drawingContext as CanvasRenderingContext2D;
        ctx.save();
        const grad = ctx.createLinearGradient(0,190,0,248);
        grad.addColorStop(0,'rgba(0,191,255,1)'); grad.addColorStop(1,'rgba(0,140,255,1)');
        ctx.fillStyle = grad; ctx.shadowBlur=18; ctx.shadowColor='rgba(0,191,255,0.5)';
        ctx.beginPath(); (ctx as any).roundRect(-97,192,194,48,24); ctx.fill(); ctx.restore();
        clearGlow();
        s.fill(255); s.textSize(typography.body); s.textStyle(s.BOLD); s.text('Pay Now', 0, 218);

        s.textSize(typography.micro); s.textStyle(s.NORMAL); s.fill(135);
        s.text('Secure · Encrypted · UPI', 0, 278);

        s.pop(); s.textAlign(s.CENTER,s.CENTER);
      }
    }

    class HolographicQRScanner {
      scan(progress: number){
        s.push(); s.translate(s.width/2, s.height/2-55);
        const scanY = s.map(progress,0,1,-97,97);

        const ctx = s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=28; ctx.shadowColor='rgba(0,255,157,0.9)';
        s.stroke(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],255);
        s.strokeWeight(4); s.line(-97,scanY,97,scanY);
        clearGlow();

        for(let i=0;i<10;i++){
          s.fill(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],200);
          s.noStroke(); s.circle(-97+i*21,scanY,5);
        }

        const bsz=48, ba=200;
        const ca=Math.sin(s.frameCount*0.1)*3;
        s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],ba);
        s.strokeWeight(5); s.noFill();
        s.arc(-97+ca,-97+ca,bsz,bsz,s.PI,s.PI+s.HALF_PI);
        s.arc( 97-ca,-97+ca,bsz,bsz,-s.HALF_PI,0);
        s.arc(-97+ca, 97-ca,bsz,bsz,s.HALF_PI,s.PI);
        s.arc( 97-ca, 97-ca,bsz,bsz,0,s.HALF_PI);

        if(progress>0.3){
          const ta=s.map(progress,0.3,0.6,0,255);
          s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],ta);
          s.textSize(typography.caption); s.textStyle(s.BOLD); s.textAlign(s.CENTER,s.CENTER);
          s.text('SCANNING QR CODE',0,138);
          const bw=155; const bp=progress*bw;
          s.noFill(); s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],ta);
          s.strokeWeight(2); s.rect(-bw/2,162,bw,5,3);
          s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],ta);
          s.noStroke(); s.rect(-bw/2,162,bp,5,3);
        }
        s.pop();
      }
    }

    class HolographicGlobe {
      cx: number; cy: number; radius=175; rotation=0;
      constructor(){ this.cx=s.width/2; this.cy=s.height/2; }

      update(progress: number){ this.rotation=progress*s.TWO_PI*2; this.cx=s.width/2; this.cy=s.height/2; }

      display(){
        s.push(); s.translate(this.cx,this.cy);

        premiumGlow(0,0,this.radius*2.8,palette.neonBlue,55); clearGlow();
        s.noFill(); s.stroke(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],170);
        s.strokeWeight(3); s.circle(0,0,this.radius*2);
        s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],100);
        s.strokeWeight(2); s.circle(0,0,this.radius*2-10);

        for(let i=-2;i<=2;i++){
          const y=i*this.radius/2.5;
          const r=Math.sqrt(this.radius*this.radius-y*y);
          s.stroke(palette.arcticBlue[0],palette.arcticBlue[1],palette.arcticBlue[2],90);
          s.strokeWeight(1.5); s.noFill(); s.ellipse(0,y,r*2,22);
        }

        for(let i=0;i<8;i++){
          s.push(); s.rotate(i*s.PI/8+this.rotation*0.3);
          s.noFill(); s.stroke(palette.arcticBlue[0],palette.arcticBlue[1],palette.arcticBlue[2],90);
          s.strokeWeight(1.5); s.ellipse(0,0,32,this.radius*2); s.pop();
        }

        const ix=48+Math.sin(this.rotation)*18, iy=22+Math.cos(this.rotation)*9;
        premiumGlow(ix,iy,48,palette.emeraldGlow,200);
        premiumGlow(ix,iy,28,palette.plasmaGreen,255); clearGlow();
        s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2]); s.noStroke(); s.circle(ix,iy,22);
        s.fill(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],200); s.circle(ix,iy,14);
        s.fill(255,220); s.circle(ix-4,iy-4,7);

        const pp=(s.frameCount*0.03)%1;
        const pr=pp*78; const pa=(1-pp)*200;
        s.noFill(); s.stroke(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],pa);
        s.strokeWeight(2); s.circle(ix,iy,pr);

        for(const c of globalConnections){
          const a=c.angle*s.PI/180+this.rotation*0.5;
          const x=Math.cos(a)*this.radius, y=Math.sin(a)*this.radius;
          s.fill(c.color[0],c.color[1],c.color[2],210); s.noStroke(); s.circle(x,y,13);
          premiumGlow(x,y,22,c.color,140); clearGlow();
          s.stroke(c.color[0],c.color[1],c.color[2],75); s.strokeWeight(2); s.line(ix,iy,x,y);
          const dp=(s.frameCount*0.02+c.angle*0.01)%1;
          s.fill(c.color[0],c.color[1],c.color[2],255); s.noStroke();
          s.circle(s.lerp(ix,x,dp), s.lerp(iy,y,dp), 5);
          // label
          s.fill(255,180); s.textSize(typography.micro); s.text(c.code, x+16*Math.sign(x), y);
        }

        s.pop();
      }
    }

    class GlobalPaymentBeam {
      startAngle: number; col: number[]; progress=0; speed=s.random(0.014,0.024); radius=175;
      constructor(){
        const c = globalConnections[Math.floor(s.random(globalConnections.length))];
        this.startAngle=c.angle*s.PI/180; this.col=c.color;
      }
      update(){ this.progress+=this.speed; }
      display(){
        s.push(); s.translate(s.width/2,s.height/2);
        const sx=Math.cos(this.startAngle)*this.radius, sy=Math.sin(this.startAngle)*this.radius;
        const ix=48, iy=22;
        const cx=s.lerp(sx,ix,this.progress), cy=s.lerp(sy,iy,this.progress);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=14; ctx.shadowColor=`rgba(${this.col[0]},${this.col[1]},${this.col[2]},0.8)`;
        s.stroke(this.col[0],this.col[1],this.col[2],140); s.strokeWeight(3); s.line(sx,sy,cx,cy);
        clearGlow();
        premiumGlow(cx,cy,18,this.col,200); clearGlow();
        s.fill(this.col[0],this.col[1],this.col[2]); s.noStroke(); s.circle(cx,cy,9);
        s.fill(255,200); s.circle(cx-2,cy-2,4);
        s.pop();
      }
      isDead(){ return this.progress>=1; }
    }

    class CinematicCamera {
      x=0; y=0; zoom=1; targetZoom=1; shake=0;
      update(){
        this.zoom=s.lerp(this.zoom,this.targetZoom,0.05);
        this.shake*=0.9;
        this.x=s.lerp(this.x,camState.x,0.1);
        this.y=s.lerp(this.y,camState.y,0.1);
        this.targetZoom=camState.targetZoom;
      }
      apply(){
        s.translate(s.width/2,s.height/2); s.scale(this.zoom);
        if(this.shake>0) s.translate(s.random(-this.shake,this.shake),s.random(-this.shake,this.shake));
        s.translate(-s.width/2-this.x,-s.height/2-this.y);
      }
      addShake(v:number){ this.shake=v; }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SETUP
    // ══════════════════════════════════════════════════════════════════════

    s.setup = () => {
      const cnv = s.createCanvas(container.clientWidth, container.clientHeight);
      cnv.parent(container);
      s.pixelDensity(Math.min(window.devicePixelRatio, 2));
      s.frameRate(60); s.smooth();
      s.textAlign(s.CENTER,s.CENTER);

      for(let i=0;i<200;i++) starfield.push(new Star());
      for(let i=0;i<90;i++) particles.push(new AmbientParticle());
      for(let i=0;i<28;i++) codeRain.push(new CodeStream(i*(s.width/28)));
      for(let y=0;y<s.height;y+=4) scanLines.push(y);
      for(let i=0;i<6;i++) hudElements.push(new FloatingHUD());

      for(const c of cities){
        nodes.push(new TransactionNode(c.x*s.width, c.y*s.height, c.name, c.volume, c.tps));
      }

      phone        = new FuturisticPhone();
      qrScanner    = new HolographicQRScanner();
      statsDisplay = new LiveStatsHUD();
      globe        = new HolographicGlobe();
      camSys       = new CinematicCamera();
    };

    // ══════════════════════════════════════════════════════════════════════
    //  DRAW
    // ══════════════════════════════════════════════════════════════════════

    s.draw = () => {
      renderBG();
      renderHolographicNoise();

      sceneTimer++;

      // Scene-change sound triggers
      if(sceneState !== lastScene){
        handleSceneEnterSound(sceneState);
        lastScene = sceneState;
      }

      if(sceneTimer > SCENE_DURATION) advanceScene();

      camSys.update();
      s.push(); camSys.apply();

      switch(sceneState){
        case 0: renderCinematicIntro(); break;
        case 1: renderLiveEconomy();    break;
        case 2: renderPhoneScene();     break;
        case 3: renderInteractiveMode();break;
        case 4: renderGlobalImpact();   break;
        case 5: renderGrandFinale();    break;
      }

      s.pop();

      for(const st of starfield){ st.update(); st.display(); }
      for(const p  of particles){ p.update();  p.display(); }

      if(sceneState>=1) for(const c of codeRain){ c.update(); c.display(); }
      if(sceneState>=3){ renderMouseTrail(); renderEnergyField(); }

      renderScanLines();
      renderTransition();
      if(sceneState===0||sceneState===5) renderLensFlares();
    };

    // ─── Sound on scene enter ─────────────────────────────────────────────

    function handleSceneEnterSound(scene: number){
      soundEngine.resetPaymentFlag();
      soundFlags.qrBeepPlayed = false;
      soundFlags.bioPlayed    = false;
      soundFlags.procTick     = 0;
      soundFlags.successPlayed= false;
      soundFlags.globalPlayed = false;
      soundFlags.finalePlayed = false;

      if(scene===0){
        setTimeout(()=>{ soundEngine.playBootSweep(); soundEngine.startAmbientHum(); }, 300);
      } else {
        soundEngine.playSceneTransition();
        if(scene===1 && !soundFlags.ambientOn){ soundEngine.startAmbientHum(); soundFlags.ambientOn=true; }
        if(scene===4){ soundEngine.stopAmbientHum(); }
        if(scene===5){ soundEngine.stopAmbientHum(); }
      }
    }

    // ─── Background ───────────────────────────────────────────────────────

    function renderBG(){
      s.background(palette.void[0], palette.void[1], palette.void[2]);
      const ctx = s.drawingContext as CanvasRenderingContext2D;
      const grad = ctx.createRadialGradient(s.width/2,s.height/2,0, s.width/2,s.height/2,s.width*0.7);
      grad.addColorStop(0,'rgba(30,0,60,0.18)');
      grad.addColorStop(1,'rgba(0,0,0,0.55)');
      ctx.fillStyle=grad; ctx.fillRect(0,0,s.width,s.height);
    }

    function renderHolographicNoise(){
      s.push(); s.blendMode(s.OVERLAY);
      for(let i=0;i<40;i++){
        s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],s.random(8,32));
        s.noStroke(); s.circle(s.random(s.width),s.random(s.height),s.random(1,3));
      }
      s.blendMode(s.BLEND); s.pop();
    }

    function renderScanLines(){
      s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],12);
      s.strokeWeight(1);
      for(const y of scanLines) s.line(0,y,s.width,y);
    }

    function renderLensFlares(){
      const positions=[{x:s.width*0.18,y:s.height*0.28},{x:s.width*0.82,y:s.height*0.72}];
      for(const p of positions){
        const a=Math.sin(s.frameCount*0.015)*80+80;
        premiumGlow(p.x,p.y,130,palette.electricCyan,a*0.3);
        premiumGlow(p.x,p.y,60,[255,255,255],a*0.5);
        clearGlow();
      }
    }

    function renderMouseTrail(){
      mouseTrail.push({x:s.mouseX,y:s.mouseY});
      if(mouseTrail.length>22) mouseTrail.shift();
      for(let i=0;i<mouseTrail.length;i++){
        const p=mouseTrail[i];
        const a=s.map(i,0,mouseTrail.length,0,140);
        const sz=s.map(i,0,mouseTrail.length,2,11);
        premiumGlow(p.x,p.y,sz*2.5,palette.electricCyan,a*0.5); clearGlow();
        s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],a);
        s.noStroke(); s.circle(p.x,p.y,sz);
      }
    }

    function renderEnergyField(){
      for(let i=0;i<14;i++){
        const a=(i/14)*s.TWO_PI+s.frameCount*0.02;
        const d=75+Math.sin(s.frameCount*0.05+i)*18;
        const x=s.mouseX+Math.cos(a)*d, y=s.mouseY+Math.sin(a)*d;
        const sz=3+Math.sin(s.frameCount*0.08+i)*2;
        const al=110+Math.sin(s.frameCount*0.06+i)*75;
        s.fill(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],al);
        s.noStroke(); s.circle(x,y,sz);
      }
    }

    // ─── Scene transition overlay ─────────────────────────────────────────

    function renderTransition(){
      const fin=40, fout=40;
      if(sceneTimer<fin){
        const a=s.map(sceneTimer,0,fin,255,0);
        s.fill(palette.void[0],palette.void[1],palette.void[2],a); s.noStroke(); s.rect(0,0,s.width,s.height);
      }
      if(sceneTimer>SCENE_DURATION-fout){
        const a=s.map(sceneTimer,SCENE_DURATION-fout,SCENE_DURATION,0,255);
        s.fill(palette.void[0],palette.void[1],palette.void[2],a); s.noStroke(); s.rect(0,0,s.width,s.height);
      }
    }

    function advanceScene(){
      sceneTimer=0;
      sceneState=(sceneState+1)%6;
      if(sceneState===0||sceneState===1) confetti=[];
      if(sceneState!==4) globalBeams=[];
      if(sceneState===0){ camState.targetZoom=1; camState.x=0; camState.y=0; }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SCENE 0 — Cinematic Intro
    // ══════════════════════════════════════════════════════════════════════

    function renderCinematicIntro(){
      const progress = easeInOutCubic(sceneTimer/SCENE_DURATION);
      s.push(); s.translate(s.width/2,s.height/2);

      if(progress<0.25) renderDigitalUniverse(progress/0.25);
      if(progress>=0.25&&progress<0.6) renderNeuralIndia(s.map(progress,0.25,0.6,0,1));
      if(progress>=0.5) renderHeroTypography(s.map(progress,0.5,0.95,0,1));

      s.pop();
      renderAmbientSoundwave(progress);
      renderFloatingNumbers(progress);
      renderMatrixBG(progress);
      camState.targetZoom = s.map(progress,0,0.4,0.82,1.0);
    }

    function renderDigitalUniverse(phase: number){
      const cnt=Math.floor(phase*180);
      for(let i=0;i<cnt;i++){
        const angle=(i/cnt)*s.TWO_PI*3;
        const radius=s.map(phase,0,1,0,360)+Math.sin(s.frameCount*0.02+i)*18;
        const x=Math.cos(angle)*radius, y=Math.sin(angle)*radius;
        const sz=s.map(Math.sin(s.frameCount*0.05+i),-1,1,2,5);
        const al=s.map(phase,0,1,0,220)*s.map(Math.sin(s.frameCount*0.03+i),-1,1,0.5,1);

        if(i%8===0&&i<cnt-1){
          const na=((i+1)/cnt)*s.TWO_PI*3;
          const nr=s.map(phase,0,1,0,360)+Math.sin(s.frameCount*0.02+i+1)*18;
          s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],al*0.28);
          s.strokeWeight(1);
          s.line(x,y,Math.cos(na)*nr,Math.sin(na)*nr);
        }
        premiumGlow(x,y,sz*4,palette.neonBlue,al*0.55); clearGlow();
        s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],al);
        s.noStroke(); s.circle(x,y,sz);
      }
    }

    function renderNeuralIndia(phase: number){
      const al=phase*255;
      s.stroke(palette.arcticBlue[0],palette.arcticBlue[1],palette.arcticBlue[2],al*0.18);
      s.strokeWeight(1.5);
      for(let i=0;i<cities.length;i++){
        for(let j=i+1;j<cities.length;j++){
          const x1=(cities[i].x-0.5)*s.width*0.7, y1=(cities[i].y-0.5)*s.height*0.7;
          const x2=(cities[j].x-0.5)*s.width*0.7, y2=(cities[j].y-0.5)*s.height*0.7;
          const lp=Math.min(s.map(phase,0.2,1.0,0,1),1);
          s.line(x1,y1,s.lerp(x1,x2,lp),s.lerp(y1,y2,lp));
          if(phase>0.6){
            const pp=(s.frameCount*0.02+i*0.3)%1;
            s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],al);
            s.noStroke(); s.circle(s.lerp(x1,x2,pp),s.lerp(y1,y2,pp),4);
          }
        }
      }
      for(const city of cities){
        const x=(city.x-0.5)*s.width*0.7, y=(city.y-0.5)*s.height*0.7;
        const hb=Math.sin(s.frameCount*0.15+city.volume*0.01)*0.3+0.7;
        const nsz=12*hb;
        premiumGlow(x,y,nsz*5,palette.neonBlue,al*0.4); clearGlow();
        for(let r=0;r<3;r++){
          const rp=(s.frameCount*0.02+r*0.3)%1;
          s.noFill(); s.stroke(palette.arcticBlue[0],palette.arcticBlue[1],palette.arcticBlue[2],(1-rp)*al);
          s.strokeWeight(2); s.circle(x,y,nsz+rp*38);
        }
        s.fill(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],al); s.noStroke(); s.circle(x,y,nsz);
        s.fill(255,al*0.8); s.circle(x-2,y-2,nsz*0.4);
        if(phase>0.7){
          const la=s.map(phase,0.7,1.0,0,255);
          s.fill(255,la); s.textSize(typography.micro); s.text(city.name,x,y+22);
        }
      }
    }

    function renderHeroTypography(phase: number){
      const ta=s.map(phase,0,0.3,0,255);
      const sa=s.map(phase,0.2,0.5,0,255);

      s.push();
      const ctx=s.drawingContext as CanvasRenderingContext2D;
      ctx.shadowBlur=55; ctx.shadowColor=`rgba(0,255,255,${ta/255})`;
      s.textSize(typography.hero); s.textStyle(s.BOLD); s.fill(255,ta);
      s.text("India's UPI Revolution", s.map(phase,0,0.2,40,0), -115);

      ctx.shadowBlur=28; ctx.shadowColor=`rgba(0,255,157,${sa/255})`;
      s.textSize(typography.subtitle); s.textStyle(s.NORMAL);
      s.fill(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],sa);
      s.text("Inspiration for the World", 0, -48);
      clearGlow();

      // Underline
      const lw=380*easeOutCubic(s.map(phase,0.4,0.7,0,1));
      const ctx2=s.drawingContext as CanvasRenderingContext2D;
      ctx2.save();
      const g=ctx2.createLinearGradient(-lw/2,-8,lw/2,-8);
      g.addColorStop(0,'rgba(0,255,157,0)');
      g.addColorStop(0.5,`rgba(0,255,157,${ta/255})`);
      g.addColorStop(1,'rgba(0,255,157,0)');
      ctx2.strokeStyle=g; ctx2.lineWidth=4;
      ctx2.beginPath(); ctx2.moveTo(-lw/2,-8); ctx2.lineTo(lw/2,-8); ctx2.stroke(); ctx2.restore();

      if(phase>0.8){
        const taga=s.map(phase,0.8,1.0,0,200);
        s.textSize(typography.caption);
        s.fill(palette.arcticBlue[0],palette.arcticBlue[1],palette.arcticBlue[2],taga);
        s.text("The Future of Digital Payments", 0, 40);
      }
      s.pop();
    }

    function renderAmbientSoundwave(progress: number){
      if(progress<0.6) return;
      const al=s.map(progress,0.6,1.0,0,140);
      s.push(); s.translate(0,s.height-115); s.noFill();
      for(let layer=0;layer<3;layer++){
        s.stroke(palette.fusionPurple[0],palette.fusionPurple[1],palette.fusionPurple[2],al*(1-layer*0.3));
        s.strokeWeight(2-layer*0.5);
        s.beginShape();
        for(let x=0;x<s.width;x+=4){
          const y=Math.sin(x*0.015+s.frameCount*0.08+layer)*33*progress
                 +Math.sin(x*0.04+s.frameCount*0.04+layer)*16*progress
                 +s.noise(x*0.01,s.frameCount*0.01+layer)*22*progress;
          s.vertex(x,y);
        }
        s.endShape();
      }
      s.pop();
    }

    function renderFloatingNumbers(progress: number){
      if(progress<0.5) return;
      const al=s.map(progress,0.5,0.8,0,110);
      for(let i=0;i<7;i++){
        const x=(i/7)*s.width+Math.sin(s.frameCount*0.02+i)*28;
        const y=95+Math.sin(s.frameCount*0.03+i*0.5)*38;
        s.fill(palette.solarGold[0],palette.solarGold[1],palette.solarGold[2],al);
        s.textSize(typography.micro);
        s.text(`₹${Math.floor(s.random(100,9999)).toLocaleString()}`,x,y);
      }
    }

    function renderMatrixBG(progress: number){
      if(progress<0.3) return;
      const al=s.map(progress,0.3,0.6,0,38);
      for(const c of codeRain){ c.alpha=al; }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SCENE 1 — Live Digital Economy
    // ══════════════════════════════════════════════════════════════════════

    function renderLiveEconomy(){
      stats.tps=s.lerp(stats.tps, stats.targetTps+Math.sin(s.frameCount*0.1)*480, 0.08);
      stats.totalTransactions+=stats.tps/60;

      for(const n of nodes){ n.update(); n.display(); n.renderActivityHeatmap(); n.renderAIShield(); }

      // Sound: random pings
      if(s.frameCount%45===0) soundEngine.playTransactionPing();

      if(s.frameCount%4===0&&transactions.length<50) spawnTransaction();
      updateArrays();

      statsDisplay.update(); statsDisplay.display();
      renderPremiumRupees();
      renderDataSyncWaves();
      renderNetworkPulse();

      // Scene title
      const ta=s.map(Math.min(sceneTimer,60),0,60,0,220);
      s.push();
      const ctx=s.drawingContext as CanvasRenderingContext2D;
      ctx.shadowBlur=30; ctx.shadowColor=`rgba(0,255,255,${ta/255})`;
      s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],ta);
      s.textSize(typography.title*0.55); s.textStyle(s.BOLD);
      s.text('LIVE DIGITAL ECONOMY', s.width/2, 55);
      clearGlow(); s.pop();
    }

    function renderPremiumRupees(){
      for(let i=0;i<6;i++){
        const x=s.width*(0.1+i*0.15);
        const y=130+Math.sin(s.frameCount*0.04+i*0.8)*55;
        const rot=Math.sin(s.frameCount*0.02+i)*0.18;
        s.push(); s.translate(x,y); s.rotate(rot);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=22; ctx.shadowColor='rgba(57,255,20,0.65)';
        s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],175);
        s.textSize(typography.subtitle); s.textStyle(s.BOLD); s.text('₹',0,0);
        clearGlow(); s.pop();
      }
    }

    function renderDataSyncWaves(){
      if(s.frameCount%120===0){
        for(const n of nodes) energyWaves.push(new EnergyWave(n.x,n.y,palette.electricCyan));
      }
    }

    function renderNetworkPulse(){
      const pp=(s.frameCount*0.02)%1;
      const pa=Math.sin(pp*s.PI)*140;
      s.push(); s.translate(s.width/2,s.height/2); s.noFill();
      s.stroke(palette.fusionPurple[0],palette.fusionPurple[1],palette.fusionPurple[2],pa);
      s.strokeWeight(2); s.circle(0,0,pp*Math.min(s.width,s.height)*0.58); s.pop();
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SCENE 2 — Futuristic Phone / Payment
    // ══════════════════════════════════════════════════════════════════════

    function renderPhoneScene(){
      const progress=easeInOutCubic(sceneTimer/SCENE_DURATION);

      phone.update(progress); phone.display();

      // QR scan (0.15→0.45)
      if(progress>0.15&&progress<0.45){
        const sp=s.map(progress,0.15,0.45,0,1);
        qrScanner.scan(sp);
        if(!soundFlags.qrBeepPlayed && sp>0.1){
          soundEngine.playQRScanBeep(); soundFlags.qrBeepPlayed=true;
        }
      }

      // Biometric (0.45→0.6)
      if(progress>0.45&&progress<0.6){
        const bp=s.map(progress,0.45,0.6,0,1);
        renderBiometric(bp);
        if(!soundFlags.bioPlayed && bp>0.1){
          soundEngine.playBiometricVerify(); soundFlags.bioPlayed=true;
        }
      }

      // Processing (0.6→0.65)
      if(progress>0.6&&progress<0.65){
        soundFlags.procTick++;
        if(soundFlags.procTick%18===0) soundEngine.playProcessingTick();
        renderProcessingAnim(s.map(progress,0.6,0.65,0,1));
      }

      // SUCCESS  (0.65→0.9)
      if(progress>0.65&&progress<0.9){
        const sp=s.map(progress,0.65,0.9,0,1);
        renderCinematicSuccess(sp);
        // Fire sound ONCE when we cross the threshold
        if(!soundFlags.successPlayed && sp>0.05){
          soundEngine.playPaymentSuccess();
          soundFlags.successPlayed=true;
        }
      }

      // Confetti (0.7→end)
      if(progress>0.7){ updateConfetti(); }

      renderTransactionParticles(progress);
    }

    function renderBiometric(progress: number){
      s.push(); s.translate(s.width/2,s.height/2-45);
      const al=200*Math.sin(progress*s.PI);
      const gsz=195; const divs=8;
      s.stroke(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],al);
      s.strokeWeight(1);
      for(let i=0;i<=divs;i++){
        const p=(i/divs-0.5)*gsz;
        s.line(-gsz/2,p,gsz/2,p); s.line(p,-gsz/2,p,gsz/2);
      }
      const rr=progress*gsz*0.68;
      s.noFill(); s.stroke(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],al);
      s.strokeWeight(2);
      for(let r=0;r<3;r++) s.circle(0,0,rr+r*14);
      if(progress>0.5){
        s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],al);
        s.textSize(typography.caption); s.text('VERIFYING IDENTITY',0,gsz/2+38);
      }
      s.pop();
    }

    function renderProcessingAnim(progress: number){
      s.push(); s.translate(s.width/2,s.height/2); s.rotate(s.frameCount*0.1);
      s.noFill(); s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],200);
      s.strokeWeight(5); s.arc(0,0,95,95,0,progress*s.TWO_PI);
      const ps=18+Math.sin(s.frameCount*0.2)*5;
      s.fill(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2],150); s.noStroke(); s.circle(0,0,ps);
      s.pop();
    }

    function renderCinematicSuccess(progress: number){
      let al=s.map(progress,0,0.2,0,255);
      al*=s.map(progress,0.9,1.0,1,0);

      s.push(); s.translate(s.width/2,s.height/2);

      const csz=easeOutCubic(s.map(progress,0,0.3,0,1))*145;
      premiumGlow(0,0,csz*2,palette.plasmaGreen,al*0.4);
      premiumGlow(0,0,csz*1.3,palette.emeraldGlow,al*0.6); clearGlow();
      s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],al*0.14);
      s.noStroke(); s.circle(0,0,csz+48);

      // Animated checkmark
      if(progress>0.15){
        const cp=s.map(progress,0.15,0.5,0,1);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=22; ctx.shadowColor=`rgba(0,255,157,${al/255})`;
        s.stroke(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],al);
        s.strokeWeight(9); s.strokeCap(s.ROUND); s.noFill();
        s.beginShape();
        s.vertex(-38,0);
        const mp=cp>0.4?1:cp/0.4;
        s.vertex(-14,24*mp);
        if(cp>0.4){ const ep=(cp-0.4)/0.6; s.vertex(38,-34*ep); }
        s.endShape(); clearGlow();
      }

      // Success text
      if(progress>0.5){
        const textA=s.map(progress,0.5,0.7,0,255);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=28; ctx.shadowColor=`rgba(255,255,255,${textA/512})`;
        s.fill(255,Math.min(textA,al));
        s.textSize(typography.title*0.5); s.textStyle(s.BOLD); s.text('Payment Successful!',0,108);
        ctx.shadowBlur=0;
        s.textSize(typography.body); s.textStyle(s.NORMAL);
        s.fill(palette.solarGold[0],palette.solarGold[1],palette.solarGold[2],Math.min(textA,al));
        s.text('₹ 1,234.00',0,148);
      }

      // Shockwave
      if(progress>0.18&&progress<0.5){
        const sp=s.map(progress,0.18,0.5,0,1);
        const sr=easeOutQuad(sp)*380; const sa=(1-sp)*195;
        s.noFill(); s.stroke(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],sa);
        s.strokeWeight(6); s.circle(0,0,sr);
        s.strokeWeight(3); s.stroke(255,255,255,sa*0.55); s.circle(0,0,sr+10);
      }

      s.pop();

      // Screen flash
      if(progress>0.19&&progress<0.3){
        const fa=s.map(progress,0.19,0.3,0,80)*s.map(progress,0.25,0.3,1,0);
        s.fill(255,255,255,fa); s.noStroke(); s.rect(0,0,s.width,s.height);
      }
    }

    function updateConfetti(){
      if(s.frameCount%2===0&&confetti.length<140) confetti.push(new PremiumConfetti());
      for(let i=confetti.length-1;i>=0;i--){
        confetti[i].update(); confetti[i].display();
        if(confetti[i].isDead()) confetti.splice(i,1);
      }
    }

    function renderTransactionParticles(progress: number){
      const cnt=Math.floor(progress*28);
      for(let i=0;i<cnt;i++){
        const angle=(i/cnt)*s.TWO_PI+s.frameCount*0.01;
        const radius=295+Math.sin(s.frameCount*0.02+i)*48;
        const x=s.width/2+Math.cos(angle)*radius, y=s.height/2+Math.sin(angle)*radius;
        const sz=2.5+Math.sin(s.frameCount*0.05+i)*2;
        const al=140+Math.sin(s.frameCount*0.03+i)*90;
        s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],al);
        s.noStroke(); s.circle(x,y,sz);
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SCENE 3 — Interactive Mode
    // ══════════════════════════════════════════════════════════════════════

    function renderInteractiveMode(){
      for(const n of nodes){
        n.update(); n.display();
        const d=s.dist(s.mouseX,s.mouseY,n.x,n.y);
        if(d<42){
          n.showPremiumInfo();
          for(const other of nodes){
            if(other!==n){ s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],28); s.strokeWeight(1); s.line(n.x,n.y,other.x,other.y); }
          }
        }
      }

      if(s.frameCount%6===0&&transactions.length<40) spawnTransaction();
      if(s.frameCount%42===0) soundEngine.playTransactionPing();
      updateArrays();

      for(const h of hudElements){ h.update(); h.display(); }

      // Instructions
      s.push();
      s.fill(palette.deepNavy[0],palette.deepNavy[1],palette.deepNavy[2],175);
      s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],140);
      s.strokeWeight(2); s.rectMode(s.CENTER);
      s.rect(s.width/2,58,580,76,14);
      s.fill(255,225); s.textSize(typography.caption); s.textStyle(s.NORMAL);
      s.text('HOVER nodes to reveal analytics • CLICK to generate transaction bursts',s.width/2,58);
      s.fill(palette.plasmaGreen[0],palette.plasmaGreen[1],palette.plasmaGreen[2],220);
      s.text('SPACE = next scene  |  R = restart  |  0-5 = jump to scene',s.width/2,82);
      s.pop();
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SCENE 4 — Global Impact
    // ══════════════════════════════════════════════════════════════════════

    function renderGlobalImpact(){
      const progress=easeInOutCubic(sceneTimer/SCENE_DURATION);

      globe.update(progress); globe.display();

      if(s.frameCount%14===0&&progress>0.25) globalBeams.push(new GlobalPaymentBeam());
      for(let i=globalBeams.length-1;i>=0;i--){
        globalBeams[i].update(); globalBeams[i].display();
        if(globalBeams[i].isDead()) globalBeams.splice(i,1);
      }

      if(s.frameCount%30===0&&progress>0.25){
        soundEngine.playGlobalBeam();
      }

      renderOrbitalSatellites(progress);

      if(progress>0.5) renderGlobalTypography(s.map(progress,0.5,0.9,0,1));

      if(progress>0.6){
        const ip=s.map(progress,0.6,1.0,0,1);
        for(let i=0;i<globalConnections.length;i++){
          const c=globalConnections[i];
          const a=c.angle*s.PI/180;
          const x=s.width/2+Math.cos(a)*(c.distance+145);
          const y=s.height/2+Math.sin(a)*(c.distance+145);
          const ca=175*ip;
          s.push(); s.translate(x,y);
          s.fill(palette.deepNavy[0],palette.deepNavy[1],palette.deepNavy[2],ca);
          s.stroke(c.color[0],c.color[1],c.color[2],ca);
          s.strokeWeight(2); s.rectMode(s.CENTER); s.rect(0,0,135,68,10);
          s.fill(255,ca); s.textSize(typography.caption); s.textStyle(s.BOLD); s.text(c.code,0,-13);
          s.textStyle(s.NORMAL); s.textSize(typography.micro);
          s.fill(c.color[0],c.color[1],c.color[2],ca);
          s.text(`${Math.floor(500+i*200)}K Users`,0,5);
          s.text(`₹${50+i*25}Cr/day`,0,19);
          s.pop();
        }
      }
    }

    function renderOrbitalSatellites(progress: number){
      if(progress<0.3) return;
      s.push(); s.translate(s.width/2,s.height/2);
      for(let i=0;i<5;i++){
        const angle=(i/5)*s.TWO_PI+s.frameCount*0.01;
        const radius=275+Math.sin(s.frameCount*0.02+i)*18;
        for(let t=0;t<10;t++){
          const ta=angle-t*0.1;
          const tx=Math.cos(ta)*radius, ty=Math.sin(ta)*radius;
          s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],s.map(t,0,10,140,0));
          s.noStroke(); s.circle(tx,ty,s.map(t,0,10,4,1));
        }
        premiumGlow(Math.cos(angle)*radius, Math.sin(angle)*radius, 18, palette.neonBlue, 190); clearGlow();
        s.fill(palette.neonBlue[0],palette.neonBlue[1],palette.neonBlue[2]); s.noStroke();
        s.circle(Math.cos(angle)*radius, Math.sin(angle)*radius, 8);
      }
      s.pop();
    }

    function renderGlobalTypography(phase: number){
      const al=255*phase;
      s.push();
      const ctx=s.drawingContext as CanvasRenderingContext2D;
      ctx.shadowBlur=48; ctx.shadowColor=`rgba(255,215,0,${al/255})`;
      s.textSize(typography.title*0.78); s.textStyle(s.BOLD);
      s.fill(palette.solarGold[0],palette.solarGold[1],palette.solarGold[2],al);
      s.text('MADE IN INDIA',s.width/2,s.height-175);
      if(phase>0.3){
        const a2=s.map(phase,0.3,0.7,0,255);
        ctx.shadowBlur=32; ctx.shadowColor=`rgba(255,255,255,${a2/512})`;
        s.textSize(typography.subtitle); s.textStyle(s.NORMAL); s.fill(255,a2);
        s.text('Trusted Worldwide',s.width/2,s.height-118);
      }
      if(phase>0.6){
        const a3=s.map(phase,0.6,1.0,0,195);
        s.textSize(typography.caption);
        s.fill(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],a3);
        s.text('Powering 6 Countries • 100M+ International Users',s.width/2,s.height-65);
      }
      clearGlow(); s.pop();
    }

    // ══════════════════════════════════════════════════════════════════════
    //  SCENE 5 — Grand Finale
    // ══════════════════════════════════════════════════════════════════════

    function renderGrandFinale(){
      const progress=easeInOutCubic(sceneTimer/SCENE_DURATION);

      if(!soundFlags.finalePlayed && progress>0.02){
        soundEngine.playFinaleExplosion(); soundFlags.finalePlayed=true;
      }

      s.push(); s.translate(s.width/2,s.height/2);
      renderUPILogo(progress);
      if(progress>0.5) renderTaglines(s.map(progress,0.5,0.95,0,1));
      if(progress>0.3) renderParticleExplosion(s.map(progress,0.3,1.0,0,1));
      s.pop();

      if(progress>0.4) renderEnergyBeams(s.map(progress,0.4,0.8,0,1));
      if(progress>0.6) renderFinaleFragments(s.map(progress,0.6,1.0,0,1));
      if(progress>0.9) renderFinalFade(s.map(progress,0.9,1.0,0,1));
    }

    function renderUPILogo(progress: number){
      const scale=easeOutElastic(s.map(progress,0,0.5,0,1));
      const lsz=typography.hero*2.4*scale;
      const al=s.map(progress,0,0.3,0,255);

      const ctx=s.drawingContext as CanvasRenderingContext2D;
      ctx.shadowBlur=75; ctx.shadowColor=`rgba(0,191,255,${al/512})`;

      for(let i=2;i>0;i--){
        premiumGlow(0,-48,lsz*(1+i*0.28),palette.neonBlue,al*0.28); clearGlow();
      }

      s.textSize(lsz); s.textStyle(s.BOLD);
      for(let offset=0;offset<3;offset++){
        s.fill(palette.electricCyan[0]-offset*28,palette.electricCyan[1]-offset*18,palette.electricCyan[2],al*(1-offset*0.28));
        s.text('UPI',offset*2,-48+offset*2);
      }
      s.fill(255,255,255,al*0.55); s.textSize(lsz*0.94); s.text('UPI',-3,-51);
      clearGlow();

      s.push(); s.rotate(s.frameCount*0.05); s.noFill();
      s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],al*0.48);
      s.strokeWeight(4);
      for(let i=0;i<8;i++){
        const a=(i/8)*s.TWO_PI;
        s.arc(0,-48,lsz*0.58,lsz*0.58,a,a+s.PI/8);
      }
      s.pop();
    }

    function renderTaglines(phase: number){
      const sp=68;
      if(phase>0){
        const a=s.map(phase,0,0.2,0,255);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=38; ctx.shadowColor=`rgba(0,255,157,${a/512})`;
        s.textSize(typography.subtitle*1.18); s.textStyle(s.BOLD);
        s.fill(palette.emeraldGlow[0],palette.emeraldGlow[1],palette.emeraldGlow[2],a);
        s.text('FAST.',0,118); clearGlow();
      }
      if(phase>0.25){
        const a=s.map(phase,0.25,0.45,0,255);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=38; ctx.shadowColor=`rgba(0,255,255,${a/512})`;
        s.textSize(typography.subtitle*1.18); s.textStyle(s.BOLD);
        s.fill(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],a);
        s.text('SECURE.',0,118+sp); clearGlow();
      }
      if(phase>0.5){
        const a=s.map(phase,0.5,0.7,0,255);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=38; ctx.shadowColor=`rgba(255,215,0,${a/512})`;
        s.textSize(typography.subtitle*1.18); s.textStyle(s.BOLD);
        s.fill(palette.solarGold[0],palette.solarGold[1],palette.solarGold[2],a);
        s.text('BORDERLESS.',0,118+sp*2); clearGlow();
      }
    }

    function renderParticleExplosion(phase: number){
      const ep=easeOutQuad(phase);
      for(let i=0;i<90;i++){
        const angle=(i/90)*s.TWO_PI+s.frameCount*0.01;
        const radius=ep*480+s.noise(i,s.frameCount*0.01)*90;
        const x=Math.cos(angle)*radius, y=Math.sin(angle)*radius;
        const sz=s.map(ep,0,1,14,2.5);
        const al=(1-ep)*250;
        const cc=[palette.neonBlue,palette.electricCyan,palette.emeraldGlow,palette.solarGold][i%4];
        s.fill(cc[0],cc[1],cc[2],al); s.noStroke(); s.circle(x,y-48,sz);
        for(let t=1;t<4;t++){
          const tr=radius-t*13;
          s.fill(cc[0],cc[1],cc[2],al/(t+1));
          s.circle(Math.cos(angle)*tr,Math.sin(angle)*tr-48,sz/(t+1));
        }
      }
    }

    function renderEnergyBeams(phase: number){
      s.push(); s.translate(s.width/2,s.height/2-48);
      for(let i=0;i<12;i++){
        const angle=(i/12)*s.TWO_PI+s.frameCount*0.02;
        const length=phase*580;
        const cc=[palette.neonBlue,palette.electricCyan,palette.emeraldGlow][i%3];
        const al=(1-phase)*195;
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=18; ctx.shadowColor=`rgba(${cc[0]},${cc[1]},${cc[2]},${al/255})`;
        s.stroke(cc[0],cc[1],cc[2],al); s.strokeWeight(3);
        s.line(0,0,Math.cos(angle)*length,Math.sin(angle)*length);
        clearGlow();
      }
      s.pop();
    }

    function renderFinaleFragments(phase: number){
      for(let i=0;i<18;i++){
        const angle=(i/18)*s.TWO_PI+s.frameCount*0.01;
        const radius=390+phase*185+Math.sin(s.frameCount*0.03+i)*45;
        const x=s.width/2+Math.cos(angle)*radius, y=s.height/2-48+Math.sin(angle)*radius;
        const al=(1-phase)*140;
        s.push(); s.translate(x,y); s.rotate(angle+s.frameCount*0.02);
        s.noFill(); s.stroke(palette.electricCyan[0],palette.electricCyan[1],palette.electricCyan[2],al);
        s.strokeWeight(2);
        s.beginShape();
        for(let v=0;v<6;v++){ const va=(v/6)*s.TWO_PI; s.vertex(Math.cos(va)*22,Math.sin(va)*22); }
        s.endShape(s.CLOSE); s.pop();
      }
    }

    function renderFinalFade(phase: number){
      const fa=phase*195;
      s.fill(palette.void[0],palette.void[1],palette.void[2],fa); s.noStroke(); s.rect(0,0,s.width,s.height);
      if(phase>0.3){
        const ia=s.map(phase,0.3,1.0,0,145);
        s.push(); s.translate(s.width/2,s.height/2);
        const ctx=s.drawingContext as CanvasRenderingContext2D;
        ctx.shadowBlur=55; ctx.shadowColor=`rgba(255,215,0,${ia/255})`;
        s.fill(palette.solarGold[0],palette.solarGold[1],palette.solarGold[2],ia); s.noStroke();
        s.beginShape();
        s.vertex(-48,-78);s.vertex(-28,-98);s.vertex(18,-93);s.vertex(48,-68);
        s.vertex(58,-28);s.vertex(48,22);s.vertex(28,78);s.vertex(-8,98);
        s.vertex(-38,83);s.vertex(-53,48);s.vertex(-58,2);
        s.endShape(s.CLOSE); clearGlow(); s.pop();
      }
    }

    // ─── Shared helpers ───────────────────────────────────────────────────

    function spawnTransaction(){
      let total=0;
      for(const n of nodes) total+=n.volume;
      let rand=Math.random()*total, acc=0, from=nodes[0];
      for(const n of nodes){ acc+=n.volume; if(rand<=acc){from=n;break;} }
      const to=nodes.filter(n=>n!==from)[Math.floor(s.random(nodes.length-1))];
      transactions.push(new AdvancedMoneyFlow(from,to));
    }

    function burstAt(x:number,y:number){
      for(let i=0;i<12;i++){
        const angle=(i/12)*s.TWO_PI, spd=s.random(2,5);
        particles.push(new BurstParticle(x,y,angle,spd) as any);
      }
      energyWaves.push(new EnergyWave(x,y));
      soundEngine.playTransactionPing();
    }

    function updateArrays(){
      for(let i=transactions.length-1;i>=0;i--){
        transactions[i].update(); transactions[i].display();
        if(transactions[i].isDead()){ burstAt(transactions[i].to.x,transactions[i].to.y); transactions.splice(i,1); }
      }
      for(let i=ripples.length-1;i>=0;i--){
        ripples[i].update(); ripples[i].display();
        if(ripples[i].isDead()) ripples.splice(i,1);
      }
      for(let i=energyWaves.length-1;i>=0;i--){
        energyWaves[i].update(); energyWaves[i].display();
        if(energyWaves[i].isDead()) energyWaves.splice(i,1);
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    //  INTERACTION
    // ══════════════════════════════════════════════════════════════════════

    s.mousePressed = () => {
      soundEngine.init(); // unlock audio on first gesture
      ripples.push(new Ripple(s.mouseX, s.mouseY));
      camSys.addShake(4);

      if(sceneState===3){
        let minD=Infinity, nearest=nodes[0];
        for(const n of nodes){ const d=s.dist(s.mouseX,s.mouseY,n.x,n.y); if(d<minD){minD=d;nearest=n;} }
        for(let i=0;i<5;i++){
          const to=nodes.filter(n=>n!==nearest)[Math.floor(s.random(nodes.length-1))];
          transactions.push(new AdvancedMoneyFlow(nearest,to));
        }
        energyWaves.push(new EnergyWave(nearest.x,nearest.y));
        soundEngine.playTransactionPing();
      }
    };

    s.keyPressed = () => {
      soundEngine.init();
      if(s.key===' '){ sceneTimer=SCENE_DURATION+1; }
      if(s.key==='r'||s.key==='R'){ sceneState=0;sceneTimer=0;transactions=[];confetti=[];globalBeams=[];ripples=[];energyWaves=[]; }
      if(s.key>='0'&&s.key<='5'){ sceneState=parseInt(s.key);sceneTimer=0; }
      if((s.keyCode as unknown as number)===37)  camState.x-=50;
      if((s.keyCode as unknown as number)===39)  camState.x+=50;
      if((s.keyCode as unknown as number)===38)  camState.y-=50;
      if((s.keyCode as unknown as number)===40)  camState.y+=50;
      if(s.key==='z'||s.key==='Z')  camState.targetZoom=Math.min(camState.targetZoom+0.1,2);
      if(s.key==='x'||s.key==='X')  camState.targetZoom=Math.max(camState.targetZoom-0.1,0.5);
    };

    s.windowResized = () => {
      s.resizeCanvas(container.clientWidth, container.clientHeight);
      for(let i=0;i<nodes.length;i++){
        nodes[i].x=cities[i].x*s.width;
        nodes[i].y=cities[i].y*s.height;
      }
      statsDisplay.x=s.width-265;
      globe.cx=s.width/2; globe.cy=s.height/2;
      phone.x=s.width/2; phone.y=s.height/2;
      scanLines=[]; for(let y=0;y<s.height;y+=4) scanLines.push(y);
    };

  }, container);
}
