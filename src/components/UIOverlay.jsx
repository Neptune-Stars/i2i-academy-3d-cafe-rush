import { useEffect, useRef, useState } from 'react'
import { useCafeStore } from '../store/cafeStore'
import { UPGRADES, DECORATIONS } from '../store/cafeStore'

// ── Helpers ───────────────────────────────────────────────────────────────────
function ComboDisplay({ combo }) {
  const ref = useRef()
  useEffect(() => {
    if (!ref.current || combo === 0) return
    ref.current.classList.remove('combo-pop')
    void ref.current.offsetWidth
    ref.current.classList.add('combo-pop')
  }, [combo])
  if (combo < 2) return null
  return <div ref={ref} className="combo-badge">🔥 ×{combo} COMBO</div>
}

function LivesDisplay({ lives }) {
  return (
    <div className="lives-row">
      {Array.from({ length: Math.max(lives, 3) }, (_, i) => (
        <span key={i} className={`heart ${i < lives ? 'heart-alive' : 'heart-dead'}`}>♥</span>
      ))}
    </div>
  )
}

function LevelProgress({ totalServed, level }) {
  const servedThisLevel = totalServed % 5
  const pct = (servedThisLevel / 5) * 100
  return (
    <div className="level-progress-wrap">
      <div className="level-progress-label">
        <span>Level {level}</span>
        <span>{servedThisLevel}/5 to next</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill lp-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Level-up toast ────────────────────────────────────────────────────────────
function LevelUpToast({ level }) {
  const [visible, setVisible] = useState(false)
  const prevLevel = useRef(level)

  useEffect(() => {
    if (level > prevLevel.current) {
      prevLevel.current = level
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 2400)
      return () => clearTimeout(t)
    }
    prevLevel.current = level
  }, [level])

  if (!visible) return null
  return (
    <div className="level-toast">
      ⭐ LEVEL UP! <span className="level-toast-num">Level {level}</span>
    </div>
  )
}

// ── Store panel ───────────────────────────────────────────────────────────────
function StorePanel({ onClose }) {
  const coins            = useCafeStore((s) => s.coins)
  const ownedUpgrades    = useCafeStore((s) => s.ownedUpgrades)
  const ownedDecorations = useCafeStore((s) => s.ownedDecorations)
  const buyUpgrade       = useCafeStore((s) => s.buyUpgrade)
  const buyDecoration    = useCafeStore((s) => s.buyDecoration)

  const [tab, setTab] = useState('upgrades')

  return (
    <div className="store-panel">
      <div className="store-header">
        <div className="store-title">🛒 Café Shop</div>
        <div className="coin-display-large">🪙 {Math.floor(coins)}</div>
        <button className="store-close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="store-tabs">
        <button
          className={`store-tab ${tab === 'upgrades' ? 'store-tab--active' : ''}`}
          onClick={() => setTab('upgrades')}
        >
          ⚡ Upgrades
        </button>
        <button
          className={`store-tab ${tab === 'decos' ? 'store-tab--active' : ''}`}
          onClick={() => setTab('decos')}
        >
          🎨 Decorations
        </button>
      </div>

      <div className="store-grid">
        {tab === 'upgrades' && UPGRADES.map((u) => {
          const owned = ownedUpgrades[u.id] || 0
          const maxed = owned >= u.maxLevel
          const affordable = coins >= u.cost
          return (
            <div key={u.id} className={`store-card ${maxed ? 'store-card--maxed' : ''}`}>
              <div className="store-card-name">{u.label}</div>
              <div className="store-card-desc">{u.desc}</div>
              <div className="store-card-level">
                {Array.from({ length: u.maxLevel }, (_, i) => (
                  <span key={i} className={`level-pip ${i < owned ? 'level-pip--filled' : ''}`} />
                ))}
              </div>
              <button
                className={`store-btn ${!affordable || maxed ? 'store-btn--disabled' : ''}`}
                onClick={() => buyUpgrade(u.id)}
                disabled={maxed || !affordable}
              >
                {maxed ? 'MAXED' : `🪙 ${u.cost}`}
              </button>
            </div>
          )
        })}

        {tab === 'decos' && DECORATIONS.map((d) => {
          const owned = !!ownedDecorations[d.id]
          const affordable = coins >= d.cost
          return (
            <div key={d.id} className={`store-card ${owned ? 'store-card--owned' : ''}`}>
              <div className="store-card-name">{d.label}</div>
              <div className="store-card-desc">{d.desc}</div>
              <div className="store-card-level">
                <span className={`level-pip ${owned ? 'level-pip--filled' : ''}`} />
              </div>
              <button
                className={`store-btn ${owned || !affordable ? 'store-btn--disabled' : ''}`}
                onClick={() => buyDecoration(d.id)}
                disabled={owned || !affordable}
              >
                {owned ? '✓ Owned' : `🪙 ${d.cost}`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main UIOverlay ────────────────────────────────────────────────────────────
function UIOverlay() {
  const score          = useCafeStore((s) => s.score)
  const lives          = useCafeStore((s) => s.lives)
  const status         = useCafeStore((s) => s.status)
  const carriedFood    = useCafeStore((s) => s.carriedFood)
  const foodReady      = useCafeStore((s) => s.foodReady)
  const chefProgress   = useCafeStore((s) => s.chefProgress)
  const customers      = useCafeStore((s) => s.customers)
  const combo          = useCafeStore((s) => s.combo)
  const level          = useCafeStore((s) => s.level)
  const totalServed    = useCafeStore((s) => s.totalServed)
  const coins          = useCafeStore((s) => s.coins)
  const bestScore      = useCafeStore((s) => s.bestScore)

  const startGame   = useCafeStore((s) => s.startGame)
  const restartGame = useCafeStore((s) => s.restartGame)
  const nextLevel   = useCafeStore((s) => s.nextLevel)
  const openStore   = useCafeStore((s) => s.openStore)
  const closeStore  = useCafeStore((s) => s.closeStore)

  const [showStore, setShowStore] = useState(false)

  useEffect(() => {
    function handleKey(e) {
      const k = e.key.toLowerCase()
      if (k === 'r' && status === 'gameOver') restartGame()
      if (k === 'enter' && status === 'menu') startGame()
      if (k === 'n' && status === 'levelComplete' && !showStore) nextLevel()
      if (k === 'escape' && showStore) setShowStore(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [status, restartGame, startGame, nextLevel, showStore])

  const progressColor = foodReady
    ? '#22c55e'
    : chefProgress > 66 ? '#facc15' : '#f97316'

  return (
    <div className="ui-overlay">

      {/* ══════════════════════ HUD (active) ══════════════════════ */}
      {status === 'active' && !showStore && (
        <>
          <div className="hud">
            <div className="hud-title">☕ 3D Café Rush</div>

            {/* Score + coins row */}
            <div className="hud-row">
              <span className="hud-label">Score</span>
              <span className="hud-value score-value">{Math.floor(score)}</span>
            </div>
            <div className="hud-row">
              <span className="hud-label">Coins</span>
              <span className="hud-value coin-inline">🪙 {Math.floor(coins)}</span>
            </div>

            <LivesDisplay lives={Math.max(lives, 0)} />

            <div className="hud-divider" />

            <LevelProgress totalServed={totalServed} level={level} />

            <div className="hud-divider" />

            {/* Kitchen */}
            <div className="chef-status">
              <span className="hud-label">Kitchen</span>
              <span className={`hud-value ${foodReady ? 'ready-flash' : ''}`}>
                {foodReady ? '✅ Ready!' : `${Math.floor(chefProgress)}%`}
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${chefProgress}%`, background: progressColor }}
              />
            </div>

            <div className="hud-divider" />

            <div className="hud-row">
              <span className="hud-label">Carrying</span>
              <span className="hud-value">
                {carriedFood
                  ? `${carriedFood.foodType?.label || '🍽️'} → T${carriedFood.tableId}`
                  : '—'}
              </span>
            </div>
            <div className="hud-row">
              <span className="hud-label">Customers</span>
              <span className="hud-value">{customers.length}</span>
            </div>

            <div className="hud-divider" />

            <div className="hints">
              <p>🎮 WASD / Arrows — Move</p>
              <p>🍳 Kitchen → pick up food</p>
              <p>🪑 Table → deliver</p>
            </div>
          </div>

          <ComboDisplay combo={combo} />
          <LevelUpToast level={level} />

          {customers.some((c) => c.patience < 25 && !c.leaving) && (
            <div className="urgency-alert">⚠️ Customer leaving soon!</div>
          )}
        </>
      )}

      {/* ══════════════════════ MAIN MENU ══════════════════════ */}
      {status === 'menu' && !showStore && (
        <div className="menu-panel">
          <div className="menu-logo">☕</div>
          <h1 className="menu-title">3D Café Rush</h1>
          <p className="menu-subtitle">Serve customers before their patience runs out!</p>

          {bestScore > 0 && (
            <div className="menu-best">🏆 Best: {Math.floor(bestScore)}</div>
          )}

          <div className="menu-coin-row">
            <span className="coin-pill">🪙 {Math.floor(coins)} coins</span>
          </div>

          <div className="menu-instructions">
            {[
              ['🎮', 'WASD / Arrow Keys — Move waiter'],
              ['🍳', 'Walk to kitchen (serving plate) to pick up food'],
              ['🪑', 'Walk to a table to deliver the order'],
              ['🔥', 'Chain deliveries for score combos!'],
              ['❤️', 'Lose a life when a customer leaves angry'],
              ['🪙', 'Earn coins per delivery — spend in the shop!'],
            ].map(([icon, text], i) => (
              <div key={i} className="instruction-row">
                <span className="inst-icon">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="menu-btn-row">
            <button className="btn-primary" onClick={startGame} id="btn-start">
              ▶ Play
            </button>
            <button className="btn-secondary" onClick={() => setShowStore(true)} id="btn-store">
              🛒 Shop
            </button>
          </div>
          <p className="menu-hint">or press Enter</p>
        </div>
      )}

      {/* ══════════════════════ GAME OVER ══════════════════════ */}
      {status === 'gameOver' && !showStore && (
        <div className="game-over-panel">
          <div className="game-over-icon">💔</div>
          <h2>Game Over</h2>
          <p className="go-subtitle">Too many customers left unhappy.</p>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-num">{Math.floor(score)}</span>
              <span className="stat-label">Score</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{totalServed}</span>
              <span className="stat-label">Served</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">Lv.{level}</span>
              <span className="stat-label">Reached</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">🪙 {Math.floor(coins)}</span>
              <span className="stat-label">Coins</span>
            </div>
          </div>

          <div className="menu-btn-row">
            <button className="btn-primary" onClick={restartGame} id="btn-restart">
              🔄 Play Again
            </button>
            <button className="btn-secondary" onClick={() => setShowStore(true)} id="btn-store-go">
              🛒 Shop
            </button>
          </div>
          <p className="menu-hint">or press R</p>
        </div>
      )}

      {/* ══════════════════════ STORE ══════════════════════ */}
      {showStore && (
        <StorePanel onClose={() => setShowStore(false)} />
      )}

      {/* ══════════════════ LEVEL COMPLETE ══════════════════ */}
      {status === 'levelComplete' && !showStore && (
        <div className="level-complete-panel">
          {/* Animated star burst */}
          <div className="lc-stars" aria-hidden>
            {['⭐','🌟','✨','⭐','🌟'].map((s, i) => (
              <span key={i} className={`lc-star lc-star-${i}`}>{s}</span>
            ))}
          </div>

          <div className="lc-icon">🎉</div>
          <h2 className="lc-title">Level {level - 1} Complete!</h2>
          <p className="lc-subtitle">Excellent work, waiter! Heading to level {level}…</p>

          <div className="stats-grid" style={{ marginBottom: '20px' }}>
            <div className="stat-box">
              <span className="stat-num">{Math.floor(score)}</span>
              <span className="stat-label">Score</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{totalServed}</span>
              <span className="stat-label">Served</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">{Math.max(lives, 0)}</span>
              <span className="stat-label">Lives left</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">🪙 {Math.floor(coins)}</span>
              <span className="stat-label">Coins</span>
            </div>
          </div>

          <div className="menu-btn-row">
            <button className="btn-primary" onClick={nextLevel} id="btn-next-level">
              ▶ Next Level
            </button>
            <button className="btn-secondary" onClick={() => setShowStore(true)} id="btn-lc-shop">
              🛒 Shop
            </button>
            <button className="btn-secondary" onClick={restartGame} id="btn-lc-restart">
              🔄 Restart
            </button>
          </div>
          <p className="menu-hint">or press N</p>
        </div>
      )}
    </div>
  )
}

export default UIOverlay