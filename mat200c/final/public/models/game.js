import { Table, Toilet } from "./furniture.js";
import { Character } from "./characters.js";

export class Game {
  constructor(order, alignments, leftTable, rightTable, bathroom) {
    this.turn = "choosingSeats"; // 'choosingSeats' or 'conversing'
    this.order = order; // 'random', 'same', 'custom'
    this.characters = this.createCharacters(alignments);
    this.entranceOrder = this.generateEntranceOrder(this.characters, order); // order that characters walk in, to be generated later
    this.leftTable = new Table(leftTable);
    this.rightTable = new Table(rightTable);
    this.bathroom = new Toilet(bathroom);
  }

  updateCharacters() {
    // Logic to update characters, e.g., moving them towards their seats
    this.characters.forEach((character) => {
      character.update(); // Assuming each character has an update method
    });
  }

  createCharacters(alignments) {
    return alignments.map((alignment) => new Character(alignment));
  }

  drawFurniture() {
    this.leftTable.drawFigure();
    this.rightTable.drawFigure();
    this.bathroom.drawFigure();
  }

  generateEntranceOrder(characters, order) {
    if (order === "random") {
      return characters.sort(() => 0.5 - Math.random());
    } else {
      return characters.sort((a, b) =>
        a.alignment.name.localeCompare(b.alignment.name)
      );
    }
  }

  chooseSeats() {
    this.entranceOrder.forEach((character) => {
      if (!this.leftTable.isFull()) {
        character.moveTo(this.leftTable.getNextSeat());
      } else if (!this.rightTable.isFull()) {
        character.moveTo(this.rightTable.getNextSeat());
      } else {
        character.moveTo(this.bathroom.getSeat());
      }
    });
    this.turn = "conversing";
  }

  haveInteraction() {
    // Logic for characters to interact and return an outcome
    // add state to check if everyone is seated (it will run every draw)
    // ...
  }
}
