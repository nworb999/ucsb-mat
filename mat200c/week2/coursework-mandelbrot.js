// Karl Yerkes
// 2023-10-04
//
// Starter code for CPU/js implementation of Mandlebrot Set
//

function handle_pixel(c, r, C, R) {
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // PUT YOUR CODE HERE. MANDLEBROT SET, GO.
  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  // algorithm:
  // for this pixel...
  // assign an x and y value (decide boundaries)
  // create c0, a complex number
  // start z at 0 or c0
  // iterate z = z² + c0 some number of times
  // count the iterations
  // test for convergence/divergence, stopping early
  // color the pixel according to the speed of divergence
  // ... use the number of iterations for this!

  // math.js is a library. look at this:
  //   https://mathjs.org/docs
  // try these:
  //   math.complex(1, 3);
  //   math.add(e, f)
  //   math.multiply(g, h)
  //   math.abs(z);
  //   math.angle(z)
  // you don't have to use this library
  // you can work with x (real) and y (imaginary) directly

  let x = (c-C/2) * 0.01 - 0.7;
  let y = (r-R/2) * 0.01;

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
  createCanvas(200, 200);
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

