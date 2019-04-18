export declare enum GeometryType {
    POINTS = 0,
    CURVE = 1,
    SURFACE = 2
}
export declare enum TextureMapping {
    SPATIAL_2D = 0,
    SPATIAL_3D = 1,
    INDEXED = 2
}
export declare type RequestGeometryCallback = (geometryName: string) => void;
export declare type RequestTextureCallback = (textureName: string) => void;
export declare class AffineViewer {
    private readonly canvas;
    private readonly requestGeometry;
    private readonly requestTexture;
    private readonly lazyRenderer;
    private readonly geometries;
    private readonly textures;
    private readonly programName;
    private readonly samplerName;
    constructor(canvas: HTMLCanvasElement, requestGeometry: RequestGeometryCallback, requestTexture: RequestTextureCallback);
    private provideResource;
    registerGeometry(geometryName: string, data: Float32Array, type: GeometryType, affineTransformation: Float32Array): void;
    updateAffineTransformation(geometryName: string, affineTransformation: Float32Array): void;
    registerTexture(textureName: string, image: string | HTMLImageElement, mapping?: TextureMapping, textureDepth?: number): void;
    drawGeometry(geometryName: string, textureName?: string, cameraMatrix?: Float32Array): void;
}
