const seatProportion = 0.3;

export class Table {
  constructor(p, position, size) {
    this.p = p;
    this.characters = [];
    this.position = position;
    this.size = size;
    this.seats = [
      {
        x: position.x + size / 2,
        y: position.y - (size * seatProportion) / 2,
      },
      {
        x: position.x + size / 2,
        y: position.y + size + (size * seatProportion) / 2,
      },
      {
        x: position.x - (size * seatProportion) / 2,
        y: position.y + size / 2,
      },
      {
        x: position.x + size + (size * seatProportion) / 2,
        y: position.y + size / 2,
      },
    ];
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  isFull() {
    return this.characters.length >= 4;
  }

  getNextSeat() {
    for (let seat of this.seats) {
      if (!seat.occupied) {
        seat.occupied = true;
        return { position: { x: seat.x, y: seat.y } };
      }
    }
    return null; // No more seats available
  }

  drawFigure() {
    this.p.fill(200);
    this.p.rect(this.position.x, this.position.y, this.size, this.size);

    this.seats.forEach((seat) => {
      this.p.fill(160);
      this.p.ellipse(
        seat.x,
        seat.y,
        this.size * seatProportion,
        this.size * seatProportion
      );
    });
  }
}

export class Toilet {
  constructor(p, position, size) {
    this.p = p;
    this.position = position;
    this.size = size;
    this.character = null;
  }

  addCharacter(character) {
    this.character = character;
  }

  isFull() {}

  getNextSeat() {}

  drawFigure() {
    this.p.fill(100);
    this.p.rect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );

    let toiletRadius = this.size * seatProportion;
    let toiletRectWidth = toiletRadius * 1.7;
    let toiletRectHeight = toiletRadius;

    this.p.fill(255);
    this.p.ellipse(this.position.x, this.position.y, toiletRadius * 2);

    this.p.fill(255);
    this.p.rect(
      this.position.x - toiletRectWidth / 2,
      this.position.y - toiletRadius - toiletRectHeight / 2,
      toiletRectWidth,
      toiletRectHeight
    );
  }
}
