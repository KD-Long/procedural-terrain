import React, { useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber';
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import { Geometry, Base, Addition, Subtraction, ReverseSubtraction, Intersection, Difference } from '@react-three/csg'
import { shaderMaterial, useTexture, OrbitControls, Environment, Icosahedron, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three'

import { SphereGeometry } from 'three/src/Three.Core.js';
import Board from './Board';
import Terrain from './Terrain';

const Experience = () => {

    const sphereRef = useRef()


    let {
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
    } = useControls({
        // bgColor: { value: '#1d1f2a', label: 'Background Color' },
        uPositionFrequency: { value: 0.2, min: 0, max: 1.0, step: 0.001 },
        uStrength: { value: 2.0, min: 0.0, max: 10.0, step: 0.001 },
        uWarpFrequency: { value: 5.0, min: 0.0, max: 10.0, step: 0.001 },
        uWarpStrength: { value: 0.5, min: 0.0, max: 1.0, step: 0.001 },

        colorWaterDeep: { value: '#002b3d' },
        colorWaterSurface: { value: '#66a8ff' },
        colorSand: { value: '#ffe894' },
        colorGrass: { value: '#85d534' },
        colorSnow: { value: '#ffffff' },
        colorRock: { value: '#bfbd8d' },


    });


    // const MyShaderMaterial = shaderMaterial({
    //     uTime: 0,
    // },
    //     vertexShader,
    //     fragmentShader
    // )
    // //this exent allows it to be used as a component below
    // // Note: When using "extend" which register custom components with the JSX reconciler, 
    // // use lowercase names for those components, regardless of how they are initially defined.
    // extend({ MyShaderMaterial: MyShaderMaterial })




    useFrame((state, delta) => {

        const elapsedTime = state.clock.elapsedTime

        // sphereRef.current.rotation.x = - elapsedTime * 0.1
        sphereRef.current.rotation.y = elapsedTime * 0.5

        // update utime
        // sphereRef.current.material.uniforms.uTime.value = elapsedTime

        // update color shader with color picker from useControls
        // sphereRef.current.material.uniforms.uColor.value= new THREE.Color(holoColor)

        // state.camera.lookAt(0, 0, 0);
    })

    return (<>
        <OrbitControls makeDefault enableDamping />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>f

        {/* Sets background */}
        {/* <color args={['#1d1f2a']} attach='background' /> */}
        <Environment
            // background lighting env map
            // preset="city"
            background={true} // this uses the HDR as background as well as env map for lighting
            backgroundBlurriness={0.5}
            files="spruit_sunrise.hdr"
        />

        {/* Directional Light */}
        <directionalLight
            color="#ffffff"
            intensity={2}
            position={[6.25, 3, 4]}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={0.1}
            shadow-camera-far={30}
            shadow-camera-top={8}
            shadow-camera-right={8}
            shadow-camera-bottom={-8}
            shadow-camera-left={-8}
        />

        <Board />

        {/* forwarding leva controls as refs to child -> shader */}
        <Terrain
            uPositionFrequency={uPositionFrequency}
            uStrength={uStrength}
            uWarpFrequency={uWarpFrequency}
            uWarpStrength={uWarpStrength}
            colorWaterDeep={colorWaterDeep}
            colorWaterSurface={colorWaterSurface}
            colorSand={colorSand}
            colorGrass={colorGrass}
            colorSnow={colorSnow}
            colorRock={colorRock}
        />










        {/* place holder for mesh with shader material */}
        <mesh
            ref={sphereRef}
            position={[0, 0, 0]}
        >
            {/* <sphereGeometry args={[2, 64, 64]} /> */}
            {/* <meshBasicMaterial color={'#1ffff0'} args={[{ wireframe: false }]} /> */}
            {/* <myShaderMaterial transparent side={THREE.DoubleSide} /> */}
        </mesh>

        {/* <mesh
            position={[0, 0, 0]}
        >
            <icosahedronGeometry args={[2, 5]} />
            <meshPhysicalMaterial />


        </mesh> */}

        {/* <mesh>
            <meshStandardMaterial />
            <Geometry>
                <Base scale={[6, 0.5, 0.5]}>
                    <boxGeometry />
                </Base>
                <Addition scale={[0.5, 2, 0.5]}>
                    <boxGeometry />
                </Addition>
                <Subtraction scale={[0.5, 0.2, 0.5]}>
                    <sphereGeometry />
                </Subtraction>
            </Geometry>
        </mesh> */}




        {/* <mesh >
            <planeGeometry args={[5, 5]} />
            <meshPhysicalMaterial side={THREE.DoubleSide} />
        </mesh> */}

    </>
    )
}

export default Experience