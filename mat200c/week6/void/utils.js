
// Define temperament types
const TEMPERAMENT = {
  INTROVERT: "introvert",
  EXTROVERT: "extrovert",
};

let characters = [];
const CHARACTER_COUNT = 8;

const MAX_SPEED = 5;
const MIN_SIZE = 20;
const MAX_SIZE = 70;
const ATTRACTION_FORCE = 0.5;
const MIN_SPEED_MULTIPLIER = 0.25;
const MAX_SPEED_MULTIPLIER = 1.25;

const MAX_FADE = 255;
const MIN_FADE = 50;
const FADE_CHANGE_SPEED = 0.3;
const SPRING_CONSTANT = 0.015;

let pickedHues = [];

function randomNeonColor() {
  let hue;
  let colorDistance = 360 / CHARACTER_COUNT; // Ensure that the hues are spread out
  let maxAttempts = 100; // Prevent infinite loops
  let attempts = 0;
  
  do {
    hue = Math.floor(random(360) / colorDistance) * colorDistance; // Quantize the hue to spread them out evenly
    attempts++;
  } while (pickedHues.includes(hue) && attempts < maxAttempts);

  pickedHues.push(hue); // Keep track of picked hues

  colorMode(HSB);
  const saturation = 100; // Full saturation for neon effect
  const brightness = 100; // Full brightness for neon effect
  const c = color(hue, saturation, brightness);
  colorMode(RGB);
  return c;
}