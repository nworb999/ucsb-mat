class Game {
  constructor(order, characters, furniture) {
    this.turn = "choosingSeats"; // 'choosingSeats' or 'conversing'
    this.order = order; // 'random', 'same', 'custom'
    this.entranceOrder = []; // order that characters walk in, to be generated later
    this.characters = characters;
    this.leftTable = furniture.leftTable;
    this.rightTable = furniture.rightTable;
    this.bathroom = furniture.bathroom;
  }
}
