function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
  }
  
  function draw() {
    background(255);
  
    let padding = 80; 
    let squareSize = (width - padding * 4) / 3; 
  
    // Draw two tables
    drawTable(padding, height - padding - squareSize, squareSize);
    drawTable(
      padding * 2 + squareSize,
      height - padding - squareSize,
      squareSize
    );
  
    // Draw the toilet
    let stallSize =
      min(width - padding * 2, height - padding * 2 - squareSize) / 2; // Stall size
    drawToilet(width / 2, padding + stallSize / 2, stallSize);
  }
  