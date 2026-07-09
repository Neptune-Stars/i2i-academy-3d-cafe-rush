import { useEffect } from 'react'
import { useCafeStore } from '../store/cafeStore'

function UIOverlay() {
  const score = useCafeStore((state) => state.score)
  const lives = useCafeStore((state) => state.lives)
  const status = useCafeStore((state) => state.status)
  const carriedFood = useCafeStore((state) => state.carriedFood)
  const foodReady = useCafeStore((state) => state.foodReady)
  const chefProgress = useCafeStore((state) => state.chefProgress)
  const customers = useCafeStore((state) => state.customers)
  const restartGame = useCafeStore((state) => state.restartGame)

  useEffect(() => {
    function handleRestart(event) {
      if (event.key.toLowerCase() === 'r' && status === 'gameOver') {
        restartGame()
      }
    }

    window.addEventListener('keydown', handleRestart)

    return () => {
      window.removeEventListener('keydown', handleRestart)
    }
  }, [status, restartGame])

  return (
    <div className="ui-overlay">
      <div className="hud">
        <h1>3D Café Rush</h1>

        <p>Score: {Math.floor(score)}</p>
        <p>Lives: {'❤️'.repeat(Math.max(lives, 0))}</p>
        <p>Customers: {customers.length}</p>
        <p>Carrying: {carriedFood ? `Food for Table ${carriedFood.tableId}` : 'Nothing'}</p>
        <p>Chef: {foodReady ? 'Food Ready' : `${Math.floor(chefProgress)}%`}</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${chefProgress}%`,
            }}
          />
        </div>

        <p className="hint">Move with WASD / Arrow Keys</p>
        <p className="hint">Go to kitchen to pick up food</p>
        <p className="hint">Go to correct table to serve</p>
      </div>

      {status === 'gameOver' && (
        <div className="game-over-panel">
          <h2>Game Over</h2>
          <p>Too many customers left unhappy.</p>
          <p>Final Score: {Math.floor(score)}</p>
          <button onClick={restartGame}>Restart</button>
          <p className="hint">You can also press R</p>
        </div>
      )}
    </div>
  )
}

export default UIOverlay