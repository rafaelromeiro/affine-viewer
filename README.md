# lazy-renderer
A viewer for points, curves and surfaces under affine transformations.

## Demo

A demo application is available at:

https://rafaelromeiro.github.io/affine-viewer/

This corresponds to the *index.html* file in the root folder of this repository.

## Installation

Install this library with:
```
npm install affine-viewer
```

To import this library as an ECMAScript module (preferred):
```javascript
import { AffineViewer } from "affine-viewer";
```

Alternatively, to import this library as a Node module (when ESM not available):
```javascript
const { AffineViewer } = require("affine-viewer");
```

## Browser

To use this library in a browser:
```html
<canvas id="renderCanvas" width="512" height="512"></canvas>
<script src="https://cdn.jsdelivr.net/npm/lazy-renderer/dist/lazy-renderer.iife.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/affine-viewer/dist/affine-viewer.iife.min.js"></script>
<script>
    const renderCanvas = document.getElementById("renderCanvas");
    const affineViewer = new AffineViewer.AffineViewer(renderCanvas, geometryName => {
        // Load geometry...
    });
</script>
```

## Documentation

A more in-depth documentation is still being written.