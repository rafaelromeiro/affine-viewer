import { LazyRenderer, ResourceType } from 'lazy-renderer';

export type RequestGeometryCallback = (geometryName: string) => void;

export class AffineViewer {
    private readonly canvas: HTMLCanvasElement;
    private readonly requestGeometry: RequestGeometryCallback;
    private readonly lazyRenderer: LazyRenderer;

    public constructor(canvas: HTMLCanvasElement, requestGeometry: RequestGeometryCallback) {
        this.canvas = canvas;
        this.requestGeometry = requestGeometry;
        this.lazyRenderer = new LazyRenderer(
            canvas,
            (resourceType, resourceName): void => this.provideResource(resourceType, resourceName),
        );
    }

    private provideResource(resourceType: ResourceType, resourceName: string): void {
        // TODO
    }

    public drawScene(geometries: string[]): void {
        // TODO
    }
}
