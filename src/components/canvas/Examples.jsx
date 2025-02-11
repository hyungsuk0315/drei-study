'use client'

import { useMemo, useRef, useState } from 'react'
import { Line, useCursor, MeshDistortMaterial, Text } from '@react-three/drei'
import { useRouter } from 'next/navigation'


export const Pallet = ({ rotation, ...props }) => {
  const mesh = useRef(null)
  return (
    <group ref={mesh} {...props}>
      <mesh position={[0.55, 0.55, -0.05]} rotation={rotation}>
        {/* 큐브의 기하학 */}
        <boxGeometry args={[1.1, 1.1, 0.1]} />
        <Text position={[0, 0, 0.1]} fontSize={0.1} color="red">
          PALLET
        </Text>
        {/* 큐브의 재질 */}
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
}
export const Box = ({ rotation, ...props }) => {
  const mesh = useRef(null)
  return (
    <group ref={mesh} {...props}>
      <mesh position={[0.05, 0.075, 0.05]} rotation={rotation}>
        {/* 큐브의 기하학 */}
        <boxGeometry args={[0.1, 0.15, 0.1]} />
        {/* 큐브의 재질 */}
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}
export const Axes = ({ rotation, ...props }) => {
  const mesh = useRef(null)
  return (
    <group ref={mesh} {...props}>
      <mesh position={[0, 0, 0]} rotation={rotation}>
        {/* 축 도우미 */}
        <axesHelper args={[2]} />
        <Text position={[2, 0, 0]} fontSize={0.5} color="red">
          X
        </Text>
        <Text position={[0, 2, 0]} fontSize={0.5} color="green">
          Y
        </Text>
        <Text position={[0, 0, 2]} fontSize={0.5} color="blue">
          Z
        </Text>
      </mesh>
    </group>
  )
};

export const Grids = ({ route = '/blob', rotation, ...props }) => {
  const mesh = useRef(null)
  return (
    <group ref={mesh} {...props}>
      <mesh position={[0, 0, 0]} rotation={rotation}>
        {/* 축 도우미 */}
        <gridHelper args={[10, 10]} />
      </mesh>
    </group>
  )
};
