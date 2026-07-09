import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useCafeStore } from '../store/cafeStore'

function Waiter({ waiterRef }) {
  const meshRef = useRef()
  const keysPressed = useRef({})
  const directionRef = useRef(0)
  const bobRef = useRef(0)
  const leftArmRef = useRef()
  const rightArmRef = useRef()
  const leftLegRef = useRef()
  const rightLegRef = useRef()

  const status = useCafeStore((s) => s.status)

  useEffect(() => {
    function handleKeyDown(e) { keysPressed.current[e.key.toLowerCase()] = true }
    function handleKeyUp(e)   { keysPressed.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup',   handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup',   handleKeyUp)
    }
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    if (status !== 'active') return

    const speed = 5.5
    let dx = 0, dz = 0

    if (keysPressed.current['w'] || keysPressed.current['arrowup'])    dz -= 1
    if (keysPressed.current['s'] || keysPressed.current['arrowdown'])  dz += 1
    if (keysPressed.current['a'] || keysPressed.current['arrowleft'])  dx -= 1
    if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1

    const moved = dx !== 0 || dz !== 0
    if (moved) {
      const len = Math.sqrt(dx * dx + dz * dz)
      meshRef.current.position.x += (dx / len) * speed * delta
      meshRef.current.position.z += (dz / len) * speed * delta
      directionRef.current = Math.atan2(dx, dz)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        directionRef.current,
        0.18
      )
    }

    // Clamp to café bounds (expanded room)
    meshRef.current.position.x = THREE.MathUtils.clamp(meshRef.current.position.x, -6, 6)
    meshRef.current.position.z = THREE.MathUtils.clamp(meshRef.current.position.z, -5, 4.5)

    // Bobbing
    bobRef.current += delta * (moved ? 8 : 2)
    const bobY = Math.sin(bobRef.current) * (moved ? 0.06 : 0.015)
    // +0.55 keeps waiter slightly above customer Y=0.5 to avoid Z-fight
    meshRef.current.position.y = 0.55 + bobY

    // Arm/leg swing while walking
    const swing = Math.sin(bobRef.current * 1.5) * (moved ? 0.5 : 0.05)
    if (leftArmRef.current)  leftArmRef.current.rotation.x  =  swing
    if (rightArmRef.current) rightArmRef.current.rotation.x = -swing
    if (leftLegRef.current)  leftLegRef.current.rotation.x  = -swing * 0.7
    if (rightLegRef.current) rightLegRef.current.rotation.x =  swing * 0.7

    // Expose position to parent (for interaction detection)
    waiterRef.current.position.copy(meshRef.current.position)
    waiterRef.current.position.y = 0.55
  })

  // Shared render-order for all meshes: keeps waiter on top of customer meshes
  const RO = 10

  return (
    <group ref={meshRef} position={[0, 0.55, 2.5]}>

      {/* ── Legs ─────────────────────────────────── */}
      <group ref={leftLegRef}  position={[-0.13, -0.45, 0]}>
        <mesh castShadow renderOrder={RO}>
          <capsuleGeometry args={[0.09, 0.38, 4, 6]} />
          <meshStandardMaterial color="#1e3a8a" depthWrite />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.26, 0.06]} renderOrder={RO}>
          <boxGeometry args={[0.14, 0.09, 0.22]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.13, -0.45, 0]}>
        <mesh castShadow renderOrder={RO}>
          <capsuleGeometry args={[0.09, 0.38, 4, 6]} />
          <meshStandardMaterial color="#1e3a8a" depthWrite />
        </mesh>
        <mesh castShadow position={[0, -0.26, 0.06]} renderOrder={RO}>
          <boxGeometry args={[0.14, 0.09, 0.22]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>

      {/* ── Body (uniform) ───────────────────────── */}
      <mesh castShadow position={[0, 0, 0]} renderOrder={RO}>
        <capsuleGeometry args={[0.28, 0.55, 4, 8]} />
        <meshStandardMaterial color="#1d4ed8" depthWrite />
      </mesh>

      {/* Apron */}
      <mesh position={[0, -0.05, 0.28]} renderOrder={RO}>
        <boxGeometry args={[0.34, 0.52, 0.01]} />
        <meshStandardMaterial color="#f8fafc" opacity={0.95} transparent depthWrite />
      </mesh>
      {/* Apron bib */}
      <mesh position={[0, 0.22, 0.285]} renderOrder={RO}>
        <boxGeometry args={[0.24, 0.22, 0.01]} />
        <meshStandardMaterial color="#f8fafc" opacity={0.95} transparent depthWrite />
      </mesh>

      {/* Bow-tie */}
      <mesh position={[-0.1, 0.38, 0.29]} rotation={[0, 0, Math.PI / 4]} renderOrder={RO}>
        <boxGeometry args={[0.1, 0.06, 0.01]} />
        <meshStandardMaterial color="#ef4444" depthWrite />
      </mesh>
      <mesh position={[0.1, 0.38, 0.29]} rotation={[0, 0, -Math.PI / 4]} renderOrder={RO}>
        <boxGeometry args={[0.1, 0.06, 0.01]} />
        <meshStandardMaterial color="#ef4444" depthWrite />
      </mesh>
      <mesh position={[0, 0.38, 0.29]} renderOrder={RO}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#b91c1c" depthWrite />
      </mesh>

      {/* ── Arms ──────────────────────────────────── */}
      <group ref={leftArmRef} position={[-0.38, 0.1, 0]}>
        <mesh castShadow renderOrder={RO}>
          <capsuleGeometry args={[0.09, 0.32, 4, 6]} />
          <meshStandardMaterial color="#1d4ed8" depthWrite />
        </mesh>
        {/* Hand */}
        <mesh castShadow position={[0, -0.24, 0]} renderOrder={RO}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color="#f5c5a3" depthWrite />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.38, 0.1, 0]}>
        <mesh castShadow renderOrder={RO}>
          <capsuleGeometry args={[0.09, 0.32, 4, 6]} />
          <meshStandardMaterial color="#1d4ed8" depthWrite />
        </mesh>
        <mesh castShadow position={[0, -0.24, 0]} renderOrder={RO}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color="#f5c5a3" depthWrite />
        </mesh>
      </group>

      {/* ── Head ──────────────────────────────────── */}
      <mesh castShadow position={[0, 0.62, 0]} renderOrder={RO}>
        <sphereGeometry args={[0.23, 10, 10]} />
        <meshStandardMaterial color="#f5c5a3" depthWrite />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.09, 0.66, 0.21]} renderOrder={RO}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" depthWrite />
      </mesh>
      <mesh position={[0.09, 0.66, 0.21]} renderOrder={RO}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#1a1a1a" depthWrite />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 0.57, 0.22]} rotation={[0.3, 0, 0]} renderOrder={RO}>
        <torusGeometry args={[0.07, 0.012, 4, 8, Math.PI]} />
        <meshStandardMaterial color="#c0605a" depthWrite />
      </mesh>

      {/* ── Waiter hat ────────────────────────────── */}
      {/* Brim */}
      <mesh castShadow position={[0, 0.85, 0]} renderOrder={RO}>
        <cylinderGeometry args={[0.27, 0.27, 0.04, 10]} />
        <meshStandardMaterial color="#1e3a8a" depthWrite />
      </mesh>
      {/* Crown */}
      <mesh castShadow position={[0, 1.03, 0]} renderOrder={RO}>
        <cylinderGeometry args={[0.18, 0.2, 0.36, 10]} />
        <meshStandardMaterial color="#1e3a8a" depthWrite />
      </mesh>
      {/* Hat band */}
      <mesh position={[0, 0.87, 0]} renderOrder={RO}>
        <cylinderGeometry args={[0.205, 0.205, 0.06, 10]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} depthWrite />
      </mesh>

      {/* ── Direction arrow ───────────────────────── */}
      <mesh position={[0, 1.45, 0]} renderOrder={RO}>
        <coneGeometry args={[0.1, 0.22, 4]} />
        <meshStandardMaterial color="#facc15" emissive="#fbbf24" emissiveIntensity={0.6} depthWrite />
      </mesh>
    </group>
  )
}

export default Waiter