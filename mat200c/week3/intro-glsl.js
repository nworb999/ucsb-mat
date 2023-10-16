let mandelbrot;
let zoom, x, y;

function setup() {
  // make a canvas centered on (0, 0) !
  createCanvas(400, 400, WEBGL);
  mandelbrot = createShader(verteX, fragment);
}


function draw() {
  // "binds" this shader; use it to handle all the drawing
  // that comes next
  //
  shader(mandelbrot);

  // draws a square that fills most of "clip space", almost
  // the whole canvas. this is what executes the shader.
  // the vertex shader executes per vertex. the fragment
  // shader executes per pixel drawn. (so the shader does
  // not execute on the wedge at the top.)
  //
  quad(-1, -1, 1, -1, 1, 0.8, -1, 1);
}

// remember mouse movements
//
function mouseDragged() {
  let x = map(mouseX, 0, width, -1, 1);
  let y = map(mouseY, 0, height, 1, -1);

  // this sends a message from javascript (on the CPU) to
  // GLSL (on the GPU). it sets the variable "mouse" in the
  // fragment shader.
  //
  mandelbrot.setUniform("mouse", [x, y]);
}



const verteX = `
precision highp float;

attribute vec3 aPosition;
varying vec2 vPosition;

void main() {
  gl_Position = vec4(aPosition, 1.0);
  vPosition = gl_Position.xy;
}
`

const fragment = `
precision highp float;
varying vec2 vPosition;

float iterations = 0.0;
float maximum = 16.0;
const float limit = 100.0;

uniform vec2 mouse; // a variable passed in from javascript/p5

vec2 complex_multiply(vec2 z0, vec2 z1) {
    return vec2(
    z0.x * z1.x + z0.y * z1.y, 
    z0.y * z1.x + z0.x * z1.y);
}

void main() {
  // x is on (-1, 1) and y is on (-1, 1)
  vec2 c0 = vec2(2.0, 3.0);
  vec2 z = c0;

  for (float i = 0.0; i < limit; i++) {
    z = complex_multiply(z, z) + c0;
    if (length(z) > maximum) {
      vec3 color = vec3(0, 0, 1.0 * (iterations/limit));
    }
    iterations++;
  }

  vec3 color = vec3(0, 0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;


