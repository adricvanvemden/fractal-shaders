import * as dat from 'dat.gui';
import { WebGPU } from './WebGPU';
import { Shader } from './Shader';
import { Renderer } from './Renderer';
import { ShaderManager } from './ShaderManager';
class App {
    private webgpu: WebGPU;
    private shaders: { [key: string]: { vertex: string; fragment: string } | null };
    private params: {
        selectedShader: string;
        scale: number;
        colorOffset: number;
        speed: number;
        intensity: number;
        color1: number[];
        color2: number[];
        color3: number[];
        color4: number[];
    };
    private shader: Shader | null;
    private renderer: Renderer | null;
    private gui: dat.GUI | null;

    constructor(webgpu: WebGPU, shaders: {[key: string]: null}, params: any) {
        this.webgpu = webgpu;
        this.shaders = shaders;
        this.params = params;
        this.shader = null;
        this.renderer = null;
        this.gui = null;
    }

    async initialize(): Promise<void> {
        await this.webgpu.initialize();
        await this.loadShaders();
        await this.initializeShader();
        this.renderer = new Renderer(this.webgpu.getDevice(), this.webgpu.getContext(), this.shader!);
        this.setupGUI();
        this.animate();
    }

    async loadShaders(): Promise<void> {
        for (const shaderName of Object.keys(this.shaders)) {
            const parsedShader = await ShaderManager.loadShader(shaderName);
            this.shaders[shaderName] = parsedShader;
        }
    }

    async initializeShader(): Promise<void> {
        const selectedShader = this.shaders[this.params.selectedShader];
        if (!selectedShader) {
            throw new Error(`Shader ${this.params.selectedShader} not found`);
        }
        console.debug(`Initializing shader: ${this.params.selectedShader}`);
        this.shader = new Shader(this.webgpu.getDevice(), this.webgpu.getFormat());
        await this.shader.initialize(selectedShader.vertex, selectedShader.fragment);
        console.debug(`Shader ${this.params.selectedShader} initialized`);
        if (this.renderer) {
            this.renderer.setShader(this.shader);
        }
    }

    setupGUI(): void {
        this.gui = new dat.GUI();
        this.gui.add(this.params, 'scale', 0.1, 3);
        this.gui.add(this.params, 'colorOffset', 0, 2);
        this.gui.add(this.params, 'speed', 0, 2);
        this.gui.add(this.params, 'intensity', 0.001, 0.1);
        
        const colorFolder = this.gui.addFolder('Color Palette');
        colorFolder.addColor(this.params, 'color1');
        colorFolder.addColor(this.params, 'color2');
        colorFolder.addColor(this.params, 'color3');
        colorFolder.addColor(this.params, 'color4');
        colorFolder.open();

        this.gui.add(this.params, 'selectedShader', Object.keys(this.shaders)).onChange(this.onShaderChange.bind(this));
    }

    async onShaderChange(): Promise<void> {
        try {
            console.debug('Changing shader to:', this.params.selectedShader);
            await this.initializeShader();
            console.debug('Shader changed successfully');
        } catch (error) {
            console.error('Error changing shader:', error);
        }
    }
    

    animate(): void {
        const animate = () => {
            const resolution = [this.webgpu.getCanvas().width, this.webgpu.getCanvas().height] as [number, number];
            const time = performance.now() / 1000;
            const params = [this.params.scale, this.params.colorOffset, this.params.speed, this.params.intensity];
            const colors = [
                this.params.color1.map(c => c / 255),
                this.params.color2.map(c => c / 255),
                this.params.color3.map(c => c / 255),
                this.params.color4.map(c => c / 255)
            ];
            
            if (this.shader) {
                this.shader.updateUniforms(resolution, time, params, colors);
                this.renderer?.render();
            } else {
                console.error('Shader is not initialized');
            }
            requestAnimationFrame(animate);
        };
        animate();
    }
}

// initialization
const webgpu = new WebGPU('gpuCanvas');

const params_original = {
    scale: 1.5,
    colorOffset: 0.6,
    speed: 0.6,
    intensity: 0.01,
    color1: [128, 128, 128],
    color2: [128, 255, 128],
    color3: [255, 128, 128],
    color4: [102, 255, 230],
    selectedShader: 'Original'
};

const params_sarah = {
    scale: 2,
    colorOffset: 0.4,
    speed: 0.5,
    intensity: 0.005,
    color1: [128, 128, 128],
    color2: [128, 255, 128],
    color3: [255, 128, 128],
    color4: [102, 255, 230],
    selectedShader: 'Sarah'
};

const shaders = {
    'Original': null,
    'Circular': null,
    'Sarah': null,
};

const app = new App(webgpu, shaders, params_original);
app.initialize().catch(console.error);