import { Table, Toilet } from "./furniture.js";
import { Character } from "./characters.js";

export class Game {
  constructor(order, alignments, names, leftTable, rightTable, bathroom) {
    this.state = "choosingSeats"; // 'choosingSeats' or 'conversing'
    this.turn = 0;
    this.order = order; // 'random', 'same', 'custom'
    this.leftTable = new Table(leftTable.position, leftTable.size);
    this.rightTable = new Table(rightTable.position, rightTable.size);
    this.toilet = new Toilet(bathroom.position, bathroom.size);
    this.characters = this.createCharacters(alignments, names);
    this.entranceOrder = this.generateEntranceOrder(this.characters, order);
  }

  createCharacters(alignments, names) {
    return Array.from({ length: 9 }, (_, i) => {
      const x = 100; // Starting x position
      const y = -50 * i; // Staggered starting y position above the canvas
      return new Character(
        alignments[i % alignments.length],
        i,
        names[i],
        x,
        y
      );
    });
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
    this.entranceOrder.forEach((character, index) => {
      if (index < this.entranceOrder.length - 1) {
        let seat = this.leftTable.isFull()
          ? this.rightTable.getNextSeat(character)
          : this.leftTable.getNextSeat(character);
        character.seat = seat;
      } else {
        // Last character goes to the toilet
        character.seat = { position: this.toilet.position };
        this.toilet.addCharacter(character);
      }
    });
  }

  startGame() {
    this.state = "choosingSeats";

    this.resetCharacterPositions();

    this.entranceOrder = this.generateEntranceOrder(
      this.characters,
      this.order
    );

    this.chooseSeats();
    this.turn++;
  }

  updateCharacters() {
    this.characters.forEach((character) => {
      if (character.seat) {
        character.moveTo(character.seat.position);
      }
    });
  }

  haveInteractions() {
    [(this.leftTable, this.rightTable)].forEach((table) => {
      const seatedCharacters = table.seats
        .filter((seat) => seat.occupied)
        .map((seat) => seat.character);

      seatedCharacters.forEach((character) => {
        seatedCharacters.forEach((otherCharacter) => {
          if (character !== otherCharacter) {
            character.interactWith(otherCharacter);
          }
        });
      });
    });
  }

  resetCharacterPositions() {
    this.characters.forEach((character, index) => {
      character.position = { x: 100, y: -50 * index };
      character.seat = null;
    });

    [this.leftTable, this.rightTable].forEach((table) => {
      table.seats.forEach((seat) => {
        seat.occupied = false;
      });
      table.characters = [];
    });
    this.toilet.addCharacter(null);
  }

  update() {
    this.updateCharacters();
    this.drawAll();
    if (this.state === "choosingSeats") {
      const allSeated = this.characters.every((character) =>
        character.hasReachedSeat()
      );
      if (allSeated) {
        this.state = "conversing";
      }
    } else if (this.state === "conversing") {
      this.haveInteractions();
      // You can put additional conversing logic here
      this.startGame();
    }
  }

  getState() {
    return {
      characters: this.characters.map((character) => character.getState()),
      leftTable: this.leftTable.getState(),
      rightTable: this.rightTable.getState(),
      toilet: this.toilet.getState(),
    };
  }
}
