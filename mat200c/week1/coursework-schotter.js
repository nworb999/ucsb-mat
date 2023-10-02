// https://editor.p5js.org/nworb999/sketches/lkbu51XGh

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

        let rawXShift =
          direction * jitter * randomGaussian(0, Math.log(count + 1));
        let xShift = rawXShift / jitterDampingFactor;

        let rawYShift =
          direction * jitter * randomGaussian(0, Math.log(count + 1));
        let yShift = rawYShift / jitterDampingFactor;

        push();

        let xPosition = 70 + column * 30 + xShift;
        let yPosition = 70 + row * 30 + yShift;

        translate(xPosition, yPosition);

        rotate(
          currentAngle +
            (direction *
              angleIncrement *
              Math.pow(exponentialBaseAngle, count)) /
              angleDampingFactor
        );

        // I copied this and the translate() call from you, it was
        // more readable than my early attempts with `square()`
        rect(0, 0, 30, 30);

        pop();

        count++;
      }
    }
  }
}
