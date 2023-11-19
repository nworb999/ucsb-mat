class Table {
  constructor(position, size) {
    this.characters = [];
    this.position = position; // { x, y }
    this.size = size;
  }

  addCharacter(character) {
    this.characters.push(character);
  }

  isFull() {}

  getNextSeat() {}

  draw() {
    fill(200);
    rect(this.position.x, this.position.y, this.size, this.size);

    let seatDiameter = this.size * 0.3;
    fill(160);
    ellipse(
      this.position.x + this.size / 2,
      this.position.y - seatDiameter / 2,
      seatDiameter
    );
    ellipse(
      this.position.x + this.size / 2,
      this.position.y + this.size + seatDiameter / 2,
      seatDiameter
    );
    ellipse(
      this.position.x - seatDiameter / 2,
      this.position.y + this.size / 2,
      seatDiameter
    );
    ellipse(
      this.position.x + this.size + seatDiameter / 2,
      this.position.y + this.size / 2,
      seatDiameter
    );
  }
}

class Toilet {
  constructor(position, stallSize) {
    this.position = position; // { centerX, centerY }
    this.stallSize = stallSize;
    this.character = null; // Assuming only one character can use the toilet at a time
  }

  addCharacter(character) {
    this.character = character;
  }

  isFull() {}

  getNextSeat() {}

  draw() {
    fill(100);
    rect(
      this.position.centerX - this.stallSize / 2,
      this.position.centerY - this.stallSize / 2,
      this.stallSize,
      this.stallSize
    );

    let toiletRadius = this.stallSize * 0.25;
    let toiletRectWidth = toiletRadius * 1.7;
    let toiletRectHeight = toiletRadius;

    fill(255);
    ellipse(this.position.centerX, this.position.centerY, toiletRadius * 2);
    fill(255);
    rect(
      this.position.centerX - toiletRectWidth / 2,
      this.position.centerY - toiletRadius - toiletRectHeight / 2,
      toiletRectWidth,
      toiletRectHeight
    );
  }
}

export { Table, Toilet };
