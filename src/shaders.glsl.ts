export const VERTEX_SHADER = `#version 300 es

precision mediump float;

in vec4 vertex_position;
in vec2 vertex_texCoord;
in vec2 vertex_ssDisplacement;

uniform vec2 resolution;

uniform vec3 camera_position;
uniform mat4 camera_rotation;
uniform mat4 camera_inverse_rotation;
uniform float camera_zoom;
uniform float camera_far_clip;
uniform float camera_vertical_scale;

out vec2 texCoord;

void main() {
  mat4 orthographic_projection = mat4(2.0 * camera_zoom / resolution.x,                              0.0,                  0.0, 0.0,
                                                                   0.0, 2.0 * camera_zoom / resolution.y,                  0.0, 0.0,
                                                                   0.0,                              0.0, -1.0/camera_far_clip, 0.0,
                                                                   0.0,                              0.0,                  0.0, 1.0);

  gl_Position = (orthographic_projection * camera_rotation * ((vertex_position - vec4(camera_position, 0.0)) * vec4(1.0, camera_vertical_scale, 1.0, 1.0))) + vec4(vertex_ssDisplacement, 0.0, 0.0);
  texCoord = vertex_texCoord;
}
`;

export const FRAGMENT_SHADER = `#version 300 es

precision mediump float;

in vec2 texCoord;

uniform vec2 resolution;
uniform vec4 color;
uniform bool has_texture;
uniform sampler2D tex;

out vec4 fragment_color;

void main() {
  if (has_texture) {
    fragment_color = texture(tex, texCoord);
  } else {
    fragment_color = color;
  }
}
`;
