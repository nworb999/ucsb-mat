const seatProportion = 0.3;

export class Table {
  constructor(p, position, size) {
    this.p = p;
    this.characters = [];
    this.position = position;
    this.size = size;
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  isFull() {}

  getNextSeat() {}

  drawFigure() {
    this.p.fill(200);
    this.p.rect(this.position.x, this.position.y, this.size, this.size);

    let seatDiameter = this.size * seatProportion;
    this.p.fill(160);
    this.p.ellipse(
      this.position.x + this.size / 2,
      this.position.y - seatDiameter / 2,
      seatDiameter
    );
    this.p.ellipse(
      this.position.x + this.size / 2,
      this.position.y + this.size + seatDiameter / 2,
      seatDiameter
    );
    this.p.ellipse(
      this.position.x - seatDiameter / 2,
      this.position.y + this.size / 2,
      seatDiameter
    );
    this.p.ellipse(
      this.position.x + this.size + seatDiameter / 2,
      this.position.y + this.size / 2,
      seatDiameter
    );
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
