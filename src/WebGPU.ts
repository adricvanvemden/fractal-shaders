export class WebGPU {
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device: GPUDevice | null;
    private format: GPUTextureFormat | null;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.context = this.canvas.getContext('webgpu') as GPUCanvasContext;
        this.device = null;
        this.format = null;
    }

    async initialize(): Promise<void> {
        if (!navigator.gpu) {
            throw new Error('WebGPU is not supported in your browser.');
        }

        const adapter: GPUAdapter | null = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('Failed to get GPU adapter.');
        }

        this.device = await adapter.requestDevice();
        this.format = navigator.gpu.getPreferredCanvasFormat();

        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: 'opaque',
        });

        window.addEventListener('resize', this.resizeCanvas.bind(this));
        this.resizeCanvas();
    }

    private resizeCanvas(): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context.configure({
            device: this.device!,
            format: this.format!,
            alphaMode: 'opaque',
        });
    }
    
    getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    getContext(): GPUCanvasContext {
        return this.context;
    }

    getDevice(): GPUDevice {
        return this.device!;
    }

    getFormat(): GPUTextureFormat {
        return this.format!;
    }
    
}