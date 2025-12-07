import React, { useEffect, useMemo, useRef } from 'react'
import CustomShaderMaterial from 'three-custom-shader-material'
import { extend, useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import vertexShader from '../shaders/terrain/vertex.glsl'
import fragmentShader from '../shaders/terrain/fragment.glsl'


const Terrain = ({
    uPositionFrequency,
    uStrength,
    uWarpFrequency,
    uWarpStrength,
    colorWaterDeep,
    colorWaterSurface,
    colorSand,
    colorGrass,
    colorSnow,
    colorRock
}) => {
    const csmRef = useRef();
    const csmDepthRef = useRef();

    // defining here so we dont need to duplicate for material + depth material
    // note when leva changes this updates the props which causes the component to remount
    // hence updating the shader (unlike uTime)
    const uniforms = {
        uTime: { value: 0 },
        uPositionFrequency: { value: uPositionFrequency },
        uStrength: { value: uStrength },
        uWarpFrequency: { value: uWarpFrequency },
        uWarpStrength: { value: uWarpStrength },
        uColorWaterDeep: { value: new THREE.Color(colorWaterDeep) },
        uColorWaterSurface: { value: new THREE.Color(colorWaterSurface) },
        uColorSand: { value: new THREE.Color(colorSand) },
        uColorGrass: { value: new THREE.Color(colorGrass) },
        uColorSnow: { value: new THREE.Color(colorSnow) },
        uColorRock: { value: new THREE.Color(colorRock) }
    }


    // Note we create the geo this way to preserve the mesh rotation
    // if we apply the rotation to the mesh that would change our shader axis
    const terrainGeometry = useMemo(() => {
        let geo = new THREE.PlaneGeometry(10, 10, 500, 500);
        geo.deleteAttribute('uv'); // note we do this since we are maunally updating the csm_normal /uv in the shader
        geo.deleteAttribute('normal')
        geo.rotateX(-Math.PI / 2); // 90 degree rotation

        return geo
    }, [])

    const water = useMemo(() => {
        let geo = new THREE.PlaneGeometry(10, 10, 500, 500);
        geo.rotateX(-Math.PI / 2); // 90 degree rotation
       
        return geo
    }, [])

    // useEffect(() => {
    //     console.log("uPositionFrequency: ", uPositionFrequency)
    //     console.log("csmRef.current.uniforms.uFlowFieldFrequency: ", csmRef.current.uniforms.uPositionFrequency)


    // }, [uPositionFrequency])

    useFrame((state, delta) => {

        const elapsedTime = state.clock.elapsedTime

        // uPositionFrequency

        // update uTime on each tick to animate for both the material and depth material (for shadows)
        csmRef.current.uniforms.uTime.value = elapsedTime * 0.2
        csmDepthRef.current.uniforms.uTime.value = elapsedTime * 0.2
    })

    // when displacing vertices in a shader, shadows won't match unless the shadow pass uses the same displacement. 
    // Three.js renders shadows from the light's perspective using the original geometry, not the displaced one.



    return (
        <>
            <mesh position={[0,-0.1,0]}>
                <primitive object={water} />
                <meshPhysicalMaterial transmission={1} roughness={0.1} />
            </mesh>

            <mesh receiveShadow castShadow >
                {/* <meshBasicMaterial /> */}
                <CustomShaderMaterial
                    ref={csmRef}
                    baseMaterial={THREE.MeshPhysicalMaterial}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    // Your Uniforms
                    uniforms={uniforms}
                    // Base material properties
                    // flatShading
                    metalness={0}
                    roughness={0.5}
                // color={'#85d834'}

                />

                {/* Custom depth material for shadows */}
                <CustomShaderMaterial
                    ref={csmDepthRef}
                    baseMaterial={THREE.MeshDepthMaterial}
                    vertexShader={vertexShader} // Same vertex shader with displacement
                    uniforms={uniforms}
                    attach="customDepthMaterial"
                    depthPacking={THREE.RGBADepthPacking}

                />


                <primitive object={terrainGeometry} attach="geometry" />
            </mesh>

        </>
    )
}

export default Terrain
