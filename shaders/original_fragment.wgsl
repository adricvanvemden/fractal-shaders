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
    var scale = iParams.x;
    var colorOffset = iParams.y;
    var speed = iParams.z;
    var intensity = iParams.w;

    var uv = (fragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
    var uv0 = uv;
    var finalColor = vec3(0.0, 0.0, 0.0);
    for (var i = 0.0; i < 3.0; i = i + 1.0) {
        uv = fract(uv * scale) - 0.5;
        var d = length(uv) * exp(-length(uv0));
        var col = palette(length(uv0) + i * colorOffset + iTime * speed);
        d = sin(d * 8.0 + iTime) / 8.0;
        d = abs(d);
        d = pow(intensity / d, 2.0);
        finalColor = finalColor + col * d;
    }
    return vec4(finalColor, 1.0);
}
