export class Shader {
    private device: GPUDevice;
    private format: GPUTextureFormat;
    private pipeline: GPURenderPipeline | null;
    private bindGroup: GPUBindGroup | null;
    private bindGroupLayout: GPUBindGroupLayout | null;
    private uniformBuffers: {
        resolution: GPUBuffer | null;
        time: GPUBuffer | null;
        params: GPUBuffer | null;
        colors: GPUBuffer | null;
    };

    constructor(device: GPUDevice, format: GPUTextureFormat) {
        this.device = device;
        this.format = format;
        this.pipeline = null;
        this.bindGroup = null;
        this.bindGroupLayout = null;
        this.uniformBuffers = {
            resolution: null,
            time: null,
            params: null,
            colors: null
        };
    }

    async initialize(vertexShader: string, fragmentShader: string): Promise<void> {
        const shaderModule = this.device.createShaderModule({
            code: `
                ${vertexShader}
                ${fragmentShader}
            `
        });

        this.createBindGroupLayout();
        this.createPipeline(shaderModule);
        this.createUniformBuffers();
        this.createBindGroup();
    }

    private createBindGroupLayout(): void {
        this.bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' }
                }
            ] as GPUBindGroupLayoutEntry[]
        });
    }

    private createPipeline(shaderModule: GPUShaderModule): void {
        const pipelineLayout = this.device.createPipelineLayout({
            bindGroupLayouts: [this.bindGroupLayout!]
        });

        this.pipeline = this.device.createRenderPipeline({
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vtx_main'
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'frag_main',
                targets: [{ format: this.format }]
            },
            primitive: {
                topology: 'triangle-list'
            }
        });
    }

    private createUniformBuffers(): void {
        this.uniformBuffers.resolution = this.device.createBuffer({
            size: 8,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.uniformBuffers.time = this.device.createBuffer({
            size: 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.uniformBuffers.params = this.device.createBuffer({
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        this.uniformBuffers.colors = this.device.createBuffer({
            size: 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }

    private createBindGroup(): void {
        this.bindGroup = this.device.createBindGroup({
            layout: this.bindGroupLayout!,
            entries: [
                { binding: 0, resource: { buffer: this.uniformBuffers.resolution! } },
                { binding: 1, resource: { buffer: this.uniformBuffers.time! } },
                { binding: 2, resource: { buffer: this.uniformBuffers.params! } },
                { binding: 3, resource: { buffer: this.uniformBuffers.colors! } }
            ]
        });
    }

    
    getPipeline(): GPURenderPipeline | null {
        return this.pipeline;
    }

    getBindGroup(): GPUBindGroup | null {
        return this.bindGroup;
    }

    updateUniforms(resolution: [number, number], time: number, params: number[], colors: number[][]): void {
        this.device.queue.writeBuffer(this.uniformBuffers.resolution!, 0, new Float32Array(resolution));
        this.device.queue.writeBuffer(this.uniformBuffers.time!, 0, new Float32Array([time]));
        this.device.queue.writeBuffer(this.uniformBuffers.params!, 0, new Float32Array(params));
        this.device.queue.writeBuffer(this.uniformBuffers.colors!, 0, new Float32Array(colors.flat()));
    }
}