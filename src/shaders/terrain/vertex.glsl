#include ../includes/simplexNoise2d.glsl

uniform float uTime;
uniform float uPositionFrequency;
uniform float uStrength;
uniform float uWarpFrequency;
uniform float uWarpStrength;

// varying vec2 vUv;
// varying vec3 vNormal;
varying vec3 vPosition;
varying float vDot; // calc dot product in vertex shader and pass to frag shdaer

// picks a random value based on x/y coords 
float getElevation(vec2 position) {
    float elevation = 0.0;

    // how frequent there are peaks and troughs (imagine zooming in on the noise)
    // float uPositionFrequency = 0.2;

    // multiplier of peak hight after randomness/plateaus
    // float uStrength = 2.0;

    // A modifier of randomness on the peaks themselves (randomness inside randomness)
    // float uWarpFrequency = 5.0;
    // float uWarpStrength = 0.5;

    vec2 warpedPosition = position;
    warpedPosition += uTime;
    //essentially we are saying that for close vertex neighbours we want even more randomness relative to each other
    warpedPosition += simplexNoise2d(warpedPosition * uPositionFrequency * uWarpFrequency) * uWarpStrength;

    // adds more randomness at different frequencies maintaining a max height<1
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency) / 2.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPosition * uPositionFrequency * 4.0) / 8.0;

    // power gives us plateaus, when the value is low the pow keeps it low
    // then as it approaches 1 it catches up very quickly, thing RHS of parabola
    // not we also need to restore the negatives after the power otherwise everything would be positive
    float elevationSign = sign(elevation);
    elevation = elevationSign * pow(abs(elevation), 2.0);

    elevation = elevation * uStrength;
    return elevation;
}

void main() {
    // important to remember we are not replacing the shader with our own from scratch
    // we are adding functionality on top of the existing with csm_
    // hence we don't need to do model world position transformations

    // elevate vertices
    float elevation = getElevation(csm_Position.xz);
    csm_Position.y += elevation;

    // Note since this is a physical material and we have updated the position of the vertex we need to udpate the normal
    // We can do this by calculating a theoretical neighbour A B and doing a cross product of the vector v->a and v->b

    // compute normal
    float shift = 0.01;
    vec3 positionA = position + vec3(shift, 0.0, 0.0);
    vec3 positionB = position + vec3(0.0, 0.0, -shift);
    positionA.y += getElevation(positionA.xz);
    positionB.y += getElevation(positionB.xz);

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    // dot product calc
    float slope = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
    // as slope approaches 1 when the terain is flat
    // as slope approaches 0 the terrain is very steep
    // as slop approaches -1 its steep again the other way


    // Varyings

    vPosition = csm_Position;
    // note we are adding the uTime to the vPosition such that the frag shader has the same postion as updated by our warp
    // utime makes the snow noise stay with the original position other wise it looks animated
    vPosition.xz = vPosition.xz + uTime;
    // if we adjust he .y we can get some pretty cool effects on water level
    vDot = slope;  

}