class Character {
  constructor(temperament, size, energyLevel, color) {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector();
    this.acceleration = createVector();
    this.temperament = temperament;
    this.size = size;
    this.energyLevel = energyLevel;
    this.color = color;
    this.crush = null;
    this.fadeLevel = 255;
  }

  applyForces(characters) {
    this.applyAttraction();
    this.applyRepulsion(characters);
  }

  applyRepulsion(characters) {
    characters.forEach(other => this.applyRepulsionToCharacter(other));
  }

  applyRepulsionToCharacter(other) {
    if (other === this) return;

    const distanceVec = p5.Vector.sub(this.position, other.position);
    const distance = distanceVec.mag();
    const sumOfRadii = this.size / 2 + other.size / 2;

    if (distance < sumOfRadii) {
      const overlap = sumOfRadii - distance;
      let repulsionForce = distanceVec.copy().normalize().mult(overlap * SPRING_CONSTANT);

      this.acceleration.add(repulsionForce);
      other.acceleration.sub(repulsionForce);
    }
  }

  applyAttraction() {
    if (this.crush) {
      let attractionVec = p5.Vector.sub(this.crush.position, this.position).normalize();
      this.acceleration.add(attractionVec.mult(ATTRACTION_FORCE));
    }
  }

  update() {
    this.applyForces(characters);

    let speedAdjustment = map(
      this.size,
      MIN_SIZE,
      MAX_SIZE,
      MAX_SPEED_MULTIPLIER,
      MIN_SPEED_MULTIPLIER
    );
    this.velocity.add(this.acceleration);
    this.velocity.limit(MAX_SPEED * speedAdjustment);

    this.position.add(this.velocity);
    this.acceleration.mult(0);

    this.constrainToCanvas();
    this.adjustFadeLevel();
  }

  adjustFadeLevel() {
    let fadeTarget =
      this.temperament === TEMPERAMENT.EXTROVERT
        ? MAX_FADE
        : MIN_FADE;

    this.fadeLevel += (fadeTarget - this.fadeLevel) * FADE_CHANGE_SPEED;
  }

  displayShape() {
    push();
    translate(this.position.x, this.position.y);
    fill(this.colorForDisplay());
    noStroke();

    // Draw the character itself
    if (this.temperament === TEMPERAMENT.INTROVERT) {
      ellipse(0, 0, this.size);
    } else {
      rectMode(CENTER);
      square(0, 0, this.size);
    }
    pop();
  }

displayArrow() {
  if (this.crush) {
    // Find the edge point on the crush's shape
    let directionToCrush = p5.Vector.sub(
      this.crush.position,
      this.position
    ).normalize();
    let crushSizeOffset = this.crush.size / 2; // Edge offset for the crush size
    let edgePoint = p5.Vector.mult(directionToCrush, crushSizeOffset);

    // Adjust arrow endpoint for the crush's size
    let arrowEndPoint = p5.Vector.sub(this.crush.position, edgePoint);

    // Draw the line from this character to the crush's edge
    push();
    stroke(this.crush.color);
    strokeWeight(2);
    line(this.position.x, this.position.y, arrowEndPoint.x, arrowEndPoint.y);

    // Draw the arrowhead
    fill(this.crush.color); // Set the fill color for the arrowhead
    let angle = atan2(
      arrowEndPoint.y - this.position.y,
      arrowEndPoint.x - this.position.x
    ); // Get the angle of the line
    translate(arrowEndPoint.x, arrowEndPoint.y);
    rotate(angle);
    let arrowSize = 7; // Size of the arrowhead
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}

  colorForDisplay() {
    let fadedColor = lerpColor(color(255), this.color, this.fadeLevel / 255);
    let intensity = map(this.energyLevel, 1, 10, 50, 255);
    return lerpColor(
      color(255, 255, 255, this.fadeLevel),
      fadedColor,
      intensity / 255
    );
  }

  constrainToCanvas() {
    let radius = this.size / 2;
    this.position.x = constrain(this.position.x, radius, width - radius);
    this.position.y = constrain(this.position.y, radius, height - radius);
  }
}