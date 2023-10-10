// https://editor.p5js.org/nworb999/sketches/CbZfKge0Q

// I went with the Mandelbox set since I could read the Wikipedia
// page's math definition and sort of understand it...

// https://en.wikipedia.org/wiki/Mandelbox
// https://www.fractalforums.com/programming/mandelbox-2d-questions-and-code-attempt/

// I tried my hand at the pseudocode then used chatGPT to 
// extrapolate it, which wasn't working at all despite wrestling
// with it for an hour so I pivoted and worked off the above 
// processing example instead

let scal = 1.1;
let minRad = 0.8;
let fixedRad = 1.1;
let xmin = -2.0;
let ymin = -2.0;
let wh = 4;
let maxIterations = 90;

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  noLoop();
}

function draw() {
  loadPixels();
  
  let xmax = xmin + wh;
  let ymax = ymin + wh;
  let dx = (xmax - xmin) / width;
  let dy = (ymax - ymin) / height;
  
  let highestVal = 0;
  let pixVals = Array.from({length: width * height}, () => 0);
  
  let x = xmin;
  for (let i = 0; i < width; i++) {
    let y = ymin;
    for (let j = 0; j < height; j++) {
      let nx = x;
      let ny = y;
      let nMag = 0;
      let n = 0;
      
      while (n < maxIterations) {
        if (nx > 1) {
          nx = scal - nx;
        } else if (nx < -1)  {
          nx = -scal - nx;
        }
        
        if (ny > 1) {
          ny = scal - ny;
        } else if (ny < -1) {
          ny = -scal - ny;
        }
        
        nMag = sqrt(nx * nx + ny * ny);
        
        if (nMag < minRad) {
          let t = (fixedRad * fixedRad) / (minRad * minRad);
          nx *= t;
          ny *= t;
        } else if (nMag < 1) {
          let t = (fixedRad * fixedRad) / (nMag * nMag);
          nx *= t;
          ny *= t;
        }
        
        if (nx * nx + ny * ny > 4) break;
        
        n++;
      }
      
      if (nMag > highestVal) highestVal = nMag;
      
      pixVals[i + j * width] = nMag;
      y += dy;
    }
    x += dx;
  }
  
  for (let i = 0; i < width * height; i++) {
    let val = Math.floor(Math.log(pixVals[i]) / Math.log(highestVal) * 255);
    let pixelIdx = i * 4;
    
    pixels[pixelIdx + 0] = val;
    pixels[pixelIdx + 1] = 90;
    pixels[pixelIdx + 2] = 250;
    pixels[pixelIdx + 3] = 255;
  }
  
  updatePixels();
}

