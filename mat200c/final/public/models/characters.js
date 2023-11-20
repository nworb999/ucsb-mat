class Alignment {
  constructor(name, compatibilityMatrix) {
    this.name = name;
    this.compatibilityMatrix = compatibilityMatrix;
  }
}

export class Character {
  constructor(p, alignment, startOrder, x, y) {
    this.p = p;
    this.alignment = alignment;
    this.seat = null;
    this.relationships = [];
    this.startOrder = startOrder;
    this.position = { x, y };
  }

  update() {
    if (this.seat) {
      this.moveTo(this.seat.position);
    }
  }

  chooseSeat(tables) {
    // choose table and then seat
    // Logic for choosing a seat based on alignment and relationships
  }

  moveTo(targetPosition) {
    const stepSize = 2; // Adjust the step size as needed
    if (Math.abs(this.position.x - targetPosition.x) > stepSize) {
      this.position.x +=
        this.position.x < targetPosition.x ? stepSize : -stepSize;
    }
    if (Math.abs(this.position.y - targetPosition.y) > stepSize) {
      this.position.y +=
        this.position.y < targetPosition.y ? stepSize : -stepSize;
    }
  }

  drawCharacter() {
    this.p.fill(144, 238, 144); // Light green color
    this.p.ellipse(this.position.x, this.position.y, 20, 20); // Radius of 20
  }

  converseWith(table) {
    // Logic for conversation
  }
}

class Relationship {
  constructor() {
    this.score = 3; // Default score
    this.history = [];
  }

  updateScore(newScore) {
    this.history.push(this.score);
    this.score = newScore;
  }
}
