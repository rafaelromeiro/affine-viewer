export declare const VERTEX_SHADER = "#version 300 es\n\nprecision mediump float;\n\nin vec4 vertexPosition;\n\nuniform vec2 viewportSize;\nuniform mat4 affineTransformation;\nuniform uint geometryType;\nuniform uint textureMapping;\nuniform mat4 cameraMatrix;\n\nout vec3 textureCoordinates;\n\nvoid main() {\n  gl_Position = affineTransformation * vertexPosition;\n  textureCoordinates = gl_Position.xyz;\n}\n";
export declare const FRAGMENT_SHADER = "#version 300 es\n\nprecision mediump float;\n\nin vec3 textureCoordinates;\n\nuniform sampler2D diffuse2D;\nuniform sampler3D diffuse3D;\n\nuniform uint textureMapping;\n\nout vec4 fragment_color;\n\nvoid main() {\n  if (has_texture) {\n    fragment_color = texture(tex, texCoord);\n  } else {\n    fragment_color = color;\n  }\n}\n";