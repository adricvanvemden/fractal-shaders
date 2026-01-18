import { Shader } from './Shader';

export class Renderer {
    private device: GPUDevice;
    private context: GPUCanvasContext;
    private shader: Shader;
    private animationFrame: number | null;

    constructor(device: GPUDevice, context: GPUCanvasContext, shader: Shader) {
        this.device = device;
        this.context = context;
        this.shader = shader;
        this.animationFrame = null;
    }

    render(): void {
        const commandEncoder: GPUCommandEncoder = this.device.createCommandEncoder();
        const textureView: GPUTextureView = this.context.getCurrentTexture().createView();

        const renderPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    loadOp: 'clear' as GPULoadOp,
                    storeOp: 'store' as GPUStoreOp,
                    clearValue: { r: 0, g: 0, b: 0, a: 1 }
                }
            ]
        };

        const passEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.shader.getPipeline()!);
        passEncoder.setBindGroup(0, this.shader.getBindGroup()!);
        passEncoder.draw(6, 1, 0, 0);
        passEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    setShader(shader: Shader): void {
        this.shader = shader;
        console.debug('Renderer shader updated');
    }

    startRenderLoop(): void {
        const loop = (): void => {
            this.render();
            this.animationFrame = requestAnimationFrame(loop);
        };
        loop();
    }

    stopRenderLoop(): void {
        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}