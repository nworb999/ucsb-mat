#version 300 es
precision highp float;
in vec3 aPosition;
void main() {
  gl_Position = vec4(aPosition, 1.0);
}