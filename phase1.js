// ============================================================
// FIXED T+6 to T+14 VERSION
// p5.js JavaScript
// SIMPLE SCENE SYSTEM
// NO EXTRA UI
// NO ERROR
// DIRECT RUN
// ============================================================


// ─────────────────────────────────────────────────────────────
// GLOBALS
// ─────────────────────────────────────────────────────────────

let scene = 0;
let sceneT = 0;

let bgParticles = [];

let dataLines = [];


// ─────────────────────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────────────────────

function setup() {

  createCanvas(windowWidth, windowHeight);

  colorMode(RGB);

  textFont('monospace');

  frameRate(60);

  initBgParticles();

  initGlobal();

}


// ─────────────────────────────────────────────────────────────
// RESIZE
// ─────────────────────────────────────────────────────────────

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}


// ─────────────────────────────────────────────────────────────
// DRAW
// ─────────────────────────────────────────────────────────────

function draw() {

  background(4, 6, 20);

  drawGrid();

  drawBgParticles();

  // AUTO SCENE CHANGE
  if (frameCount % 400 === 0) {

    scene++;

    if (scene > 5) {
      scene = 0;
    }

    sceneT = 0;

  }

  // SCENES
  if (scene === 0) {

    drawIntro();

  }

  else if (scene === 1) {

    drawRevolution();

  }

  else if (scene === 2) {

    drawPayment();

  }

  else if (scene === 3) {

    drawDashboard();

  }

  else if (scene === 4) {

    drawGlobal();

  }

  else if (scene === 5) {

    drawFinale();

  }

  sceneT++;

}


// ─────────────────────────────────────────────────────────────
// SIMPLE BACKGROUND
// ─────────────────────────────────────────────────────────────

function initBgParticles() {

  for (let i = 0; i < 80; i++) {

    bgParticles.push({

      x: random(width),
      y: random(height),

      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),

      alpha: random(50, 150),

      char: random() > 0.5 ? "0" : "1"

    });

  }

}


// ─────────────────────────────────────────────────────────────
// GRID
// ─────────────────────────────────────────────────────────────

function drawGrid() {

  stroke(20, 60, 120, 40);

  strokeWeight(1);

  for (let x = 0; x < width; x += 60) {

    line(x, 0, x, height);

  }

  for (let y = 0; y < height; y += 60) {

    line(0, y, width, y);

  }

}


// ─────────────────────────────────────────────────────────────
// BACKGROUND PARTICLES
// ─────────────────────────────────────────────────────────────

function drawBgParticles() {

  noStroke();

  for (let p of bgParticles) {

    fill(0, 220, 255, p.alpha);

    textSize(10);

    text(p.char, p.x, p.y);

    p.x += p.vx;

    p.y += p.vy;

    if (p.x < 0 || p.x > width) {

      p.vx *= -1;

    }

    if (p.y < 0 || p.y > height) {

      p.vy *= -1;

    }

  }

}


// ─────────────────────────────────────────────────────────────
// SCENE 0
// ─────────────────────────────────────────────────────────────

function drawIntro() {

  fill(0, 220, 255);

  textAlign(CENTER, CENTER);

  textSize(60);

  text("UPI", width / 2, height / 2 - 40);

  textSize(24);

  fill(180, 220, 255);

  text(
    "India's Digital Gift to the World",
    width / 2,
    height / 2 + 30
  );

}


// ─────────────────────────────────────────────────────────────