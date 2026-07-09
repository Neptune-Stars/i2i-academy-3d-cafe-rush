import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function CarriedFood({ waiterRef }) {
  const foodRef = useRef()

  useFrame(() => {
    if (!foodRef.current) return

    foodRef.current.position.x = waiterRef.current.position.x
    foodRef.current.position.y = 1.35
    foodRef.current.position.z = waiterRef.current.position.z
  })

  return (
    <mesh ref={foodRef} castShadow>
      <sphereGeometry args={[0.18, 24, 24]} />
      <meshStandardMaterial color="#ffcc33" />
    </mesh>
  )
}

export default CarriedFood