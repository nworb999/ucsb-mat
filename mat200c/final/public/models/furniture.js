const seatProportion = 0.3;

export class Table {
  constructor(p, position, size) {
    this.p = p;
    this.characters = [];
    this.position = position;
    this.size = size;
    this.seats = this.createSeats();
    this.occupiedSeats = 0;
  }

  createSeats() {
    const halfSize = this.size / 2;
    const seatDiameter = this.size * seatProportion;
    const offset = seatDiameter / 2;
    return [
      { x: this.position.x + halfSize, y: this.position.y - offset },
      {
        x: this.position.x + halfSize,
        y: this.position.y + this.size + offset,
      },
      { x: this.position.x - offset, y: this.position.y + halfSize },
      {
        x: this.position.x + this.size + offset,
        y: this.position.y + halfSize,
      },
    ].map((seat) => ({ ...seat, occupied: false }));
  }

  isFull() {
    return this.occupiedSeats >= 4;
  }

  getNextSeat() {
    const seat = this.seats.find((seat) => !seat.occupied);
    if (seat) {
      seat.occupied = true;
      this.occupiedSeats++;

      return { position: { x: seat.x, y: seat.y } };
    }
    return null;
  }

  drawFigure() {
    this.p.fill(200);
    this.p.rect(this.position.x, this.position.y, this.size, this.size);
    this.seats.forEach((seat) => {
      this.p.fill(160);
      this.p.ellipse(seat.x, seat.y, this.size * seatProportion);
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

  isFull() {}

  getNextSeat() {
    if (!this.character) {
      this.character = {}; // Placeholder for the character, should be replaced with actual character reference
      // Return the position of the "seat" in the toilet
      return { position: { x: this.position.x, y: this.position.y } };
    }
    return null; // The toilet is "full"
  }

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
