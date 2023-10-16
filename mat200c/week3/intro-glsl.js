let mandelbrot;
let zoom, x, y;

function setup() {
  // make a canvas centered on (0, 0) !
  createCanvas(600, 600, WEBGL);
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
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
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
uniform vec2 mouse; // a variable passed in from javascript/p5

float maximum = 16.0;
const float limit = 100.0;


void main() {
  vec2 c = vPosition;
  vec2 z = vec2(0.0, 0.0);
  vec3 color = vec3(0.0, 0.0, 0.0);

  for (float i = 0.0; i < limit; i++) {
    float x = (z.x * z.x - z.y * z.y) + c.x;
    float y = (z.y * z.x + z.x * z.y) + c.y;

    if ((x * x + y * y) > maximum) {
      color = vec3(i/maximum, sqrt(i/maximum), sin(i));
      break;
    }
    z.x = x;
    z.y = y;
  }


  gl_FragColor = vec4(color, 1.0);
}
`;

