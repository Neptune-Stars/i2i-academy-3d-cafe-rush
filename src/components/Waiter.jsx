import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function Waiter({ waiterRef }) {
  const meshRef = useRef()
  const keysPressed = useRef({})

  useEffect(() => {
    function handleKeyDown(event) {
      keysPressed.current[event.key.toLowerCase()] = true
    }

    function handleKeyUp(event) {
      keysPressed.current[event.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const speed = 4.5

    if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
      meshRef.current.position.z -= speed * delta
    }

    if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
      meshRef.current.position.z += speed * delta
    }

    if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
      meshRef.current.position.x -= speed * delta
    }

    if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
      meshRef.current.position.x += speed * delta
    }

    meshRef.current.position.x = THREE.MathUtils.clamp(
      meshRef.current.position.x,
      -5,
      5
    )

    meshRef.current.position.z = THREE.MathUtils.clamp(
      meshRef.current.position.z,
      -4,
      4
    )

    waiterRef.current.position.copy(meshRef.current.position)
  })

  return (
    <group ref={meshRef} position={[0, 0.5, 2.5]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.35, 0.8, 8, 16]} />
        <meshStandardMaterial color="#2f80ed" />
      </mesh>

      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color="#f2c49b" />
      </mesh>
    </group>
  )
}

export default Waiter