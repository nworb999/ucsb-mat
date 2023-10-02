// https://editor.p5js.org/nworb999/sketches/lkbu51XGh

// I'm not even sure this is the best iteration but
// I've retried this for hours now and I started
// to feel like I was losing my mind because the longer I worked
// the more I started noticing aspects of the original that made it so clean.

// I have a much greater appreciation of the aesthetics of the original now.

let gridHeight = 22;
let gridWidth = 12;

let count = 0;

let a = 0;
let angleIncrement = 10;
let exponentialBaseAngle = 1.046;
let angleDampingFactor = 10000;

let x, y;
let jitter = 50;
let jitterDampingFactor = 1000;

function setup() {
  createCanvas(500, 800);
  noLoop();
  rectMode(CENTER);
  angleMode(RADIANS);
  // I used chatGPT to simplify the code (it
  // came up with the clever random direction ternary)
  // and how to make the angle change exponential.  It also suggested
  // a dampingFactor when I was struggling
  // to make the positional shifts grow more slowly.

  // I decided to try randomGaussian() after
  // being unsatisfied with the symmetrical
  // looking results from just random()
  // (it looked like it was shifting back and forth too evenly)
}

function draw() {
  background(255);
  fill(255, 0);

  while (count < gridHeight * gridWidth) {
    for (let row = 0; row < gridHeight; row++) {
      for (let column = 0; column < gridWidth; column++) {
        let direction = random() < 0.5 ? 1 : -1;

        let xShift = getPositionShift(direction);
        let yShift = getPositionShift(direction);

        push();

        x = 70 + column * 30 + xShift;
        y = 70 + row * 30 + yShift;
        translate(x, y);

        let angleShift = getAngleShift(direction);
        rotate(a + angleShift);

        // I copied this and the translate call from you, it was
        // more readable than my early attempts with `square()`
        rect(15, 15, 30, 30);

        pop();

        count++;
      }
    }
  }
}

function getPositionShift(direction) {
  let directionShift =
    direction * jitter * randomGaussian(0, Math.log(count + 1));
  return directionShift / jitterDampingFactor;
}

function getAngleShift(direction) {
  let angleShift =
    direction * angleIncrement * Math.pow(exponentialBaseAngle, count);
  return angleShift / angleDampingFactor;
}

