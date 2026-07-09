import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCafeStore } from '../store/cafeStore'

function CoffeeMachine({ position = [0, 0, 0] }) {
  const chefProgress = useCafeStore((s) => s.chefProgress)
  const foodReady    = useCafeStore((s) => s.foodReady)
  const active       = chefProgress > 0 && !foodReady
  const dropRef      = useRef()

  useFrame((state) => {
    if (!dropRef.current) return
    // Drip cycle
    const t = (state.clock.elapsedTime * 1.5) % 1
    dropRef.current.position.y = -t * 0.18
    dropRef.current.material.opacity = active ? 1 - t : 0
  })

  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[0.52, 0.9, 0.38]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Top panel */}
      <mesh castShadow position={[0, 0.97, 0]}>
        <boxGeometry args={[0.54, 0.07, 0.4]} />
        <meshStandardMaterial color="#111111" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Water tank (translucent blue) */}
      <mesh castShadow position={[0.2, 0.75, -0.15]}>
        <boxGeometry args={[0.1, 0.38, 0.18]} />
        <meshStandardMaterial color="#93c5fd" opacity={0.55} transparent metalness={0.2} />
      </mesh>
      {/* Water level inside */}
      <mesh position={[0.2, 0.65, -0.15]}>
        <boxGeometry args={[0.08, 0.22, 0.14]} />
        <meshStandardMaterial color="#3b82f6" opacity={0.6} transparent />
      </mesh>

      {/* Drip tray */}
      <mesh castShadow position={[0, 0.08, 0.08]}>
        <boxGeometry args={[0.42, 0.06, 0.28]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Tray grid */}
      <mesh position={[0, 0.12, 0.08]}>
        <boxGeometry args={[0.4, 0.01, 0.26]} />
        <meshStandardMaterial color="#4b5563" wireframe />
      </mesh>

      {/* Portafilter group */}
      <group position={[0, 0.32, 0.2]}>
        {/* Filter holder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.06, 8]} />
          <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.25} />
        </mesh>
        {/* Spouts */}
        {[-0.06, 0.06].map((x, i) => (
          <mesh key={i} castShadow position={[x, -0.1, 0.04]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.16, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Drip drop */}
      <mesh ref={dropRef} position={[0, 0.18, 0.24]}>
        <sphereGeometry args={[0.018, 5, 5]} />
        <meshStandardMaterial color="#4b2005" opacity={0} transparent />
      </mesh>

      {/* Steam wand */}
      <mesh castShadow position={[-0.27, 0.55, 0.15]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.016, 0.016, 0.32, 6]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh castShadow position={[-0.32, 0.38, 0.18]} rotation={[0.4, 0, 0.35]}>
        <cylinderGeometry args={[0.025, 0.012, 0.08, 6]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>

      {/* Button panel */}
      {[[-0.1, 0.62], [0, 0.62], [0.1, 0.62], [-0.05, 0.52], [0.05, 0.52]].map(([bx, by], i) => (
        <mesh key={i} position={[bx, by, 0.2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.015, 7]} />
          <meshStandardMaterial
            color={i === 0 && active ? '#22c55e' : i === 0 ? '#16a34a' : '#374151'}
            emissive={i === 0 && active ? '#22c55e' : '#000000'}
            emissiveIntensity={i === 0 && active ? 1.2 : 0}
          />
        </mesh>
      ))}

      {/* Display */}
      <mesh position={[0.08, 0.78, 0.2]}>
        <boxGeometry args={[0.22, 0.12, 0.01]} />
        <meshStandardMaterial color="#1e293b" emissive="#0ea5e9" emissiveIntensity={active ? 0.8 : 0.2} />
      </mesh>
    </group>
  )
}

export default CoffeeMachine
