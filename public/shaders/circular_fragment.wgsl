@group(0) @binding(0) var<uniform> iResolution : vec2<f32>;
@group(0) @binding(1) var<uniform> iTime : f32;
@group(0) @binding(2) var<uniform> iParams : vec4<f32>;
@group(0) @binding(3) var<uniform> iColors : array<vec3<f32>, 4>;

fn palette(t: f32) -> vec3<f32> {
    let a = iColors[0];
    let b = iColors[1];
    let c = iColors[2];
    let d = iColors[3];
    return a + b * cos(6.28318 * (c * t + d));
}

@fragment
fn frag_main(@builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
    var uv = (fragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    var d = length(uv);
    var col = palette(d + iTime * iParams.z);
    d = sin(d * 8.0 + iTime * iParams.x) / 8.0;
    d = abs(d);
    d = pow(iParams.w / d, 2.0);
    return vec4(col * d, 1.0);
}
