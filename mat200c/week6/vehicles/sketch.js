// https://editor.p5js.org/nworb999/sketches/Y2Ohkwbk3
// I worked with chatGPT to write this whole thing but 
// I was in charge of the details 😤

// Define temperament types
const TEMPERAMENT = {
  INTROVERT: "introvert",
  EXTROVERT: "extrovert",
};

let characters = [];
const MAX_SPEED = 10;
const CHARACTER_COUNT = 10;
const MIN_SIZE = 20;
const MAX_SIZE = 80;
const ATTRACTION_FORCE = 5;
const MIN_SPEED_MULTIPLIER = 0.25;
const MAX_SPEED_MULTIPLIER = 1.25;
const MAX_FADE = 255;
const MIN_FADE = 50;
const FADE_CHANGE_SPEED = 0.3;
const SPRING_CONSTANT = 0.05;

function randomColor() {
  return color(random(255), random(255), random(255));
}

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < CHARACTER_COUNT; i++) {
    const temperament = i % 2 === 0 ? TEMPERAMENT.INTROVERT : TEMPERAMENT.EXTROVERT;
    characters.push(new Character(temperament, random(MIN_SIZE, MAX_SIZE), 10, randomColor()));
  }

  characters.forEach(char => {
    char.crush = random(characters.filter(c => c !== char));
    char.velocity = p5.Vector.sub(char.crush.position, char.position).setMag(random(0.5, 1.5));
  });
}

function draw() {
  background(255);
  
    characters.forEach(char => {
    char.update(characters.filter(other => other !== char));
    char.displayShape(); 
  });

  // arrows always in front
  characters.forEach(char => {
    char.displayArrow(); 
  });
  
}
