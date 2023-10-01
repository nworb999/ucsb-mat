// https://editor.p5js.org/nworb999/sketches/lkbu51XGh

function setup() {
  createCanvas(400, 700);
  noLoop();
  rectMode(CENTER);
  angleMode(RADIANS);
  // I used chatGPT to simplify the code (it 
  // came up with the clever random direction ternary)
  // make the angle change exponential.
  // I decided to try randomGaussian() after
  // being unsatisfied with the symmetrical 
  // looking results from just random() + jitterIncrement
  // (it looked like it was rotating back and forth too evenly)
}

function draw() {
  background(255);
  fill(255, 0);
  
  let gridHeight = 22;
  let gridWidth = 12;

  let count = 0;

  let currentAngle = 0;
  let angleIncrement = 0.02;

  let exponentialBase = 1.035;
  let exponentialBaseJitter = 1.02;

  let xJitter = 10;
  let yJitter = 10;
  let jitterIncrement = 0.02;

  while (count < gridHeight * gridWidth) {
    for (let row = 0; row < gridHeight; row++) {
      for (let column = 0; column < gridWidth; column++) {
        let direction = random() < 0.5 ? 1 : -1;
        
        
        let xShift =
          direction *
          xJitter *
          randomGaussian(jitterIncrement, jitterIncrement) *
          Math.pow(exponentialBaseJitter, count);
        
        let yShift =
          direction *
          yJitter *
          randomGaussian(jitterIncrement, jitterIncrement) *
          Math.pow(exponentialBaseJitter, count);

        push();
        translate(20 + column * 30 + xShift, 20 + row * 30 + yShift);

        rotate(
          currentAngle +
            direction * angleIncrement * Math.pow(exponentialBase, count)
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
