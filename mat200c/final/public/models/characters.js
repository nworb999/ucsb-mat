import { Memory } from "./memory.js";

class Alignment {
  constructor(name, compatibilityMatrix) {
    this.name = name;
    this.compatibilityMatrix = compatibilityMatrix;
  }
}

const stepSize = 5;

export class Character {
  constructor(alignment, startOrder, name, x, y) {
    this.alignment = alignment;
    this.seat = null;
    this.relationships = [];
    this.startOrder = startOrder;
    this.position = { x, y };
    this.name = name;
    this.memory = new Memory(this);
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

  hasReachedSeat() {
    const tolerance = stepSize;
    return (
      this.seat &&
      Math.abs(this.position.x - this.seat.position.x) <= tolerance &&
      Math.abs(this.position.y - this.seat.position.y) <= tolerance
    );
  }

  moveTo(targetPosition) {
    if (Math.abs(this.position.x - targetPosition.x) > stepSize) {
      this.position.x +=
        this.position.x < targetPosition.x ? stepSize : -stepSize;
    }
    if (Math.abs(this.position.y - targetPosition.y) > stepSize) {
      this.position.y +=
        this.position.y < targetPosition.y ? stepSize : -stepSize;
    }
  }

  getState() {
    return { position: this.position };
  }

  interactWith(otherCharacter) {
    // Roll a 10-sided die to determine the outcome of the interaction
    const outcome = Math.ceil(Math.random(10));
    // Find or create a relationship for the otherCharacter
    let relationship = this.relationships.find(
      (r) => r.character === otherCharacter
    );
    if (!relationship) {
      relationship = { character: otherCharacter, scores: [] };
      this.relationships.push(relationship);
    }
    // Store the outcome of the interaction
    relationship.scores.push(outcome);
    console.log(outcome);
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
