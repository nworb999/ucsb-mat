function drawTable(x, y, size) {
  fill(200);
  rect(x, y, size, size);

  let seatDiameter = size * 0.3;
  fill(160);
  ellipse(x + size / 2, y - seatDiameter / 2, seatDiameter);
  ellipse(x + size / 2, y + size + seatDiameter / 2, seatDiameter);
  ellipse(x - seatDiameter / 2, y + size / 2, seatDiameter);
  ellipse(x + size + seatDiameter / 2, y + size / 2, seatDiameter);
}

function drawToilet(centerX, centerY, stallSize) {
  fill(100);
  rect(centerX - stallSize / 2, centerY - stallSize / 2, stallSize, stallSize);

  let toiletRadius = stallSize * 0.25;
  let toiletRectWidth = toiletRadius * 1.7;
  let toiletRectHeight = toiletRadius;

  fill(255);
  ellipse(centerX, centerY, toiletRadius * 2);
  fill(255);
  rect(
    centerX - toiletRectWidth / 2,
    centerY - toiletRadius - toiletRectHeight / 2,
    toiletRectWidth,
    toiletRectHeight
  );
}