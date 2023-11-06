const Temperament = {
  INTROVERT: "introvert",
  EXTROVERT: "extrovert",
};

function randomSpeed() {
  return (random(1) > 0.5 ? 1 : -1) * random(3, 5);
}

class Character {
  constructor(temperament, confidence, energyLevel, color) {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(randomSpeed(), randomSpeed());
    this.temperament = temperament;
    this.confidence = confidence;
    this.targetConfidence = confidence; // The desired confidence level after interactions (thanks chatGPT)
    this.energyLevel = energyLevel; // 1-10
    this.color = color;
    this.crush = null;
    this.interactedThisFrame = false;
  }

  applyForce(force) {
    let acceleration = p5.Vector.div(force, this.confidence);
    this.velocity.add(acceleration);
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    let offset = this.temperament === Temperament.INTROVERT ? -6 : 6;

    // Draw attraction line to the crush with transparency
    if (this.crush) {
      stroke(this.getColor(), 75);
      strokeWeight(2);
      line(
        offset,
        0,
        this.crush.position.x - this.position.x + offset,
        this.crush.position.y - this.position.y
      );
    }

    fill(this.getColor());
    noStroke();
    if (this.temperament === Temperament.INTROVERT) {
      ellipse(0, 0, this.confidence * 2); // Using diameter for ellipse size
    } else {
      rectMode(CENTER);
      square(0, 0, this.confidence * 2); // Using side length for square
    }
    pop();
  }

  constrainToCanvas() {
    if (this.position.x < 0 || this.position.x > width) {
      this.position.x = constrain(this.position.x, 0, width);
      this.velocity.x *= -1;
    }

    if (this.position.y < 0 || this.position.y > height) {
      this.position.y = constrain(this.position.y, 0, height);
      this.velocity.y *= -1;
    }
  }

  update() {
    let velocityModifier = map(this.energyLevel, 1, 10, 0.5, 1.5);
    this.velocity.mult(velocityModifier);
    
    if (this.crush) {
      let attractionForce = p5.Vector.sub(this.crush.position, this.position);
      let distanceSq = attractionForce.magSq();
      let strength = (G * this.crush.confidence) / distanceSq;
      strength *= crushAttractionMultiplier;
      attractionForce.setMag(strength);
      this.applyForce(attractionForce);
      this.velocity.mult(softeningFactor);
    }
    this.velocity.x = constrain(this.velocity.x, -maxSpeed, maxSpeed);
    this.velocity.y = constrain(this.velocity.y, -maxSpeed, maxSpeed);
    
    this.position.add(this.velocity);
    this.constrainToCanvas();
    this.adjustConfidence();
  }

  interact(other) {
    let distance = p5.Vector.dist(this.position, other.position);
    if (distance < this.confidence + other.confidence) {
      this.doInteraction(other);
      this.interactedThisFrame = true;
      other.interactedThisFrame = true;
    }
  }

  doInteraction(other) {
    let confidenceFactor = map(this.confidence, 10, 50, 0.5, 1.5); // Scale factor based on confidence
    let diceRoll = ceil(random(10) * confidenceFactor); // Rolling a 10-sided dice
    let successThreshold = 6; // A roll of 6 or higher is a success
    let interactionOutcome =
      diceRoll >= successThreshold ? diceRoll - 5 : diceRoll - 6;

    this.setTargetConfidence(interactionOutcome);
    other.setTargetConfidence(interactionOutcome);

    this.adjustEnergy();
    other.adjustEnergy();

    // make the character bounce away more after a failed interaction
    let forceMagnitude = map(
      abs(interactionOutcome),
      0,
      4,
      failForce,
      succeedForce
    );
    let repelForce = p5.Vector.sub(this.position, other.position);
    repelForce.setMag(forceMagnitude);

    this.applyForce(repelForce);
  }

  setTargetConfidence(change) {
    this.targetConfidence += change;
    this.targetConfidence = constrain(this.targetConfidence, 10, 50);
  }

  adjustConfidence() {
    // Gradually adjust the current confidence towards the target confidence
    if (this.confidence < this.targetConfidence) {
      this.confidence += this.confidenceAdjustSpeed;
      if (this.confidence > this.targetConfidence) {
        this.confidence = this.targetConfidence;
      }
    } else if (this.confidence > this.targetConfidence) {
      this.confidence -= this.confidenceAdjustSpeed;
      if (this.confidence < this.targetConfidence) {
        this.confidence = this.targetConfidence;
      }
    }
    let newConfidence = constrain(this.targetConfidence, 10, 50);
    this.confidence =
      typeof newConfidence === "number" && !isNaN(newConfidence)
        ? newConfidence
        : this.confidence;
  }

  adjustEnergy() {
    // Introverts regain energy when not interacting, extroverts lose energy
    if (this.temperament === Temperament.INTROVERT) {
      this.energyLevel += this.interactedThisFrame ? 0 : 1;
    } else {
      this.energyLevel -= this.interactedThisFrame ? 0 : 1;
    }
    this.energyLevel = constrain(this.energyLevel, 1, 10);
    this.interactedThisFrame = false;
  }

  getColor() {
    let intensity = map(this.energyLevel, 1, 10, 50, 255);
    return lerpColor(color(255), this.color, intensity / 255);
  }
}

let characters = [];
const maxSpeed = 5;
const characterCount = 10;
const failForce = 3;
const succeedForce = 1;
const confidenceAdjustSpeed = 0.1;
const crushAttractionMultiplier = 10;
const softeningFactor = 0.8;
const G = 1200;

function setup() {
  createCanvas(800, 800);
  for (let i = 0; i < characterCount; i++) {
    let temperament =
      i % 2 === 0 ? Temperament.INTROVERT : Temperament.EXTROVERT;
    characters.push(
      new Character(
        temperament,
        random(10, 30),
        random(1, 10),
        color(random(255), random(255), random(255))
      )
    );
  }

  characters.forEach((char) => {
    let possibleCrushes = characters.filter((c) => c !== char);
    char.crush = random(possibleCrushes);
    let r = p5.Vector.sub(char.crush.position, char.position);
    let distance = r.mag();
    let orbitalVelocity = sqrt((G * char.crush.confidence) / distance);
    r.rotate(HALF_PI).setMag(orbitalVelocity);
    char.velocity = r;
  });
}

function draw() {
  background(255);

  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      characters[i].interact(characters[j]);
    }
    characters[i].update();
    characters[i].display();
  }
}

