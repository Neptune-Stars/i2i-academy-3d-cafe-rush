import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const TABLE_POSITIONS = [
  { tableId: 1, position: [-4.5, 0.35, -1.5] },
  { tableId: 2, position: [0,    0.35, -3.0] },
  { tableId: 3, position: [4.5,  0.35, -1.5] },
  { tableId: 4, position: [-4.5, 0.35,  1.5] },
  { tableId: 5, position: [4.5,  0.35,  1.5] },
]

const FOOD_TYPES = [
  { id: 'coffee',   color: '#8b4513', label: '☕' },
  { id: 'cake',     color: '#ff69b4', label: '🍰' },
  { id: 'sandwich', color: '#f4a460', label: '🥪' },
  { id: 'juice',    color: '#ffa500', label: '🧃' },
]

// ── Upgrades catalog ──────────────────────────────────────────────────────────
export const UPGRADES = [
  { id: 'fasterChef',  label: '⚡ Speed Kitchen',  desc: 'Cook time –20%',       cost: 80,  maxLevel: 3 },
  { id: 'extraLife',   label: '❤️ Extra Life',      desc: 'Start with +1 life',   cost: 120, maxLevel: 2 },
  { id: 'extraTable',  label: '🪑 Extra Table',      desc: 'Unlock a 4th table',   cost: 150, maxLevel: 2 },
  { id: 'comboTime',   label: '🔥 Combo Timer',      desc: 'Combo window +2 s',    cost: 60,  maxLevel: 3 },
  { id: 'patience',    label: '😊 Patient Guests',   desc: 'Patience drain –15%',  cost: 100, maxLevel: 3 },
]

// ── Decorations catalog ───────────────────────────────────────────────────────
export const DECORATIONS = [
  { id: 'plant',    label: '🌿 Corner Plants',    desc: 'Lush greenery',         cost: 40 },
  { id: 'rug',      label: '🟫 Patterned Rug',    desc: 'Cosy floor rug',        cost: 50 },
  { id: 'painting', label: '🖼️ Wall Paintings',   desc: 'Art for the walls',     cost: 60 },
  { id: 'string',   label: '💡 String Lights',    desc: 'Warm ambient glow',     cost: 70 },
  { id: 'umbrella', label: '☂️ Table Umbrellas',  desc: 'Stylish shading',       cost: 55 },
]

// ─────────────────────────────────────────────────────────────────────────────

const getInitialCustomers = () => [
  {
    id: 'table-1',
    tableId: 1,
    position: TABLE_POSITIONS[0].position,
    patience: 100,
    status: 'waiting',
    foodType: FOOD_TYPES[0],
    leaving: false,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
//  Persistent slice (coins + owned items survive page refresh)
// ─────────────────────────────────────────────────────────────────────────────

const persistedSlice = (set, get) => ({
  coins: 0,
  bestScore: 0,
  ownedUpgrades: {},    // { fasterChef: 1, extraLife: 2, ... }
  ownedDecorations: {}, // { plant: true, rug: true, ... }

  buyUpgrade: (id) => {
    const upgrade = UPGRADES.find((u) => u.id === id)
    if (!upgrade) return
    const state = get()
    const currentLevel = state.ownedUpgrades[id] || 0
    if (currentLevel >= upgrade.maxLevel) return
    if (state.coins < upgrade.cost) return
    set((s) => ({
      coins: s.coins - upgrade.cost,
      ownedUpgrades: { ...s.ownedUpgrades, [id]: currentLevel + 1 },
    }))
  },

  buyDecoration: (id) => {
    const deco = DECORATIONS.find((d) => d.id === id)
    if (!deco) return
    const state = get()
    if (state.ownedDecorations[id]) return
    if (state.coins < deco.cost) return
    set((s) => ({
      coins: s.coins - deco.cost,
      ownedDecorations: { ...s.ownedDecorations, [id]: true },
    }))
  },

  earnCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
  updateBestScore: (score) =>
    set((s) => ({ bestScore: Math.max(s.bestScore, score) })),
})

// ─────────────────────────────────────────────────────────────────────────────
//  Session slice (resets each game)
// ─────────────────────────────────────────────────────────────────────────────

const sessionSlice = (set, get) => ({
  score: 0,
  lives: 3,
  status: 'menu', // 'menu' | 'active' | 'store' | 'gameOver'
  combo: 0,
  comboTimer: 0,
  level: 1,
  totalServed: 0,
  levelBanner: null,  // null | number  — triggers banner display

  carriedFood: null,
  foodReady: false,
  chefProgress: 0,

  customers: getInitialCustomers(),

  FOOD_TYPES,
  TABLE_POSITIONS,

  // ── How many tables are active this run ───────────────────────────────────
  activeTableCount: () => {
    const { ownedUpgrades } = get()
    const extra = ownedUpgrades.extraTable || 0
    return Math.min(3 + extra, 5)
  },

  startGame: () => {
    const { ownedUpgrades } = get()
    const extraLifeLvl = ownedUpgrades.extraLife || 0
    const extraTableLvl = ownedUpgrades.extraTable || 0
    const tableCount = Math.min(3 + extraTableLvl, 5)
    set({
      score: 0,
      lives: 3 + extraLifeLvl,
      status: 'active',
      carriedFood: null,
      foodReady: false,
      chefProgress: 0,
      customers: [
        {
          id: 'table-1',
          tableId: 1,
          position: TABLE_POSITIONS[0].position,
          patience: 100,
          status: 'waiting',
          foodType: FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)],
          leaving: false,
        },
      ],
      combo: 0,
      comboTimer: 0,
      level: 1,
      totalServed: 0,
      levelBanner: null,
      _tableCount: tableCount,
    })
  },

  restartGame: () => get().startGame(),

  openStore: () => set({ status: 'store' }),
  closeStore: () => set({ status: 'menu' }),

  // Resume after level-complete screen
  nextLevel: () => set({ status: 'active', levelBanner: null }),

  // ── Trash food ────────────────────────────────────────────────────────────
  // Discard carried food (or food waiting on plate) and reset chef so cooking
  // restarts automatically on the next frame if customers are still present.
  trashFood: () =>
    set((s) => {
      // Nothing to trash
      if (!s.carriedFood && !s.foodReady) return s
      return {
        carriedFood: null,
        foodReady: false,
        chefProgress: 0,
      }
    }),

  // ── Scoring ───────────────────────────────────────────────────────────────
  increaseScore: (amount) =>
    set((s) => ({ score: s.score + amount })),

  setFoodReady: (value) =>
    set({ foodReady: value, chefProgress: value ? 100 : 0 }),

  setChefProgress: (value) => set({ chefProgress: value }),

  tickCombo: (delta) =>
    set((s) => {
      const newTimer = s.comboTimer - delta
      if (newTimer <= 0 && s.combo > 0) return { combo: 0, comboTimer: 0 }
      return { comboTimer: Math.max(newTimer, 0) }
    }),

  clearLevelBanner: () => set({ levelBanner: null }),

  // ── Food pick-up ──────────────────────────────────────────────────────────
  pickUpFood: () =>
    set((s) => {
      if (!s.foodReady || s.carriedFood) return s
      const waiting = s.customers.find((c) => c.status === 'waiting' && !c.leaving)
      if (!waiting) return s
      return {
        carriedFood: { tableId: waiting.tableId, foodType: waiting.foodType },
        foodReady: false,
        chefProgress: 0,
      }
    }),

  // ── Delivery ──────────────────────────────────────────────────────────────
  deliverFood: (tableId) =>
    set((s) => {
      if (!s.carriedFood || s.carriedFood.tableId !== tableId) return s

      const updatedCustomers = s.customers.filter((c) => c.tableId !== tableId)
      const newCombo = s.combo + 1
      const { ownedUpgrades } = get()
      const comboTimerBonus = (ownedUpgrades.comboTime || 0) * 2
      const multiplier = 1 + newCombo * 0.25
      const points = Math.round(30 * multiplier)
      const newServed = s.totalServed + 1
      const newLevel = Math.min(Math.floor(newServed / 5) + 1, 10)
      const leveledUp = newLevel > s.level

      // earn coins: base 10 + combo bonus
      const coinsEarned = 10 + Math.min(newCombo - 1, 5) * 3

      // Side-effect: add coins + update best score
      get().earnCoins(coinsEarned)
      get().updateBestScore(s.score + points)

      return {
        score: s.score + points,
        carriedFood: null,
        customers: updatedCustomers,
        combo: newCombo,
        comboTimer: 4 + comboTimerBonus,
        totalServed: newServed,
        level: newLevel,
        // Pause the game on level-up (but not on level 10 max)
        status: leveledUp && newLevel <= 10 ? 'levelComplete' : s.status,
        levelBanner: leveledUp ? newLevel : s.levelBanner,
      }
    }),

  // ── Patience ──────────────────────────────────────────────────────────────
  decreaseCustomerPatience: (amount) =>
    set((s) => {
      let lostLives = 0
      const { ownedUpgrades } = get()
      const patienceBonus = (ownedUpgrades.patience || 0) * 0.15

      const updated = s.customers.map((c) => {
        if (c.leaving) return c
        return { ...c, patience: c.patience - amount * (1 - patienceBonus) }
      })

      const filtered = updated.filter((c) => {
        if (c.patience <= 0) { lostLives += 1; return false }
        return true
      })

      const newLives = s.lives - lostLives
      get().updateBestScore(s.score)

      return {
        customers: filtered,
        lives: newLives,
        combo: lostLives > 0 ? 0 : s.combo,
        comboTimer: lostLives > 0 ? 0 : s.comboTimer,
        status: newLives <= 0 ? 'gameOver' : s.status,
      }
    }),

  // ── Spawn ─────────────────────────────────────────────────────────────────
  spawnCustomer: () =>
    set((s) => {
      const { ownedUpgrades } = get()
      const extraTableLvl = ownedUpgrades.extraTable || 0
      const tableCount = Math.min(3 + extraTableLvl, 5)
      const activeTables = TABLE_POSITIONS.slice(0, tableCount)
      const occupied = s.customers.map((c) => c.tableId)
      const available = activeTables.filter((t) => !occupied.includes(t.tableId))
      if (available.length === 0) return s
      const table = available[Math.floor(Math.random() * available.length)]
      const food = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)]
      return {
        customers: [
          ...s.customers,
          {
            id: crypto.randomUUID(),
            tableId: table.tableId,
            position: table.position,
            patience: 100,
            status: 'waiting',
            foodType: food,
            leaving: false,
          },
        ],
      }
    }),
})

// ─────────────────────────────────────────────────────────────────────────────
//  Create unified store with persistence for the wallet/inventory slice
// ─────────────────────────────────────────────────────────────────────────────
export const useCafeStore = create(
  persist(
    (set, get) => ({
      ...persistedSlice(set, get),
      ...sessionSlice(set, get),
    }),
    {
      name: 'cafe-rush-save',
      partialize: (state) => ({
        coins: state.coins,
        bestScore: state.bestScore,
        ownedUpgrades: state.ownedUpgrades,
        ownedDecorations: state.ownedDecorations,
      }),
    }
  )
)