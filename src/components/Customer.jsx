function Customer({ customer }) {
  const patienceColor =
    customer.patience > 60 ? '#00ff88' : customer.patience > 30 ? '#ffcc00' : '#ff3333'

  return (
    <group position={customer.position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.65, 8, 16]} />
        <meshStandardMaterial color="#9b59b6" />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.25, 24, 24]} />
        <meshStandardMaterial color="#f2c49b" />
      </mesh>

      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[1, 0.12, 0.12]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[-0.5 + customer.patience / 100 / 2, 1.35, 0.01]}>
        <boxGeometry args={[customer.patience / 100, 0.1, 0.14]} />
        <meshStandardMaterial color={patienceColor} />
      </mesh>
    </group>
  )
}

export default Customer