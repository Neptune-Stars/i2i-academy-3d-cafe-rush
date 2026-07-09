import { useCafeStore } from '../store/cafeStore'

function Kitchen() {
  const foodReady    = useCafeStore((s) => s.foodReady)
  const chefProgress = useCafeStore((s) => s.chefProgress)
  const cooking      = chefProgress > 0 && !foodReady

  return (
    <group position={[0, 0, -4.8]}>
      {/* ── Main counter body ── */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[6, 0.55, 1.3]} />
        <meshStandardMaterial color="#7c4a1e" roughness={0.7} />
      </mesh>

      {/* Counter top */}
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[6, 0.05, 1.3]} />
        <meshStandardMaterial color="#d4a96a" roughness={0.25} metalness={0.12} />
      </mesh>

      {/* ── Stove area ── */}
      <mesh position={[0.4, 0.34, -0.1]} receiveShadow>
        <boxGeometry args={[1.8, 0.05, 1.0]} />
        <meshStandardMaterial color="#1e1e1e" roughness={0.85} />
      </mesh>

      {/* Burner rings (4 burners) */}
      {[[-0.5, -0.15], [-0.5, 0.2], [0.5+0.4, -0.15], [0.5+0.4, 0.2]].map(([bx, bz], i) => (
        <group key={i} position={[bx, 0.39, bz]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* Outer ring */}
          <mesh>
            <torusGeometry args={[0.2, 0.03, 4, 12]} />
            <meshStandardMaterial
              color={cooking ? '#ff4400' : '#555555'}
              emissive={cooking ? '#ff2200' : '#000000'}
              emissiveIntensity={cooking ? 0.9 : 0}
            />
          </mesh>
          {/* Inner ring */}
          <mesh>
            <torusGeometry args={[0.1, 0.025, 4, 8]} />
            <meshStandardMaterial
              color={cooking ? '#ff7700' : '#444444'}
              emissive={cooking ? '#ff5500' : '#000000'}
              emissiveIntensity={cooking ? 0.7 : 0}
            />
          </mesh>
          {/* Centre grate */}
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 6]} />
            <meshStandardMaterial color="#333333" metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── Exhaust hood ── */}
      <mesh position={[0.4, 2.1, -0.35]} castShadow>
        <boxGeometry args={[2.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.4, 1.6, -0.35]}>
        <boxGeometry args={[1.9, 1.0, 1.0]} />
        <meshStandardMaterial color="#b0b8c1" metalness={0.5} roughness={0.4} opacity={0.92} transparent />
      </mesh>
      {/* Hood vent pipe */}
      <mesh position={[0.4, 2.4, -0.2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 8]} />
        <meshStandardMaterial color="#6b7280" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* ── Serving / pickup plate ── */}
      <mesh position={[-2.0, 0.34, 0.25]} receiveShadow>
        <cylinderGeometry args={[0.44, 0.44, 0.04, 10]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Plate rim */}
      <mesh position={[-2.0, 0.35, 0.25]}>
        <torusGeometry args={[0.44, 0.02, 4, 16]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.3} />
      </mesh>

      {/* Food ready on plate */}
      {foodReady && (
        <mesh position={[-2.0, 0.52, 0.25]} castShadow>
          <sphereGeometry args={[0.23, 8, 8]} />
          <meshStandardMaterial color="#ffcc33" emissive="#ff9900" emissiveIntensity={0.7} />
        </mesh>
      )}

      {/* ── Wall tiles behind kitchen ── */}
      <mesh position={[0, 1.35, -0.68]} receiveShadow>
        <boxGeometry args={[6.1, 2.7, 0.04]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      {/* Tile grout lines H */}
      {[-0.3, 0.15, 0.6, 1.05, 1.5, 1.95].map((y, i) => (
        <mesh key={`th-${i}`} position={[0, y, -0.67]}>
          <boxGeometry args={[6.1, 0.018, 0.01]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}
      {/* Tile grout lines V */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x, i) => (
        <mesh key={`tv-${i}`} position={[x, 0.85, -0.67]}>
          <boxGeometry args={[0.018, 2.7, 0.01]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}

      {/* ── Spice rack ── */}
      <mesh position={[2.3, 0.78, -0.55]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.28]} />
        <meshStandardMaterial color="#6b3a1f" />
      </mesh>
      {[0, 0.26, 0.52, 0.78].map((x, i) => (
        <group key={i} position={[1.75 + x, 0.94, -0.55]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.075, 0.2, 8]} />
            <meshStandardMaterial color={['#dc2626','#16a34a','#b45309','#7c3aed'][i]} />
          </mesh>
          <mesh position={[0, 0.115, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.04, 6]} />
            <meshStandardMaterial color="#888888" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Pots on shelf ── */}
      <mesh position={[-2.4, 0.7, -0.52]} castShadow>
        <boxGeometry args={[0.9, 0.07, 0.28]} />
        <meshStandardMaterial color="#6b3a1f" />
      </mesh>
      {[0, 0.38].map((x, i) => (
        <group key={i} position={[-2.7 + x, 0.87, -0.52]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.14, 0.22, 8]} />
            <meshStandardMaterial color={i === 0 ? '#b91c1c' : '#1d4ed8'} metalness={0.3} />
          </mesh>
          <mesh castShadow position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 8]} />
            <meshStandardMaterial color="#4b5563" metalness={0.5} />
          </mesh>
          {/* Handle */}
          <mesh castShadow position={[0.16, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.18, 5]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ── Hanging lamp above kitchen ── */}
      <mesh position={[0, 2.85, 0]}>
        <cylinderGeometry args={[0.28, 0.38, 0.22, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.4} />
      </mesh>
      <mesh position={[0, 2.74, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.04, 8]} />
        <meshStandardMaterial color="#f3f4f6" opacity={0.9} transparent emissive="#fff8e1" emissiveIntensity={0.3} />
      </mesh>
      <pointLight position={[0, 2.5, 0]} intensity={1.4} color="#fff5e0" distance={5} />
    </group>
  )
}

export default Kitchen