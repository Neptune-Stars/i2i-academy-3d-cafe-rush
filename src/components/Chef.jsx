import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function Chef() {
  const chefRef = useRef()

  useFrame((state) => {
    if (!chefRef.current) return
    chefRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.04
  })

  return (
    <group ref={chefRef} position={[0, 0.5, -4.2]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.4, 0.9, 8, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial color="#f2c49b" />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.25, 24]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>
    </group>
  )
}

export default Chef