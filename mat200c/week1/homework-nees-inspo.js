// https://editor.p5js.org/nworb999/sketches/CFilQmvKl

// I like this program because of the range of outcomes it can produce

// I used a markov chain because I had been researching it for another
// project and I wanted more symmetry in the results.  

// The boilerplate for markov chain is from chatGPT. 

let maxRadius = 200;
let radiusShift = 10;
let skewShift = 33 + (1 / 3);

let x, y, r;
let state;

let counter = 0;
let maxCalls = 12 * 22; // same as nees


// transition matrix, two states, i and j
let matrix = [
  [0.1, 0.4, 0.4, 0.1],
  [0.2, 0.3, 0.3, 0.2],
  [0.3, 0.2, 0.2, 0.3],
  [0.4, 0.1, 0.1, 0.4],
];

function setup() {
  createCanvas(400, 700);
  background(255);

  // this makes for a cooler animation 
  // and I got it from chatGPT
  frameRate(10);

  x = width / 2;
  y = height / 2;
  r = 50;

  state = 0; 
}

function draw() {
  if (counter < maxCalls) {
    counter++;

    fill(255, 0);

    ellipse(min(400, x), min(700, y), r, r);

    let randomValue = random([0, 1]);

    let nextState = getNextState(state, matrix);

    switch (nextState) {
      case 0:
        r > maxRadius ? (r = maxRadius) : (r += radiusShift);
        break;
      case 1:
        r < 10 ? (r = 10) : (r -= radiusShift); // (decreasing size but not letting it disappear is from chatGPT)
        break;
      case 2:
        randomValue === 1 ? (x -= skewShift) : (x += skewShift); 
        break;
      case 3:
        randomValue == 1 ? (y -= skewShift) : (y += skewShift);
        break;
    }

    state = nextState;
  }

  function getNextState(currentState, transitionMatrix) {
    let r = random(1);
    let cumulativeProbability = 0;

    for (let i = 0; i < transitionMatrix[currentState].length; i++) {
      cumulativeProbability += transitionMatrix[currentState][i];
      if (r < cumulativeProbability) {
        return i;
      }
    }

    return currentState;
  }
}

