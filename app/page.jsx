'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import React, { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
const Pallet = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Pallet), { ssr: false })
const Axes = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Axes), { ssr: false })
const Grids = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Grids), { ssr: false })
const Box = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Box), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 size-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

const Cube = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.3, 0.5, 0.5]} />
      <meshStandardMaterial color="cyan" />
    </mesh>
  )
}

const HCube = ({ position }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.3, 0.5, 0.5]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}
const Scene = () => {
  const meshRef = useRef < THREE.Mesh > (null);
  const [corners, setCorner] = useState([[new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.1, 1.1, 0)]]) // 큐브 위치를 저장하는 상태
  const [cubes, setCubes] = useState([]) // 큐브 위치를 저장하는 상태
  const [Hcube_p, setHCubes] = useState(new THREE.Vector3(0, 0, 0)) // 큐브 위치를 저장하는 상태
  const raycaster = useRef(new THREE.Raycaster())
  const { camera, scene } = useThree()

  const handlePointerDown = (event) => {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    // Raycaster로 클릭한 위치 계산
    raycaster.current.setFromCamera(mouse, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0) // Y=0 평면
    const intersectPoint = new THREE.Vector3()
    raycaster.current.ray.intersectPlane(plane, intersectPoint)

    if (intersectPoint) {
      console.log(intersectPoint)
      for (let i = 0; i < corners.length; i++) {
        if ((corners[i][0].x < intersectPoint.x) && (corners[i][0].y < intersectPoint.y)
          && (corners[i][1].x > intersectPoint.x) && (corners[i][1].y > intersectPoint.y) && ((corners[i][1].z > intersectPoint.z))) {
          intersectPoint.setZ(corners[i][0].z)
        }
      }
      setCubes((prevCubes) => [...prevCubes, new THREE.Vector3(intersectPoint.x + 0.15, intersectPoint.y + 0.25, intersectPoint.z + 0.25)])
      setCorner((prevCorners) => [...prevCorners, [new THREE.Vector3(intersectPoint.x, intersectPoint.y, intersectPoint.z + 0.5), new THREE.Vector3(intersectPoint.x + 3, intersectPoint.y + 5, intersectPoint.z + 0.5)]])
    }
  }

  const handleMouseOver = (event) => {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    // Raycaster로 클릭한 위치 계산
    raycaster.current.setFromCamera(mouse, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0) // Y=0 평면
    const intersectPoint = new THREE.Vector3()
    raycaster.current.ray.intersectPlane(plane, intersectPoint)

    if (intersectPoint) {
      for (let i = 0; i < corners.length; i++) {
        if ((corners[i][0].x < intersectPoint.x) && (corners[i][0].y < intersectPoint.y)
          && (corners[i][1].x > intersectPoint.x) && (corners[i][1].y > intersectPoint.y) && ((corners[i][1].z >= intersectPoint.z))) {
          intersectPoint.setZ(corners[i][0].z)
          setHCubes(() => new THREE.Vector3(intersectPoint.x + 0.15, intersectPoint.y + 0.25, intersectPoint.z + 0.25))
        } else if ((corners[i][0].x < intersectPoint.x) && (corners[i][0].y < intersectPoint.y)
          && (corners[i][1].x > intersectPoint.x) && (corners[i][1].y > intersectPoint.y) && ((corners[i][1].z >= intersectPoint.z))) {
          setHCubes(() => new THREE.Vector3(0, 0, 10))
        }
      }
    }
  }
  const handleMouseOut = (event) => {
    setHCubes(() => new THREE.Vector3(0, 0, 10))
  }
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <mesh

        onPointerDown={handlePointerDown} // 클릭 이벤트 등록
        onPointerMove={handleMouseOver}
        onPointerOut={handleMouseOut}
        position={[0.55, 0.55, -0.05]}
      >
        <planeGeometry args={[1.1, 1.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <HCube position={Hcube_p} />
      {cubes.map((position, index) => (
        <Cube key={index} position={position} />
      ))}
    </>
  )
}

export default function Page() {
  return (
    <>


      <div className='mx-auto flex size-full flex-col flex-wrap items-center p-12 md:flex-row  lg:w-4/5'>
        {/* first row */}

        <div className='relative my-12 size-full py-6 '>
          <View orbit className='relative size-full  '>
            <Suspense fallback={null}>
              <Axes rotation={[(0 * Math.PI) / 180, 0, 0]} />
              <Grids rotation={[(90 * Math.PI) / 180, 0, 0]} />
              <Pallet rotation={[(0 * Math.PI) / 180, 0, 0]} />
              <Box rotation={[(0 * Math.PI) / 180, 0, 0]} />
              <Scene />
              <Common color={'lightpink'} />
            </Suspense>
          </View>
        </div>


      </div>
    </>
  )
}
