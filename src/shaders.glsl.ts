export const VERTEX_SHADER = `#version 300 es

precision mediump float;

in vec4 vertexPosition;

uniform vec2 viewportSize;
uniform mat4 affineTransformation;
uniform uint geometryType;
uniform uint textureMapping;
uniform mat4 cameraMatrix;

out vec3 textureCoordinates;

void main() {
  gl_Position = affineTransformation * vertexPosition;
  textureCoordinates = gl_Position.xyz;
}
`;

export const FRAGMENT_SHADER = `#version 300 es

precision mediump float;

in vec3 textureCoordinates;

uniform sampler2D diffuse2D;
uniform sampler3D diffuse3D;

uniform uint textureMapping;

out vec4 fragment_color;

void main() {
  if (has_texture) {
    fragment_color = texture(tex, texCoord);
  } else {
    fragment_color = color;
  }
}
`;
