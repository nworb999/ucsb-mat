// https://editor.p5js.org/nworb999/sketches/Y2Ohkwbk3
// I worked with chatGPT to write this whole thing but
// I was the creative director 😤


const CALL_OF_THE_VOID = 20;
const UNREQUITED_POWER = 100;

const VOID_DISTANCE = 20;
const VOID_SIZE = 200;
const VOID_SPIN = 0.01;

const THE_VOID = {
  position: null,
  size: VOID_SIZE,
  pullStrength: CALL_OF_THE_VOID,
  angle: 0,
  rotationSpeed: VOID_SPIN,
};

function displayVoid() {
  push();

  // Use sin function and frameCount to create a strobing effect
  let strobeSpeed = 0.05; // Adjust the speed of strobing
  let strobeIntensity = sin(frameCount * strobeSpeed) * 0.25 + 0.25; // Normalize sin wave between 0 and 1
  let minGlow = 50; // Minimum glow radius
  let maxGlow = 100; // Maximum glow radius
  drawingContext.shadowBlur = lerp(minGlow, maxGlow, strobeIntensity);
  drawingContext.shadowColor = "white";

  fill(0);
  noStroke();

  translate(THE_VOID.position.x, THE_VOID.position.y);
  rotate(THE_VOID.angle);
  rectMode(CENTER);
  rect(0, 0, THE_VOID.size, THE_VOID.size);
  THE_VOID.angle += THE_VOID.rotationSpeed;
  pop();
}

function setup() {
  createCanvas(600, 600);

  THE_VOID.position = createVector(width / 2, height / 2);

    pickedHues = [];
  
  for (let i = 0; i < CHARACTER_COUNT; i++) {
    const temperament =
      i % 2 === 0 ? TEMPERAMENT.INTROVERT : TEMPERAMENT.EXTROVERT;
    characters.push(
      new Character(
        temperament,
        random(MIN_SIZE, MAX_SIZE),
        10,
        randomNeonColor()
      )
    );
  }

  characters.forEach((char) => {
    char.crush = random(characters.filter((c) => c !== char));
    char.velocity = p5.Vector.sub(char.crush.position, char.position).setMag(
      random(0.5, 1.5)
    );
  });
}

function draw() {
  background(0);
  displayVoid();

  characters.forEach((char) => {
    char.update(characters.filter((other) => other !== char));
    char.displayShape();
  });

  // arrows always in front
  characters.forEach((char) => {
    char.displayArrow();
  });
}
