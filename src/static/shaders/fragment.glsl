precision highp float;
precision highp int;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;

uniform vec3 color;
uniform float strength;
uniform float width;

varying vec3 vPosition;
varying vec3 vNormal;

void main()
{
    vec3 normal = normalize(normalMatrix * vNormal);
    float intensity = pow(1.0 - abs(dot(normal, vec3(0, 0, 1))), strength);
    vec3 glow = color * intensity;
    gl_FragColor = vec4(glow, 1.0);
}
