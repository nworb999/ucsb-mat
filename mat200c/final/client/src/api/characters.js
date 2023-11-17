class Alignment {
  constructor(name, compatibilityMatrix) {
    this.name = name;
    this.compatibilityMatrix = compatibilityMatrix;
  }
}

class Character {
  constructor(alignment, startOrder, x, y) {
    this.alignment = alignment;
    this.seat = null;
    this.relationships = []; // a matrix of each character combination and the relationship score from 1-10
    this.startOrder = startOrder;
    this.position = { x, y };
  }

  update() {
    // Update logic for character, e.g., moving towards a seat
    if (this.seat && this.position !== this.seat.position) {
      this.moveTo(this.seat);
    }
  }

  chooseSeat(tables) {
    // choose table and then seat
    // Logic for choosing a seat based on alignment and relationships
  }

  moveTo(seat) {
    // basically move one square closer to seat until seat is reached
    this.position == seat.position ? (this.seat = seat) : update(this.position);
  }

  converseWith(otherCharacter) {
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
