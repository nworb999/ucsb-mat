// https://editor.p5js.org/nworb999/sketches/FpSJP69jk

let feedback;
function preload() {
  feedback = loadShader("feedback.vert", "feedback.frag");
}

let previous, next;
let renderer;
function setup() {
  renderer = createCanvas(500, 500, WEBGL);
  previous = createFramebuffer(width, height, { format: FLOAT });
  next = createFramebuffer(width, height, { format: FLOAT });
  imageMode(CENTER);
  print(pixelDensity());
  
  // controls how colors blend when alpha channel is used
  blendMode(BLEND);
 
  // controls how texture lookups work: nearest neighbor or linear interpolationt
  
  renderer.getTexture(previous).setInterpolation(NEAREST, NEAREST);
  renderer.getTexture(next).setInterpolation(NEAREST, NEAREST);
}

let x, y, z;
function draw() {
  [previous, next] = [next, previous];

  if (frameCount % 60 == 0) { // (thanks chatGPT)
    let randX = random(width);
    let randY = random(height);
    x = randX / width;
    y = randY / height;
  }
  
  next.begin();
  clear();
  shader(feedback);
  feedback.setUniform("u_resolution", [
    width * pixelDensity(),
    height * pixelDensity(),
  ]);
  feedback.setUniform("u_previous", previous);
  feedback.setUniform("u_time",   0.00005 * Math.tanh(frameCount * 10));
  feedback.setUniform("u_frame_count", frameCount/10000000 + 0.5 * Math.tanh(frameCount * 10));
  feedback.setUniform("u_rotation", 10.0 + 0.05 * Math.tanh(frameCount));
  feedback.setUniform("u_zoom",  0.5 * Math.tanh(frameCount * 10));
  feedback.setUniform("u_mode", mode);
  feedback.setUniform("u_mouse", [x, y, z, mouseIsPressed]);
  quad(-1, 1, 1, 1, 1, -1, -1, -1);
  next.end();

  image(next, 0, 0);
}

function mousePressed() {
  mouseDragged();
}
function mouseDragged() {
  x = mouseX / width;
  y = mouseY / height;
}
function mouseReleased() {}
function mouseWheel(event) {
  z += (event.delta * z) / 200;
}

function reset(c) {
  next.begin();
  resetShader();
  background(c);
  next.end();
}

let mode = 0;
function keyReleased() {
  if (key == " ") {
    // XXX add controls here
  } else if (key >= "0" && key <= "9") {
    mode = key - "0";
    print("mode: ", mode);
  } else if (keyCode == RIGHT_ARROW) {
    // XXX add control here
  } else if (keyCode == LEFT_ARROW) {
    // XXX add control here
  } else if (keyCode == UP_ARROW) {
    // XXX add control here
  } else if (keyCode == DOWN_ARROW) {
    // XXX add control here
  } else if (key == "t") {
    reset(0); // theater: black
  } else if (key == "g") {
    reset(255); // galary: white
  }
}
