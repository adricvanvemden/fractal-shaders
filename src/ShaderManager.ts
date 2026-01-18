export class ShaderManager {
    static async loadShader(name: string): Promise<{ vertex: string; fragment: string }> {
        const vertexPath = `./shaders/default_vertex.wgsl`;
        const fragmentPath = `./shaders/${name}_fragment.wgsl`;
        // Load vertex shader
        const vertexResponse = await fetch(vertexPath);
        if (!vertexResponse.ok) {
            throw new Error(`Failed to load vertex shader: ${vertexPath}`);
        }
        const vertexShaderCode = await vertexResponse.text();

        // Load fragment shader
        const fragmentResponse = await fetch(fragmentPath);
        if (!fragmentResponse.ok) {
            throw new Error(`Failed to load fragment shader: ${fragmentPath}`);
        }
        const fragmentShaderCode = await fragmentResponse.text();

        // Combine shaders into a single object
        return {
            vertex: vertexShaderCode.trim(),
            fragment: fragmentShaderCode.trim()
        };
    }
}