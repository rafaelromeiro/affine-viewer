import {
    LazyRenderer,
    ResourceType,
    ShaderType,
    PrimitiveType,
    BufferTarget,
    BufferDataType,
    ShaderDataType,
    TextureFilter,
    TextureWrapping,
    TextureType,
    TextureFormat,
} from 'lazy-renderer';

import { VERTEX_SHADER, FRAGMENT_SHADER } from './shaders.glsl';
import { CHECKER_IMAGE } from './checker-image-uri';

export enum GeometryType {
    POINTS = 0,
    CURVE = 1,
    SURFACE = 2,
}

export enum TextureMapping {
    SPATIAL_2D = 0,
    SPATIAL_3D = 1,
    INDEXED = 2,
}

interface Geometry {
    readonly type: GeometryType;
    readonly primitiveName: string;
    affineTransformation: Float32Array;
}

interface Texture {
    readonly mapping: TextureMapping;
    readonly textureName: string;
}

export type RequestGeometryCallback = (geometryName: string) => void;
export type RequestTextureCallback = (textureName: string) => void;

export class AffineViewer {
    // Render canvas.
    private readonly canvas: HTMLCanvasElement;
    // Callbacks.
    private readonly requestGeometry: RequestGeometryCallback;
    private readonly requestTexture: RequestTextureCallback;
    // LazyRenderer instance.
    private readonly lazyRenderer: LazyRenderer;
    // Geometry and texture maps.
    private readonly geometries: Map<string, Geometry> = new Map<string, Geometry>();
    private readonly textures: Map<string, Texture> = new Map<string, Texture>();
    // Default resources.
    private readonly programName = 'affine-viewer/programs/main';
    private readonly samplerName = 'affine-viewer/samplers/linear-repeat';

    public constructor(
        canvas: HTMLCanvasElement,
        requestGeometry: RequestGeometryCallback,
        requestTexture: RequestTextureCallback,
    ) {
        this.canvas = canvas;
        this.requestGeometry = requestGeometry;
        this.requestTexture = requestTexture;
        this.lazyRenderer = new LazyRenderer(
            this.canvas,
            (resourceType, resourceName): void => this.provideResource(resourceType, resourceName),
        );

        // Setup default program.
        this.lazyRenderer.registerProgram(this.programName, [
            'affine-viewer/shaders/vertex',
            'affine-viewer/shaders/fragment',
        ]);
        this.lazyRenderer.registerShader('affine-viewer/shaders/vertex', VERTEX_SHADER, ShaderType.VERTEX);
        this.lazyRenderer.registerShader('affine-viewer/shaders/fragment', FRAGMENT_SHADER, ShaderType.FRAGMENT);

        // Setup default sampler.
        this.lazyRenderer.registerSampler(
            this.samplerName,
            TextureFilter.LINEAR,
            TextureFilter.LINEAR_MIPMAP_LINEAR,
            TextureWrapping.REPEAT,
            TextureWrapping.REPEAT,
            TextureWrapping.REPEAT,
        );

        // Setup default texture.
        this.registerTexture('', CHECKER_IMAGE);
    }

    private provideResource(resourceType: ResourceType, resourceName: string): void {
        // TODO
        console.log(ResourceType[resourceType], resourceName);
    }

    public registerGeometry(
        geometryName: string,
        data: Float32Array,
        type: GeometryType,
        affineTransformation: Float32Array,
    ): void {
        const primitiveName = 'affine-viewer/primitives/' + geometryName;
        const positionsAccessorName = 'affine-viewer/accessors/positions-' + geometryName;
        const indicesAccessorName = 'affine-viewer/accessors/indices-' + geometryName;
        const attributesBufferName = 'affine-viewer/buffers/attributes-' + geometryName;
        const indicesBufferName = 'affine-viewer/buffers/indices-' + geometryName;

        const stride = 12;

        const attributeArray = new Float32Array(data);
        const indexArray = new Uint32Array();

        this.lazyRenderer.registerBuffer(attributesBufferName, attributeArray.byteLength, BufferTarget.ATTRIBUTES);
        this.lazyRenderer.registerBuffer(indicesBufferName, indexArray.byteLength, BufferTarget.INDICES);

        this.lazyRenderer.writeBufferData(attributesBufferName, attributeArray);
        this.lazyRenderer.writeBufferData(indicesBufferName, indexArray);

        this.lazyRenderer.registerAccessor(
            positionsAccessorName,
            attributesBufferName,
            ShaderDataType.SF_3,
            BufferDataType.SF32,
            0,
            stride,
            false,
        );

        this.lazyRenderer.registerAccessor(
            indicesAccessorName,
            indicesBufferName,
            ShaderDataType.UI_1,
            BufferDataType.UI32,
            0,
            0,
            false,
        );

        const attributes = new Map<string, string>();
        attributes.set('vertexPosition', positionsAccessorName);
        this.lazyRenderer.registerPrimitive(
            primitiveName,
            indexArray.length,
            attributes,
            indicesAccessorName,
            PrimitiveType.TRIANGLES,
        );

        this.geometries.set(geometryName, {
            type,
            primitiveName,
            affineTransformation: new Float32Array(affineTransformation),
        });
    }

    public updateAffineTransformation(geometryName: string, affineTransformation: Float32Array): void {
        const geometry = this.geometries.get(geometryName);
        if (geometry === undefined) {
            // Unkown geometry name.
            this.requestGeometry(geometryName);
            return;
        }

        geometry.affineTransformation = new Float32Array(affineTransformation);
    }

    public registerTexture(
        textureName: string,
        image: string | HTMLImageElement,
        mapping: TextureMapping = TextureMapping.SPATIAL_2D,
        textureDepth: number = 1,
    ): void {
        const texture = {
            mapping,
            textureName: 'affine-viewer/textures/' + textureName,
        };

        this.textures.set(textureName, texture);

        const loadTexture = (loadedImage: HTMLImageElement): void => {
            this.lazyRenderer.registerTexture(
                texture.textureName,
                loadedImage.width,
                loadedImage.height / textureDepth,
                textureDepth,
                mapping === TextureMapping.SPATIAL_3D ? TextureType.TEX_3D : TextureType.TEX_2D,
                TextureFormat.UN_8_8_8_8,
            );

            this.lazyRenderer.writeTextureImage(texture.textureName, loadedImage, textureDepth);
        };

        if (typeof image === 'string') {
            const newImage = new Image();
            newImage.onload = (): void => loadTexture(newImage);
            newImage.src = image;
        } else {
            loadTexture(image);
        }
    }

    public drawGeometry(geometryName: string, textureName: string = '', cameraMatrix?: Float32Array): void {
        const geometry = this.geometries.get(geometryName);
        if (geometry === undefined) {
            // Unkown gometry name.
            this.requestGeometry(geometryName);
            return;
        }

        let texture = this.textures.get(textureName);
        if (texture === undefined) {
            // Unkown texture name.
            this.requestTexture(textureName);
            texture = this.textures.get('');
        }
        if (texture === undefined) {
            // Unkown default texture.
            this.requestTexture('');
            return;
        }

        const uniforms = new Map<string, ArrayBufferView>();
        uniforms.set('viewportSize', new Uint32Array([this.canvas.width, this.canvas.height]));
        uniforms.set('affineTransformation', geometry.affineTransformation);
        uniforms.set('geometryType', new Uint32Array([geometry.type]));
        uniforms.set('textureMapping', new Uint32Array([texture.mapping]));
        if (cameraMatrix !== undefined) {
            uniforms.set('cameraMatrix', cameraMatrix);
        }

        const uniformSampler = texture.mapping === TextureMapping.SPATIAL_3D ? 'diffuse3D' : 'diffuse2D';
        const textureNames = new Map<string, { textureName: string; samplerName: string }>();
        textureNames.set(uniformSampler, { textureName: texture.textureName, samplerName: this.samplerName });

        this.lazyRenderer.render(this.programName, geometry.primitiveName, uniforms, textureNames);
    }
}
