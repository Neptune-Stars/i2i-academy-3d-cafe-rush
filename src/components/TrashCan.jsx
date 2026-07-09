import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

function TrashCan({ position = [0, 0, 0] }) {
  const lidRef = useRef()
  // Lid opens slightly when waiter is nearby (visual cue only; driven by time)
  useFrame((state) => {
    if (!lidRef.current) return
    // Gently bob lid as if breathing
    lidRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.02
  })

  return (
    <group position={position}>
      {/* ── Foot pedal ── */}
      <mesh castShadow position={[0.16, 0.04, 0.12]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.2, 0.03, 0.1]} />
        <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Pedal arm */}
      <mesh castShadow position={[0.1, 0.07, 0.12]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 5]} />
        <meshStandardMaterial color="#4b5563" metalness={0.5} />
      </mesh>

      {/* ── Main body ── */}
      <mesh castShadow position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.19, 0.15, 0.58, 10]} />
        <meshStandardMaterial color="#374151" metalness={0.35} roughness={0.55} />
      </mesh>

      {/* Body stripe / label area */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.196, 0.196, 0.16, 10]} />
        <meshStandardMaterial color="#4b5563" metalness={0.2} roughness={0.6} />
      </mesh>

      {/* Recycling icon (crude cross) */}
      <mesh position={[0.2, 0.32, 0]}>
        <boxGeometry args={[0.01, 0.1, 0.02]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
      <mesh position={[0.2, 0.32, 0]}>
        <boxGeometry args={[0.01, 0.02, 0.1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      {/* Inner liner hint */}
      <mesh position={[0, 0.59, 0]}>
        <cylinderGeometry args={[0.175, 0.175, 0.02, 10]} />
        <meshStandardMaterial color="#1f2937" metalness={0.2} />
      </mesh>

      {/* ── Lid ── */}
      <group ref={lidRef} position={[0, 0.64, 0]}>
        {/* Lid disc */}
        <mesh castShadow>
          <cylinderGeometry args={[0.21, 0.2, 0.06, 10]} />
          <meshStandardMaterial color="#4b5563" metalness={0.45} roughness={0.45} />
        </mesh>
        {/* Handle / knob on lid */}
        <mesh castShadow position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.06, 8]} />
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Hinge detail at back */}
        <mesh castShadow position={[0, 0.03, -0.2]}>
          <boxGeometry args={[0.08, 0.04, 0.03]} />
          <meshStandardMaterial color="#374151" metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

export default TrashCan
