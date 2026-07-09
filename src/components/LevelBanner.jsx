import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCafeStore } from '../store/cafeStore'

// A 3D floating banner that appears when the player levels up
function LevelBanner() {
  const levelBanner    = useCafeStore((s) => s.levelBanner)
  const clearLevelBanner = useCafeStore((s) => s.clearLevelBanner)
  const groupRef       = useRef()
  const timerRef       = useRef(0)
  const DURATION       = 2.5 // seconds

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (levelBanner === null) {
      timerRef.current = 0
      groupRef.current.visible = false
      return
    }

    groupRef.current.visible = true
    timerRef.current += delta

    // Fly up over duration
    groupRef.current.position.y = 3.5 + (timerRef.current / DURATION) * 0.8

    // Fade-in then fade-out
    const progress = timerRef.current / DURATION
    const opacity = progress < 0.2
      ? progress / 0.2
      : progress > 0.7
      ? 1 - (progress - 0.7) / 0.3
      : 1

    groupRef.current.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = opacity
      }
    })

    if (timerRef.current >= DURATION) {
      timerRef.current = 0
      clearLevelBanner()
    }
  })

  const LEVEL_COLORS = [
    '#22c55e', // 2
    '#3b82f6', // 3
    '#f59e0b', // 4
    '#ef4444', // 5
    '#8b5cf6', // 6
    '#ec4899', // 7
    '#14b8a6', // 8
    '#f97316', // 9
    '#dc2626', // 10
  ]
  const color = levelBanner ? LEVEL_COLORS[Math.min(levelBanner - 2, LEVEL_COLORS.length - 1)] : '#f59e0b'

  return (
    <group ref={groupRef} position={[0, 3.5, 0]} visible={false}>
      {/* Background plane */}
      <mesh>
        <planeGeometry args={[3.2, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={1}
        />
      </mesh>
      {/* Border */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.28, 0.88]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

export default LevelBanner
