// https://editor.p5js.org/nworb999/sketches/Y2Ohkwbk3

const Temperament = {
  INTROVERT: "introvert",
  EXTROVERT: "extrovert",
};

class Character {
  constructor(temperament, confidence, energyLevel, color) {
    if (!Object.values(Temperament).includes(temperament)) {
      throw new Error("Invalid temperament value");
    }
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.temperament = temperament;
    this.confidence = confidence; // 1-5
    this.energyLevel = energyLevel; // 1-10
    this.color = color;
    this.crush = null;
    this.x = random(width);
    this.y = random(height);
  }

  applyForce(force) {
    // Newton's second law: F = m * a
    let acceleration = p5.Vector.div(force, this.confidence);
    this.velocity.add(acceleration);
  }

  display() {
    push();
    translate(this.position.x, this.position.y);

    if (this.crush) {
      stroke(this.crush.color);
      strokeWeight(2);
      line(0, 0, this.crush.position.x - this.position.x, this.crush.position.y - this.position.y);
    }

    noStroke();
    fill(this.getColor());

    if (this.temperament === "introvert") {
      ellipse(0, 0, this.confidence, this.confidence);
    } else if (this.temperament === "extrovert") {
      rectMode(CENTER);
      square(0, 0, this.confidence);
    }

    pop();
  }

   constrainToCanvas() {
    // Check the left and right boundaries
    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x *= -1; // Invert velocity to "bounce" from the edge
    } else if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    }

    // Check the top and bottom boundaries
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y *= -1;
    } else if (this.position.y > height) {
      this.position.y = height;
      this.velocity.y *= -1;
    }
  }
  
  update() {
    if (this.crush && this.confidence < this.crush.confidence) {
      let force = p5.Vector.sub(this.crush.position, this.position);
      let distanceSq = force.magSq();
      let strength = (G * this.crush.confidence) / distanceSq;
      
      strength *= crushAttractionMultiplier;
      
      force.setMag(strength); // Calculate the gravitational force
      this.applyForce(force);
    }
    
    this.position.add(this.velocity);
    this.constrainToCanvas();
  }

  interact(other) {
    let buffer = this.confidence / 2 + other.confidence / 2; // so they don't overlap (thanks chatGPT)
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distance = sqrt(dx * dx + dy * dy);

    if (distance < buffer) {
      // Perform a speech check (coin flip)
      let coinFlip = random() < 0.5;
      let repelForce = coinFlip ? 5 : 2; // Heads: strong repulsion, Tails: weak repulsion

      // Apply the spring force
      let springForceX = (dx / distance) * repelForce;
      let springForceY = (dy / distance) * repelForce;

      // Repel this character
      this.x -= springForceX;
      this.y -= springForceY;

      // Repel the other character (to conserve momentum)
      other.x += springForceX;
      other.y += springForceY;
    }
  }

  getColor() {
    let intensity = map(this.energyLevel, 1, 10, 50, 255);
    return lerpColor(color(255), this.color, intensity / 255); // thanks chatGPT
  }
}

let characters = [];
const crushAttractionMultiplier = 5; 
const G = 90;

function setup() {
  createCanvas(600, 600);
  characters.push(
    new Character(
      Temperament.INTROVERT,
      30,
      5,
      color(random(255), random(255), random(255))
    )
  );
  characters.push(
    new Character(
      Temperament.EXTROVERT,
      20,
      7,
      color(random(255), random(255), random(255))
    )
  );
  characters.push(
    new Character(
      Temperament.INTROVERT,
      40,
      6,
      color(random(255), random(255), random(255))
    )
  );
  characters.push(
    new Character(
      Temperament.EXTROVERT,
      50,
      4,
      color(random(255), random(255), random(255))
    )
  );

  for (let char of characters) {
    let possibleCrushes = characters.filter((c) => c !== char); // Can't have a crush on themselves
    char.crush = random(possibleCrushes);

    let r = p5.Vector.sub(char.position, char.crush.position);
    let distance = r.mag();
    let orbitalVelocity = sqrt((G * char.crush.confidence) / distance); // Circular orbit speed
    r.rotate(HALF_PI); // Rotate vector by 90 degrees to make it tangential
    r.setMag(orbitalVelocity);
    char.velocity = r;
  }
}

function draw() {
  background(255);

  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      characters[i].interact(characters[j]);
    }
  }

  for (let char of characters) {
    char.update();
    char.display();
  }
}

