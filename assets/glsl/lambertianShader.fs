#version 300 es

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform float cr // diffuse reflectance

uniform vec3 modelColor;
uniform vec3 lightPos;

//varying vec3 vUv;

void main() {
    vec3 lightDir =normalize( lightPos - position);
    vec3 normLightDeg = normalize(abs(dot(normal , lightDir)));
    gl_FragColor  =vec4(  modelColor , 1);
}
