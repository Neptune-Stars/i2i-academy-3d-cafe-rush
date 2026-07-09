import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const FOOD_COLORS = {
  coffee: '#8b4513',
  cake: '#e91e8c',
  sandwich: '#d4813a',
  juice: '#ff8c00',
}

function CarriedFood({ waiterRef, carriedFood }) {
  const foodRef = useRef()
  const trailRef = useRef([])

  useFrame((state) => {
    if (!foodRef.current) return
    const pos = waiterRef.current.position
    foodRef.current.position.x = pos.x
    foodRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 8) * 0.04
    foodRef.current.position.z = pos.z

    // Slight tilt while moving (for fun)
    foodRef.current.rotation.y = state.clock.elapsedTime * 3
  })

  const color = carriedFood?.foodType ? FOOD_COLORS[carriedFood.foodType.id] || '#ffcc33' : '#ffcc33'

  return (
    <group ref={foodRef}>
      {/* Plate */}
      <mesh position={[0, -0.08, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.2, 0.04, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.2} />
      </mesh>

      {/* Food item */}
      <mesh castShadow>
        <sphereGeometry args={[0.16, 6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>

      {/* Glow point light */}
      <pointLight color={color} intensity={0.8} distance={1.2} />
    </group>
  )
}

export default CarriedFood