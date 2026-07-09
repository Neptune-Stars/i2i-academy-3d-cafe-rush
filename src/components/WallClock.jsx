import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

function WallClock({ position = [0, 0, 0] }) {
  const hourRef   = useRef()
  const minuteRef = useRef()
  const secondRef = useRef()

  useFrame(() => {
    const now     = new Date()
    const ms      = now.getMilliseconds()
    const secs    = now.getSeconds()   + ms / 1000
    const mins    = now.getMinutes()   + secs / 60
    const hours   = (now.getHours() % 12) + mins / 60

    if (secondRef.current) secondRef.current.rotation.z = -(secs  / 60)  * Math.PI * 2
    if (minuteRef.current) minuteRef.current.rotation.z = -(mins  / 60)  * Math.PI * 2
    if (hourRef.current)   hourRef.current.rotation.z   = -(hours / 12)  * Math.PI * 2
  })

  return (
    <group position={position}>
      {/* Clock body (slight depth) */}
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.46, 0.46, 0.06, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.6} />
      </mesh>

      {/* Clock face */}
      <mesh>
        <cylinderGeometry args={[0.42, 0.42, 0.03, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>

      {/* Outer rim */}
      <mesh>
        <torusGeometry args={[0.44, 0.04, 8, 28]} />
        <meshStandardMaterial color="#7c4a1e" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const x = Math.sin(angle) * 0.33
        const y = Math.cos(angle) * 0.33
        const isMajor = i % 3 === 0
        return (
          <mesh key={i} position={[x, y, 0.02]}>
            <boxGeometry args={[isMajor ? 0.04 : 0.025, isMajor ? 0.1 : 0.06, 0.01]} />
            <meshStandardMaterial color={isMajor ? '#3d1f0a' : '#7c4a1e'} />
          </mesh>
        )
      })}

      {/* Minute markers (60 ticks) */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null // skip — hour markers cover these
        const angle = (i / 60) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(angle) * 0.36, Math.cos(angle) * 0.36, 0.015]}>
            <boxGeometry args={[0.01, 0.035, 0.008]} />
            <meshStandardMaterial color="#c8a870" />
          </mesh>
        )
      })}

      {/* Hour hand */}
      <group ref={hourRef} position={[0, 0, 0.04]}>
        <mesh position={[0, 0.12, 0]}>
          <boxGeometry args={[0.035, 0.24, 0.014]} />
          <meshStandardMaterial color="#1a0d00" />
        </mesh>
      </group>

      {/* Minute hand */}
      <group ref={minuteRef} position={[0, 0, 0.05]}>
        <mesh position={[0, 0.155, 0]}>
          <boxGeometry args={[0.025, 0.31, 0.012]} />
          <meshStandardMaterial color="#1a0d00" />
        </mesh>
      </group>

      {/* Second hand */}
      <group ref={secondRef} position={[0, 0, 0.06]}>
        {/* Long forward part */}
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.012, 0.34, 0.01]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        {/* Short counterbalance */}
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[0.012, 0.12, 0.01]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Centre pin */}
      <mesh position={[0, 0, 0.07]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hanger knob at top */}
      <mesh position={[0, 0.46, -0.04]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#7c4a1e" />
      </mesh>
    </group>
  )
}

export default WallClock
