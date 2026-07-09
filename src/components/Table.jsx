import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function Table({ position, tableId }) {
  const candleRef = useRef()
  const flameRef  = useRef()

  useFrame((state) => {
    if (candleRef.current) candleRef.current.rotation.y = state.clock.elapsedTime * 0.4
    if (flameRef.current) {
      const flicker = 1 + Math.sin(state.clock.elapsedTime * 14 + tableId) * 0.07
      flameRef.current.scale.setScalar(flicker)
    }
  })

  const topColors  = ['#7c3d12', '#6b3010', '#92400e']
  const topColor   = topColors[(tableId - 1) % topColors.length]
  const clothColor = ['#fef9c3', '#dbeafe', '#fce7f3'][(tableId - 1) % 3]

  return (
    <group position={position}>
      {/* ── Tablecloth ── */}
      <mesh receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.01, 12]} />
        <meshStandardMaterial color={clothColor} roughness={0.9} />
      </mesh>
      {/* Cloth overhang */}
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.8, 0.75, 0.18, 12]} />
        <meshStandardMaterial color={clothColor} roughness={0.9} opacity={0.85} transparent />
      </mesh>

      {/* ── Table top ── */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.1, 12]} />
        <meshStandardMaterial color={topColor} roughness={0.4} />
      </mesh>
      {/* Edge trim */}
      <mesh>
        <torusGeometry args={[0.73, 0.022, 4, 20]} />
        <meshStandardMaterial color="#c8a870" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* ── Pedestal ── */}
      <mesh castShadow position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.72, 7]} />
        <meshStandardMaterial color="#5a3318" roughness={0.6} />
      </mesh>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.07, 10]} />
        <meshStandardMaterial color="#4a2a10" roughness={0.7} />
      </mesh>

      {/* ── Salt & pepper shakers ── */}
      {[[-0.32, 0, 0.1], [0.32, 0, 0.1]].map(([x, y, z], i) => (
        <group key={i} position={[x, 0.12, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.055, 0.18, 8]} />
            <meshStandardMaterial color={i === 0 ? '#e8e8e8' : '#2a2a2a'} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.058, 6, 6]} />
            <meshStandardMaterial color="#888888" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* ── Small flower vase ── */}
      <group position={[0, 0.1, -0.22]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.15, 8]} />
          <meshStandardMaterial color="#2563eb" roughness={0.5} />
        </mesh>
        {/* Flower petals */}
        {[0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].map((angle, i) => (
          <mesh key={i} position={[Math.sin(angle) * 0.07, 0.18, Math.cos(angle) * 0.07]}>
            <sphereGeometry args={[0.04, 5, 5]} />
            <meshStandardMaterial color="#f472b6" emissive="#ec4899" emissiveIntensity={0.3} />
          </mesh>
        ))}
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.04, 5, 5]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* ── Candle ── */}
      <group ref={candleRef} position={[0, 0.1, 0.22]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 7]} />
          <meshStandardMaterial color="#fef3c7" />
        </mesh>
        <group ref={flameRef} position={[0, 0.12, 0]}>
          <mesh>
            <coneGeometry args={[0.03, 0.1, 5]} />
            <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={1.5} />
          </mesh>
        </group>
        <pointLight position={[0, 0.14, 0]} intensity={0.6} color="#ff9900" distance={1.8} />
      </group>

      {/* ── Chairs (3 around table) ── */}
      {[0, Math.PI * 0.67, Math.PI * 1.33].map((angle, i) => {
        const cx = Math.sin(angle) * 1.1
        const cz = Math.cos(angle) * 1.1
        const ry = angle + Math.PI
        return (
          <group key={i} position={[cx, -0.38, cz]} rotation={[0, ry, 0]}>
            {/* Seat */}
            <mesh castShadow>
              <boxGeometry args={[0.46, 0.05, 0.44]} />
              <meshStandardMaterial color="#4a6fa5" roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh castShadow position={[0, 0.3, -0.2]}>
              <boxGeometry args={[0.46, 0.5, 0.05]} />
              <meshStandardMaterial color="#3b5c90" roughness={0.8} />
            </mesh>
            {/* Backrest slats */}
            {[-0.13, 0, 0.13].map((sx, si) => (
              <mesh key={si} castShadow position={[sx, 0.3, -0.18]}>
                <boxGeometry args={[0.05, 0.44, 0.03]} />
                <meshStandardMaterial color="#2d4a7a" />
              </mesh>
            ))}
            {/* Legs */}
            {[[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]].map(([lx, lz], li) => (
              <mesh key={li} castShadow position={[lx, -0.22, lz]}>
                <cylinderGeometry args={[0.022, 0.022, 0.42, 5]} />
                <meshStandardMaterial color="#2d4a7a" />
              </mesh>
            ))}
          </group>
        )
      })}
    </group>
  )
}

export default Table