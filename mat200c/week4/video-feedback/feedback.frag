#version 300 es
precision highp float;
out vec4 glFragColor;

uniform vec4 u_mouse; // x, y, z (scroll), w (button state)
uniform float u_time;
uniform float u_rotation;
uniform float u_zoom;
uniform int u_frame_count;
uniform int u_mode;
uniform vec2 u_resolution;
uniform sampler2D u_previous;

float random(vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898, 78.233)))
                 * 43758.5453123);
}

float perlin(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 blur(sampler2D t, vec2 p) {
    vec2 z = 1.0 / u_resolution;
    
    float kernel[9];
    kernel[0] = 2.0/16.0; kernel[1] = 2.0/16.0; kernel[2] = 2.0/16.0;
    kernel[3] = 2.0/16.0; kernel[4] = 2.0/16.0; kernel[5] = 2.0/16.0;
    kernel[6] = 2.0/16.0; kernel[7] = 2.0/16.0; kernel[8] = 2.0/16.0;
    
    return (
        kernel[0] * texture(t, p + vec2(-z.x,  z.y)) +
        kernel[1] * texture(t, p + vec2( 0.0,  z.y)) +
        kernel[2] * texture(t, p + vec2( z.x,  z.y)) +
        
        kernel[3] * texture(t, p + vec2(-z.x,  0.0)) +
        kernel[4] * texture(t, p) +
        kernel[5] * texture(t, p + vec2( z.x,  0.0)) +
        
        kernel[6] * texture(t, p + vec2(-z.x, -z.y)) +
        kernel[7] * texture(t, p + vec2( 0.0, -z.y)) +
        kernel[8] * texture(t, p + vec2( z.x, -z.y))
    );
}

vec4 laplacian(sampler2D t, vec2 p) {
  vec2 z = 1.0 / u_resolution;
  return -8.0 * texture(t, p)
    + texture(t, p + vec2( 0.0,  z.y))
    + texture(t, p + vec2( 0.0, -z.y))
    + texture(t, p + vec2( z.x,  0.0))
    + texture(t, p + vec2(-z.x,  0.0))
    + texture(t, p + vec2( z.x,  z.y))
    + texture(t, p + vec2( z.x, -z.y))
    + texture(t, p + vec2(-z.x, -z.y))
    + texture(t, p + vec2(-z.x,  z.y));
}

vec4 sharpen(sampler2D t, vec2 p) {
    vec2 z = 1.0 / u_resolution;

    float kernel[9];
    kernel[0] = -1.0/16.0; kernel[1] = -2.0/16.0; kernel[2] = -1.0/16.0;
    kernel[3] = -2.0/16.0; kernel[4] = 20.0/16.0; kernel[5] = -2.0/16.0;
    kernel[6] = -1.0/16.0; kernel[7] = -2.0/16.0; kernel[8] = -1.0/16.0;

    return (
        kernel[0] * texture(t, p + vec2(-z.x,  z.y)) +
        kernel[1] * texture(t, p + vec2( 0.0,  z.y)) +
        kernel[2] * texture(t, p + vec2( z.x,  z.y)) +
        
        kernel[3] * texture(t, p + vec2(-z.x,  0.0)) +
        kernel[4] * texture(t, p) +
        kernel[5] * texture(t, p + vec2( z.x,  0.0)) +
        
        kernel[6] * texture(t, p + vec2(-z.x, -z.y)) +
        kernel[7] * texture(t, p + vec2( 0.0, -z.y)) +
        kernel[8] * texture(t, p + vec2( z.x, -z.y))
    );
}

float gol(sampler2D t, vec2 p) {
  vec2 z = 1.0 / u_resolution;
  float count = (
    texture(t, p + vec2( 0.0,  z.y)) +
    texture(t, p + vec2( z.x,  z.y)) +
    texture(t, p + vec2( z.x,  0.0)) +
    texture(t, p + vec2( z.x, -z.y)) +
    texture(t, p + vec2( 0.0, -z.y)) +
    texture(t, p + vec2(-z.x, -z.y)) +
    texture(t, p + vec2(-z.x,  0.0)) +
    texture(t, p + vec2(-z.x,  z.y))
  ).x;
  if (texture(t, p).r == 1.0) {
    if (count == 2.0 || count == 3.0) {
      return 1.0;
    }
  }
  else {
    if (count == 3.0) {
      return 1.0;
    }
  }
  return 0.0;
  
  // now try SmoothLife
  // https://www.shadertoy.com/view/XtdSDn
}

float gaussianRandom(vec2 st, float mean, float stddev) {
    float u1 = random(st);
    float u2 = random(st + vec2(0.5, 0.5));
    if(u1 == 0.0) u1 = 0.0001; // Avoid zero
    float z0 = sqrt(-2.0 * log(u1)) * cos(6.28318 * u2);
    return z0 * stddev + mean;
}


vec2 scaleRotate(vec2 v, vec2 pivot, vec2 scale, float angle) {
    return
      pivot + (v - pivot)
        * scale
        * mat2(
            vec2(cos(angle), -sin(angle)),
            vec2(sin(angle),  cos(angle)));
}

float jaggedEdge(vec2 st, float radius) {
    float dist = distance(st, vec2(0.5));
    float jagged = sin(20.0 * atan(st.y, st.x) + u_time * 5.0) * 0.05;
    return smoothstep(radius, radius + jagged, dist);
}

void main() {
  vec2 pixel = gl_FragCoord.xy / u_resolution;
  
  vec2 transformed = scaleRotate(pixel, vec2(0.5), vec2(u_zoom), radians(u_rotation));
  vec4 next = texture(u_previous, transformed);
  vec4 convolved = blur(u_previous, transformed);

  glFragColor = mix(next, convolved, 0.15);

  // Perlin noise-based pattern (thanks chatGPT)
  float p = perlin(pixel * 5.0 + u_time * 0.5);

  if (u_mouse.w == 1.0) {
    if (jaggedEdge(pixel - u_mouse.xy, 0.1) < 1.0) { // jagged brush (thanks chatGPT)
        vec4 lastColor = texture(u_previous, pixel);

        
        vec4 warmColor = vec4(1.0, 0.7, 0.5 + 0.5 * sin(u_time), 1.0);
        vec4 coldColor = vec4(0.7, 0.8 + 0.2 * sin(u_time), 1.0, 1.0);

        float warmBias = dot(lastColor.rgb, warmColor.rgb);
        float coldBias = dot(lastColor.rgb, coldColor.rgb);

        float warmShadeAdjust = gaussianRandom(u_mouse.xy + vec2(0.33, 0.77), warmBias, 0.5);
        float coldShadeAdjust = gaussianRandom(u_mouse.xy + vec2(0.77, 0.33), coldBias, 0.5);

        warmColor.rgb = clamp(warmColor.rgb - warmShadeAdjust, 0.0, 1.0);
        coldColor.rgb = clamp(coldColor.rgb - coldShadeAdjust, 0.0, 1.0);

        if(p > 0.5) {
            glFragColor = warmColor;
        } else {
            glFragColor = coldColor;
        }
  
    }
  }
  
  if (u_mode == 1) { 
    // random noise
    glFragColor = vec4(vec3((random(pixel) + random(u_mouse.xy)) > 1.0), 1.0);
  } else if (u_mode == 2) {
    // Game Of Life
    
  }
  else if (u_mode == 3) {
    // XXX add your code here to implement this "mode"
  }
  else if (u_mode == 4) {
    // XXX add your code here to implement this "mode"
  }
}