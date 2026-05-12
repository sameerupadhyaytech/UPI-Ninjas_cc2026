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
────────────
// SCENE 1
// ─────────────────────────────────────────────────────────────

function drawRevolution() {

  fill(0, 255, 180);

  textAlign(CENTER, CENTER);

  textSize(40);

  text(
    "India's Digital Revolution",
    width / 2,
    100
  );

  stroke(0, 220, 255);

  strokeWeight(3);

  line(150, height / 2, width - 150, height / 2);

  let years = ["2016", "2018", "2020", "2022", "2025"];

  for (let i = 0; i < years.length; i++) {

    let x = map(i, 0, years.length - 1, 150, width - 150);

    fill(0, 220, 255);

    ellipse(x, height / 2, 25);

    fill(255);

    textSize(16);

    text(years[i], x, height / 2 - 40);

  }

}


// ─────────────────────────────────────────────────────────────
// SCENE 2
// ─────────────────────────────────────────────────────────────

function drawPayment() {

  fill(0, 220, 255);

  textAlign(CENTER, CENTER);

  textSize(40);

  text(
    "UPI Payment Flow",
    width / 2,
    100
  );

  let y = height / 2;

  let xs = [
    width * 0.2,
    width * 0.4,
    width * 0.6,
    width * 0.8
  ];

  stroke(0, 220, 255);

  strokeWeight(4);

  for (let i = 0; i < xs.length - 1; i++) {

    line(xs[i], y, xs[i + 1], y);

  }

  for (let x of xs) {

    fill(0, 255, 180);

    ellipse(x, y, 70);

  }
// ─────────────────────────────────────────────────────────────
// SCENE 4
// ─────────────────────────────────────────────────────────────

function drawGlobal() {

  fill(0, 220, 255);

  textAlign(CENTER, CENTER);

  textSize(40);

  text(
    "Global UPI Expansion",
    width / 2,
    80
  );

  noFill();

  stroke(0, 220, 255);

  ellipse(width / 2, height / 2, 400);

  fill(255, 153, 51);

  ellipse(width / 2, height / 2, 20);

  for (let dl of dataLines) {

    stroke(0, 220, 255, 100);

    line(dl.x1, dl.y1, dl.x2, dl.y2);

    let px = lerp(dl.x1, dl.x2, dl.t);

    let py = lerp(dl.y1, dl.y2, dl.t);

    noStroke();

    fill(0, 255, 180);

    ellipse(px, py, 8);

    dl.t += 0.01;

    if (dl.t > 1) {

      dl.t = 0;

    }

  }

}




}


// ─────────────────────────────────────────────────────────────
