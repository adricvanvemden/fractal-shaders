@vertex
fn vtx_main(@builtin(vertex_index) VertexIndex: u32) -> @builtin(position) vec4<f32> {
    var positions = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
        vec2(-1.0, 1.0),
        vec2(-1.0, 1.0),
        vec2(1.0, -1.0),
        vec2(1.0, 1.0)
    );
    let pos = positions[VertexIndex];
    return vec4<f32>(pos, 0.0, 1.0);
}

