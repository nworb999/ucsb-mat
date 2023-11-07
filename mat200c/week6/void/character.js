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
  }

  applyForces(characters) {
    this.applyAttraction();
    this.applyRepulsion(characters);
    this.applyVoidGravitation();
  }

  applyRepulsion(characters) {
    characters.forEach((other) => this.applyRepulsionToCharacter(other));
  }

  applyRepulsionToCharacter(other) {
    if (other === this) return;

    const distanceVec = p5.Vector.sub(this.position, other.position);
    const distance = distanceVec.mag();
    const sumOfRadii = this.size / 2 + other.size / 2;

    if (distance < sumOfRadii) {
      const overlap = sumOfRadii - distance;
      let repulsionMultiplier = SPRING_CONSTANT;

      if (other.crush === this && this.crush !== other) {
        repulsionMultiplier *= UNREQUITED_POWER;
      }

      let repulsionForce = distanceVec
        .copy()
        .normalize()
        .mult(overlap * repulsionMultiplier);

      this.acceleration.add(repulsionForce);
      other.acceleration.sub(repulsionForce);
    }
  }

  applyAttraction() {
    if (this.crush) {
      let attractionVec = p5.Vector.sub(
        this.crush.position,
        this.position
      ).normalize();
      this.acceleration.add(attractionVec.mult(ATTRACTION_FORCE));
    }
  }

  applyVoidGravitation() {
    let toVoid = p5.Vector.sub(THE_VOID.position, this.position);
    let distance = toVoid.mag() - THE_VOID.size / 2 - this.size / 2;

    toVoid.normalize();
    let strength = THE_VOID.pullStrength / distance;
    toVoid.mult(strength);

    if (distance > VOID_DISTANCE) {
      this.acceleration.add(toVoid);
    } else if (distance < VOID_DISTANCE) {
      toVoid.mult(-0.5);
      this.acceleration.add(toVoid);
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
  }

  displayShape() {
    push();
    translate(this.position.x, this.position.y);

    fill(this.color);
    noStroke();

    if (this.temperament === TEMPERAMENT.INTROVERT) {
      ellipse(0, 0, this.size);
    } else if (this.temperament === TEMPERAMENT.EXTROVERT) {
      let circleRadius = this.size/1.8;
      let sideLength = sqrt((2 * PI * pow(circleRadius, 2)) / sqrt(3));
      const h = sideLength * (sqrt(3)/2);

      triangle(
        -sideLength / 2, h / 3,
        sideLength / 2, h / 3,
        0, -2 * h / 3
      );
    }
    pop();
  }

  displayArrow() {
    if (this.crush) {
      let directionToCrush = p5.Vector.sub(
        this.crush.position,
        this.position
      ).normalize();
      let crushSizeOffset = this.crush.size / 2;
      let edgePoint = p5.Vector.mult(directionToCrush, crushSizeOffset);
      let arrowEndPoint = p5.Vector.sub(this.crush.position, edgePoint);

      push();
      stroke(this.crush.color);
      strokeWeight(2);
      line(this.position.x, this.position.y, arrowEndPoint.x, arrowEndPoint.y);

      fill(this.crush.color);
      let angle = atan2(
        arrowEndPoint.y - this.position.y,
        arrowEndPoint.x - this.position.x
      );
      translate(arrowEndPoint.x, arrowEndPoint.y);
      rotate(angle + HALF_PI);
      let arrowSize = 6;
      triangle(
        -arrowSize * 0.5,
        arrowSize,
        arrowSize * 0.5,
        arrowSize,
        0,
        -arrowSize / 2
      );
      pop();
    }
  }

  constrainToCanvas() {
    if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    } else if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x *= -1;
    }

    if (this.position.y > height) {
      this.position.y = height;
      this.velocity.y *= -1;
    } else if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y *= -1;
    }
  }
}
