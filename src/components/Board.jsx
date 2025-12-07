import { Base, Geometry, Subtraction } from '@react-three/csg'
import React from 'react'

const Board = () => {
    return (
        <>
            <mesh castShadow receiveShadow>
                <meshPhysicalMaterial />
                <Geometry>
                    <Base>
                        <boxGeometry args={[11, 2, 11]} />
                    </Base>
                    <Subtraction >
                        <boxGeometry args={[10, 2, 10]} />
                    </Subtraction>
                </Geometry>
            </mesh>
        </>
    )
}

export default Board
