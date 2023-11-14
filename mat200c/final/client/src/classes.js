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

class Memory {
  constructor(character) {
    this.character = character;
    this.pastConversations = [];
  }

  remember(conversation) {
    this.pastConversations.push(conversation);
  }
}

class Table {
  constructor(position) {
    this.characters = [];
    this.position = position;
  }

  addCharacter(character) {
    this.characters.push(character);
  }
}

class Conversation {
  constructor(characters, topic) {
    this.characters = characters;
    this.topic = topic;
    this.outcome = null;
    this.summary = "";
  }
}

class Turn {
  constructor(state, order, characters) {
    this.state = state; // 'choosingSeats' or 'conversing'
    this.order = order; // 'random', 'same', 'custom'
    this.entranceOrder = []; // order that characters walk in
    this.characters = characters;
  }

  generateEntranceOrder(order) {
    this.entranceOrder = "results";
  }
}

class Game {
  constructor(turn, characters, furniture) {
    this.turn = new Turn(s);
    this.characters = characters;
    this.furniture = furniture;
  }

  startNewTurn() {
    // Logic to start a new turn
  }

  startNewGame() {
    // Logic to restart game state
  }
}
