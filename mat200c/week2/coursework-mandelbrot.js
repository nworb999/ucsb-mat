// https://editor.p5js.org/nworb999/sketches/WRiu2f4ED

// Karl Yerkes
// 2023-10-04
//
// Starter code for CPU/js implementation of Mandlebrot Set
//

// Emma Brown 

function handle_pixel(c, r, C, R) {

  let x = c * 3.0/C - 2.1; 
  // chatGPT zoomed this in for me 
  let y = r * 3.0/R - 1.5; 

  let c0 = math.complex(x, y); // 1 + 3i

  let z = math.complex(0,0);

  let pixel = [0, 0, 0];

  let ceiling = 16;

  let limit = 100;

  let iterationCount = 0;
  
  for (i = 1; i < limit; i++) {
    z = math.add(math.pow(z, 2), c0);
    iterationCount = i;
    if (math.abs(z) > ceiling) {
      pixel = [0, 255*(iterationCount/limit), 0];
      break;
    }
  }

  return pixel;
}

function setup() {
  createCanvas(600, 600);
}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// DON'T EDIT BELOW THIS COMMENT.
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

function draw() {
  noLoop();
  const then = millis();
  background(255);
  loadPixels();
  const C = pixelDensity() * width;
  const R = pixelDensity() * height;
  let index = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const pixel = handle_pixel(c, r, C, R);
      pixels[index + 0] = pixel[0];
      pixels[index + 1] = pixel[1];
      pixels[index + 2] = pixel[2];
      pixels[index + 3] = 255;
      index += 4;
    }
  }
  updatePixels();
  // saveCanvas();

  // print out some statistics
  //
  const seconds_elapsed = (millis() - then) / 1000;
  const pixel_count = pixelDensity() * pixelDensity() * width * height;
  print(pixelDensity(), "pixel density");
  print(
    pixelDensity() * width,
    pixelDensity() * height,
    "actual width and height"
  );
  print(pixel_count, "actual pixels");
  print((millis() - then) / 1000, "seconds elapsed");
  print(seconds_elapsed / pixel_count, "seconds per pixel");
}

