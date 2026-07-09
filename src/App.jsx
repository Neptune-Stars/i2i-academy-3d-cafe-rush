import { Canvas } from '@react-three/fiber'
import CafeScene from './components/CafeScene'
import UIOverlay from './components/UIOverlay'
import './App.css'

function App() {
  return (
    <div className="app">
      <Canvas
        shadows
        camera={{
          position: [0, 8, 9],
          fov: 50,
        }}
      >
        <CafeScene />
      </Canvas>

      <UIOverlay />
    </div>
  )
}

export default App