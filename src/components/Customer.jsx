import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SKIN_TONES = ['#f5c5a3', '#d4956a', '#c68642', '#8d5524', '#f9dbc0']
const SHIRT_COLORS = ['#7c3aed', '#0891b2', '#b45309', '#16a34a', '#dc2626']

const FOOD_COLORS = {
  coffee:   '#6b3a2a',
  cake:     '#e91e8c',
  sandwich: '#d4813a',
  juice:    '#ff8c00',
}

// ── Patience ring ─────────────────────────────────────────────────────────────
function PatienceRing({ patience }) {
  const ringRef = useRef()
  useFrame((state) => {
    if (!ringRef.current) return
    if (patience < 30) {
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.05)
    } else {
      ringRef.current.scale.setScalar(1)
    }
  })
  const color = patience > 60 ? '#22c55e' : patience > 30 ? '#facc15' : '#ef4444'
  return (
    <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
      <mesh>
        <torusGeometry args={[0.7, 0.05, 4, 24]} />
        <meshStandardMaterial color="#222222" opacity={0.35} transparent />
      </mesh>
      <mesh rotation={[0, 0, (1 - patience / 100) * Math.PI]}>
        <torusGeometry
          args={[0.7, 0.08, 4, Math.max(3, Math.round((patience / 100) * 24)),
            (patience / 100) * Math.PI * 2]}
        />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

// ── Food order bubble ─────────────────────────────────────────────────────────
function FoodBubble({ foodType }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = 1.7 + Math.sin(state.clock.elapsedTime * 2.5) * 0.07
  })
  const color = FOOD_COLORS[foodType.id] || '#ffcc33'
  return (
    <group ref={ref} position={[0, 1.7, 0]}>
      {/* Bubble */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#ffffff" opacity={0.92} transparent />
      </mesh>
      {/* Bubble tail */}
      <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.07, 0.15, 5]} />
        <meshStandardMaterial color="#ffffff" opacity={0.92} transparent />
      </mesh>
      {/* Food icon */}
      <mesh position={[0, 0, 0.22]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

// ── Main Customer ─────────────────────────────────────────────────────────────
function Customer({ customer }) {
  const groupRef   = useRef()
  const scaleRef   = useRef(1)
  const fadeRef    = useRef(1)

  // skin/shirt determined by tableId so consistent per seat
  const skinIdx   = (customer.tableId - 1) % SKIN_TONES.length
  const shirtIdx  = (customer.tableId - 1) % SHIRT_COLORS.length
  const skinColor  = SKIN_TONES[skinIdx]
  const shirtColor = SHIRT_COLORS[shirtIdx]

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Jitter when impatient
    if (customer.patience < 30) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 9) * 0.06
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1)
    }

    // Idle sway
    groupRef.current.position.y =
      customer.position[1] + Math.sin(state.clock.elapsedTime * 1.2 + customer.tableId) * 0.01
  })

  return (
    <group ref={groupRef} position={customer.position}>
      {/* Patience ring */}
      <PatienceRing patience={customer.patience} />

      {/* ── Chair (shown behind customer) ── */}
      {/* Seat */}
      <mesh castShadow position={[0, -0.28, -0.08]}>
        <boxGeometry args={[0.52, 0.06, 0.48]} />
        <meshStandardMaterial color="#5a7fb5" roughness={0.7} />
      </mesh>
      {/* Chair back */}
      <mesh castShadow position={[0, 0.05, -0.3]}>
        <boxGeometry args={[0.52, 0.62, 0.06]} />
        <meshStandardMaterial color="#4a6fa5" roughness={0.7} />
      </mesh>
      {/* Chair back slats */}
      {[-0.14, 0, 0.14].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.05, -0.27]}>
          <boxGeometry args={[0.06, 0.56, 0.03]} />
          <meshStandardMaterial color="#3b5c90" />
        </mesh>
      ))}
      {/* Legs */}
      {[[-0.2, -0.1], [0.2, -0.1], [-0.2, -0.35], [0.2, -0.35]].map(([x, z], i) => (
        <mesh key={i} castShadow position={[x, -0.5, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.44, 5]} />
          <meshStandardMaterial color="#3b5c90" />
        </mesh>
      ))}

      {/* ── Legs (customer) ── */}
      {[-0.12, 0.12].map((x, i) => (
        <mesh key={i} castShadow position={[x, -0.12, 0.08]}>
          <capsuleGeometry args={[0.085, 0.26, 4, 6]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}

      {/* ── Body ── */}
      <mesh castShadow position={[0, 0.22, 0]}>
        <capsuleGeometry args={[0.25, 0.42, 4, 8]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* ── Arms ── */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 0.34, 0.22, 0]} rotation={[0.3, 0, side * 0.4]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.075, 0.26, 4, 6]} />
            <meshStandardMaterial color={shirtColor} />
          </mesh>
          {/* Hand resting on table */}
          <mesh castShadow position={[0, -0.2, 0.12]}>
            <sphereGeometry args={[0.08, 6, 6]} />
            <meshStandardMaterial color={skinColor} />
          </mesh>
        </group>
      ))}

      {/* ── Head ── */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      {/* Hair */}
      <mesh castShadow position={[0, 0.84, 0]}>
        <sphereGeometry args={[0.19, 8, 5]} />
        <meshStandardMaterial color={skinIdx % 2 === 0 ? '#3b1f0a' : '#1a1a2e'} />
      </mesh>

      {/* Eyes */}
      {[-0.08, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.72, 0.19]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}

      {/* Table number badge */}
      <mesh position={[0.35, 0.45, 0.18]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 8]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>

      {/* Order bubble */}
      {customer.foodType && !customer.leaving && (
        <FoodBubble foodType={customer.foodType} />
      )}
    </group>
  )
}

export default Customer