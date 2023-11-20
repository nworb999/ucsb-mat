import { Table, Toilet } from "./furniture.js";
import { Character } from "./characters.js";

export class Game {
  constructor(p, order, alignments, leftTable, rightTable, bathroom) {
    this.p = p;
    this.state = "choosingSeats";
    this.order = order; // 'random', 'same', 'custom'
    this.leftTable = new Table(p, leftTable.position, leftTable.size);
    this.rightTable = new Table(p, rightTable.position, rightTable.size);
    this.toilet = new Toilet(p, bathroom.position, bathroom.size);
    this.characters = this.createCharacters(alignments);
    this.entranceOrder = this.generateEntranceOrder(this.characters, order);
  }

  createCharacters(alignments) {
    return Array.from({ length: 9 }, (_, i) => {
      const x = 100; // Starting x position
      const y = -50 * i; // Staggered starting y position above the canvas
      return new Character(this.p, alignments[i % alignments.length], i, x, y);
    });
  }

  drawFurniture() {
    this.leftTable.drawFigure();
    this.rightTable.drawFigure();
    this.toilet.drawFigure();
  }

  drawAll() {
    this.p.background(255);
    this.drawFurniture();
    this.characters.forEach((character) => {
      character.update();
      character.drawCharacter();
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

  drawCharacters() {
    this.characters.forEach((character) => {
      character.drawCharacter();
    });
  }

  chooseSeats() {
    console.log(this.entranceOrder);
    this.entranceOrder.forEach((character, index) => {
      console.log(character);
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

  updateCharacterPositions() {
    this.characters.forEach((character) => {
      if (character.seat) {
        character.moveTo(character.seat.position);
      }
    });
  }

  haveInteractions() {
    [this.leftTable, this.rightTable].forEach((table) => {
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

  resetCharacterPositions() {}

  restartGame() {
    this.state = "choosingSeats";
    this.characters.forEach((character, index) => {
      character.position.y = -50 * index;
      character.seat = null;
    });
    this.entranceOrder = this.generateEntranceOrder(
      this.characters,
      this.order
    );
  }

  update() {
    if (this.state === "choosingSeats") {
      this.chooseSeats();
      this.updateCharacterPositions();
    } else if (this.state === "conversing") {
      const conversation = new Conversation(this.characters, "Some topic");
      conversation.start();
      console.log(conversation.summary);
      this.restartGame();
    }
  }
}
