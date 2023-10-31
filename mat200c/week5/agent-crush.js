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
    this.temperament = temperament;
    this.confidence = confidence; // 1-5
    this.energyLevel = energyLevel; // 1-10
    this.color = color;
    this.crush = null;
    this.x = random(width);
    this.y = random(height);
  }

  display() {
    push();
    translate(this.x, this.y);

    if (this.crush) {
      stroke(0);
      strokeWeight(2);
      line(0, 0, this.crush.x - this.x, this.crush.y - this.y);
    }

    noStroke();
    fill(this.getColor());

    if (this.temperament === "introvert") {
      ellipse(0, 0, this.getSize(), this.getSize());
    } else if (this.temperament === "extrovert") {
      rectMode(CENTER);
      square(0, 0, this.getSize());
    }

    pop();
  }

  update() {
    if (this.crush) {
      let dx = this.crush.x - this.x;
      let dy = this.crush.y - this.y;
      let distance = sqrt(dx * dx + dy * dy);

      if (distance > 1) {
        this.x += dx / distance;
        this.y += dy / distance;
      }
    }
  }

  getSize() {
    return this.confidence * 20; // Size based on confidence
  }

  getColor() {
    let intensity = map(this.energyLevel, 1, 10, 50, 255);
    return lerpColor(color(255), this.color, intensity / 255); // thanks chatGPT
  }
}

let characters = [];

function setup() {
  createCanvas(600, 600);
  characters.push(
    new Character(
      Temperament.INTROVERT,
      3,
      5,
      color(random(255), random(255), random(255))
    )
  );
  characters.push(
    new Character(
      Temperament.EXTROVERT,
      2,
      7,
      color(random(255), random(255), random(255))
    )
  );
  characters.push(
    new Character(
      Temperament.INTROVERT,
      4,
      6,
      color(random(255), random(255), random(255))
    )
  );
  characters.push(
    new Character(
      Temperament.EXTROVERT,
      5,
      4,
      color(random(255), random(255), random(255))
    )
  );

  for (let char of characters) {
    let possibleCrushes = characters.filter((c) => c !== char); // Can't have a crush on themselves
    char.crush = random(possibleCrushes);
  }
}

function draw() {
  background(255);
  for (let char of characters) {
    char.update();
    char.display();
  }
}

