function Fridge({ position = [0, 0, 0] }) {
  // Items visible through the glass door
  const items = [
    { color: '#dc2626', x: -0.22, y: 0.55 },
    { color: '#16a34a', x:  0.0,  y: 0.55 },
    { color: '#ea580c', x:  0.22, y: 0.55 },
    { color: '#2563eb', x: -0.22, y: 0.9  },
    { color: '#9333ea', x:  0.0,  y: 0.9  },
    { color: '#f59e0b', x:  0.22, y: 0.9  },
    { color: '#0891b2', x: -0.22, y: 1.25 },
    { color: '#65a30d', x:  0.0,  y: 1.25 },
  ]

  return (
    <group position={position}>
      {/* Main body */}
      <mesh castShadow position={[0, 0.95, 0]}>
        <boxGeometry args={[0.78, 1.8, 0.68]} />
        <meshStandardMaterial color="#dde8ee" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Side panel detail lines */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.95, 0.34]}>
          <boxGeometry args={[0.04, 1.76, 0.01]} />
          <meshStandardMaterial color="#c2d4dc" />
        </mesh>
      ))}

      {/* ── Freezer top door ── */}
      <mesh castShadow position={[0, 1.6, 0.345]}>
        <boxGeometry args={[0.76, 0.6, 0.02]} />
        <meshStandardMaterial color="#c5d5de" roughness={0.3} />
      </mesh>

      {/* ── Main fridge door (glass panel) ── */}
      <mesh castShadow position={[0, 0.88, 0.345]}>
        <boxGeometry args={[0.76, 1.14, 0.02]} />
        <meshStandardMaterial color="#b8ccd6" roughness={0.1} opacity={0.55} transparent />
      </mesh>
      {/* Door frame */}
      <mesh position={[0, 0.88, 0.346]}>
        <boxGeometry args={[0.78, 1.16, 0.01]} />
        <meshStandardMaterial color="#94a3b8" wireframe />
      </mesh>

      {/* Shelves inside */}
      {[0.45, 0.78, 1.12, 1.44].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]}>
          <boxGeometry args={[0.7, 0.015, 0.5]} />
          <meshStandardMaterial color="#cbd5e1" opacity={0.6} transparent />
        </mesh>
      ))}

      {/* Items inside */}
      {items.map((item, i) => (
        <group key={i} position={[item.x, item.y, 0.08]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.22, 8]} />
            <meshStandardMaterial color={item.color} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Handles ── */}
      {/* Top door handle */}
      <mesh castShadow position={[0.3, 1.6, 0.38]}>
        <boxGeometry args={[0.04, 0.28, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Main door handle */}
      <mesh castShadow position={[0.3, 0.88, 0.38]}>
        <boxGeometry args={[0.04, 0.62, 0.04]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Handle connectors */}
      {[1.74, 1.46].map((y, i) => (
        <mesh key={i} castShadow position={[0.3, y, 0.37]}>
          <boxGeometry args={[0.04, 0.04, 0.05]} />
          <meshStandardMaterial color="#6b7280" metalness={0.8} />
        </mesh>
      ))}
      {[1.15, 0.6].map((y, i) => (
        <mesh key={i} castShadow position={[0.3, y, 0.37]}>
          <boxGeometry args={[0.04, 0.04, 0.05]} />
          <meshStandardMaterial color="#6b7280" metalness={0.8} />
        </mesh>
      ))}

      {/* Temperature dial */}
      <mesh position={[-0.28, 1.52, 0.36]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.5} />
      </mesh>

      {/* Power light */}
      <mesh position={[-0.15, 1.82, 0.36]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
      </mesh>

      {/* Feet */}
      {[[-0.28, -0.25], [0.28, -0.25], [-0.28, 0.25], [0.28, 0.25]].map(([fx, fz], i) => (
        <mesh key={i} castShadow position={[fx, 0.03, fz]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 6]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
    </group>
  )
}

export default Fridge
