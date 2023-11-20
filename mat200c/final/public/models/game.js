import { Table, Toilet } from "./furniture.js";
import { Character } from "./characters.js";

export class Game {
  constructor(p, order, alignments, leftTable, rightTable, bathroom) {
    this.p = p;
    this.turn = "choosingSeats"; // 'choosingSeats' or 'conversing'
    this.order = order; // 'random', 'same', 'custom'
    this.leftTable = new Table(p, leftTable.position, leftTable.size);
    this.rightTable = new Table(p, rightTable.position, rightTable.size);
    this.toilet = new Toilet(p, bathroom.position, bathroom.size);
    this.characters = this.createCharacters(alignments);
    this.entranceOrder = this.generateEntranceOrder(this.characters, order);
  }

  createCharacters(alignments) {
    let characters = [];
    for (let i = 0; i < 9; i++) {
      let x = 100; // Starting x position
      let y = -50 * i; // Staggered starting y position above the canvas
      let character = new Character(
        this.p,
        alignments[i % alignments.length],
        i,
        x,
        y
      );
      character.seat = { position: this.toilet.position }; // Directly set the toilet's position as the target
      characters.push(character);
    }
    return characters;
  }

  drawFurniture() {
    this.leftTable.drawFigure();
    this.rightTable.drawFigure();
    this.toilet.drawFigure();
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

  updateCharacters() {
    this.characters.forEach((character) => {
      character.update();
    });
  }

  drawCharacters() {
    this.characters.forEach((character) => {
      character.drawCharacter();
    });
  }

  chooseSeats() {
    this.entranceOrder.forEach((character, index) => {
      if (index < this.entranceOrder.length - 1) {
        // All but the last character
        let seat = this.leftTable.isFull()
          ? this.rightTable.getNextSeat()
          : this.leftTable.getNextSeat();
        character.seat = seat;
      } else {
        // Last character goes to the toilet
        character.seat = { position: this.toilet.position };
      }
    });
    this.turn = "conversing";
  }

  updateCharacters() {
    this.characters.forEach((character) => {
      if (character.seat) {
        character.moveTo(character.seat.position);
      }
    });
  }

  haveInteraction() {
    // Logic for characters to interact and return an outcome
    // add state to check if everyone is seated (it will run every draw)
    // ...
  }
}
