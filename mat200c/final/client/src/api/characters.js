class Alignment {
  constructor(name, compatibilityMatrix) {
    this.name = name;
    this.compatibilityMatrix = compatibilityMatrix;
  }
}

class Character {
  constructor(alignment, startOrder) {
    this.alignment = alignment;
    this.seat = null;
    this.relationships = [];
    this.startOrder = startOrder;
  }

  chooseSeat(tables) {
    // Logic for choosing a seat based on alignment and relationships
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
