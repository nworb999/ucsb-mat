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
      this.summary = '';
    }
  }
  
  class Turn {
    constructor(state, order) {
      this.state = state; // 'choosingSeats' or 'conversing'
      this.order = order;
    }
  }
  
  class Game {
    constructor(characters) {
      this.turn = null;
      this.result = null;
      this.characters = characters;
    }
  
    startNewTurn() {
      // Logic to start a new turn
    }
  
    calculateResult() {
      // Logic to calculate game result
    }
  }
  