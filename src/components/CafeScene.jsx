import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useCafeStore } from '../store/cafeStore'
import Waiter from './Waiter'
import Chef from './Chef'
import Kitchen from './Kitchen'
import Table from './Table'
import Customer from './Customer'
import CarriedFood from './CarriedFood'
import TrashCan from './TrashCan'
import CoffeeMachine from './CoffeeMachine'
import Fridge from './Fridge'
import WallClock from './WallClock'
import LevelBanner from './LevelBanner'

// ── Table layout (5 tables, first 3 always active) ───────────────────────────
const tableData = [
  { tableId: 1, position: [-4.5, 0.35, -1.5] },
  { tableId: 2, position: [0,    0.35, -3.0] },
  { tableId: 3, position: [4.5,  0.35, -1.5] },
  { tableId: 4, position: [-4.5, 0.35,  1.5] },
  { tableId: 5, position: [4.5,  0.35,  1.5] },
]

// ── Floor ─────────────────────────────────────────────────────────────────────
function Floor({ hasRug }) {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#c8a97a" roughness={0.85} />
      </mesh>

      {/* Tile grid lines X */}
      {Array.from({ length: 9 }, (_, i) => i - 4).map((x) => (
        <mesh key={`fx-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x * 1.5, 0.001, 0]}>
          <planeGeometry args={[0.025, 12]} />
          <meshStandardMaterial color="#b09060" />
        </mesh>
      ))}
      {/* Tile grid lines Z */}
      {Array.from({ length: 9 }, (_, i) => i - 4).map((z) => (
        <mesh key={`fz-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, z * 1.35]}>
          <planeGeometry args={[14, 0.025]} />
          <meshStandardMaterial color="#b09060" />
        </mesh>
      ))}

      {/* Entrance mat */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 4.8]}>
        <planeGeometry args={[2.5, 0.9]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.9} />
      </mesh>
      {/* Mat pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, 4.8]}>
        <planeGeometry args={[2.2, 0.6]} />
        <meshStandardMaterial color="#991b1b" roughness={0.9} />
      </mesh>

      {/* Optional patterned rug in centre */}
      {hasRug && (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, -1]}>
            <planeGeometry args={[8, 5.5]} />
            <meshStandardMaterial color="#1e3a5f" roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, -1]}>
            <planeGeometry args={[7.4, 4.9]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.9} opacity={0.6} transparent />
          </mesh>
          {/* Rug border fringe hints */}
          {Array.from({ length: 7 }, (_, i) => i - 3).map((x) => (
            <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x * 1.1, 0.005, -3.77]}>
              <planeGeometry args={[0.06, 0.25]} />
              <meshStandardMaterial color="#93c5fd" />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

// ── Walls ─────────────────────────────────────────────────────────────────────
function Walls({ hasPainting }) {
  const wallColor   = '#e8d5b7'
  const wallAccent  = '#d4b896'
  const wainscot    = '#c8a870'

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2.5, -6.1]} receiveShadow>
        <boxGeometry args={[14, 5.5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 2.5, -0.5]} receiveShadow>
        <boxGeometry args={[0.2, 5.5, 13]} />
        <meshStandardMaterial color={wallAccent} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 2.5, -0.5]} receiveShadow>
        <boxGeometry args={[0.2, 5.5, 13]} />
        <meshStandardMaterial color={wallAccent} />
      </mesh>

      {/* Wainscoting (lower wall panel) */}
      <mesh position={[0, 0.6, -5.98]}>
        <boxGeometry args={[14, 1.2, 0.05]} />
        <meshStandardMaterial color={wainscot} roughness={0.5} />
      </mesh>
      <mesh position={[-6.88, 0.6, -0.5]}>
        <boxGeometry args={[0.05, 1.2, 13]} />
        <meshStandardMaterial color={wainscot} roughness={0.5} />
      </mesh>
      <mesh position={[6.88, 0.6, -0.5]}>
        <boxGeometry args={[0.05, 1.2, 13]} />
        <meshStandardMaterial color={wainscot} roughness={0.5} />
      </mesh>


      {/* Ceiling removed — open-air café view */}


      {/* Baseboard trim - back */}
      <mesh position={[0, 0.14, -5.98]}>
        <boxGeometry args={[14, 0.28, 0.1]} />
        <meshStandardMaterial color="#8b5e3c" />
      </mesh>
      <mesh position={[-6.88, 0.14, -0.5]}>
        <boxGeometry args={[0.1, 0.28, 13]} />
        <meshStandardMaterial color="#8b5e3c" />
      </mesh>
      <mesh position={[6.88, 0.14, -0.5]}>
        <boxGeometry args={[0.1, 0.28, 13]} />
        <meshStandardMaterial color="#8b5e3c" />
      </mesh>

      {/* Optional wall paintings */}
      {hasPainting && (
        <>
          {/* Left painting */}
          <group position={[-6.8, 2.4, -1]}>
            <mesh>
              <boxGeometry args={[0.08, 1.3, 1.0]} />
              <meshStandardMaterial color="#5c3317" />
            </mesh>
            <mesh position={[0.05, 0, 0]}>
              <boxGeometry args={[0.04, 1.1, 0.8]} />
              <meshStandardMaterial color="#1e3a5f" />
            </mesh>
            <mesh position={[0.06, 0.15, 0.1]}>
              <boxGeometry args={[0.01, 0.35, 0.25]} />
              <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
            </mesh>
          </group>

          {/* Right painting */}
          <group position={[6.8, 2.4, -1]}>
            <mesh>
              <boxGeometry args={[0.08, 1.3, 1.0]} />
              <meshStandardMaterial color="#5c3317" />
            </mesh>
            <mesh position={[-0.05, 0, 0]}>
              <boxGeometry args={[0.04, 1.1, 0.8]} />
              <meshStandardMaterial color="#831843" />
            </mesh>
            <mesh position={[-0.06, 0, 0]}>
              <boxGeometry args={[0.01, 0.4, 0.55]} />
              <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.2} />
            </mesh>
          </group>

          {/* Back wall painting */}
          <group position={[-3, 2.8, -5.98]}>
            <mesh>
              <boxGeometry args={[1.4, 1.0, 0.08]} />
              <meshStandardMaterial color="#5c3317" />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <boxGeometry args={[1.2, 0.82, 0.04]} />
              <meshStandardMaterial color="#0c4a6e" />
            </mesh>
          </group>
        </>
      )}
    </group>
  )
}

// ── Decorative accents ────────────────────────────────────────────────────────
function WallDecor({ hasPlant, hasStringLights }) {
  return (
    <group>
      {/* Menu board above kitchen counter */}
      <mesh position={[0, 3.8, -5.88]}>
        <boxGeometry args={[3.5, 1.4, 0.12]} />
        <meshStandardMaterial color="#3d1f0a" />
      </mesh>
      <mesh position={[0, 3.8, -5.8]}>
        <boxGeometry args={[3.2, 1.15, 0.05]} />
        <meshStandardMaterial color="#1a0d04" />
      </mesh>
      {/* Menu "chalk" lines */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 3.82, -5.75]}>
          <boxGeometry args={[0.5, 0.03, 0.01]} />
          <meshStandardMaterial color="#ffffffcc" opacity={0.6} transparent />
        </mesh>
      ))}
      <pointLight position={[0, 4.4, -5.2]} intensity={0.5} color="#fff5cc" distance={3} />

      {/* Ceiling lamps */}
      {[[-4.5, 4.88, -1], [0, 4.88, -1], [4.5, 4.88, -1]].map(([x, y, z], i) => (
        <group key={i}>
          <mesh position={[x, y, z]}>
            <cylinderGeometry args={[0.16, 0.3, 0.18, 8]} />
            <meshStandardMaterial color="#333333" metalness={0.4} />
          </mesh>
          <mesh position={[x, y - 0.1, z]}>
            <cylinderGeometry args={[0.28, 0.28, 0.04, 8]} />
            <meshStandardMaterial color="#f3f4f6" opacity={0.9} transparent emissive="#fff8e1" emissiveIntensity={0.3} />
          </mesh>
          <pointLight position={[x, y - 0.4, z]} intensity={0.5} color="#fff0d0" distance={7} />
        </group>
      ))}

      {/* Wall sconces */}
      {[[-6.7, 2.4, 2.5], [6.7, 2.4, 2.5], [-6.7, 2.4, -3.5], [6.7, 2.4, -3.5]].map(([x, y, z], i) => (
        <group key={i}>
          <mesh position={[x, y, z]}>
            <boxGeometry args={[0.06, 0.25, 0.18]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[x < 0 ? x + 0.12 : x - 0.12, y + 0.18, z]} rotation={[0, 0, x < 0 ? 0.4 : -0.4]}>
            <coneGeometry args={[0.1, 0.22, 8, 1, true]} />
            <meshStandardMaterial color="#d97706" side={2} emissive="#f59e0b" emissiveIntensity={0.2} />
          </mesh>
          <pointLight position={[x < 0 ? x + 0.2 : x - 0.2, y + 0.25, z]} intensity={0.35} color="#ffe8c0" distance={4} />
        </group>
      ))}

      {/* Corner plants */}
      {hasPlant && [[-6.2, 0, 4.5], [6.2, 0, 4.5], [-6.2, 0, -5], [6.2, 0, -5]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Pot */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.16, 0.38, 8]} />
            <meshStandardMaterial color="#c0722a" roughness={0.7} />
          </mesh>
          {/* Soil */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.04, 8]} />
            <meshStandardMaterial color="#4b2905" roughness={0.9} />
          </mesh>
          {/* Foliage */}
          {[[0, 0.55, 0], [0.2, 0.65, 0.15], [-0.18, 0.6, 0.1], [0.1, 0.8, -0.15]].map(([fx, fy, fz], fi) => (
            <mesh key={fi} castShadow position={[fx, fy, fz]}>
              <sphereGeometry args={[0.22 - fi * 0.03, 6, 5]} />
              <meshStandardMaterial color={fi % 2 === 0 ? '#166534' : '#15803d'} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* String lights */}
      {hasStringLights && (
        <group>
          {/* Left string */}
          {Array.from({ length: 8 }, (_, i) => (
            <group key={i} position={[-6.5 + i * 1.5, 4.6, -3]}>
              <mesh>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
              </mesh>
              <pointLight intensity={0.12} color="#ffe8a0" distance={2} />
            </group>
          ))}
        </group>
      )}
    </group>
  )
}

// ── Bar counter (right side) ──────────────────────────────────────────────────
function BarCounter() {
  return (
    <group position={[5.5, 0, 1.5]}>
      {/* Counter body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.1, 0.8]} />
        <meshStandardMaterial color="#6b3a1f" roughness={0.7} />
      </mesh>
      {/* Counter top */}
      <mesh position={[0, 0.58, 0]}>
        <boxGeometry args={[2.2, 0.06, 0.82]} />
        <meshStandardMaterial color="#d4a96a" roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Edge trim */}
      <mesh position={[0, 0.59, 0.41]}>
        <boxGeometry args={[2.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#c8a870" metalness={0.3} />
      </mesh>

      {/* Bar stools */}
      {[-0.65, 0, 0.65].map((x, i) => (
        <group key={i} position={[x, 0, 0.72]}>
          {/* Stool top */}
          <mesh castShadow position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 10]} />
            <meshStandardMaterial color="#4a6fa5" roughness={0.7} />
          </mesh>
          {/* Stool stem */}
          <mesh castShadow position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Base */}
          <mesh castShadow position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.06, 8]} />
            <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Footrest ring */}
          <mesh position={[0, 0.28, 0]}>
            <torusGeometry args={[0.12, 0.015, 4, 10]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Cash register */}
      <group position={[0.7, 0.62, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.3, 0.3]} />
          <meshStandardMaterial color="#1f2937" metalness={0.3} roughness={0.5} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.1, 0.16]}>
          <boxGeometry args={[0.28, 0.18, 0.01]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
        </mesh>
        {/* Keys */}
        {[[-0.1, -0.05], [0, -0.05], [0.1, -0.05], [-0.1, -0.12], [0, -0.12], [0.1, -0.12]].map(([kx, ky], ki) => (
          <mesh key={ki} position={[kx, ky, 0.155]}>
            <boxGeometry args={[0.055, 0.04, 0.01]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ── Entrance arch ─────────────────────────────────────────────────────────────
function EntranceArch() {
  return (
    <group position={[0, 0, 6.1]}>
      {/* Left pillar */}
      <mesh castShadow position={[-2, 2.5, 0]}>
        <boxGeometry args={[0.35, 5, 0.35]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {/* Right pillar */}
      <mesh castShadow position={[2, 2.5, 0]}>
        <boxGeometry args={[0.35, 5, 0.35]} />
        <meshStandardMaterial color="#92400e" roughness={0.6} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, 5.1, 0]}>
        <boxGeometry args={[4.35, 0.5, 0.35]} />
        <meshStandardMaterial color="#7c3d12" roughness={0.6} />
      </mesh>
      {/* Sign board */}
      <mesh position={[0, 4.5, 0.1]}>
        <boxGeometry args={[3.0, 0.7, 0.12]} />
        <meshStandardMaterial color="#3d1f0a" />
      </mesh>
      {/* "CAFÉ" lettering hint */}
      {[-0.55, -0.2, 0.15, 0.5].map((x, i) => (
        <mesh key={i} position={[x, 4.5, 0.18]}>
          <boxGeometry args={[0.18, 0.38, 0.04]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ── Outdoor environment (visible through open roof) ─────────────────────────
function Outdoors() {
  return (
    <group>
      {/* Sky dome — large hemisphere above the scene */}
      <mesh position={[0, 0, -4]} scale={[1, 1, 1]}>
        <sphereGeometry args={[55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        {/* Gradient: bottom warm horizon, top deep sky blue */}
        <meshStandardMaterial
          color="#87ceeb"
          side={1}
          emissive="#87ceeb"
          emissiveIntensity={0.25}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Horizon band — warm peachy gradient strip */}
      <mesh position={[0, 4.8, -4]}>
        <cylinderGeometry args={[54.5, 54.5, 3.5, 24, 1, true]} />
        <meshStandardMaterial
          color="#fcd9a0"
          side={1}
          emissive="#f4a460"
          emissiveIntensity={0.15}
          roughness={1}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Sun disc */}
      <mesh position={[22, 18, -40]}>
        <sphereGeometry args={[2.2, 12, 12]} />
        <meshStandardMaterial
          color="#fffde7"
          emissive="#ffe082"
          emissiveIntensity={2.5}
          roughness={1}
        />
      </mesh>
      {/* Sun halo glow ring */}
      <mesh position={[22, 18, -40]}>
        <sphereGeometry args={[3.4, 12, 12]} />
        <meshStandardMaterial
          color="#fff8e1"
          emissive="#ffcc02"
          emissiveIntensity={0.4}
          transparent
          opacity={0.25}
          roughness={1}
        />
      </mesh>
      <pointLight position={[22, 18, -35]} intensity={1.8} color="#fff5cc" distance={80} />

      {/* Clouds — various sizes and depths */}
      {[
        { pos: [-20, 14, -38], sx: 4.5, sy: 1.6, sz: 2.2 },
        { pos: [  5, 16, -42], sx: 6.0, sy: 2.0, sz: 2.5 },
        { pos: [ 28, 12, -36], sx: 5.0, sy: 1.8, sz: 2.0 },
        { pos: [-38, 10, -30], sx: 3.8, sy: 1.4, sz: 1.8 },
        { pos: [ 40, 15, -44], sx: 4.2, sy: 1.5, sz: 2.0 },
        { pos: [-10, 18, -50], sx: 7.0, sy: 2.2, sz: 2.8 },
        { pos: [ 15, 11, -32], sx: 3.2, sy: 1.2, sz: 1.5 },
      ].map(({ pos, sx, sy, sz }, i) => (
        <group key={i} position={pos}>
          {/* Main puff */}
          <mesh>
            <sphereGeometry args={[1, 7, 5]} />
            <meshStandardMaterial color="#ffffff" emissive="#e0eeff" emissiveIntensity={0.08} roughness={1} />
          </mesh>
          {/* Side puffs */}
          {[[-0.9, -0.2, 0], [0.9, -0.2, 0], [0, -0.2, -0.6]].map(([cx, cy, cz], ci) => (
            <mesh key={ci} position={[cx * sx * 0.28, cy * sy * 0.3, cz * sz * 0.3]} scale={[sx * 0.3, sy * 0.28, sz * 0.28]}>
              <sphereGeometry args={[1, 6, 5]} />
              <meshStandardMaterial color="#f5f8ff" emissive="#dce8ff" emissiveIntensity={0.06} roughness={1} />
            </mesh>
          ))}
          {/* Flatten / stretch the cloud cluster */}
          <mesh scale={[sx, sy * 0.55, sz]}>
            <sphereGeometry args={[1, 8, 5]} />
            <meshStandardMaterial color="#ffffff" emissive="#eaf0ff" emissiveIntensity={0.05} roughness={1} transparent opacity={0.75} />
          </mesh>
        </group>
      ))}

      {/* Distant city skyline — simple low-poly buildings */}
      {[
        { x: -34, h: 8,  w: 4, z: -28 },
        { x: -28, h: 12, w: 3, z: -30 },
        { x: -22, h: 6,  w: 5, z: -26 },
        { x:  22, h: 10, w: 3.5, z: -28 },
        { x:  28, h: 14, w: 3, z: -32 },
        { x:  34, h: 7,  w: 4.5, z: -27 },
        { x:  40, h: 9,  w: 3, z: -30 },
        { x: -42, h: 11, w: 3, z: -32 },
      ].map(({ x, h, w, z }, i) => (
        <group key={i} position={[x, h / 2, z]}>
          <mesh castShadow>
            <boxGeometry args={[w, h, w * 0.8]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#d4a96a' : i % 3 === 1 ? '#b8ccd6' : '#e8d5b7'}
              roughness={0.7}
            />
          </mesh>
          {/* Windows hint */}
          {Array.from({ length: Math.floor(h / 2) }, (_, wi) => (
            <mesh key={wi} position={[0, -h / 2 + 1 + wi * 1.8, w * 0.41]}>
              <boxGeometry args={[w * 0.5, 0.6, 0.05]} />
              <meshStandardMaterial color="#93c5fd" emissive="#3b82f6" emissiveIntensity={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Street / pavement outside the café entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 14]}>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>
      {/* Pavement centre line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 14]}>
        <planeGeometry args={[0.25, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.9} />
      </mesh>
      {/* Roadside kerb */}
      <mesh position={[0, 0.07, 8.2]}>
        <boxGeometry args={[30, 0.14, 0.3]} />
        <meshStandardMaterial color="#6b7280" roughness={0.8} />
      </mesh>

      {/* Pavement tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 10.5]}>
        <planeGeometry args={[30, 3.5]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.85} />
      </mesh>

      {/* Street trees */}
      {[-10, -4, 4, 10].map((x, i) => (
        <group key={i} position={[x, 0, 9.5]}>
          {/* Trunk */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.22, 2.2, 7]} />
            <meshStandardMaterial color="#5c3317" roughness={0.9} />
          </mesh>
          {/* Canopy — layered spheres */}
          {[[0, 2.6, 0], [-0.5, 2.2, 0.3], [0.5, 2.3, -0.2], [0, 3.2, 0]].map(([tx, ty, tz], ti) => (
            <mesh key={ti} castShadow position={[tx, ty, tz]}>
              <sphereGeometry args={[0.9 - ti * 0.08, 7, 6]} />
              <meshStandardMaterial
                color={ti % 2 === 0 ? '#15803d' : '#166534'}
                roughness={0.85}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Street lamp posts */}
      {[-8, 0, 8].map((x, i) => (
        <group key={i} position={[x, 0, 9]}>
          {/* Post */}
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3.5, 6]} />
            <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Arm */}
          <mesh castShadow position={[0.3, 3.6, 0]} rotation={[0, 0, -0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 5]} />
            <meshStandardMaterial color="#374151" metalness={0.6} />
          </mesh>
          {/* Lamp shade */}
          <mesh position={[0.55, 3.5, 0]}>
            <coneGeometry args={[0.22, 0.28, 8, 1, true]} />
            <meshStandardMaterial color="#1f2937" metalness={0.5} side={2} />
          </mesh>
          {/* Lamp glow */}
          <mesh position={[0.55, 3.42, 0]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={1.5} />
          </mesh>
          <pointLight position={[0.55, 3.3, 0]} intensity={0.5} color="#fef3c7" distance={5} />
        </group>
      ))}

      {/* Outdoor bench */}
      <group position={[5, 0, 9.2]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.6, 0.08, 0.42]} />
          <meshStandardMaterial color="#7c4a1e" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[1.6, 0.08, 0.42]} />
          <meshStandardMaterial color="#7c4a1e" roughness={0.8} />
        </mesh>
        {[-0.65, 0.65].map((x, i) => (
          <mesh key={i} castShadow position={[x, 0.25, 0]}>
            <boxGeometry args={[0.08, 0.5, 0.42]} />
            <meshStandardMaterial color="#4b5563" metalness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ── Main scene ────────────────────────────────────────────────────────────────
function CafeScene() {
  const waiterRef = useRef({ position: new THREE.Vector3(0, 0.55, 2.5) })

  const chefTimer          = useRef(0)
  const spawnTimer         = useRef(0)
  const patienceTimer      = useRef(0)
  const interactionCooldown= useRef(0)

  const status         = useCafeStore((s) => s.status)
  const customers      = useCafeStore((s) => s.customers)
  const carriedFood    = useCafeStore((s) => s.carriedFood)
  const foodReady      = useCafeStore((s) => s.foodReady)
  const level          = useCafeStore((s) => s.level)
  const ownedUpgrades  = useCafeStore((s) => s.ownedUpgrades)
  const ownedDecorations= useCafeStore((s) => s.ownedDecorations)

  const setFoodReady            = useCafeStore((s) => s.setFoodReady)
  const setChefProgress         = useCafeStore((s) => s.setChefProgress)
  const pickUpFood              = useCafeStore((s) => s.pickUpFood)
  const deliverFood             = useCafeStore((s) => s.deliverFood)
  const trashFood               = useCafeStore((s) => s.trashFood)
  const decreaseCustomerPatience= useCafeStore((s) => s.decreaseCustomerPatience)
  const spawnCustomer           = useCafeStore((s) => s.spawnCustomer)
  const increaseScore           = useCafeStore((s) => s.increaseScore)
  const tickCombo               = useCafeStore((s) => s.tickCombo)

  // Active table count (based on upgrade)
  const extraTableLvl = ownedUpgrades?.extraTable || 0
  const activeTableCount = Math.min(3 + extraTableLvl, 5)

  useEffect(() => {
    if (status === 'active') {
      chefTimer.current          = 0
      spawnTimer.current         = 0
      patienceTimer.current      = 0
      interactionCooldown.current= 0
    }
  }, [status])

  useFrame((state, delta) => {
    if (status !== 'active') return

    chefTimer.current           += delta
    spawnTimer.current          += delta
    patienceTimer.current       += delta
    interactionCooldown.current -= delta

    // Cook time: level scales, fasterChef upgrade reduces
    const chefSpeedMult = 1 - (ownedUpgrades?.fasterChef || 0) * 0.2
    const cookTime = Math.max(1.2, (4 - (level - 1) * 0.25)) * chefSpeedMult

    const activeCustomers = customers.filter((c) => !c.leaving)

    if (!foodReady && !carriedFood && activeCustomers.length > 0) {
      const progress = Math.min((chefTimer.current / cookTime) * 100, 100)
      setChefProgress(progress)
      if (chefTimer.current >= cookTime) {
        setFoodReady(true)
        chefTimer.current = 0
      }
    }

    if (activeCustomers.length === 0) {
      setChefProgress(0)
      chefTimer.current = 0
    }

    // Spawn interval
    const spawnInterval = Math.max(3, 7 - (level - 1) * 0.4)
    if (spawnTimer.current > spawnInterval) {
      spawnCustomer()
      spawnTimer.current = 0
    }

    // Patience drain
    if (patienceTimer.current > 0.25) {
      const patienceDrain = 1.0 + (level - 1) * 0.12
      decreaseCustomerPatience(patienceDrain)
      patienceTimer.current = 0
    }

    // Passive score trickle
    if (activeCustomers.length > 0) increaseScore(delta * 0.2)

    tickCombo(delta)

    const wp = waiterRef.current.position

    // Kitchen pickup zone (near serving plate at x=-2, z=-4.55)
    const pickupPoint = new THREE.Vector3(-2, 0.55, -4.55)
    if (wp.distanceTo(pickupPoint) < 1.6 && interactionCooldown.current <= 0) {
      pickUpFood()
      interactionCooldown.current = 0.5
    }

    // Delivery zones
    for (const customer of activeCustomers) {
      const cp = new THREE.Vector3(customer.position[0], customer.position[1], customer.position[2])
      if (wp.distanceTo(cp) < 1.5 && interactionCooldown.current <= 0) {
        deliverFood(customer.tableId)
        interactionCooldown.current = 0.5
      }
    }

    // Trash-can zone — discard carried food or food waiting on plate
    // Trash can is at position [0, 0, 4.2] in CafeScene
    const trashPoint = new THREE.Vector3(0, 0.55, 4.2)
    if (wp.distanceTo(trashPoint) < 1.1 && interactionCooldown.current <= 0) {
      trashFood()
      // Reset chef timer so cooking restarts immediately for remaining customers
      chefTimer.current = 0
      interactionCooldown.current = 0.8
    }
  })

  return (
    <>
      {/* Sky-blue background instead of dark brown */}
      <color attach="background" args={['#87ceeb']} />

      {/* Outdoor sky & environment */}
      <Outdoors />

      {/* ── Lights ── */}
      <ambientLight intensity={0.65} color="#fff8f0" />

      <directionalLight
        position={[6, 10, 6]}
        intensity={1.1}
        color="#ffe8c0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 6, 4]} intensity={0.25} color="#c0d8ff" />

      {/* ── Scene ── */}
      <Floor hasRug={!!ownedDecorations?.rug} />
      <Walls hasPainting={!!ownedDecorations?.painting} />
      <WallDecor
        hasPlant={!!ownedDecorations?.plant}
        hasStringLights={!!ownedDecorations?.string}
      />
      <EntranceArch />
      <BarCounter />

      {/* Props */}
      <TrashCan position={[0, 0, 4.2]} />
      <CoffeeMachine position={[-1, 0, -4.3]} />
      <Fridge position={[5.8, 0, -5.0]} />
      <WallClock position={[0, 3.2, -5.95]} />

      {/* Kitchen & chef */}
      <Kitchen />
      <Chef />

      {/* Tables */}
      {tableData.slice(0, activeTableCount).map((table) => (
        <Table key={table.tableId} tableId={table.tableId} position={table.position} />
      ))}

      {/* Customers */}
      {customers.map((customer) => (
        <Customer key={customer.id} customer={customer} />
      ))}

      {/* Waiter */}
      <Waiter waiterRef={waiterRef} />

      {/* Carried food */}
      {carriedFood && <CarriedFood waiterRef={waiterRef} carriedFood={carriedFood} />}

      {/* Level up banner */}
      <LevelBanner />

      {/* Umbrella tables (decoration) */}
      {ownedDecorations?.umbrella && tableData.slice(0, activeTableCount).map((table) => (
        <group key={`umb-${table.tableId}`} position={[table.position[0], table.position[1] + 0.12, table.position[2]]}>
          {/* Pole */}
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 2.5, 6]} />
            <meshStandardMaterial color="#374151" metalness={0.5} />
          </mesh>
          {/* Canopy */}
          <mesh position={[0, 1.3, 0]}>
            <coneGeometry args={[1.1, 0.45, 10, 1, true]} />
            <meshStandardMaterial
              color={['#dc2626','#2563eb','#16a34a','#7c3aed','#ea580c'][table.tableId - 1]}
              side={2}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 8}
        minDistance={7}
        maxDistance={22}
        target={[0, 0, -1]}
      />
    </>
  )
}

export default CafeScene