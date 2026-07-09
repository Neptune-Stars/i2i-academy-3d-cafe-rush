function Table({ position, tableId }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.25, 32]} />
        <meshStandardMaterial color="#7a4a22" />
      </mesh>

      <mesh position={[0, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.9, 16]} />
        <meshStandardMaterial color="#5a3318" />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.95, 0.03, 8, 48]} />
        <meshStandardMaterial color="#d6a85f" />
      </mesh>
    </group>
  )
}

export default Table