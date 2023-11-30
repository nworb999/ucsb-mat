import { Table, Toilet } from "./furniture.js";
import { Character } from "./characters.js";

export class Game {
  constructor(order, alignments, leftTable, rightTable, bathroom) {
    this.state = "choosingSeats"; // 'choosingSeats' or 'conversing'
    this.turn = 0;
    this.order = order; // 'random', 'same', 'custom'
    this.leftTable = new Table(leftTable.position, leftTable.size);
    this.rightTable = new Table(rightTable.position, rightTable.size);
    this.toilet = new Toilet(bathroom.position, bathroom.size);
    this.characters = this.createCharacters(alignments);
    this.entranceOrder = null;
    this.memory = {};
  }

  setMemory(memory) {
    this.memory = memory ? memory : this.memory;
  }

  createCharacters(alignments) {
    return Array.from({ length: 9 }, (_, i) => {
      const x = 100;
      const y = -50 * i;
      return new Character(alignments[i % alignments.length], i, x, y);
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

  haveInteractions(memory) {
    const conversations = [];
    const topic = "the weather";
    [(this.leftTable, this.rightTable)].forEach((table) => {
      const seatedCharacters = table.seats
        .filter((seat) => seat.occupied)
        .map((seat) => seat.character);

      seatedCharacters.forEach((character) => {
        seatedCharacters.forEach((otherCharacter) => {
          if (character !== otherCharacter) {
            const outcome = character.interactWith(
              otherCharacter,
              memory ? memory[character.name] : null,
              topic
            );
            conversations.push({
              turn: this.turn,
              character: character,
              otherCharacter: otherCharacter,
              outcome,
            });
          }
        });
      });
    });
    this.memory = conversations;
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
    if (this.state === "choosingSeats") {
      const allSeated = this.characters.every((character) =>
        character.hasReachedSeat()
      );
      if (allSeated) {
        this.state = "conversing";
      }
    }
    if (this.state === "conversing") {
      this.haveInteractions(this.memory);
    }
  }

  getState() {
    return {
      characters: this.characters.map((character) => character.getState()),
      leftTable: this.leftTable.getState(),
      rightTable: this.rightTable.getState(),
      toilet: this.toilet.getState(),
      state: this.state,
      memory: this.memory,
      turn: this.turn,
    };
  }
}
