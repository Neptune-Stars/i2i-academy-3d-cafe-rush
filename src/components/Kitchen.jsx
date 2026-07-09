import { useCafeStore } from '../store/cafeStore'

function Kitchen() {
  const foodReady = useCafeStore((state) => state.foodReady)

  return (
    <group position={[0, 0, -4.8]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4, 0.5, 0.8]} />
        <meshStandardMaterial color="#8b5a2b" />
      </mesh>

      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[1.2, 0.15, 0.6]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>

      {foodReady && (
        <mesh position={[0, 0.85, 0]} castShadow>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="#ffcc33" />
        </mesh>
      )}
    </group>
  )
}

export default Kitchen