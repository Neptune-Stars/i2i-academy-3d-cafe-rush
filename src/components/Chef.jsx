import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useCafeStore } from '../store/cafeStore'

function Chef() {
  const chefRef    = useRef()
  const leftArmRef = useRef()
  const rightArmRef= useRef()
  const ladleRef   = useRef()

  const foodReady    = useCafeStore((s) => s.foodReady)
  const chefProgress = useCafeStore((s) => s.chefProgress)

  useFrame((state) => {
    if (!chefRef.current) return
    const t = state.clock.elapsedTime

    if (foodReady) {
      // Happy bounce
      chefRef.current.position.y = 0.55 + Math.abs(Math.sin(t * 5)) * 0.1
      chefRef.current.rotation.y = Math.sin(t * 4) * 0.35
      if (leftArmRef.current)  leftArmRef.current.rotation.z  =  0.7 + Math.sin(t * 6) * 0.3
      if (rightArmRef.current) rightArmRef.current.rotation.z = -0.7 - Math.sin(t * 6) * 0.3
    } else if (chefProgress > 0) {
      // Cooking stir animation
      chefRef.current.position.y = 0.55 + Math.sin(t * 3) * 0.02
      chefRef.current.rotation.y = Math.sin(t * 2) * 0.08
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 5) * 0.5
        leftArmRef.current.rotation.z = 0.4
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(t * 5) * 0.5
        rightArmRef.current.rotation.z = -0.4
      }
      if (ladleRef.current) {
        ladleRef.current.rotation.z = Math.sin(t * 8) * 0.6
      }
    } else {
      // Idle
      chefRef.current.position.y = 0.55 + Math.sin(t * 1.5) * 0.01
      chefRef.current.rotation.y = 0
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = 0
        leftArmRef.current.rotation.z = 0.25
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = 0
        rightArmRef.current.rotation.z = -0.25
      }
    }
  })

  return (
    <group ref={chefRef} position={[0, 0.55, -4.2]}>

      {/* ── Legs ── */}
      {[-0.14, 0.14].map((x, i) => (
        <mesh key={i} castShadow position={[x, -0.48, 0]}>
          <capsuleGeometry args={[0.1, 0.32, 4, 6]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
      ))}
      {/* Shoes */}
      {[-0.14, 0.14].map((x, i) => (
        <mesh key={i} castShadow position={[x, -0.72, 0.07]}>
          <boxGeometry args={[0.16, 0.1, 0.24]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}

      {/* ── Body (white coat) ── */}
      <mesh castShadow position={[0, 0, 0]}>
        <capsuleGeometry args={[0.33, 0.65, 4, 8]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Coat buttons */}
      {[0.14, -0.02, -0.18].map((y, i) => (
        <mesh key={i} position={[0.04, y, 0.33]}>
          <sphereGeometry args={[0.04, 5, 5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}

      {/* Apron strings */}
      {[-0.12, 0.12].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0.34]}>
          <boxGeometry args={[0.02, 0.45, 0.01]} />
          <meshStandardMaterial color="#e2e8f0" opacity={0.8} transparent />
        </mesh>
      ))}

      {/* Chest pocket */}
      <mesh position={[-0.2, 0.18, 0.33]}>
        <boxGeometry args={[0.12, 0.1, 0.01]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* ── Arms ── */}
      <group ref={leftArmRef} position={[-0.42, 0.12, 0.05]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.3, 4, 6]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#f5c5a3" />
        </mesh>
      </group>

      <group ref={rightArmRef} position={[0.42, 0.12, 0.05]}>
        <mesh castShadow>
          <capsuleGeometry args={[0.1, 0.3, 4, 6]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh castShadow position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshStandardMaterial color="#f5c5a3" />
        </mesh>
        {/* Ladle */}
        <group ref={ladleRef} position={[0, -0.42, 0.1]}>
          <mesh castShadow rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.4, 6]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh castShadow position={[0, -0.25, 0.1]}>
            <sphereGeometry args={[0.09, 5, 4]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ── Head ── */}
      <mesh castShadow position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.26, 10, 10]} />
        <meshStandardMaterial color="#f5c5a3" />
      </mesh>

      {/* Eyes */}
      {[-0.09, 0.09].map((x, i) => (
        <mesh key={i} position={[x, 0.82, 0.23]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Moustache */}
      {[-0.08, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.71, 0.24]} rotation={[0, 0, i === 0 ? 0.4 : -0.4]}>
          <capsuleGeometry args={[0.025, 0.1, 4, 6]} />
          <meshStandardMaterial color="#5c3317" />
        </mesh>
      ))}

      {/* ── Chef hat ── */}
      {/* Brim */}
      <mesh castShadow position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 10]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      {/* Puff 1 */}
      <mesh castShadow position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.22, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Puff 2 (wider) */}
      <mesh castShadow position={[0, 1.38, 0]}>
        <sphereGeometry args={[0.24, 8, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Ready glow */}
      {foodReady && (
        <mesh position={[0, 1.75, 0]}>
          <sphereGeometry args={[0.16, 8, 8]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </mesh>
      )}
    </group>
  )
}

export default Chef