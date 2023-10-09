// https://editor.p5js.org/nworb999/sketches/btKLcTI2MD

// I used chatGPT to extend a basic sketch that had
// two circles orbiting at the same rate away from the center

let r;

let count = 5;
let baseRadius = 25;
let baseFactor = 1.6;
let orbitIncrement = 15;
let staggerAmount = 0.1;
let innerOffset = 5;

function setup() {
  createCanvas(700, 700);
  background(0);
  angleMode(RADIANS);
  ellipseMode(CENTER);
  frameRate(500);
}

function draw() {
  background(0);

  for (i = count - 1; i >= 0; i--) {
    push();

    translate(width / 2, height / 2);

    rotate(frameCount / 100 + i * staggerAmount);

    let currentRadius = baseRadius * Math.pow(baseFactor, i);

    if (i % 2 == 0) {
      fill(255, 255, 255);
    } else {
      fill(0);
    }

    let orbitRadius =
      i * orbitIncrement + currentRadius / 5 + (i === 0 ? innerOffset : 0);

    let x = cos(frameCount / 100 + i * staggerAmount) * orbitRadius;
    let y = sin(frameCount / 100 + i * staggerAmount) * orbitRadius;

    noStroke();
    ellipse(x, y, currentRadius * 2, currentRadius * 2);

    pop();
  }
}

